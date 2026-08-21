import { _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, withAsyncContext, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { g as useFetch, i as defaultSiteContent, h as createError, k as useSeoMeta } from "../server.mjs";
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
  __name: "cgv",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: content } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      { default: () => ({ ...defaultSiteContent }) },
      "$maTlBlBfqJ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    if (!content.value?.cgvContent) {
      throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
    }
    useSeoMeta({
      title: `Conditions Générales de Vente | ${content.value?.seoSiteName || "Angel Dreamer"}`,
      robots: "index, follow"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: unref(content)?.announcement,
        "payment-label": unref(content)?.paymentLabel,
        "logo-text": unref(content)?.logoText
      }, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).legalPage)}">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Retour à l&#39;accueil`);
          } else {
            return [
              createTextVNode("← Retour à l'accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).legalContent)}">${unref(content)?.cgvContent ?? "" ?? ""}</div></div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)} <i>•</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
      if (unref(content)?.cguContent) {
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
      if (unref(content)?.cgvContent) {
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cgv.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=cgv-Bv3YfF7e.js.map
