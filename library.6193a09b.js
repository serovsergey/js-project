!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},a={},n=e.parcelRequire216a;null==n&&((n=function(e){if(e in t)return t[e].exports;if(e in a){var n=a[e];delete a[e];var s={id:e,exports:{}};return t[e]=s,n.call(s.exports,s,s.exports),s.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){a[e]=t},e.parcelRequire216a=n),n("8vL8o");var s=n("2Z7mb"),r=n("hnyov"),o=n("cQkN8"),i=n("jcFG7"),l=n("5cQgp"),c=n("gcmAn"),d=n("kzlwW"),u=n("gHeeA");const g="library_mode",f="watched_page",m="queue_page",p="watched",h="queue";new(0,s.default)("#slider");document.querySelectorAll(".modal").forEach((e=>e.style.display="none"));const w=new(0,r.default)("queue"),v=new(0,r.default)("watched"),y={watchedBtn:document.querySelector('header [data-action="watched"]'),queueBtn:document.querySelector('header [data-action="queue"]'),cardsUl:document.querySelector(".gallery__list"),pagination:document.querySelector(".gallery__pagination"),teamLink:document.querySelector(".open-team-modal")};y.teamLink.addEventListener("click",(e=>{e.preventDefault();new(0,d.default)(u.teamMembers).show()})),y.watchedBtn.closest("UL").addEventListener("click",(e=>{const t=e.target.dataset.action;t&&b(t)})),y.cardsUl.addEventListener("click",(e=>{e.preventDefault();const t=e.target.closest("LI");if(!t)return;new(0,c.default)("watched"===L?v.getItemById(t.dataset.id):w.getItemById(t.dataset.id),{onClose:null,onChange:e=>{e===L&&q(w.page)}}).show()})),y.pagination.addEventListener("click",(async e=>{if(e.target.classList.contains("gallery__pag-button--current")){if("1"===e.target.dataset.pages)return;const t=`<form style=""><input type="number" name="page" max="${e.target.dataset.pages}" min="1" value="${e.target.textContent}" style="width:100%; height:100%"></form>`;e.target.innerHTML=t;const a=e.target.querySelector("form");return a.elements.page.focus(),a.elements.page.select(),a.addEventListener("submit",(async t=>{t.preventDefault(),q(t.target.elements.page.value),e.target.textContent=e.target.dataset.curpage}),{once:!0}),void a.elements.page.addEventListener("blur",(t=>{a.remove(),e.target.textContent=e.target.dataset.curpage}),{once:!0})}const t=e.target.dataset.page;t&&(q(t),window.scrollTo({top:0,behavior:"smooth"}))}));let L=sessionStorage.getItem(g);function b(e){let t;switch(L=e,sessionStorage.setItem(g,e),e){case p:y.watchedBtn.classList.add("is-active"),y.queueBtn.classList.remove("is-active"),t=sessionStorage.getItem(f)||1;break;case h:y.watchedBtn.classList.remove("is-active"),y.queueBtn.classList.add("is-active"),t=sessionStorage.getItem(m)||1;break;default:return}q(t)}function q(e){let t;switch(L){case p:t=v.fetchNext(e),t&&sessionStorage.setItem(f,t.page);break;case h:t=w.fetchNext(e),t&&sessionStorage.setItem(m,t.page);break;default:return}!function(e){y.cardsUl.innerHTML=e?(0,l.default)({results:e.results,base_path:o.default.IMAGES_BASE_URL,showRating:1}):`<li class="gallery__no-entries">There are no entries in the ${L} list yet</li>`,y.pagination.innerHTML=e?(0,i.default)(e):""}(t)}L||(L=p),b(L)}();
//# sourceMappingURL=library.6193a09b.js.map
