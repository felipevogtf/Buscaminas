(()=>{"use strict";var e,v={},m={};function t(e){var u=m[e];if(void 0!==u)return u.exports;var r=m[e]={exports:{}};return v[e](r,r.exports,t),r.exports}t.m=v,e=[],t.O=(u,r,i,o)=>{if(!r){var a=1/0;for(n=0;n<e.length;n++){for(var[r,i,o]=e[n],d=!0,f=0;f<r.length;f++)(!1&o||a>=o)&&Object.keys(t.O).every(b=>t.O[b](r[f]))?r.splice(f--,1):(d=!1,o<a&&(a=o));if(d){e.splice(n--,1);var s=i();void 0!==s&&(u=s)}}return u}o=o||0;for(var n=e.length;n>0&&e[n-1][2]>o;n--)e[n]=e[n-1];e[n]=[r,i,o]},t.d=(e,u)=>{for(var r in u)t.o(u,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:u[r]})},t.f={},t.e=e=>Promise.all(Object.keys(t.f).reduce((u,r)=>(t.f[r](e,u),u),[])),t.u=e=>e+".9d34e092195df1e0.js",t.miniCssF=e=>{},t.o=(e,u)=>Object.prototype.hasOwnProperty.call(e,u),(()=>{var e={},u="buscaminas:";t.l=(r,i,o,n)=>{if(e[r])e[r].push(i);else{var a,d;if(void 0!==o)for(var f=document.getElementsByTagName("script"),s=0;s<f.length;s++){var l=f[s];if(l.getAttribute("src")==r||l.getAttribute("data-webpack")==u+o){a=l;break}}a||(d=!0,(a=document.createElement("script")).type="module",a.charset="utf-8",a.timeout=120,t.nc&&a.setAttribute("nonce",t.nc),a.setAttribute("data-webpack",u+o),a.src=t.tu(r)),e[r]=[i];var c=(g,b)=>{a.onerror=a.onload=null,clearTimeout(p);var h=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),h&&h.forEach(y=>y(b)),g)return g(b)},p=setTimeout(c.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=c.bind(null,a.onerror),a.onload=c.bind(null,a.onload),d&&document.head.appendChild(a)}}})(),t.r=e=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;t.tt=()=>(void 0===e&&(e={createScriptURL:u=>u},typeof trustedTypes<"u"&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("angular#bundler",e))),e)})(),t.tu=e=>t.tt().createScriptURL(e),t.p="https://felipevogtf.github.io/buscaminas/",(()=>{var e={666:0};t.f.j=(i,o)=>{var n=t.o(e,i)?e[i]:void 0;if(0!==n)if(n)o.push(n[2]);else if(666!=i){var a=new Promise((l,c)=>n=e[i]=[l,c]);o.push(n[2]=a);var d=t.p+t.u(i),f=new Error;t.l(d,l=>{if(t.o(e,i)&&(0!==(n=e[i])&&(e[i]=void 0),n)){var c=l&&("load"===l.type?"missing":l.type),p=l&&l.target&&l.target.src;f.message="Loading chunk "+i+" failed.\n("+c+": "+p+")",f.name="ChunkLoadError",f.type=c,f.request=p,n[1](f)}},"chunk-"+i,i)}else e[i]=0},t.O.j=i=>0===e[i];var u=(i,o)=>{var f,s,[n,a,d]=o,l=0;if(n.some(p=>0!==e[p])){for(f in a)t.o(a,f)&&(t.m[f]=a[f]);if(d)var c=d(t)}for(i&&i(o);l<n.length;l++)t.o(e,s=n[l])&&e[s]&&e[s][0](),e[s]=0;return t.O(c)},r=self.webpackChunkbuscaminas=self.webpackChunkbuscaminas||[];r.forEach(u.bind(null,0)),r.push=u.bind(null,r.push.bind(r))})()})();