document.addEventListener("DOMContentLoaded",()=>{

const btn=document.getElementById("menuBtn");
const nav=document.getElementById("navLinks");

if(btn){
btn.onclick=()=>nav.classList.toggle("open");
}

const items=document.querySelectorAll(".reveal");

const observer=new IntersectionObserver(entries=>{
entries.forEach(e=>{
if(e.isIntersecting){
e.target.classList.add("show");
}
})
},{threshold:.15});

items.forEach(i=>observer.observe(i));

});
