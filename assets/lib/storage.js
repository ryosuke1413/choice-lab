const KEY = "choice_lab_v1";

function nowISO(){
  return new Date().toISOString();
}

export function loadAll(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return { events: [] };
  try{
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.events)) return { events: [] };
    return parsed;
  }catch{
    return { events: [] };
  }
}

export function saveAll(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addEvent(evt){
  const data = loadAll();
  data.events.push({
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2),
    t: nowISO(),
    ...evt
  });
  // keep last 300
  if(data.events.length > 300) data.events = data.events.slice(-300);
  saveAll(data);
}

export function resetAll(){
  localStorage.removeItem(KEY);
}

export function summarize(){
  const { events } = loadAll();
  const total = events.length;
  const last = total ? events[total-1] : null;

  const counts = { default:0, anchoring:0, social_proof:0 };
  for(const e of events){
    if(counts[e.exp] !== undefined) counts[e.exp]++;
  }

  // bias score: mean absolute gap between user outcome and model prediction
  // For anchoring (numeric), compare normalized value with model mean (normalized).
  let sumGap = 0;
  let nGap = 0;
  for(const e of events){
    if(typeof e.model_pred === "number"){
      if(e.exp === "anchoring"){
        if(typeof e.value_norm === "number"){
          sumGap += Math.abs(e.value_norm - e.model_pred);
          nGap++;
        }
      }else{
        if(typeof e.choice === "number"){
          sumGap += Math.abs(e.choice - e.model_pred);
          nGap++;
        }
      }
    }
  }
  const bias = nGap ? (sumGap / nGap) : 0;

  return {
    total,
    last,
    counts,
    bias
  };
}

export function recent(n=10){
  const { events } = loadAll();
  return events.slice(-n).reverse();
}
