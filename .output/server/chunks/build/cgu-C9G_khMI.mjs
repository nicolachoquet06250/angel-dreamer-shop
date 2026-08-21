import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, withAsyncContext, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { g as useFetch, i as defaultSiteContent, h as createError, k as useSeoMeta } from './server.mjs';
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
  __name: "cgu",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b;
    let __temp, __restore;
    const { data: content } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      { default: () => ({ ...defaultSiteContent }) },
      "$YwqQwA7GE9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    if (!((_a = content.value) == null ? void 0 : _a.cguContent)) {
      throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
    }
    useSeoMeta({
      title: `Conditions G\xE9n\xE9rales d'Utilisation | ${((_b = content.value) == null ? void 0 : _b.seoSiteName) || "Angel Dreamer"}`,
      robots: "index, follow"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, {
        announcement: (_a2 = unref(content)) == null ? void 0 : _a2.announcement,
        "payment-label": (_b2 = unref(content)) == null ? void 0 : _b2.paymentLabel,
        "logo-text": (_c = unref(content)) == null ? void 0 : _c.logoText
      }, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).legalPage)}">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 Retour \xE0 l&#39;accueil`);
          } else {
            return [
              createTextVNode("\u2190 Retour \xE0 l'accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).legalContent)}">${(_f = (_e = (_d = unref(content)) == null ? void 0 : _d.cguContent) != null ? _e : "") != null ? _f : ""}</div></div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content).footerBrand)}<i>\u2022</i><span><span><span>${ssrInterpolate(unref(content).footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
      if ((_g = unref(content)) == null ? void 0 : _g.cguContent) {
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
      if ((_h = unref(content)) == null ? void 0 : _h.cgvContent) {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cgu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cgu-C9G_khMI.mjs.map
