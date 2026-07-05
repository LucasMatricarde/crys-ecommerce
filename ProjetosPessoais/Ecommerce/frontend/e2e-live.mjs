// Live E2E driver: real SPA (Vite :5173) against live gateway (:8080).
// Covers Inc5 tasks 11.2/11.3/11.4/11.5. Run: node e2e-live.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:5173";
const GW = "http://localhost:8080/api";
const SHOT = "/private/tmp/claude-501/-Users-lucasmatricarde-ProjetosPessoais-Ecommerce/0261ea91-dadd-4bef-aa49-863f0c6e2113/scratchpad";
const results = [];
const ok = (n) => { results.push(["PASS", n]); console.log("PASS  " + n); };
const fail = (n, e) => { results.push(["FAIL", n + " :: " + e]); console.log("FAIL  " + n + " :: " + e); };

async function seedCart(page, slug, qty) {
  const p = await page.evaluate(async (s) => (await fetch(`http://localhost:8080/api/catalog/products/${s}`)).json(), slug);
  await page.evaluate(({ p, qty }) => {
    localStorage.setItem("crys.cart", JSON.stringify([
      { slug: p.slug, name: p.name, qty, priceCents: p.priceCents, priceFormatted: p.priceFormatted },
    ]));
  }, { p, qty });
}
async function login(page, subject) {
  await page.goto(`${BASE}/login`);
  await page.fill('input', subject);
  await page.getByRole("button", { name: /Entrar \(demo\)/ }).click();
  await page.waitForFunction(() => !!localStorage.getItem("crys.token"));
}
async function waitTerminal(page) {
  // status label rendered on tracking page; wait for Confirmado/Cancelado
  await page.waitForFunction(() => {
    const t = document.body.innerText;
    return /Confirmado|Cancelado/.test(t);
  }, { timeout: 30000 });
  return await page.evaluate(() => document.body.innerText);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

try {
  // ---- 11.2 catalog browse + detail by slug ----
  try {
    await page.goto(BASE);
    await page.waitForSelector("text=Catálogo");
    await page.waitForFunction(() => document.body.innerText.includes("rosin-premium".replace("-", " ")) || document.querySelectorAll("button").length > 6);
    // assert live cards: rosin-premium name "Rosin Premium" expected
    const hasCards = await page.evaluate(() => /Adicionar|Indisponível/.test(document.body.innerText));
    if (!hasCards) throw new Error("no catalog cards rendered");
    await page.goto(`${BASE}/product/rosin-premium`);
    await page.waitForSelector("text=Adicionar ao carrinho", { timeout: 8000 });
    const detail = await page.evaluate(() => document.body.innerText);
    if (!/THC|CBD|g\b/.test(detail)) throw new Error("detail metrics missing");
    await page.screenshot({ path: `${SHOT}/11_2_detail.png` });
    ok("11.2 catalog renders live + detail by slug (rosin-premium)");
  } catch (e) { fail("11.2 catalog/detail", e.message); }

  // ---- 11.5a guard: /checkout without token -> /login ----
  try {
    await ctx.clearCookies();
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/checkout`);
    await page.waitForURL(/\/login/, { timeout: 5000 });
    const u = new URL(page.url());
    if (!u.searchParams.get("next")) throw new Error("no next param on redirect");
    ok("11.5a guard: /checkout unauthenticated -> /login?next=");
  } catch (e) { fail("11.5a guard redirect", e.message); }

  // ---- 11.3 happy path: rosin-premium qty1 -> CONFIRMED ----
  try {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await seedCart(page, "rosin-premium", 1);
    await login(page, "demo-user");
    await page.goto(`${BASE}/checkout`);
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await page.waitForURL(/\/orders\//, { timeout: 8000 });
    const txt = await waitTerminal(page);
    await page.screenshot({ path: `${SHOT}/11_3_confirmed.png` });
    if (!/Confirmado/.test(txt)) throw new Error("not CONFIRMED: " + txt.slice(0, 120));
    if (!/created|reserved|confirmed|Confirmado/i.test(txt)) throw new Error("no timeline");
    ok("11.3 happy path rosin-premium qty1 -> CONFIRMED (polling advanced)");
  } catch (e) { fail("11.3 happy path", e.message); }

  // ---- 11.4a shatter-cristal (no stock) -> CANCELLED reason ----
  try {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await login(page, "demo-user");
    await seedCart(page, "shatter-cristal", 1); // unavailable -> seed (card btn disabled)
    await page.goto(`${BASE}/checkout`);
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await page.waitForURL(/\/orders\//, { timeout: 8000 });
    const txt = await waitTerminal(page);
    await page.screenshot({ path: `${SHOT}/11_4a_nostock.png` });
    if (!/Cancelado/.test(txt)) throw new Error("not CANCELLED");
    if (!/inventory rejected/i.test(txt)) throw new Error("reason not shown: " + txt.slice(0, 200));
    ok("11.4a shatter-cristal -> CANCELLED, reason 'inventory rejected' shown");
  } catch (e) { fail("11.4a no-stock", e.message); }

  // ---- 11.4b rosin qty60 (payment decline) -> CANCELLED reason ----
  try {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await login(page, "demo-user");
    await seedCart(page, "rosin-premium", 60);
    await page.goto(`${BASE}/checkout`);
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await page.waitForURL(/\/orders\//, { timeout: 8000 });
    const txt = await waitTerminal(page);
    await page.screenshot({ path: `${SHOT}/11_4b_paydecline.png` });
    if (!/Cancelado/.test(txt)) throw new Error("not CANCELLED");
    if (!/payment declined/i.test(txt)) throw new Error("reason not shown: " + txt.slice(0, 200));
    ok("11.4b rosin qty60 -> CANCELLED, reason 'payment declined' shown");
  } catch (e) { fail("11.4b payment-decline", e.message); }

  // ---- 11.5b bad token -> 401 clears session + redirect ----
  try {
    // place a real order id to visit, then corrupt token (order created from node)
    const tok = (await (await fetch(`${GW}/auth/token`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: "demo-user" }) })).json()).token;
    const oid = (await (await fetch(`${GW}/orders`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + tok }, body: JSON.stringify({ productSlug: "rosin-premium", quantity: 1 }) })).json()).id;
    // Fresh context: no leftover polling/redirects from prior flows.
    const ctx2 = await browser.newContext();
    const pg = await ctx2.newPage();
    await pg.goto(BASE);
    await pg.evaluate(() => {
      localStorage.setItem("crys.token", "garbage.bad.token");
      localStorage.setItem("crys.subject", "demo-user");
    });
    await pg.goto(`${BASE}/orders/${oid}`);
    await pg.waitForURL(/\/login/, { timeout: 8000 });
    await pg.waitForLoadState("networkidle");
    await pg.waitForTimeout(400);
    const cleared = await pg.evaluate(() => localStorage.getItem("crys.token"));
    await ctx2.close();
    if (cleared) throw new Error("token not cleared on 401");
    ok("11.5b bad token -> 401 interceptor cleared session + redirect /login");
  } catch (e) { fail("11.5b 401 handling", e.message); }

} finally {
  await browser.close();
}

const failed = results.filter((r) => r[0] === "FAIL");
console.log("\n==== SUMMARY ====");
console.log(`${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
