import { u as useShopCart, _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { r as renderSeoTemplate } from "./seo-template-BqCbrlBi.js";
import { g as useFetch, k as useSeoMeta } from "../server.mjs";
import { u as useThemedImage } from "./useThemedImage-HZxF4Y-0.js";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@nuxt/nitro-server/dist/runtime/h3-compat.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ufo/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/defu/dist/defu.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/hookable/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/unctx/dist/index.mjs";
import "vue-router";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/perfect-debounce/dist/index.mjs";
import "/home/runner/work/angel-dreamer-shop/angel-dreamer-shop/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "panier",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: content } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      "$MYFXZortuf"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => renderSeoTemplate(content.value?.seoCartTitle, { "Nom du site": content.value?.seoSiteName })
    });
    const imageFor = useThemedImage();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$Irvnuix9-T"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cartDisabled = computed(() => auth.value?.user?.role === "demo");
    const { cart, total } = useShopCart();
    const totalDiscounted = computed(() => cart.value.reduce((s, l) => {
      const price = l.product.discountedPriceCents ?? l.product.priceCents;
      return s + price * l.quantity;
    }, 0));
    const loading = ref("");
    const error = ref("");
    const promoCode = ref("");
    const promoInput = ref("");
    const promoError = ref("");
    const promoSuccess = ref("");
    const promoLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).cartPage)}">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`&lt; Continuer mes achats`);
          } else {
            return [
              createTextVNode("< Continuer mes achats")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1>Votre panier</h1>`);
      if (unref(cartDisabled)) {
        _push(`<div class="${ssrRenderClass(unref(styles).empty)}">Le panier est indisponible avec un compte de démonstration.</div>`);
      } else if (!unref(cart).length) {
        _push(`<div class="${ssrRenderClass(unref(styles).empty)}">Votre panier est vide.</div>`);
      } else {
        _push(`<!--[--><!--[-->`);
        ssrRenderList(unref(cart), (line) => {
          _push(`<div class="${ssrRenderClass(unref(styles).cartLine)}">`);
          if (unref(imageFor)(line.product.image)) {
            _push(`<img${ssrRenderAttr("src", unref(imageFor)(line.product.image)?.content)}${ssrRenderAttr("alt", line.product.name)}${ssrRenderAttr("width", unref(imageFor)(line.product.image)?.width)}${ssrRenderAttr("height", unref(imageFor)(line.product.image)?.height)}>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><h3>${ssrInterpolate(line.product.name)}</h3><span>Quantité : ${ssrInterpolate(line.quantity)}</span></div><div class="${ssrRenderClass(unref(styles).cartLinePrice)}">`);
          if (line.product.discountedPriceCents != null) {
            _push(`<!--[--><strong class="${ssrRenderClass(unref(styles).cartLineDiscounted)}">${ssrInterpolate((line.product.discountedPriceCents * line.quantity / 100).toFixed(2).replace(".", ","))} €</strong><span class="${ssrRenderClass(unref(styles).cartLineOriginal)}">${ssrInterpolate((line.product.priceCents * line.quantity / 100).toFixed(2).replace(".", ","))} €</span><!--]-->`);
          } else {
            _push(`<strong>${ssrInterpolate((line.product.priceCents * line.quantity / 100).toFixed(2).replace(".", ","))} €</strong>`);
          }
          _push(`</div><button>Retirer</button></div>`);
        });
        _push(`<!--]--><div class="${ssrRenderClass(unref(styles).checkout)}"><div class="${ssrRenderClass(unref(styles).promoSection)}"><span class="${ssrRenderClass(unref(styles).promoLabel)}">Code promo</span>`);
        if (!unref(promoCode)) {
          _push(`<!--[--><div class="${ssrRenderClass(unref(styles).promoRow)}"><input id="promo-input"${ssrRenderAttr("value", unref(promoInput))} type="text" placeholder="Entrez votre code"${ssrIncludeBooleanAttr(unref(promoLoading)) ? " disabled" : ""}><button type="button"${ssrIncludeBooleanAttr(unref(promoLoading) || !unref(promoInput).trim()) ? " disabled" : ""}>${ssrInterpolate(unref(promoLoading) ? "…" : "Appliquer")}</button></div>`);
          if (unref(promoError)) {
            _push(`<small class="${ssrRenderClass(unref(styles).promoError)}">${ssrInterpolate(unref(promoError))}</small>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<div class="${ssrRenderClass(unref(styles).promoApplied)}"><span>${ssrInterpolate(unref(promoSuccess))}</span><button type="button">Retirer</button></div>`);
        }
        _push(`</div>`);
        if (unref(totalDiscounted) < unref(total)) {
          _push(`<div class="${ssrRenderClass(unref(styles).checkoutTotalRow)}"><span>Sous-total</span><span class="${ssrRenderClass(unref(styles).checkoutTotalStrike)}">${ssrInterpolate((unref(total) / 100).toFixed(2).replace(".", ","))} €</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass(unref(styles).checkoutTotalRow)}"><span>Total</span><strong class="${ssrRenderClass(unref(totalDiscounted) < unref(total) ? unref(styles).checkoutTotalAccent : "")}">${ssrInterpolate((unref(totalDiscounted) / 100).toFixed(2).replace(".", ","))} €</strong></div><p>Choisissez votre moyen de paiement sécurisé :</p><button${ssrIncludeBooleanAttr(!!unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) === "stripe" ? "Redirection…" : "Payer par carte avec Stripe")}</button><button class="${ssrRenderClass(unref(styles).paypal)}"${ssrIncludeBooleanAttr(!!unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) === "paypal" ? "Redirection…" : "Payer avec PayPal")}</button>`);
        if (unref(error)) {
          _push(`<small>${ssrInterpolate(unref(error))}</small>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><!--]-->`);
      }
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panier.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=panier-Dv87H6f8.js.map
