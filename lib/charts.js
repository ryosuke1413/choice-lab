// Minimal canvas charts (no external libs)

function clear(ctx, w, h){
  ctx.clearRect(0,0,w,h);
}

function roundRect(ctx, x,y,w,h,r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

export function barChartCounts(canvas, counts){
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  clear(ctx, W, H);

  // background panel
  roundRect(ctx, 18, 18, W-36, H-36, 18);
  ctx.fillStyle = "rgba(15,22,34,.35)";
  ctx.fill();
  ctx.strokeStyle = "rgba(34,48,71,.55)";
  ctx.stroke();

  const items = [
    { k:"default", label:"Default", v: counts.default ?? 0 },
    { k:"anchoring", label:"Anchoring", v: counts.anchoring ?? 0 },
    { k:"social_proof", label:"Social Proof", v: counts.social_proof ?? 0 },
  ];
  const maxV = Math.max(1, ...items.map(x=>x.v));
  const padL = 60, padR = 40, padT = 50, padB = 60;
  const x0 = padL, y0 = padT;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // axes
  ctx.strokeStyle = "rgba(34,48,71,.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y0+plotH);
  ctx.lineTo(x0+plotW, y0+plotH);
  ctx.stroke();

  // title
  ctx.fillStyle = "rgba(232,238,247,.92)";
  ctx.font = "700 22px ui-sans-serif, system-ui";
  ctx.fillText("Trials by Experiment", x0, 42);

  // grid + labels
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillStyle = "rgba(166,179,198,.9)";
  for(let i=0;i<=4;i++){
    const y = y0 + plotH - (plotH*i/4);
    ctx.strokeStyle = "rgba(34,48,71,.35)";
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0+plotW, y); ctx.stroke();
    const val = Math.round(maxV*i/4);
    ctx.fillText(String(val), 20, y+4);
  }

  // bars (no specified colors: use grayscale-ish)
  const gap = 22;
  const barW = (plotW - gap*(items.length-1)) / items.length;
  items.forEach((it, idx)=>{
    const x = x0 + idx*(barW+gap);
    const h = plotH * (it.v / maxV);
    const y = y0 + (plotH - h);

    ctx.fillStyle = "rgba(232,238,247,.70)";
    roundRect(ctx, x, y, barW, h, 14);
    ctx.fill();

    ctx.fillStyle = "rgba(232,238,247,.92)";
    ctx.font = "700 14px ui-sans-serif, system-ui";
    ctx.fillText(String(it.v), x + barW/2 - 6, y - 8);

    ctx.fillStyle = "rgba(166,179,198,.95)";
    ctx.font = "12px ui-sans-serif, system-ui";
    const label = it.label;
    const tw = ctx.measureText(label).width;
    ctx.fillText(label, x + barW/2 - tw/2, y0 + plotH + 28);
  });
}

export function diffBar(canvas, user, model){
  // shows user vs model as 2 bars in [-1..1] or [0..1]; we assume [0..1]
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  clear(ctx, W, H);

  roundRect(ctx, 18, 18, W-36, H-36, 18);
  ctx.fillStyle = "rgba(15,22,34,.35)";
  ctx.fill();
  ctx.strokeStyle = "rgba(34,48,71,.55)";
  ctx.stroke();

  const padL = 60, padR = 40, padT = 44, padB = 58;
  const x0 = padL, y0 = padT;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  ctx.fillStyle = "rgba(232,238,247,.92)";
  ctx.font = "700 18px ui-sans-serif, system-ui";
  ctx.fillText("You vs Model", x0, 34);

  // axes
  ctx.strokeStyle = "rgba(34,48,71,.55)";
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y0+plotH);
  ctx.lineTo(x0+plotW, y0+plotH);
  ctx.stroke();

  // grid 0..1
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.fillStyle = "rgba(166,179,198,.9)";
  for(let i=0;i<=4;i++){
    const y = y0 + plotH - (plotH*i/4);
    ctx.strokeStyle = "rgba(34,48,71,.35)";
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0+plotW, y); ctx.stroke();
    ctx.fillText((i/4).toFixed(2), 18, y+4);
  }

  const bars = [
    {label:"You", v:user},
    {label:"Model", v:model},
  ];

  const gap = 26;
  const barW = (plotW - gap) / 2;
  bars.forEach((b, i)=>{
    const x = x0 + i*(barW+gap);
    const h = plotH * (Math.max(0, Math.min(1, b.v)));
    const y = y0 + (plotH - h);

    ctx.fillStyle = "rgba(232,238,247,.70)";
    roundRect(ctx, x, y, barW, h, 14);
    ctx.fill();

    ctx.fillStyle = "rgba(232,238,247,.92)";
    ctx.font = "700 13px ui-sans-serif, system-ui";
    ctx.fillText(b.v.toFixed(2), x + 10, y - 8);

    ctx.fillStyle = "rgba(166,179,198,.95)";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(b.label, x + 10, y0 + plotH + 28);
  });
}
