import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { f as useRoute } from './server.mjs';
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
  __name: "connexion",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}"><small>ESPACE CLIENT</small><h1>Connexion</h1><p> Connectez-vous pour finaliser vos achats et acc\xE9der \xE0 votre compte. </p><label> E-mail <input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required></label><label> Mot de passe <input${ssrRenderAttr("value", unref(password))} type="password" autocomplete="current-password" required></label><p>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/mot-de-passe-oublie" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Mot de passe oubli\xE9 ?`);
          } else {
            return [
              createTextVNode("Mot de passe oubli\xE9 ?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><button type="submit">${ssrInterpolate(unref(loading) ? "Connexion\u2026" : "Se connecter")}</button>`);
      if (unref(error)) {
        _push(`<span>${ssrInterpolate(unref(error))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p> Pas encore de compte ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/inscription?returnTo=${encodeURIComponent(String(unref(route).query.returnTo || "/compte"))}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cr\xE9er un compte `);
          } else {
            return [
              createTextVNode(" Cr\xE9er un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connexion.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=connexion-DTTM3UOH.mjs.map
