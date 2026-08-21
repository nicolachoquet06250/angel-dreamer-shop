import { u as useShopCart, _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, useCssModule, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { f as useRoute, g as useFetch, i as defaultSiteContent, h as createError, c as useRuntimeConfig, j as useRequestURL, k as useSeoMeta, u as useHead } from "../server.mjs";
import { r as renderSeoTemplate } from "./seo-template-BqCbrlBi.js";
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
const cartIcon = "" + __buildAssetsURL("shopping-cart-white.YPYW-bs1.png");
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
    const cartDisabled = computed(() => auth.value?.user?.role === "demo");
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
    const productImage = computed(() => product.value?.image ? `${origin}${product.value.image.content}?size=1200x630` : void 0);
    const configuredProductImage = computed(() => {
      const image = content.value.seoProductOgImage;
      return image ? `${origin}${image.content}?size=1200x630` : void 0;
    });
    const socialImage = computed(() => content.value.seoProductImageMode === "library" ? configuredProductImage.value || productImage.value : productImage.value);
    const seoValues = computed(() => ({
      "Nom du produit": product.value?.name,
      "Description du produit": product.value?.description,
      "Prix": product.value ? `${(product.value.priceCents / 100).toFixed(2).replace(".", ",")} €` : "",
      ["Catégories"]: product.value?.categories.map((item) => item.label).join(", "),
      "Univers": product.value?.universes.map((item) => item.title).join(", "),
      "Nom du site": content.value.seoSiteName
    }));
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
          _push(`<img${ssrRenderAttr("src", unref(imageFor)(unref(product).image)?.content + `?size=${unref(imageFor)(unref(product).image)?.width}x${unref(imageFor)(unref(product).image)?.height}`)}${ssrRenderAttr("alt", unref(product).name)}${ssrRenderAttr("width", unref(imageFor)(unref(product).image)?.width)}${ssrRenderAttr("height", unref(imageFor)(unref(product).image)?.height)}>`);
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
        _push(`<small>${ssrInterpolate(unref(product).categories.map((item) => item.label).join(" · "))}</small><h1>${ssrInterpolate(unref(product).name)}</h1><div class="${ssrRenderClass(unref(productStyles).priceBlock)}">`);
        if (unref(product).discountedPriceCents != null) {
          _push(`<strong class="${ssrRenderClass(unref(productStyles).discountedPrice)}">${ssrInterpolate((unref(product).discountedPriceCents / 100).toFixed(2).replace(".", ","))} €</strong>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass(unref(product).discountedPriceCents != null ? unref(productStyles).originalPrice : unref(productStyles).regularPrice)}">${ssrInterpolate((unref(product).priceCents / 100).toFixed(2).replace(".", ","))} €</span></div><p>${ssrInterpolate(unref(product).description)}</p><ul><li>Imprimé à la demande en France</li><li>Encres à base d’eau</li><li>Expédition sous 3 à 5 jours ouvrés</li></ul><button class="${ssrRenderClass([unref(styles).cta, unref(productStyles).addToCart])}"${ssrIncludeBooleanAttr(unref(cartDisabled)) ? " disabled" : ""}${ssrRenderAttr("title", unref(cartDisabled) ? "Panier indisponible en mode démonstration" : void 0)}><img${ssrRenderAttr("src", unref(cartIcon))} alt="" aria-hidden="true"><span>${ssrInterpolate(unref(cartDisabled) ? "Panier indisponible en mode démo" : unref(added) ? "Ajouté au panier ✓" : "Ajouter au panier")}</span></button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)}<i>•</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
export {
  _slug_ as default
};
//# sourceMappingURL=_slug_-BOyR0Rhq.js.map
