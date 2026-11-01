
"use strict";
const slides = window.GALERIA_TELAS || [];
let ativo = 0;
const imagem = document.getElementById("tourImage");
const titulo = document.getElementById("tourScreenTitle");
const total = document.getElementById("tourCount");
const select = document.getElementById("tourSelect");
const lateral = document.getElementById("tourItems");
const anterior = document.getElementById("tourPrev");
const proximo = document.getElementById("tourNext");
const zoom = document.getElementById("tourZoom");
const visor = document.getElementById("tourImageWrap");
const ajustar = (i) => {
  if (!slides.length) return;
  ativo = (i + slides.length) % slides.length;
  const item = slides[ativo];
  imagem.src = item.src;
  imagem.alt = item.label;
  titulo.textContent = item.label;
  total.textContent = `${ativo+1} / ${slides.length}`;
  select.value = String(ativo);
  lateral.querySelectorAll("button").forEach((b,k) => b.setAttribute("aria-current", String(k===ativo)));
  visor.classList.remove("zoomed");
  zoom.textContent = "Ampliar +";
  visor.scrollTo(0,0);
  const current = lateral.children[ativo];
  current?.scrollIntoView({block:"nearest",behavior:"instant"});
};
slides.forEach((item,i) => {
 const option=document.createElement("option");option.value=String(i);option.textContent=`${String(i+1).padStart(2,'0')} · ${item.label}`;select.append(option);
 const b=document.createElement("button");b.type="button";b.className="tour-item";b.setAttribute("aria-current","false");
 const number=document.createElement("span");number.textContent=String(i+1).padStart(2,'0');
 const label=document.createElement("span");label.textContent=item.label;b.append(number,label);b.addEventListener("click",()=>ajustar(i));lateral.append(b);
});
select.addEventListener("change",()=>ajustar(Number(select.value)));
anterior.addEventListener("click",()=>ajustar(ativo-1));
proximo.addEventListener("click",()=>ajustar(ativo+1));
zoom.addEventListener("click",()=>{let v=visor.classList.toggle("zoomed");zoom.textContent=v?"Ajustar tela −":"Ampliar +";visor.scrollTo(0,0)});
window.addEventListener("keydown",e=>{if(["INPUT","SELECT","TEXTAREA"].includes(document.activeElement?.tagName))return;if(e.key==="ArrowRight")ajustar(ativo+1);if(e.key==="ArrowLeft")ajustar(ativo-1);});
let gesto = null;
visor.addEventListener("touchstart",e=>{if(visor.classList.contains("zoomed")||e.touches.length!==1)return;gesto={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
visor.addEventListener("touchend",e=>{if(!gesto||!e.changedTouches.length)return;let dx=e.changedTouches[0].clientX-gesto.x;let dy=e.changedTouches[0].clientY-gesto.y;gesto=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.35)ajustar(ativo+(dx<0?1:-1))},{passive:true});
ajustar(0);

const voltar = document.getElementById('tourBack');
voltar?.addEventListener('click', () => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ tipo: 'fechar-galeria' }, window.location.origin);
  } else {
    window.location.href = '../../index.html#projetos';
  }
});
