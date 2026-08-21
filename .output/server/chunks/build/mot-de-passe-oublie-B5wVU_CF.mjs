import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, withAsyncContext, ref, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { f as useRoute, g as useFetch, u as useHead } from './server.mjs';
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
  __name: "mot-de-passe-oublie",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b;
    let __temp, __restore;
    const route = useRoute();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$TC8BHBsOa9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const email = ref(((_b = (_a = auth.value) == null ? void 0 : _a.user) == null ? void 0 : _b.email) || "");
    const token = typeof route.query.token === "string" ? route.query.token : "";
    const userId = Number(route.query.uid);
    const isResetLink = token.length >= 32 && Number.isInteger(userId) && userId > 0;
    const sent = ref(isResetLink), code = ref(""), password = ref(""), confirmation = ref("");
    const loading = ref(false), message = ref(""), error = ref("");
    const isProfile = computed(() => {
      var _a2;
      return Boolean((_a2 = auth.value) == null ? void 0 : _a2.user) && route.query.source === "profile";
    });
    useHead(() => ({
      title: `${isProfile.value ? "Changer mon mot de passe" : "Mot de passe oubli\xE9"} \u2014 Angel Dreamer`,
      meta: [{ name: "robots", content: "noindex, nofollow" }]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}" novalidate><small>S\xC9CURIT\xC9 DU COMPTE</small><h1>${ssrInterpolate(unref(isProfile) ? "Changer mon mot de passe" : "Mot de passe oubli\xE9")}</h1>`);
      if (!unref(sent)) {
        _push(`<p>Nous vous enverrons un code \xE0 six chiffres afin de confirmer votre identit\xE9.</p>`);
      } else if (unref(isResetLink)) {
        _push(`<p>Choisissez imm\xE9diatement votre nouveau mot de passe. Le lien re\xE7u par e-mail confirme votre identit\xE9.</p>`);
      } else {
        _push(`<p>Saisissez le code re\xE7u par e-mail puis choisissez votre nouveau mot de passe.</p>`);
      }
      if (!unref(isResetLink) && !unref(isProfile)) {
        _push(`<label>E-mail<input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required></label>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(sent)) {
        _push(`<!--[-->`);
        if (!unref(isResetLink)) {
          _push(`<label>Code de s\xE9curit\xE9<input${ssrRenderAttr("value", unref(code))} inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required><em>Le code expire apr\xE8s 10 minutes et cinq essais.</em></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label>Nouveau mot de passe<input${ssrRenderAttr("value", unref(password))} type="password" autocomplete="new-password" minlength="12" maxlength="128" required><em>12 caract\xE8res minimum.</em></label><label>Confirmer le mot de passe<input${ssrRenderAttr("value", unref(confirmation))} type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Traitement\u2026" : unref(sent) ? "Changer mon mot de passe" : "Recevoir mon code")}</button>`);
      if (unref(sent) && !unref(isResetLink)) {
        _push(`<button type="button" class="${ssrRenderClass(_ctx.$style.resend)}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}> Renvoyer un code </button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(message)) {
        _push(`<span class="${ssrRenderClass(_ctx.$style.success)}">${ssrInterpolate(unref(message))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(error)) {
        _push(`<span>${ssrInterpolate(unref(error))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: ((_a2 = unref(auth)) == null ? void 0 : _a2.user) ? "/compte" : "/connexion"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a3, _b2;
          if (_push2) {
            _push2(`Retour ${ssrInterpolate(((_a3 = unref(auth)) == null ? void 0 : _a3.user) ? "au profil" : "\xE0 la connexion")}`);
          } else {
            return [
              createTextVNode("Retour " + toDisplayString(((_b2 = unref(auth)) == null ? void 0 : _b2.user) ? "au profil" : "\xE0 la connexion"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></main>`);
    };
  }
});
const resend = "_resend_155us_2";
const success = "_success_155us_9";
const style0 = {
  resend,
  success
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mot-de-passe-oublie.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const motDePasseOublie = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);

export { motDePasseOublie as default };
//# sourceMappingURL=mot-de-passe-oublie-B5wVU_CF.mjs.map
