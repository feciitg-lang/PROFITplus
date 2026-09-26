// Paste the registration form link here. Until then, Register buttons show a "coming soon" message.
const REGISTER_URL="";

document.addEventListener("DOMContentLoaded",()=>{

const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer=matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- Mobile menu ----------
const btn=document.getElementById("menuBtn");
const nav=document.getElementById("navLinks");

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
document.addEventListener("click",e=>{if(!e.target.closest("nav"))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

// ---------- Register buttons ----------
const toast=document.getElementById("toast");
let toastTimer;

document.querySelectorAll(".js-register").forEach(a=>{
if(REGISTER_URL){
a.href=REGISTER_URL;
a.target="_blank";
a.rel="noopener";
}else{
a.addEventListener("click",e=>{
e.preventDefault();
toast.textContent="Registration link opens soon. Stay tuned!";
toast.classList.add("show");
clearTimeout(toastTimer);
toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
});
}
});

// ---------- Reveal on scroll (staggered per grid) ----------
const items=document.querySelectorAll(".reveal");

items.forEach(el=>{
const siblings=[...el.parentElement.children].filter(c=>c.classList.contains("reveal"));
el.style.setProperty("--delay",Math.min(siblings.indexOf(el),5)*0.08+"s");
});

const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.classList.add("show");
observer.unobserve(e.target);
}
});
},{threshold:.12,rootMargin:"0px 0px -40px 0px"});

items.forEach(i=>observer.observe(i));

// Once revealed, drop the stagger delay so hover/tilt respond instantly.
items.forEach(el=>el.addEventListener("transitionend",()=>el.style.removeProperty("--delay"),{once:true}));

if(reduceMotion||!finePointer)return;

// ---------- 3D tilt + specular light on glass boxes ----------
const MAX_TILT=6;

document.querySelectorAll(".box").forEach(box=>{
let rect=null,frame=0,x=0,y=0;

const paint=()=>{
frame=0;
const px=(x-rect.left)/rect.width;
const py=(y-rect.top)/rect.height;
box.style.setProperty("--mx",px*100+"%");
box.style.setProperty("--my",py*100+"%");
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

// ---------- Hero arrow parallax ----------
const hero=document.querySelector(".hero");
const arrow=document.querySelector(".arrow");
let heroFrame=0,hx=0,hy=0;

hero.addEventListener("pointermove",e=>{
hx=e.clientX/innerWidth-.5;
hy=e.clientY/innerHeight-.5;
if(!heroFrame)heroFrame=requestAnimationFrame(()=>{
heroFrame=0;
arrow.style.setProperty("--px",hx*-24+"px");
arrow.style.setProperty("--py",hy*-24+"px");
});
});

});
