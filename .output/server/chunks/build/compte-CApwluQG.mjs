import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, withAsyncContext, useCssModule, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { r as renderSeoTemplate } from './seo-template-BqCbrlBi.mjs';
import { g as useFetch, k as useSeoMeta, n as navigateTo } from './server.mjs';
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
  __name: "compte",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b, _c, _d, _e;
    let __temp, __restore;
    const { data: content } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      "$is7RkiG4S7"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const profileStyles = useCssModule("profileStyles");
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$BiN4QttmJm"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    useSeoMeta({
      title: () => {
        var _a2, _b2, _c2, _d2, _e2, _f, _g, _h;
        return renderSeoTemplate((_a2 = content.value) == null ? void 0 : _a2.seoProfileTitle, {
          "Nom du site": (_b2 = content.value) == null ? void 0 : _b2.seoSiteName,
          ["Pr\xE9nom"]: (_d2 = (_c2 = data.value) == null ? void 0 : _c2.user) == null ? void 0 : _d2.firstName,
          "Nom": (_f = (_e2 = data.value) == null ? void 0 : _e2.user) == null ? void 0 : _f.lastName,
          "Email": (_h = (_g = data.value) == null ? void 0 : _g.user) == null ? void 0 : _h.email
        });
      }
    });
    if (!((_a = data.value) == null ? void 0 : _a.user)) [__temp, __restore] = withAsyncContext(() => navigateTo("/connexion?returnTo=/compte")), await __temp, __restore();
    else if (data.value.user.mustChangePassword) [__temp, __restore] = withAsyncContext(() => navigateTo("/changer-mot-de-passe")), await __temp, __restore();
    const firstName = ref(((_c = (_b = data.value) == null ? void 0 : _b.user) == null ? void 0 : _c.firstName) || "");
    const lastName = ref(((_e = (_d = data.value) == null ? void 0 : _d.user) == null ? void 0 : _e.lastName) || "");
    const message = ref("");
    const error2 = ref("");
    const saving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      if ((_a2 = unref(data)) == null ? void 0 : _a2.user) {
        _push(`<div class="${ssrRenderClass(unref(styles).account)}"><small>MON COMPTE</small><h1>Bonjour ${ssrInterpolate(unref(data).user.firstName || "")}</h1><form class="${ssrRenderClass(unref(profileStyles).form)}"><div class="${ssrRenderClass(unref(profileStyles).names)}"><label>Pr\xE9nom<input${ssrRenderAttr("value", unref(firstName))} autocomplete="given-name" maxlength="80" required></label><label>Nom<input${ssrRenderAttr("value", unref(lastName))} autocomplete="family-name" maxlength="80" required></label></div><button type="submit">${ssrInterpolate(unref(saving) ? "Enregistrement\u2026" : "Enregistrer mon profil")}</button>`);
        if (unref(message)) {
          _push(`<p class="${ssrRenderClass(unref(profileStyles).success)}">\u2713 ${ssrInterpolate(unref(message))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(error2)) {
          _push(`<p class="${ssrRenderClass(unref(profileStyles).error)}">${ssrInterpolate(unref(error2))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form><div><span>Adresse e-mail</span><strong>${ssrInterpolate(unref(data).user.email)}</strong></div><div><span>Type de compte</span><strong>${ssrInterpolate(unref(data).user.role === "admin" ? "Administrateur" : unref(data).user.role === "demo" ? "D\xE9monstration (lecture seule)" : "Client")}</strong></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/mot-de-passe-oublie?source=profile",
          class: unref(profileStyles).passwordLink
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Changer mon mot de passe `);
            } else {
              return [
                createTextVNode("Changer mon mot de passe ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (["admin", "demo"].includes(unref(data).user.role)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin",
            class: unref(styles).cta
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ouvrir l\u2019administration `);
              } else {
                return [
                  createTextVNode("Ouvrir l\u2019administration ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<button>Se d\xE9connecter</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});
const form = "_form_11jr0_2";
const names = "_names_11jr0_7";
const success = "_success_11jr0_37";
const error = "_error_11jr0_37";
const passwordLink = "_passwordLink_11jr0_50";
const style0 = {
  form,
  names,
  success,
  error,
  passwordLink
};
const cssModules = {
  "profileStyles": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const compte = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);

export { compte as default };
//# sourceMappingURL=compte-CApwluQG.mjs.map
