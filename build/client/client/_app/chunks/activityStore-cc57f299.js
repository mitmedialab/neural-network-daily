import{D as l}from"./vendor-296f84ed.js";const p="Contours2Classification_";function e(i,o=null){const r=p+i,s=typeof localStorage!="undefined",a=()=>{if(s){const t=localStorage.getItem(r);return t?JSON.parse(t):o}return o},c=t=>{s&&localStorage.setItem(r,JSON.stringify(t))},{subscribe:n,set:f,update:d}=l(a());return n(t=>c(t)),{subscribe:n,update:d,set:f}}const S=e("room",void 0);e("role",void 0);e("inputs",void 0);export{S as r};
