document.addEventListener("DOMContentLoaded",()=>{

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer=matchMedia("(hover: hover) and (pointer: fine)").matches;
const wideQuery=matchMedia("(min-width: 901px)");
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

// ---------- Mobile menu ----------
const btn=$("#menuBtn");
const nav=$("#navLinks");

const setMenu=open=>{
nav.classList.toggle("open",open);
btn.setAttribute("aria-expanded",open);
btn.setAttribute("aria-label",open?"Close menu":"Open menu");
};

btn.addEventListener("click",e=>{
e.stopPropagation();
setMenu(!nav.classList.contains("open"));
});
nav.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});
document.addEventListener("click",e=>{if(!e.target.closest("header"))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

// ---------- Curriculum: rendered from curriculum.js, unlocked day by day ----------
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeLink=u=>/^https:\/\//i.test(u||"")?u:"";
const days=Array.isArray(window.PROFIT_CURRICULUM)?window.PROFIT_CURRICULUM:[];
const rollout=window.PROFIT_ROLLOUT||{};
const DAY_MS=864e5;

const parseIST=(date,time="00:00")=>new Date(`${date}T${time.length===5?time:"00:00"}:00+05:30`);
const startAt=rollout.start?parseIST(rollout.start,rollout.time):null;
const unlockAt=d=>{
let at;
if(d.unlock){const [dd,tt]=String(d.unlock).trim().split(/[ T]/);at=parseIST(dd,tt)}
else if(startAt)at=new Date(startAt.getTime()+(d.day-1)*DAY_MS);
return at&&!isNaN(at)?at:new Date(0);
};
const unlocks=days.map(unlockAt);

const fmtDay=at=>at.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",timeZone:"Asia/Kolkata"});
const fmtTime=at=>at.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit",timeZone:"Asia/Kolkata"})+" IST";
const pad=n=>String(n).padStart(2,"0");
const countdown=ms=>{
const t=Math.max(0,Math.floor(ms/1000));
const d=Math.floor(t/86400),h=Math.floor(t%86400/3600),m=Math.floor(t%3600/60),sec=t%60;
return (d?`${d}d `:"")+`${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
};

const cardHTML=(d,i,now)=>{
const at=unlocks[i],locked=now<at;
const topics=d.topics||[];
const live=topics.filter(t=>safeLink(t.link)).length;
const isNew=!locked&&now-at<DAY_MS&&at.getTime()>0;
const status=locked
?`<span class="status lock">Locked</span>`
:isNew?`<span class="status new"><i></i>New</span>`
:live?`<span class="status on"><i></i>${live}/${topics.length} live</span>`:`<span class="status">Material soon</span>`;

const head=`<span class="hnum" aria-hidden="true">${esc(pad(d.day))}</span>
<div class="hcard-top">
<div class="hcard-meta"><span class="day-pill">DAY ${esc(d.day)}</span>${status}</div>
<span class="f-ico"><img src="icons/${esc(d.icon)}.svg" alt="" width="28" height="28"></span>
</div>
<div class="hcard-body"><h4>${esc(d.title)}</h4><p>${esc(d.summary)}</p></div>`;

if(locked){
const next=unlocks.findIndex(u=>now<u)===i;
return head+`<div class="locked">
<div class="lock-bars" aria-hidden="true">${topics.map(()=>"<i></i>").join("")}</div>
<div class="lock-info">
<svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg>
<div>${next?`<b>Unlocks in <span data-countdown="${i}">${countdown(at-now)}</span></b><span>${esc(fmtDay(at))}, ${esc(fmtTime(at))}</span>`:`<b>Unlocks ${esc(fmtDay(at))}</b><span>${esc(fmtTime(at))}</span>`}</div>
</div>
</div>`;
}

const rows=topics.map((t,k)=>{
const href=safeLink(t.link);
return href
?`<li style="--ti:${k}"><a class="topic" href="${esc(href)}" target="_blank" rel="noopener"><span class="t-bullet"></span><span class="t-name">${esc(t.name)}</span><svg class="ico t-go" aria-hidden="true"><use href="#i-drive"/></svg></a></li>`
:`<li style="--ti:${k}"><span class="topic soon"><span class="t-bullet"></span><span class="t-name">${esc(t.name)}</span><span class="t-soon">Soon</span></span></li>`;
}).join("");
return head+`<ul class="topics">${rows}</ul>`;
};

const trackEl=$("#hTrack");
trackEl.innerHTML=days.map(d=>`<article class="box hcard reveal" id="day-${esc(d.day)}"></article>`).join("");
const cardEls=[...trackEl.children];
$("#dayPills").innerHTML=days.map((d,i)=>`<button type="button" data-i="${i}" aria-label="Day ${esc(d.day)}: ${esc(d.title)}">${esc(d.day)}</button>`).join("");
const pillEls=[...$("#dayPills").children];

let lockState=[];
const renderDays=()=>{
const now=new Date();
days.forEach((d,i)=>{
const locked=now<unlocks[i];
const isNew=!locked&&now-unlocks[i]<DAY_MS;
const key=`${locked}|${isNew}|${unlocks.findIndex(u=>now<u)}`;
if(lockState[i]===key)return;
lockState[i]=key;
cardEls[i].innerHTML=cardHTML(d,i,now);
cardEls[i].classList.toggle("is-locked",locked);
pillEls[i].classList.toggle("is-locked",locked);
});
};
renderDays();

// tick the countdown every second while any day is still locked
if(unlocks.some(u=>new Date()<u)){
const clock=setInterval(()=>{
const now=new Date();
renderDays();
$$("[data-countdown]").forEach(el=>{el.textContent=countdown(unlocks[+el.dataset.countdown]-now)});
if(!unlocks.some(u=>now<u))clearInterval(clock);
},1000);
}

// ---------- Text splitting ----------
const title=$("#heroTitle");
title.setAttribute("aria-label","PROFIT+");
[...title.childNodes].forEach(node=>{
if(node.nodeType!==3)return;
const frag=document.createDocumentFragment();
[...node.textContent].forEach((ch,i)=>{
const s=document.createElement("span");
s.className="ch";
s.textContent=ch;
s.style.setProperty("--c",i);
s.setAttribute("aria-hidden","true");
frag.append(s);
});
node.replaceWith(frag);
});
const sup=title.querySelector("sup");
sup.style.setProperty("--c",6);
sup.setAttribute("aria-hidden","true");

$$("[data-split]").forEach(el=>{
const words=el.textContent.trim().split(/\s+/);
el.setAttribute("aria-label",words.join(" "));
el.innerHTML=words.map((w,i)=>`<span class="w" aria-hidden="true"><span style="--wi:${i}">${w}</span></span>`).join(" ");
});

// ---------- Hero entrance ----------
const hero=$("#hero");
const start=()=>hero.classList.add("loaded");
Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,900))]).then(()=>requestAnimationFrame(start));

// ---------- Reveal on scroll (staggered per grid) ----------
const items=$$(".reveal");

items.forEach(el=>{
const siblings=[...el.parentElement.children].filter(c=>c.classList.contains("reveal"));
el.style.setProperty("--delay",Math.min(siblings.indexOf(el),5)*0.08+"s");
el.addEventListener("transitionend",()=>el.style.removeProperty("--delay"),{once:true});
});

const revealer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.classList.add("show");
revealer.unobserve(e.target);
}
});
},{threshold:.12,rootMargin:"0px 0px -40px 0px"});

items.forEach(i=>revealer.observe(i));

// ---------- Count-up numbers ----------
const counter=new IntersectionObserver(entries=>{
entries.forEach(({isIntersecting,target})=>{
if(!isIntersecting)return;
counter.unobserve(target);
const end=+target.dataset.count;
const fmt=n=>target.dataset.format==="in"?n.toLocaleString("en-IN"):String(n);
if(reduceMotion){target.textContent=fmt(end);return}
const t0=performance.now(),dur=1400;
const step=now=>{
const k=clamp((now-t0)/dur);
target.textContent=fmt(Math.round(end*(1-Math.pow(1-k,3))));
if(k<1)requestAnimationFrame(step);
};
requestAnimationFrame(step);
});
},{threshold:.6});
$$("[data-count]").forEach(el=>counter.observe(el));

// ---------- Marquee: duplicate content for a seamless loop ----------
$$(".marquee .track").forEach(t=>t.innerHTML+=t.innerHTML);

// ---------- Active nav link ----------
const navLinks=$$('.links a[href^="#"]');
const spy=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(!e.isIntersecting)return;
navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
});
},{rootMargin:"-45% 0px -50% 0px"});
["hero","about","curriculum","join","faq"].forEach(id=>spy.observe(document.getElementById(id)));

// ---------- Scroll engine: one rAF loop drives every scroll-linked effect ----------
const bar=$("#progressBar");
const heroFx=$(".hero-fx");
const marquee=$("#marquee");
const hSection=$("#curriculum");
const hTrack=$("#hTrack");
const hCards=$$(".hcard");
const pillBtns=$$("#dayPills button");
const dayMeter=$("#dayMeter");
const footer=$("#footer");
const giantFill=$(".giant-fill");

let hero3d=null;
let vh=0,docH=0,heroH=0,trackMax=0,cardCenters=[],hMode=false;
let lastY=scrollY,skew=0,ticking=false,lastDay=0;

const measure=()=>{
vh=innerHeight;
heroH=hero.offsetHeight;
hMode=wideQuery.matches&&!reduceMotion;
if(hMode){
trackMax=Math.max(0,hTrack.scrollWidth-innerWidth);
hSection.style.height=trackMax+vh+"px";
cardCenters=hCards.map(c=>c.offsetLeft+c.offsetWidth/2);
}else{
hSection.style.height="";
hTrack.style.transform="";
hCards.forEach(c=>{c.style.removeProperty("--cry");c.style.removeProperty("--ctz")});
}
docH=document.documentElement.scrollHeight;
};

const frame=()=>{
// reads
const y=scrollY;
const hTop=hMode?hSection.getBoundingClientRect().top:0;
const fTop=footer.getBoundingClientRect().top;

// writes
bar.style.transform=`scaleX(${docH>vh?clamp(y/(docH-vh)):0})`;

if(y<heroH+200){
const hp=clamp(y/heroH);
heroFx.style.setProperty("--sy",y.toFixed(1));
hero3d?.setScroll(hp);
}

const vel=y-lastY;
lastY=y;
if(!reduceMotion){
skew+=(clamp(vel*.2,-8,8)-skew)*.12;
marquee.style.setProperty("--skew",skew.toFixed(2)+"deg");
}

if(hMode){
const p=clamp(-hTop/(hSection.offsetHeight-vh));
const x=p*trackMax;
hTrack.style.transform=`translate3d(${-x}px,0,0)`;
let day=1,best=Infinity;
hCards.forEach((c,i)=>{
const d=(cardCenters[i]-x-innerWidth/2)/innerWidth;
if(Math.abs(d)<best){best=Math.abs(d);day=i+1}
c.style.setProperty("--cry",(d*-28).toFixed(2)+"deg");
c.style.setProperty("--ctz",(-Math.abs(d)*160).toFixed(1)+"px");
});
if(day!==lastDay){pillBtns.forEach((b,i)=>b.classList.toggle("active",i===day-1));lastDay=day}
dayMeter.style.transform=`scaleX(${p.toFixed(3)})`;
}

if(fTop<vh){
giantFill.style.setProperty("--fp",clamp((vh-fTop)/footer.offsetHeight*1.3).toFixed(3));
}

if(vel!==0||Math.abs(skew)>.05)requestAnimationFrame(frame);
else ticking=false;
};

const kick=()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}};
addEventListener("scroll",kick,{passive:true});

// on the stacked (mobile) layout, highlight the pill of the card in view
const pillSpy=new IntersectionObserver(entries=>{
if(hMode)return;
entries.forEach(e=>{
if(e.isIntersecting)pillBtns.forEach((b,i)=>b.classList.toggle("active",hCards[i]===e.target));
});
},{rootMargin:"-45% 0px -50% 0px"});
hCards.forEach(c=>pillSpy.observe(c));

// day pills jump to a card (in the horizontal track or the stacked mobile list)
$("#dayPills").addEventListener("click",e=>{
const b=e.target.closest("button");
if(!b)return;
const i=+b.dataset.i;
const behavior=reduceMotion?"auto":"smooth";
if(hMode&&trackMax>0){
const top=hSection.getBoundingClientRect().top+scrollY;
const p=clamp((cardCenters[i]-innerWidth/2)/trackMax);
scrollTo({top:top+p*(hSection.offsetHeight-vh),behavior});
}else{
hCards[i].scrollIntoView({behavior,block:"center"});
}
});
addEventListener("resize",()=>{measure();kick()});
wideQuery.addEventListener("change",()=>{measure();kick()});
document.fonts.ready.then(()=>{measure();kick()});
measure();
kick();

// ---------- Live simulated candlestick chart ----------
const chart=$("#liveChart");
const changeEl=$("#simChange");
(()=>{
const ctx=chart.getContext("2d");
const CW=13;
let W=0,H=0,candles=[],price=100,ticks=0,timer=0,visible=false;

const newCandle=()=>({o:price,h:price,l:price,c:price});
const tick=()=>{
price=Math.max(20,price+(Math.random()-.47)*.9+(104-price)*.012);
const c=candles[candles.length-1];
c.c=price;c.h=Math.max(c.h,price);c.l=Math.min(c.l,price);
if(++ticks%7===0){
candles.push(newCandle());
const cap=Math.ceil(W/CW)+2;
if(candles.length>cap)candles.splice(0,candles.length-cap);
}
};

const draw=()=>{
ctx.clearRect(0,0,W,H);
const padR=58,padY=14;
const vis=candles.slice(-Math.floor((W-padR)/CW));
let lo=Infinity,hi=-Infinity;
vis.forEach(c=>{lo=Math.min(lo,c.l);hi=Math.max(hi,c.h)});
const span=Math.max(hi-lo,1);
const Y=v=>padY+(1-(v-lo)/span)*(H-padY*2);

ctx.strokeStyle="rgba(255,255,255,.06)";
ctx.lineWidth=1;
for(let i=1;i<4;i++){const gy=Math.round(H*i/4)+.5;ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W-padR,gy);ctx.stroke()}

let ema=vis[0].c;
const emaPts=[];
vis.forEach((c,i)=>{
const x=W-padR-(vis.length-i)*CW+CW/2;
const up=c.c>=c.o;
ctx.strokeStyle=ctx.fillStyle=up?"#3ee08f":"#ff5c7a";
ctx.beginPath();ctx.moveTo(x+.5,Y(c.h));ctx.lineTo(x+.5,Y(c.l));ctx.stroke();
const top=Y(Math.max(c.o,c.c)),bh=Math.max(1.5,Math.abs(Y(c.o)-Y(c.c)));
ctx.fillRect(x-CW*.3,top,CW*.6,bh);
ema+=(c.c-ema)*(2/11);
emaPts.push([x,Y(ema)]);
});

ctx.strokeStyle="#9cc1ff";
ctx.lineWidth=2;
ctx.beginPath();
emaPts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
ctx.stroke();

const ly=Y(price);
ctx.setLineDash([4,4]);
ctx.strokeStyle="rgba(156,193,255,.5)";
ctx.lineWidth=1;
ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(W-padR,ly);ctx.stroke();
ctx.setLineDash([]);
ctx.fillStyle="#2f6bff";
ctx.fillRect(W-padR+4,ly-10,padR-4,20);
ctx.fillStyle="#fff";
ctx.font="600 11px 'JetBrains Mono', monospace";
ctx.textBaseline="middle";
ctx.fillText(price.toFixed(2),W-padR+9,ly);

const pct=(price/vis[0].o-1)*100;
changeEl.textContent=`${pct>=0?"▲ +":"▼ "}${pct.toFixed(2)}%`;
changeEl.classList.toggle("down",pct<0);
};

const resize=()=>{
const dpr=Math.min(devicePixelRatio,2);
W=chart.clientWidth;H=chart.clientHeight;
chart.width=W*dpr;chart.height=H*dpr;
ctx.setTransform(dpr,0,0,dpr,0,0);
if(!candles.length){
candles=[newCandle()];
for(let i=0;i<(Math.ceil(W/CW)+2)*7;i++)tick();
}
draw();
};

const run=()=>{
clearInterval(timer);
if(visible&&!reduceMotion&&!document.hidden)timer=setInterval(()=>{tick();draw()},140);
};

new ResizeObserver(resize).observe(chart);
new IntersectionObserver(([e])=>{visible=e.isIntersecting;run()}).observe(chart);
document.addEventListener("visibilitychange",run);
})();

// ---------- WebGL hero (loaded after the page, image stays as fallback) ----------
const heroArt=$("#heroArt");
const canvas=$("#hero3d");
const hasWebGL=(()=>{try{return!!document.createElement("canvas").getContext("webgl2")}catch{return false}})();

if(hasWebGL){
const load=()=>import("./hero3d.js").then(m=>{
hero3d=m.initHero3D(canvas,{
lite:!wideQuery.matches||(navigator.hardwareConcurrency||8)<=4,
still:reduceMotion
});
hero3d.setScroll(clamp(scrollY/heroH));
requestAnimationFrame(()=>heroArt.classList.add("webgl-ready"));
}).catch(err=>console.warn("3D hero unavailable, using image",err));
if(document.readyState==="complete")setTimeout(load,50);
else addEventListener("load",()=>setTimeout(load,50),{once:true});
}

// ---------- Live candle: follows the cursor, beam in from the left, rays fan out ----------
// Moving up paints a green (bull) candle, moving down a red (bear) one; speed stretches the body.
// The price tag reads higher on screen as a gain, lower as a loss.
// Everything fades toward the left edge so the hero text stays readable.
// Rays and candle are moved with transforms only, so nothing large is repainted per frame.
(()=>{
const raysEl=$("#rays"),top=$("#candleTop");
const body=$("#pBody"),wick=$("#pWick"),tagBg=$("#pTagBg"),tagText=$("#pTagText");
const glowStop=$("#pGlowStop"),glowEnd=glowStop.nextElementSibling;
const UP=[62,224,143],DOWN=[255,92,122];
let w=0,h=0,left=0,docTop=0,offX=0,offY=0,x=0,y=0,tx=null,ty=null,frame=0,inView=true;
let trend=1,speed=0,lastY=0,lastPct="",lastOp="",lastLook="";
const t0=performance.now();

const measureFx=()=>{
const r=heroFx.getBoundingClientRect(),hr=hero.getBoundingClientRect();
w=r.width;h=r.height;left=r.left;docTop=r.top+scrollY;
offX=r.left-hr.left;offY=r.top-hr.top;
};
const idle=t=>[w*.64+Math.sin(t*.35)*w*.07,h*.8+Math.sin(t*.6)*h*.05];
const mix=k=>UP.map((u,i)=>Math.round(DOWN[i]+(u-DOWN[i])*k)).join(",");

const render=()=>{
raysEl.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
top.style.transform=`translate3d(${(x+offX-110).toFixed(1)}px,${(y+offY-100).toFixed(1)}px,0)`;

const op=clamp((x/w-.12)/.36,.12,1).toFixed(2);
if(op!==lastOp){raysEl.style.opacity=top.style.opacity=lastOp=op}

// candle colour + body height (only touched when they visibly change)
const rgb=`rgb(${mix((trend+1)/2)})`;
const bh=(36+speed*30).toFixed(0);
const look=rgb+bh;
if(look!==lastLook){
lastLook=look;
body.setAttribute("y",-bh/2);
body.setAttribute("height",bh);
body.setAttribute("fill",rgb);
wick.setAttribute("y1",-bh/2-16);
wick.setAttribute("y2",bh/2+16);
wick.setAttribute("stroke",rgb);
glowStop.setAttribute("stop-color",rgb);
glowEnd.setAttribute("stop-color",rgb);
}

const pct=((.5-y/h)*10).toFixed(2);
if(pct!==lastPct){
lastPct=pct;
tagText.textContent=(pct>=0?"+":"")+pct+"%";
tagBg.setAttribute("fill",pct>=0?"#3ee08f":"#ff5c7a");
}
};

const step=now=>{
frame=0;
const [ix,iy]=idle((now-t0)/1000);
x+=((tx??ix)-x)*.3;
y+=((ty??iy)-y)*.3;
const dy=y-lastY;
lastY=y;
if(Math.abs(dy)>.3)trend+=(clamp(-dy/3,-1,1)-trend)*.15;
speed+=(clamp(Math.abs(dy)/14)-speed)*.12;
render();
run();
};
const run=()=>{if(!frame&&inView&&!document.hidden&&!reduceMotion)frame=requestAnimationFrame(step)};

measureFx();
[x,y]=idle(0);
lastY=y;
render();
addEventListener("resize",measureFx);
document.addEventListener("visibilitychange",run);
new IntersectionObserver(([e])=>{inView=e.isIntersecting;if(inView){measureFx();run()}}).observe(hero);

if(finePointer&&!reduceMotion){
hero.addEventListener("pointermove",e=>{tx=e.clientX-left;ty=e.clientY+scrollY-docTop});
hero.addEventListener("pointerleave",()=>{tx=ty=null});
}
run();
})();

if(reduceMotion||!finePointer)return;

// ---------- Hero pointer: drives 3D scene (or image parallax fallback) ----------
const arrow=$(".arrow");
let hFrame=0,hx=0,hy=0;
hero.addEventListener("pointermove",e=>{
hx=e.clientX/innerWidth*2-1;
hy=e.clientY/innerHeight*2-1;
if(!hFrame)hFrame=requestAnimationFrame(()=>{
hFrame=0;
if(hero3d)hero3d.setPointer(hx,hy);
else{arrow.style.setProperty("--px",hx*-12+"px");arrow.style.setProperty("--py",hy*-12+"px")}
});
});

// ---------- 3D tilt + specular light on glass boxes ----------
const MAX_TILT=6;

$$(".box").forEach(box=>{
let rect=null,frame=0,x=0,y=0;

const paint=()=>{
frame=0;
const px=(x-rect.left)/rect.width;
const py=(y-rect.top)/rect.height;
box.style.setProperty("--mx",px*100+"%");
box.style.setProperty("--my",py*100+"%");
if(box.classList.contains("hcard")&&hMode)return;
box.style.setProperty("--ry",(px-.5)*MAX_TILT*2+"deg");
box.style.setProperty("--rx",(.5-py)*MAX_TILT*2+"deg");
};

box.addEventListener("pointerenter",()=>{rect=box.getBoundingClientRect()});
box.addEventListener("pointermove",e=>{
x=e.clientX;y=e.clientY;
if(!rect)rect=box.getBoundingClientRect();
if(!frame)frame=requestAnimationFrame(paint);
});
box.addEventListener("pointerleave",()=>{
cancelAnimationFrame(frame);frame=0;rect=null;
box.style.setProperty("--rx","0deg");
box.style.setProperty("--ry","0deg");
});
});

// ---------- Magnetic buttons ----------
$$(".magnetic").forEach(el=>{
el.addEventListener("pointermove",e=>{
const r=el.getBoundingClientRect();
el.style.translate=`${(e.clientX-r.left-r.width/2)*.25}px ${(e.clientY-r.top-r.height/2)*.35}px`;
});
el.addEventListener("pointerleave",()=>{el.style.translate=""});
});

});
