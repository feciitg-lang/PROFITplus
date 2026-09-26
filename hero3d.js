// PROFIT+ hero scene: a glossy 3D version of the poster's % arrow,
// orbited by candlesticks, floating in a star field.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const UP = 0x3ee08f;
const DOWN = 0xff5c7a;

// Poster arrow centreline (tail -> dip -> head base) turned into a thick extruded shape.
function arrowGeometry(){
const pts=[[-1.45,-1.15],[-0.8,-0.4],[-0.4,-0.72],[0.78,0.58]].map(([x,y])=>new THREE.Vector2(x,y));
const w=0.16;
const left=[],right=[];

const normal=(a,b)=>{const d=b.clone().sub(a).normalize();return new THREE.Vector2(-d.y,d.x)};

pts.forEach((p,i)=>{
let n;
if(i===0)n=normal(pts[0],pts[1]);
else if(i===pts.length-1)n=normal(pts[i-1],pts[i]);
else{
const n1=normal(pts[i-1],pts[i]),n2=normal(pts[i],pts[i+1]);
const m=n1.clone().add(n2).normalize();
n=m.multiplyScalar(1/m.dot(n1));
}
left.push(p.clone().addScaledVector(n,w));
right.push(p.clone().addScaledVector(n,-w));
});

const base=pts[pts.length-1];
const dir=base.clone().sub(pts[pts.length-2]).normalize();
const n=new THREE.Vector2(-dir.y,dir.x);
const tip=base.clone().addScaledVector(dir,0.55);

const shape=new THREE.Shape();
shape.moveTo(left[0].x,left[0].y);
left.slice(1).forEach(p=>shape.lineTo(p.x,p.y));
const wl=base.clone().addScaledVector(n,w*2.4),wr=base.clone().addScaledVector(n,-w*2.4);
shape.lineTo(wl.x,wl.y);
shape.lineTo(tip.x,tip.y);
shape.lineTo(wr.x,wr.y);
right.slice().reverse().forEach(p=>shape.lineTo(p.x,p.y));
shape.closePath();

const geo=new THREE.ExtrudeGeometry(shape,{depth:0.26,bevelEnabled:true,bevelThickness:0.06,bevelSize:0.045,bevelSegments:5,curveSegments:1});
geo.translate(0,0,-0.13);
return geo;
}

export function initHero3D(canvas,{lite=false,still=false}={}){
const renderer=new THREE.WebGLRenderer({canvas,antialias:!lite,alpha:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,lite?1.25:1.5));
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=0.95;

const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
pmrem.dispose();

const camera=new THREE.PerspectiveCamera(32,1,0.1,60);
camera.position.set(0,0,8);

scene.add(new THREE.DirectionalLight(0xffffff,2).translateX(3).translateY(5).translateZ(6));
const blue=new THREE.PointLight(0x4d8bff,30,20);blue.position.set(-3,-2,3);scene.add(blue);
const rim=new THREE.PointLight(0x9cc1ff,18,20);rim.position.set(3,2,-3);scene.add(rim);

const world=new THREE.Group();
world.scale.setScalar(0.7);
scene.add(world);

// --- the % arrow ---
const glass=new THREE.MeshPhysicalMaterial({
color:0x1a5cff,metalness:0.15,roughness:0.16,
clearcoat:1,clearcoatRoughness:0.05,
emissive:0x0a3bd6,emissiveIntensity:0.55,envMapIntensity:0.75
});

const logo=new THREE.Group();
logo.add(new THREE.Mesh(arrowGeometry(),glass));
const torusGeo=new THREE.TorusGeometry(0.34,0.13,24,72);
const t1=new THREE.Mesh(torusGeo,glass);t1.position.set(-0.78,0.62,0);
const t2=new THREE.Mesh(torusGeo,glass);t2.position.set(0.72,-0.72,0);
logo.add(t1,t2);
world.add(logo);

// --- orbiting candlesticks ---
const N=lite?18:28;
const bodies=new THREE.InstancedMesh(new THREE.BoxGeometry(0.065,1,0.065),new THREE.MeshBasicMaterial({toneMapped:false}),N);
const wicks=new THREE.InstancedMesh(new THREE.BoxGeometry(0.014,1,0.014),new THREE.MeshBasicMaterial({color:0x9cc1ff,transparent:true,opacity:.55}),N);
const m=new THREE.Matrix4(),q=new THREE.Quaternion(),pos=new THREE.Vector3(),scl=new THREE.Vector3(),col=new THREE.Color();
let level=0;
for(let i=0;i<N;i++){
const a=i/N*Math.PI*2,r=2.5+(i%3)*0.07;
const h=0.1+Math.random()*0.3;
const up=Math.random()>0.38;
level+=up?0.05:-0.04;
pos.set(Math.cos(a)*r,Math.sin(level*3)*0.12,Math.sin(a)*r);
bodies.setMatrixAt(i,m.compose(pos,q,scl.set(1,h,1)));
wicks.setMatrixAt(i,m.compose(pos,q,scl.set(1,h*1.7,1)));
bodies.setColorAt(i,col.setHex(up?UP:DOWN));
}
const ring=new THREE.Group();
ring.add(bodies,wicks);
ring.rotation.set(0.38,0,-0.22);
world.add(ring);

// --- star field ---
const P=lite?260:620;
const starPos=new Float32Array(P*3);
for(let i=0;i<P;i++){
const r=3.2+Math.random()*6,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
starPos.set([r*Math.sin(ph)*Math.cos(th),r*Math.sin(ph)*Math.sin(th),r*Math.cos(ph)-2],i*3);
}
const starGeo=new THREE.BufferGeometry();
starGeo.setAttribute("position",new THREE.BufferAttribute(starPos,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x8fb6ff,size:0.035,transparent:true,opacity:.75,depthWrite:false}));
scene.add(stars);

// --- sizing ---
const resize=()=>{
const w=canvas.clientWidth,h=canvas.clientHeight;
if(!w||!h)return;
renderer.setSize(w,h,false);
camera.aspect=w/h;
camera.updateProjectionMatrix();
if(still)frame();
};
new ResizeObserver(resize).observe(canvas);

// --- animation ---
let tx=0,ty=0,px=0,py=0,scroll=0,sScroll=0,t=0,last=performance.now();

function frame(){
const now=performance.now();
const dt=Math.min((now-last)/1000,0.05);
last=now;
if(!still)t+=dt;
px+=(tx-px)*0.06;
py+=(ty-py)*0.06;
sScroll+=(scroll-sScroll)*0.12;

logo.rotation.y=Math.sin(t*0.45)*0.55+px*0.5+sScroll*2.4;
logo.rotation.x=-py*0.3+Math.sin(t*0.6)*0.06;
logo.position.y=Math.sin(t*1.1)*0.07;
ring.rotation.y=t*0.22;
stars.rotation.y=t*0.015;
world.position.y=sScroll*1.4;
world.rotation.z=sScroll*0.25;

renderer.render(scene,camera);
}

let inView=true,running=false;
const update=()=>{
const should=!still&&inView&&!document.hidden;
if(should===running)return;
running=should;
last=performance.now();
renderer.setAnimationLoop(should?frame:null);
};
new IntersectionObserver(([e])=>{inView=e.isIntersecting;update()}).observe(canvas);
document.addEventListener("visibilitychange",update);

resize();
frame();
update();

return{
setPointer(x,y){tx=x;ty=y},
setScroll(p){
scroll=p;
if(still)frame();
}
};
}
