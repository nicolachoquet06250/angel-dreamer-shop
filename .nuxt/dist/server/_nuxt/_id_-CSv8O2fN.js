import { _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_3 } from "./ProductCard-tdFpQDYF.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, withAsyncContext, computed, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { f as useRoute, g as useFetch, a as useRouter, h as createError, n as navigateTo, i as defaultSiteContent, c as useRuntimeConfig, j as useRequestURL, k as useSeoMeta } from "../server.mjs";
import { c as catalog } from "./catalog.module-BY5p-w8A.js";
import { r as renderSeoTemplate } from "./seo-template-BqCbrlBi.js";
import "./useThemedImage-HZxF4Y-0.js";
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$89mVXKi1W9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cartDisabled = computed(() => auth.value?.user?.role === "demo");
    useRouter();
    const universeKey = String(route.params.id);
    const { data: universes } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/universes",
      { default: () => [] },
      "$fw8dVq7BC3"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const universe = computed(() => universes.value.find((item) => String(item.id) === universeKey || item.slug === universeKey));
    if (!universe.value) throw createError({ statusCode: 404, statusMessage: "Univers introuvable" });
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      { default: () => [] },
      "$TBvpAyxWrT"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const activeCategory = computed(() => String(route.params.category || route.query.categorie || ""));
    const selectedCategory = computed(() => categories.value.find((item) => item.slug === activeCategory.value));
    if (route.query.categorie) [__temp, __restore] = withAsyncContext(() => navigateTo(`/univers/${universe.value.slug || universe.value.id}/${route.query.categorie}`, { replace: true })), await __temp, __restore();
    const { data: products } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      {
        query: computed(() => ({
          universe: universe.value?.id,
          category: activeCategory.value || void 0
        })),
        watch: [activeCategory],
        default: () => []
      },
      "$peabmli2oB"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: storedContent } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      { default: () => ({}) },
      "$xDZSpLTgEa"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const content = computed(() => ({ ...defaultSiteContent, ...storedContent.value }));
    const origin = (useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/$/, "");
    const socialImage = computed(() => universe.value?.image ? `${origin}${universe.value.image.content}?size=1200x630` : content.value.seoOgImage ? `${origin}${content.value.seoOgImage.content}?size=1200x630` : `${origin}/og.png`);
    const seoValues = computed(() => ({
      ["Nom de l’univers"]: universe.value?.title,
      ["Nom de la catégorie"]: selectedCategory.value?.label,
      "Nom du site": content.value.seoSiteName
    }));
    const seoField = (universeField, categoryField) => renderSeoTemplate(String(content.value[activeCategory.value ? categoryField : universeField] || ""), seoValues.value);
    useSeoMeta({
      title: () => seoField("seoUniverseTitle", "seoUniverseCategoryTitle"),
      description: () => seoField("seoUniverseDescription", "seoUniverseCategoryDescription"),
      ogType: "website",
      ogTitle: () => seoField("seoUniverseOgTitle", "seoUniverseCategoryOgTitle"),
      ogDescription: () => seoField("seoUniverseOgDescription", "seoUniverseCategoryOgDescription"),
      ogImage: socialImage,
      twitterTitle: () => seoField("seoUniverseOgTitle", "seoUniverseCategoryOgTitle"),
      twitterDescription: () => seoField("seoUniverseOgDescription", "seoUniverseCategoryOgDescription"),
      twitterImage: socialImage
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_ProductCard = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: unref(content).announcement,
        "logo-text": unref(content).logoText,
        "payment-label": unref(content).paymentLabel
      }, null, _parent));
      _push(`<section class="${ssrRenderClass(unref(catalog).catalogPage)}"><small>${ssrInterpolate(unref(content).universeEyebrow)}</small><h1>${ssrInterpolate(unref(universe)?.title)}</h1><nav class="${ssrRenderClass(unref(catalog).filterNav)}" aria-label="Filtrer les produits"><button class="${ssrRenderClass(!unref(activeCategory) ? unref(catalog).filterActive : "")}">${ssrInterpolate(unref(content).universeAllLabel)}</button><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(`<button class="${ssrRenderClass(unref(activeCategory) === category.slug ? unref(catalog).filterActive : "")}">${ssrInterpolate(category.label)}</button>`);
      });
      _push(`<!--]--></nav><div class="${ssrRenderClass(unref(styles).productGrid)}"><!--[-->`);
      ssrRenderList(unref(products), (product) => {
        _push(ssrRenderComponent(_component_ProductCard, {
          key: product.id,
          product,
          "cart-disabled": unref(cartDisabled)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (!unref(products).length) {
        _push(`<p class="${ssrRenderClass(unref(styles).empty)}">${ssrInterpolate(unref(content).universeEmptyText)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)}<i>•</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/univers/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-CSv8O2fN.js.map
