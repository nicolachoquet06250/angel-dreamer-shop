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
  __name: "inscription",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const error = ref("");
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}"><small>NOUVEAU COMPTE</small><h1>Cr\xE9er un compte</h1><p>Ces informations servent uniquement \xE0 votre compte et au traitement de vos commandes.</p><label>Pr\xE9nom<input${ssrRenderAttr("value", unref(firstName))} type="text" autocomplete="given-name" maxlength="80" required></label><label>Nom<input${ssrRenderAttr("value", unref(lastName))} type="text" autocomplete="family-name" maxlength="80" required></label><label>E-mail<input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required></label><label>Mot de passe<input${ssrRenderAttr("value", unref(password))} type="password" minlength="10" autocomplete="new-password" required><em>10 caract\xE8res minimum</em></label><label>Confirmer le mot de passe<input${ssrRenderAttr("value", unref(confirmPassword))} type="password" minlength="10" autocomplete="new-password" required></label><button type="submit">${ssrInterpolate(unref(loading) ? "Cr\xE9ation\u2026" : "Cr\xE9er mon compte")}</button>`);
      if (unref(error)) {
        _push(`<span>${ssrInterpolate(unref(error))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p>D\xE9j\xE0 inscrit ? `);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/connexion" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Se connecter`);
          } else {
            return [
              createTextVNode("Se connecter")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/inscription.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=inscription-C8zEjAdZ.mjs.map
