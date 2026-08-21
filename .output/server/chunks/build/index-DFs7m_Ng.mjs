import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { e as engagementStyles, _ as __nuxt_component_1 } from './engagement-icons.module-BtNn5Pri.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { _ as __nuxt_component_3 } from './ProductCard-tdFpQDYF.mjs';
import { defineComponent, useCssModule, withAsyncContext, computed, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { g as useFetch, i as defaultSiteContent } from './server.mjs';
import { c as catalog } from './catalog.module-BY5p-w8A.mjs';
import { u as useThemedImage } from './useThemedImage-HZxF4Y-0.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'mysql2/promise';
import 'nodemailer';
import '@vue-email/render';
import '@vue-email/components';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const managed = useCssModule("managed");
    const imageFor = useThemedImage();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$NPe2pSZDQb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cartDisabled = computed(() => {
      var _a, _b;
      return ((_b = (_a = auth.value) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "demo";
    });
    const { data: allProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      { default: () => [] },
      "$NZYcZ2QbRL"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const products = computed(() => allProducts.value.filter((product) => product.featured).slice(0, 4));
    const { data: universes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/universes",
      { default: () => [] },
      "$l7u5D2V3NW"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: stored } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      { default: () => ({}) },
      "$N9KLkV9FkB"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const content = computed(() => ({ ...defaultSiteContent, ...stored.value }));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_HorizontalCarousel = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ProductCard = __nuxt_component_3;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: unref(content).announcement,
        "payment-label": unref(content).paymentLabel,
        "logo-text": unref(content).logoText
      }, null, _parent));
      _push(`<section class="${ssrRenderClass(unref(styles).hero)}"><div class="${ssrRenderClass(unref(styles).heroCopy)}"><h1>${ssrInterpolate(unref(content).heroTitle)}</h1><i></i><p>${ssrInterpolate(unref(content).heroSubtitle)}</p><a href="#selection" class="${ssrRenderClass(unref(styles).cta)}">${ssrInterpolate(unref(content).heroCta)} <b>&gt;</b></a></div><div class="${ssrRenderClass([unref(styles).heroImage, unref(managed).hero])}">`);
      if (unref(imageFor)(unref(content).heroImage)) {
        _push(`<img${ssrRenderAttr("src", ((_a = unref(imageFor)(unref(content).heroImage)) == null ? void 0 : _a.content) + `?size=${(_b = unref(imageFor)(unref(content).heroImage)) == null ? void 0 : _b.width}x${(_c = unref(imageFor)(unref(content).heroImage)) == null ? void 0 : _c.height}`)} alt="" fetchpriority="high" loading="eager" decoding="async">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="${ssrRenderClass(unref(styles).values)}"><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value1Image)) {
        _push(`<img${ssrRenderAttr("src", ((_d = unref(imageFor)(unref(content).value1Image)) == null ? void 0 : _d.content) + `?size=${(_e = unref(imageFor)(unref(content).value1Image)) == null ? void 0 : _e.width}x${(_f = unref(imageFor)(unref(content).value1Image)) == null ? void 0 : _f.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(unref(content).value1)}</b></span><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value2Image)) {
        _push(`<img${ssrRenderAttr("src", ((_g = unref(imageFor)(unref(content).value2Image)) == null ? void 0 : _g.content) + `?size=${(_h = unref(imageFor)(unref(content).value2Image)) == null ? void 0 : _h.width}x${(_i = unref(imageFor)(unref(content).value2Image)) == null ? void 0 : _i.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(unref(content).value2)}</b></span><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value3Image)) {
        _push(`<img${ssrRenderAttr("src", ((_j = unref(imageFor)(unref(content).value3Image)) == null ? void 0 : _j.content) + `?size=${(_k = unref(imageFor)(unref(content).value3Image)) == null ? void 0 : _k.width}x${(_l = unref(imageFor)(unref(content).value3Image)) == null ? void 0 : _l.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(unref(content).value3)}</b></span></section><div class="${ssrRenderClass(unref(styles).container)}"><section id="univers"><div class="${ssrRenderClass(unref(styles).sectionTitle)}"><small>${ssrInterpolate(unref(content).universesEyebrow)}</small><h2>${ssrInterpolate(unref(content).universesTitle)}</h2></div>`);
      _push(ssrRenderComponent(_component_HorizontalCarousel, {
        "track-class": unref(styles).universes,
        label: "les univers"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(universes), (item) => {
              var _a2;
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: item.id,
                to: `/univers/${item.slug || item.id}`,
                class: unref(catalog).universeCard,
                style: unref(imageFor)(item.image) ? { backgroundImage: `linear-gradient(#0002,#0008),url(${(_a2 = unref(imageFor)(item.image)) == null ? void 0 : _a2.content})`, backgroundSize: "cover", backgroundPosition: "center" } : {}
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span${_scopeId2}>${ssrInterpolate(item.title)}</span><b${_scopeId2}>&gt;</b>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(item.title), 1),
                      createVNode("b", null, ">")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(universes), (item) => {
                var _a2;
                return openBlock(), createBlock(_component_NuxtLink, {
                  key: item.id,
                  to: `/univers/${item.slug || item.id}`,
                  class: unref(catalog).universeCard,
                  style: unref(imageFor)(item.image) ? { backgroundImage: `linear-gradient(#0002,#0008),url(${(_a2 = unref(imageFor)(item.image)) == null ? void 0 : _a2.content})`, backgroundSize: "cover", backgroundPosition: "center" } : {}
                }, {
                  default: withCtx(() => [
                    createVNode("span", null, toDisplayString(item.title), 1),
                    createVNode("b", null, ">")
                  ]),
                  _: 2
                }, 1032, ["to", "class", "style"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section id="selection"><div class="${ssrRenderClass(unref(styles).sectionTitle)}"><small>${ssrInterpolate(unref(content).favoritesEyebrow)}</small><h2>${ssrInterpolate(unref(content).favoritesTitle)}</h2></div><div class="${ssrRenderClass(unref(styles).productGrid)}"><!--[-->`);
      ssrRenderList(unref(products), (product) => {
        _push(ssrRenderComponent(_component_ProductCard, {
          key: product.id,
          product,
          "cart-disabled": unref(cartDisabled)
        }, null, _parent));
      });
      _push(`<!--]--></div></section><section class="${ssrRenderClass(unref(styles).workshop)}">`);
      if (unref(imageFor)(unref(content).workshopImage)) {
        _push(`<img${ssrRenderAttr("src", ((_m = unref(imageFor)(unref(content).workshopImage)) == null ? void 0 : _m.content) + `?size=${(_n = unref(imageFor)(unref(content).workshopImage)) == null ? void 0 : _n.width}x${(_o = unref(imageFor)(unref(content).workshopImage)) == null ? void 0 : _o.height}`)}${ssrRenderAttr("width", (_p = unref(imageFor)(unref(content).workshopImage)) == null ? void 0 : _p.width)}${ssrRenderAttr("height", (_q = unref(imageFor)(unref(content).workshopImage)) == null ? void 0 : _q.height)} alt="">`);
      } else {
        _push(`<b>\u25A4</b>`);
      }
      _push(`<div><small>${ssrInterpolate(unref(content).workshopEyebrow)}</small><h2>${ssrInterpolate(unref(content).workshopTitle)}</h2><p>${ssrInterpolate(unref(content).workshopText)}</p></div></section></div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}"><span>${ssrInterpolate(unref(content).footerBrand)}<i>\u2022</i></span><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/contact" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              createTextVNode("Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(content).cguContent) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/cgu" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`CGU`);
            } else {
              return [
                createTextVNode("CGU")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(content).cgvContent) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/cgv" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`CGV`);
            } else {
              return [
                createTextVNode("CGV")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></footer></main>`);
    };
  }
});
const hero = "_hero_i0gh9_1";
const style0 = {
  hero
};
const cssModules = {
  "managed": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);

export { index as default };
//# sourceMappingURL=index-DFs7m_Ng.mjs.map
