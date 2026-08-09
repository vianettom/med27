const list = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (m, p = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://127.0.0.1:8000/" });
await new Promise((r) => setTimeout(r, 2000));
const r = await send("Runtime.evaluate", { expression: `(async () => {
  const img = document.querySelector('.venue__photo');
  img.scrollIntoView({ block: 'center' });
  await new Promise(r => setTimeout(r, 3000));
  return JSON.stringify({
    loading: img.loading, complete: img.complete,
    nat: img.naturalWidth + 'x' + img.naturalHeight,
    rect: Math.round(img.getBoundingClientRect().width) + 'x' + Math.round(img.getBoundingClientRect().height),
    currentSrc: img.currentSrc
  });
})()`, returnByValue: true, awaitPromise: true });
console.log(r.result.value);
ws.close();
