function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a={},n={},r=t.parcelRequire216a;null==r&&((r=function(e){if(e in a)return a[e].exports;if(e in n){var t=n[e];delete n[e];var r={id:e,exports:{}};return a[e]=r,t.call(r.exports,r,r.exports),r.exports}var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){n[e]=t},t.parcelRequire216a=r);var o=r("9OeKo"),s=r("brr8Z"),l=r("5gHzC"),c=r("9N7Qa"),i=r("2nhTy");r("aeCdc");var u=r("44W7Q");const d=[{photo:"https://avatars.githubusercontent.com/u/32988243?v=4",name:"Сергій Сєров",role:"Team Lead",quote:"«Що ми робимо в житті, відгукнеться луною в вічності». («Гладіатор»)."},{photo:"https://avatars.githubusercontent.com/u/99733904?v=4",name:"Нікіта Крутоголов",role:"Scrum Master",quote:"«Нехай прибуде з тобою Сила!». («Зоряні Війни»)."},{photo:"https://avatars.githubusercontent.com/u/28190277?v=4",name:"Максим Бай",role:"Developer",quote:"«– Ти любиш музику? – А ти любиш дихати?». («Це дуже кумедна історія»). "},{photo:"https://avatars.githubusercontent.com/u/15800167?v=4",name:"Марія Чворун",role:"Developer",quote:"«Я є Грут», («Охоронці Галактики»). "},{photo:"https://avatars.githubusercontent.com/u/94764038?v=4",name:"Самуїл Семченко",role:"Developer",quote:"«Не говори:” Я помилився ». Краще скажи: «Треба ж як цікаво вийшло». («Льодовиковий період»). "}];var m=r("aeCdc");var h=e(r("amrNH")).template({1:function(e,t,a,n,r){var o,s=null!=t?t:e.nullContext||{},l=e.hooks.helperMissing,c="function",i=e.escapeExpression,u=e.lookupProperty||function(e,t){if(Object.prototype.hasOwnProperty.call(e,t))return e[t]};return'  <li class="team-item">\n    <img\n    class="team-image"\n    src='+i(typeof(o=null!=(o=u(a,"photo")||(null!=t?u(t,"photo"):t))?o:l)===c?o.call(s,{name:"photo",hash:{},data:r,loc:{start:{line:7,column:8},end:{line:7,column:17}}}):o)+"\n    alt="+i(typeof(o=null!=(o=u(a,"name")||(null!=t?u(t,"name"):t))?o:l)===c?o.call(s,{name:"name",hash:{},data:r,loc:{start:{line:8,column:8},end:{line:8,column:16}}}):o)+'\n    />\n    <div class="overlay">\n                  <p class="overlay__text">'+i(typeof(o=null!=(o=u(a,"quote")||(null!=t?u(t,"quote"):t))?o:l)===c?o.call(s,{name:"quote",hash:{},data:r,loc:{start:{line:11,column:43},end:{line:11,column:52}}}):o)+'\n                </p></div>\n    <div class="member-description">\n    <h3 class="team-member">'+i(typeof(o=null!=(o=u(a,"name")||(null!=t?u(t,"name"):t))?o:l)===c?o.call(s,{name:"name",hash:{},data:r,loc:{start:{line:14,column:28},end:{line:14,column:36}}}):o)+'</h3>\n    <p lang="en" class="team-member-text ">'+i(typeof(o=null!=(o=u(a,"role")||(null!=t?u(t,"role"):t))?o:l)===c?o.call(s,{name:"role",hash:{},data:r,loc:{start:{line:15,column:43},end:{line:15,column:51}}}):o)+"</p></div>\n    </li>\n"},compiler:[8,">= 4.3.0"],main:function(e,t,a,n,r){var o;return'<h2 class="modal__title">Team BAVOVNA</h2>\n  <ul class="team-pics ">\n'+(null!=(o=(e.lookupProperty||function(e,t){if(Object.prototype.hasOwnProperty.call(e,t))return e[t]})(a,"each").call(null!=t?t:e.nullContext||{},t,{name:"each",hash:{},fn:e.program(1,r,0),inverse:e.noop,data:r,loc:{start:{line:3,column:0},end:{line:17,column:9}}}))?o:"")+"  </ul>"},useData:!0});class g extends m.default{constructor(e){super(h(e),{containerClass:"team-container"})}}var p=r("7JPzN");new(0,s.default)("#slider");const f=new(0,l.default);new(0,c.default)("queue");document.querySelectorAll(".modal").forEach((e=>e.style.display="none"));const v={cardsUl:document.querySelector(".gallery__list"),pagination:document.querySelector(".gallery__pagination"),header:document.querySelector("header"),footer:document.querySelector("footer"),main:document.querySelector("main"),searchForm:document.querySelector(".hero-home__form"),loader:document.querySelector(".loader"),homeLinks:document.querySelectorAll(".js-home"),teamLink:document.querySelector(".open-team-modal")},y=e(o)((()=>{const e=document.querySelector(".search-fail");e&&(e.remove(),v.searchForm.removeEventListener("input",y))}),250);function _(e){v.cardsUl.innerHTML=(0,u.default)({results:e.results,base_path:l.default.IMAGES_BASE_URL}),v.pagination.innerHTML=(0,i.default)(e)}async function L(e){let t;const a=document.querySelector(".search-fail");a&&a.remove();const n=sessionStorage.getItem("search_query");if(n){v.searchForm.elements.searchQuery.value=n,v.loader.classList.remove("is-hidden");try{t=await f.fetchNextSearch("",e),sessionStorage.setItem("search_current_page",t.page),_(t)}catch(e){console.log(e.message)}finally{v.loader.classList.add("is-hidden")}}else{v.searchForm.elements.searchQuery.value="",v.loader.classList.remove("is-hidden");try{t=await f.fetchNextTrending(e),sessionStorage.setItem("trending_current_page",t.page),_(t)}catch(e){console.log(e.message)}finally{v.loader.classList.add("is-hidden")}}}v.teamLink.addEventListener("click",(e=>{e.preventDefault();new g(d).show()})),v.homeLinks.forEach((e=>{e.addEventListener("click",(e=>{sessionStorage.removeItem("search_current_page"),sessionStorage.removeItem("search_query"),sessionStorage.removeItem("trending_current_page")}))})),v.cardsUl.addEventListener("click",(e=>{e.preventDefault();const t=e.target.closest("LI");if(!t)return;console.log(f.getCachedMovieById(t.dataset.id));new(0,p.default)(f.getCachedMovieById(t.dataset.id),{onClose:null,onChange:null}).show()})),v.searchForm.addEventListener("submit",(async e=>{e.preventDefault();const t=document.querySelector(".search-fail");t&&t.remove();const a=e.target.elements.searchQuery.value.trim().toLowerCase();if(!a)return;let n;e.target.elements.searchQuery.value=a,v.loader.classList.remove("is-hidden");try{n=await f.fetchNextSearch(a),sessionStorage.setItem("search_current_page",1)}catch(e){return void console.error(e.message)}finally{v.loader.classList.add("is-hidden")}if(!n.results.length){const t=document.createElement("DIV");return t.textContent="Search result not successful. Enter the correct movie name and try again.",t.classList.add("search-fail"),e.target.appendChild(t),void v.searchForm.addEventListener("input",y)}sessionStorage.setItem("search_query",a),_(n)})),v.pagination.addEventListener("click",(async e=>{if(e.target.classList.contains("gallery__pag-button--current")){if("1"===e.target.dataset.pages)return;const t=`<form style=""><input type="number" name="page" max="${e.target.dataset.pages}" min="1" value="${e.target.textContent}" style="width:100%; height:100%"></form>`;e.target.innerHTML=t;const a=e.target.querySelector("form");return a.elements.page.focus(),a.elements.page.select(),a.addEventListener("submit",(async t=>{t.preventDefault(),L(t.target.elements.page.value),e.target.textContent=e.target.dataset.curpage}),{once:!0}),void a.elements.page.addEventListener("blur",(t=>{a.remove(),e.target.textContent=e.target.dataset.curpage}),{once:!0})}const t=e.target.dataset.page;t&&(L(t),window.scrollTo({top:0,behavior:"smooth"}))})),(async()=>{const e=sessionStorage.getItem("search_query");if(e){v.searchForm.elements.searchQuery.value=e;const t=sessionStorage.getItem("search_current_page");let a;v.loader.classList.remove("is-hidden");try{a=await f.fetchNextSearch(e,t||1)}catch(e){console.error(e.message)}finally{v.loader.classList.add("is-hidden")}_(a)}else{const e=sessionStorage.getItem("trending_current_page");let t;v.loader.classList.remove("is-hidden");try{t=await f.fetchNextTrending(e||1)}catch(e){console.error(e.message)}finally{v.loader.classList.add("is-hidden")}if(!t.results.length)return void(v.cardsUl.innerHTML="<li>There is no trending movies.</li>");_(t)}})();
//# sourceMappingURL=index.3ab939c6.js.map
