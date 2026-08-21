import { _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { e as engagementStyles, _ as __nuxt_component_1 } from "./engagement-icons.module-BtNn5Pri.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { _ as __nuxt_component_3 } from "./ProductCard-tdFpQDYF.js";
import { defineComponent, useCssModule, withAsyncContext, computed, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { g as useFetch, i as defaultSiteContent } from "../server.mjs";
import { c as catalog } from "./catalog.module-BY5p-w8A.js";
import { u as useThemedImage } from "./useThemedImage-HZxF4Y-0.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ufo/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/defu/dist/defu.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/hookable/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/unctx/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@nuxt/nitro-server/dist/runtime/h3-compat.mjs";
import "vue-router";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/perfect-debounce/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@unhead/vue/dist/index.mjs";
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
    const cartDisabled = computed(() => auth.value?.user?.role === "demo");
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
        _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(content).heroImage)?.content + `?size=${unref(imageFor)(unref(content).heroImage)?.width}x${unref(imageFor)(unref(content).heroImage)?.height}`)} alt="" fetchpriority="high" loading="eager" decoding="async">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="${ssrRenderClass(unref(styles).values)}"><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value1Image)) {
        _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(content).value1Image)?.content + `?size=${unref(imageFor)(unref(content).value1Image)?.width}x${unref(imageFor)(unref(content).value1Image)?.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(unref(content).value1)}</b></span><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value2Image)) {
        _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(content).value2Image)?.content + `?size=${unref(imageFor)(unref(content).value2Image)?.width}x${unref(imageFor)(unref(content).value2Image)?.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(unref(content).value2)}</b></span><span class="${ssrRenderClass(unref(engagementStyles).publicItem)}">`);
      if (unref(imageFor)(unref(content).value3Image)) {
        _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(content).value3Image)?.content + `?size=${unref(imageFor)(unref(content).value3Image)?.width}x${unref(imageFor)(unref(content).value3Image)?.height}`)} alt="">`);
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
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: item.id,
                to: `/univers/${item.slug || item.id}`,
                class: unref(catalog).universeCard,
                style: unref(imageFor)(item.image) ? { backgroundImage: `linear-gradient(#0002,#0008),url(${unref(imageFor)(item.image)?.content})`, backgroundSize: "cover", backgroundPosition: "center" } : {}
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
                return openBlock(), createBlock(_component_NuxtLink, {
                  key: item.id,
                  to: `/univers/${item.slug || item.id}`,
                  class: unref(catalog).universeCard,
                  style: unref(imageFor)(item.image) ? { backgroundImage: `linear-gradient(#0002,#0008),url(${unref(imageFor)(item.image)?.content})`, backgroundSize: "cover", backgroundPosition: "center" } : {}
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
        _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(content).workshopImage)?.content + `?size=${unref(imageFor)(unref(content).workshopImage)?.width}x${unref(imageFor)(unref(content).workshopImage)?.height}`)}${ssrRenderAttr("width", unref(imageFor)(unref(content).workshopImage)?.width)}${ssrRenderAttr("height", unref(imageFor)(unref(content).workshopImage)?.height)} alt="">`);
      } else {
        _push(`<b>▤</b>`);
      }
      _push(`<div><small>${ssrInterpolate(unref(content).workshopEyebrow)}</small><h2>${ssrInterpolate(unref(content).workshopTitle)}</h2><p>${ssrInterpolate(unref(content).workshopText)}</p></div></section></div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}"><span>${ssrInterpolate(unref(content).footerBrand)}<i>•</i></span><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
export {
  index as default
};
//# sourceMappingURL=index-DFs7m_Ng.js.map
