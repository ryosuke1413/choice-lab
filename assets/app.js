const lib = (p) => new URL(`../lib/${p}`, import.meta.url).href;

(async () => {
  const { summarize, recent, resetAll, loadAll } = await import(lib("storage.js"));
  const { barChartCounts } = await import(lib("charts.js"));

  function fmtTime(iso){
    try{ return new Date(iso).toLocaleString("ja-JP", { hour12:false }); }catch{ return iso; }
  }
  function expLabel(k){
    if(k==="default") return "Default";
    if(k==="anchoring") return "Anchoring";
    if(k==="social_proof") return "Social Proof";
    return k ?? "—";
  }
  function formatCondition(e){
    if(e.exp==="default") return `default=${e.cond_default_on ? "ON" : "OFF"}`;
    if(e.exp==="anchoring") return `anchor=${e.cond_anchor ?? "—"}`;
    if(e.exp==="social_proof") return `proof=${e.cond_proof ? "ON" : "OFF"}`;
    return "—";
  }
  function formatChoice(e){
    if(e.exp==="anchoring") return `${Math.round(e.value ?? 0)}`;
    if(typeof e.choice === "number") return e.choice === 1 ? "Yes/ON/A" : "No/OFF/B";
    return "—";
  }
  function formatModel(e){
    if(typeof e.model_pred !== "number") return "—";
    if(e.exp==="anchoring") return `norm=${e.model_pred.toFixed(2)}`;
    return e.model_pred.toFixed(2);
  }

  function render(){
    const s = summarize();
    document.getElementById("totalTrials").textContent = String(s.total);
    document.getElementById("biasScore").textContent = s.total ? s.bias.toFixed(2) : "—";
    document.getElementById("lastExp").textContent = s.last ? expLabel(s.last.exp) : "—";

    const canvas = document.getElementById("countChart");
    barChartCounts(canvas, s.counts);

    const rows = recent(10);
    const tbody = document.getElementById("recentTbody");
    tbody.innerHTML = "";
    for(const e of rows){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${fmtTime(e.t)}</td>
        <td>${expLabel(e.exp)}</td>
        <td>${formatCondition(e)}</td>
        <td>${formatChoice(e)}</td>
        <td>${formatModel(e)}</td>
      `;
      tbody.appendChild(tr);
    }
    const exportBox = document.getElementById("exportBox");
    exportBox.classList.add("hidden");
  }

  document.getElementById("resetBtn").addEventListener("click", ()=>{
    if(confirm("端末内の記録をすべて削除します。よろしいですか？")){
      resetAll();
      render();
    }
  });

  document.getElementById("exportBtn").addEventListener("click", ()=>{
    const box = document.getElementById("exportBox");
    const data = loadAll();
    box.textContent = JSON.stringify(data, null, 2);
    box.classList.toggle("hidden");
  });

  render();
})();

function fmtTime(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleString("ja-JP", { hour12:false });
  }catch{
    return iso;
  }
}

function expLabel(k){
  if(k==="default") return "Default";
  if(k==="anchoring") return "Anchoring";
  if(k==="social_proof") return "Social Proof";
  return k ?? "—";
}

function formatCondition(e){
  if(e.exp==="default"){
    return `default=${e.cond_default_on ? "ON" : "OFF"}`;
  }
  if(e.exp==="anchoring"){
    return `anchor=${e.cond_anchor ?? "—"}`;
  }
  if(e.exp==="social_proof"){
    return `proof=${e.cond_proof ? "ON" : "OFF"}`;
  }
  return "—";
}

function formatChoice(e){
  if(e.exp==="anchoring"){
    return `${Math.round(e.value ?? 0)}`;
  }
  if(typeof e.choice === "number"){
    return e.choice === 1 ? "Yes/ON/A" : "No/OFF/B";
  }
  return "—";
}

function formatModel(e){
  if(typeof e.model_pred !== "number") return "—";
  if(e.exp==="anchoring"){
    return `norm=${e.model_pred.toFixed(2)}`;
  }
  return e.model_pred.toFixed(2);
}

function render(){
  const s = summarize();
  document.getElementById("totalTrials").textContent = String(s.total);
  document.getElementById("biasScore").textContent = s.total ? s.bias.toFixed(2) : "—";
  document.getElementById("lastExp").textContent = s.last ? expLabel(s.last.exp) : "—";

  const canvas = document.getElementById("countChart");
  barChartCounts(canvas, s.counts);

  const rows = recent(10);
  const tbody = document.getElementById("recentTbody");
  tbody.innerHTML = "";
  for(const e of rows){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtTime(e.t)}</td>
      <td>${expLabel(e.exp)}</td>
      <td>${formatCondition(e)}</td>
      <td>${formatChoice(e)}</td>
      <td>${formatModel(e)}</td>
    `;
    tbody.appendChild(tr);
  }

  const exportBox = document.getElementById("exportBox");
  exportBox.classList.add("hidden");
}

document.getElementById("resetBtn").addEventListener("click", ()=>{
  if(confirm("端末内の記録をすべて削除します。よろしいですか？")){
    resetAll();
    render();
  }
});

document.getElementById("exportBtn").addEventListener("click", async ()=>{
  const box = document.getElementById("exportBox");
  // lazy load full
  const mod = await import("../lib/storage.js");
  const data = mod.loadAll();
  box.textContent = JSON.stringify(data, null, 2);
  box.classList.toggle("hidden");
});

render();
