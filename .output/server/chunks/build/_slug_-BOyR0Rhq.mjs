import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { u as useShopCart, _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, useCssModule, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { f as useRoute, g as useFetch, i as defaultSiteContent, h as createError, c as useRuntimeConfig, j as useRequestURL, k as useSeoMeta, u as useHead } from './server.mjs';
import { r as renderSeoTemplate } from './seo-template-BqCbrlBi.mjs';
import { u as useThemedImage } from './useThemedImage-HZxF4Y-0.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const cartIcon = "" + buildAssetsURL("shopping-cart-white.YPYW-bs1.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const productStyles = useCssModule("productStyles");
    const imageFor = useThemedImage();
    const route = useRoute();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$59PGIqq1Jk"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cartDisabled = computed(() => {
      var _a, _b;
      return ((_b = (_a = auth.value) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "demo";
    });
    const { data: product, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/products/${route.params.slug}`,
      "$DMAcAMLQZg"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: stored } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      { default: () => ({}) },
      "$ne2o1UvhkS"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const content = computed(() => ({ ...defaultSiteContent, ...stored.value }));
    if (error.value) throw createError({ statusCode: 404, statusMessage: "Produit introuvable" });
    useShopCart();
    const added = ref(false);
    const origin = (useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/$/, "");
    const productImage = computed(() => {
      var _a;
      return ((_a = product.value) == null ? void 0 : _a.image) ? `${origin}${product.value.image.content}?size=1200x630` : void 0;
    });
    const configuredProductImage = computed(() => {
      const image = content.value.seoProductOgImage;
      return image ? `${origin}${image.content}?size=1200x630` : void 0;
    });
    const socialImage = computed(() => content.value.seoProductImageMode === "library" ? configuredProductImage.value || productImage.value : productImage.value);
    const seoValues = computed(() => {
      var _a, _b, _c, _d;
      return {
        "Nom du produit": (_a = product.value) == null ? void 0 : _a.name,
        "Description du produit": (_b = product.value) == null ? void 0 : _b.description,
        "Prix": product.value ? `${(product.value.priceCents / 100).toFixed(2).replace(".", ",")} \u20AC` : "",
        ["Cat\xE9gories"]: (_c = product.value) == null ? void 0 : _c.categories.map((item) => item.label).join(", "),
        "Univers": (_d = product.value) == null ? void 0 : _d.universes.map((item) => item.title).join(", "),
        "Nom du site": content.value.seoSiteName
      };
    });
    useSeoMeta({
      title: () => renderSeoTemplate(content.value.seoProductTitle, seoValues.value),
      description: () => renderSeoTemplate(content.value.seoProductDescription, seoValues.value),
      ogType: "article",
      ogTitle: () => renderSeoTemplate(content.value.seoProductOgTitle, seoValues.value),
      ogDescription: () => renderSeoTemplate(content.value.seoProductOgDescription, seoValues.value),
      ogImage: socialImage,
      twitterTitle: () => renderSeoTemplate(content.value.seoProductOgTitle, seoValues.value),
      twitterDescription: () => renderSeoTemplate(content.value.seoProductOgDescription, seoValues.value),
      twitterImage: socialImage
    });
    useHead(() => ({
      script: product.value ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.value.name,
          description: product.value.description,
          image: productImage.value,
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: (product.value.priceCents / 100).toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${origin}/produits/${product.value.slug}`
          }
        })
      }] : []
    }));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: unref(productStyles).page
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: unref(content).announcement,
        "payment-label": unref(content).paymentLabel,
        "logo-text": unref(content).logoText
      }, null, _parent));
      if (unref(product)) {
        _push(`<div class="${ssrRenderClass([unref(styles).detail, unref(productStyles).detail])}"><div class="${ssrRenderClass(unref(styles).detailImage)}">`);
        if (unref(imageFor)(unref(product).image)) {
          _push(`<img${ssrRenderAttr("src", ((_a = unref(imageFor)(unref(product).image)) == null ? void 0 : _a.content) + `?size=${(_b = unref(imageFor)(unref(product).image)) == null ? void 0 : _b.width}x${(_c = unref(imageFor)(unref(product).image)) == null ? void 0 : _c.height}`)}${ssrRenderAttr("alt", unref(product).name)}${ssrRenderAttr("width", (_d = unref(imageFor)(unref(product).image)) == null ? void 0 : _d.width)}${ssrRenderAttr("height", (_e = unref(imageFor)(unref(product).image)) == null ? void 0 : _e.height)}>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="${ssrRenderClass(unref(styles).detailCopy)}">`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`&lt; Collection`);
            } else {
              return [
                createTextVNode("< Collection")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<small>${ssrInterpolate(unref(product).categories.map((item) => item.label).join(" \xB7 "))}</small><h1>${ssrInterpolate(unref(product).name)}</h1><div class="${ssrRenderClass(unref(productStyles).priceBlock)}">`);
        if (unref(product).discountedPriceCents != null) {
          _push(`<strong class="${ssrRenderClass(unref(productStyles).discountedPrice)}">${ssrInterpolate((unref(product).discountedPriceCents / 100).toFixed(2).replace(".", ","))} \u20AC</strong>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass(unref(product).discountedPriceCents != null ? unref(productStyles).originalPrice : unref(productStyles).regularPrice)}">${ssrInterpolate((unref(product).priceCents / 100).toFixed(2).replace(".", ","))} \u20AC</span></div><p>${ssrInterpolate(unref(product).description)}</p><ul><li>Imprim\xE9 \xE0 la demande en France</li><li>Encres \xE0 base d\u2019eau</li><li>Exp\xE9dition sous 3 \xE0 5 jours ouvr\xE9s</li></ul><button class="${ssrRenderClass([unref(styles).cta, unref(productStyles).addToCart])}"${ssrIncludeBooleanAttr(unref(cartDisabled)) ? " disabled" : ""}${ssrRenderAttr("title", unref(cartDisabled) ? "Panier indisponible en mode d\xE9monstration" : void 0)}><img${ssrRenderAttr("src", unref(cartIcon))} alt="" aria-hidden="true"><span>${ssrInterpolate(unref(cartDisabled) ? "Panier indisponible en mode d\xE9mo" : unref(added) ? "Ajout\xE9 au panier \u2713" : "Ajouter au panier")}</span></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)}<i>\u2022</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
const page = "_page_1f35q_1";
const detail = "_detail_1f35q_7";
const addToCart = "_addToCart_1f35q_11";
const priceBlock = "_priceBlock_1f35q_23";
const discountedPrice = "_discountedPrice_1f35q_31";
const originalPrice = "_originalPrice_1f35q_37";
const regularPrice = "_regularPrice_1f35q_44";
const style0 = {
  page,
  detail,
  addToCart,
  priceBlock,
  discountedPrice,
  originalPrice,
  regularPrice
};
const cssModules = {
  "productStyles": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/produits/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-BOyR0Rhq.mjs.map
