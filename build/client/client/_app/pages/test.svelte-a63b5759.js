import{S as w,i as A,s as q,l as p,g as f,e as _,c as u,a as d,d as i,b as h,K as g,R as m,k as D,m as I,J as y}from"../chunks/vendor-cf4817b6.js";function b(o,l,s){const t=o.slice();return t[4]=l[s],t[6]=s,t}function k(o,l,s){const t=o.slice();return t[4]=l[s],t[8]=s,t}function E(o){let l;return{c(){l=_("div"),this.h()},l(s){l=u(s,"DIV",{style:!0}),d(l).forEach(i),this.h()},h(){h(l,"style",o[0](o[6],o[8]))},m(s,t){f(s,l,t)},p:g,d(s){s&&i(l)}}}function S(o){let l,s=Array($),t=[];for(let r=0;r<s.length;r+=1)t[r]=E(k(o,s,r));return{c(){for(let r=0;r<t.length;r+=1)t[r].c();l=p()},l(r){for(let n=0;n<t.length;n+=1)t[n].l(r);l=p()},m(r,n){for(let e=0;e<t.length;e+=1)t[e].m(r,n);f(r,l,n)},p(r,n){if(n&1){s=Array($);let e;for(e=0;e<s.length;e+=1){const a=k(r,s,e);t[e]?t[e].p(a,n):(t[e]=E(a),t[e].c(),t[e].m(l.parentNode,l))}for(;e<t.length;e+=1)t[e].d(1);t.length=s.length}},d(r){m(t,r),r&&i(l)}}}function V(o){let l,s,t,r=Array(x),n=[];for(let e=0;e<r.length;e+=1)n[e]=S(b(o,r,e));return{c(){l=_("div");for(let e=0;e<n.length;e+=1)n[e].c();s=D(),t=_("div"),this.h()},l(e){l=u(e,"DIV",{class:!0});var a=d(l);for(let c=0;c<n.length;c+=1)n[c].l(a);s=I(a),t=u(a,"DIV",{style:!0,class:!0}),d(t).forEach(i),a.forEach(i),this.h()},h(){h(t,"style",o[0](1,1)),h(t,"class","crossed svelte-1bwp131"),h(l,"class","container svelte-1bwp131")},m(e,a){f(e,l,a);for(let c=0;c<n.length;c+=1)n[c].m(l,null);y(l,s),y(l,t)},p(e,[a]){if(a&1){r=Array(x);let c;for(c=0;c<r.length;c+=1){const v=b(e,r,c);n[c]?n[c].p(v,a):(n[c]=S(v),n[c].c(),n[c].m(l,s))}for(;c<n.length;c+=1)n[c].d(1);n.length=r.length}},i:g,o:g,d(e){e&&i(l),m(n,e)}}}let x=6,$=6;function C(o){const l=r=>r%2==0,s=(r,n)=>{const e=l(r),a=l(n);if(e&&a)return"black";if(e&&!a)return"orange";if(!e&&a)return"green";if(!e&&!a)return"red"};return[(r,n)=>`background-color: ${s(r,n)};
    grid-row: ${r+1};
    grid-column: ${n+1};`]}class j extends w{constructor(l){super();A(this,l,C,V,q,{})}}export{j as default};
