import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_3 } from './ProductCard-tdFpQDYF.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, withAsyncContext, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { f as useRoute, g as useFetch, a as useRouter, h as createError, n as navigateTo, i as defaultSiteContent, c as useRuntimeConfig, j as useRequestURL, k as useSeoMeta } from './server.mjs';
import { c as catalog } from './catalog.module-BY5p-w8A.mjs';
import { r as renderSeoTemplate } from './seo-template-BqCbrlBi.mjs';
import './useThemedImage-HZxF4Y-0.mjs';
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
    const cartDisabled = computed(() => {
      var _a, _b;
      return ((_b = (_a = auth.value) == null ? void 0 : _a.user) == null ? void 0 : _b.role) === "demo";
    });
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
        query: computed(() => {
          var _a;
          return {
            universe: (_a = universe.value) == null ? void 0 : _a.id,
            category: activeCategory.value || void 0
          };
        }),
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
    const socialImage = computed(() => {
      var _a;
      return ((_a = universe.value) == null ? void 0 : _a.image) ? `${origin}${universe.value.image.content}?size=1200x630` : content.value.seoOgImage ? `${origin}${content.value.seoOgImage.content}?size=1200x630` : `${origin}/og.png`;
    });
    const seoValues = computed(() => {
      var _a, _b;
      return {
        ["Nom de l\u2019univers"]: (_a = universe.value) == null ? void 0 : _a.title,
        ["Nom de la cat\xE9gorie"]: (_b = selectedCategory.value) == null ? void 0 : _b.label,
        "Nom du site": content.value.seoSiteName
      };
    });
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
      var _a;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_ProductCard = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: unref(content).announcement,
        "logo-text": unref(content).logoText,
        "payment-label": unref(content).paymentLabel
      }, null, _parent));
      _push(`<section class="${ssrRenderClass(unref(catalog).catalogPage)}"><small>${ssrInterpolate(unref(content).universeEyebrow)}</small><h1>${ssrInterpolate((_a = unref(universe)) == null ? void 0 : _a.title)}</h1><nav class="${ssrRenderClass(unref(catalog).filterNav)}" aria-label="Filtrer les produits"><button class="${ssrRenderClass(!unref(activeCategory) ? unref(catalog).filterActive : "")}">${ssrInterpolate(unref(content).universeAllLabel)}</button><!--[-->`);
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
      _push(`</section><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)}<i>\u2022</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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

export { _sfc_main as default };
//# sourceMappingURL=_id_-CSv8O2fN.mjs.map
