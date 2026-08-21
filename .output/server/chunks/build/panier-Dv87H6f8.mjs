import { u as useShopCart, _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { r as renderSeoTemplate } from './seo-template-BqCbrlBi.mjs';
import { g as useFetch, k as useSeoMeta } from './server.mjs';
import { u as useThemedImage } from './useThemedImage-HZxF4Y-0.mjs';
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
      title: () => {
        var _a, _b;
        return renderSeoTemplate((_a = content.value) == null ? void 0 : _a.seoCartTitle, { "Nom du site": (_b = content.value) == null ? void 0 : _b.seoSiteName });
      }
    });
    const imageFor = useThemedImage();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$Irvnuix9-T"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cartDisabled = computed(() => {
      var _a, _b;
      return ((_b = (_a = auth.value) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "demo";
    });
    const { cart, total } = useShopCart();
    const totalDiscounted = computed(() => cart.value.reduce((s, l) => {
      var _a;
      const price = (_a = l.product.discountedPriceCents) != null ? _a : l.product.priceCents;
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
        _push(`<div class="${ssrRenderClass(unref(styles).empty)}">Le panier est indisponible avec un compte de d\xE9monstration.</div>`);
      } else if (!unref(cart).length) {
        _push(`<div class="${ssrRenderClass(unref(styles).empty)}">Votre panier est vide.</div>`);
      } else {
        _push(`<!--[--><!--[-->`);
        ssrRenderList(unref(cart), (line) => {
          var _a, _b, _c;
          _push(`<div class="${ssrRenderClass(unref(styles).cartLine)}">`);
          if (unref(imageFor)(line.product.image)) {
            _push(`<img${ssrRenderAttr("src", (_a = unref(imageFor)(line.product.image)) == null ? void 0 : _a.content)}${ssrRenderAttr("alt", line.product.name)}${ssrRenderAttr("width", (_b = unref(imageFor)(line.product.image)) == null ? void 0 : _b.width)}${ssrRenderAttr("height", (_c = unref(imageFor)(line.product.image)) == null ? void 0 : _c.height)}>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div><h3>${ssrInterpolate(line.product.name)}</h3><span>Quantit\xE9 : ${ssrInterpolate(line.quantity)}</span></div><div class="${ssrRenderClass(unref(styles).cartLinePrice)}">`);
          if (line.product.discountedPriceCents != null) {
            _push(`<!--[--><strong class="${ssrRenderClass(unref(styles).cartLineDiscounted)}">${ssrInterpolate((line.product.discountedPriceCents * line.quantity / 100).toFixed(2).replace(".", ","))} \u20AC</strong><span class="${ssrRenderClass(unref(styles).cartLineOriginal)}">${ssrInterpolate((line.product.priceCents * line.quantity / 100).toFixed(2).replace(".", ","))} \u20AC</span><!--]-->`);
          } else {
            _push(`<strong>${ssrInterpolate((line.product.priceCents * line.quantity / 100).toFixed(2).replace(".", ","))} \u20AC</strong>`);
          }
          _push(`</div><button>Retirer</button></div>`);
        });
        _push(`<!--]--><div class="${ssrRenderClass(unref(styles).checkout)}"><div class="${ssrRenderClass(unref(styles).promoSection)}"><span class="${ssrRenderClass(unref(styles).promoLabel)}">Code promo</span>`);
        if (!unref(promoCode)) {
          _push(`<!--[--><div class="${ssrRenderClass(unref(styles).promoRow)}"><input id="promo-input"${ssrRenderAttr("value", unref(promoInput))} type="text" placeholder="Entrez votre code"${ssrIncludeBooleanAttr(unref(promoLoading)) ? " disabled" : ""}><button type="button"${ssrIncludeBooleanAttr(unref(promoLoading) || !unref(promoInput).trim()) ? " disabled" : ""}>${ssrInterpolate(unref(promoLoading) ? "\u2026" : "Appliquer")}</button></div>`);
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
          _push(`<div class="${ssrRenderClass(unref(styles).checkoutTotalRow)}"><span>Sous-total</span><span class="${ssrRenderClass(unref(styles).checkoutTotalStrike)}">${ssrInterpolate((unref(total) / 100).toFixed(2).replace(".", ","))} \u20AC</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass(unref(styles).checkoutTotalRow)}"><span>Total</span><strong class="${ssrRenderClass(unref(totalDiscounted) < unref(total) ? unref(styles).checkoutTotalAccent : "")}">${ssrInterpolate((unref(totalDiscounted) / 100).toFixed(2).replace(".", ","))} \u20AC</strong></div><p>Choisissez votre moyen de paiement s\xE9curis\xE9 :</p><button${ssrIncludeBooleanAttr(!!unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) === "stripe" ? "Redirection\u2026" : "Payer par carte avec Stripe")}</button><button class="${ssrRenderClass(unref(styles).paypal)}"${ssrIncludeBooleanAttr(!!unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) === "paypal" ? "Redirection\u2026" : "Payer avec PayPal")}</button>`);
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

export { _sfc_main as default };
//# sourceMappingURL=panier-Dv87H6f8.mjs.map
