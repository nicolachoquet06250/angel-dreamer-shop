import { _ as __nuxt_component_0, s as styles } from './StoreHeader-BX76lEQZ.mjs';
import { defineComponent, ref, withAsyncContext, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { g as useFetch, n as navigateTo } from './server.mjs';
import './nuxt-link-DpXmWH_x.mjs';
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
  __name: "changer-mot-de-passe",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const password = ref("");
    const confirmation = ref("");
    const error = ref("");
    const loading = ref(false);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$J2eRLRAqDa"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    if (!((_a = data.value) == null ? void 0 : _a.user)) [__temp, __restore] = withAsyncContext(() => navigateTo("/connexion?returnTo=/changer-mot-de-passe")), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}"><small>S\xC9CURIT\xC9</small><h1>Nouveau mot de passe</h1><p>Pour prot\xE9ger l\u2019administration, vous devez remplacer le mot de passe temporaire avant de continuer.</p><label>Nouveau mot de passe<input${ssrRenderAttr("value", unref(password))} type="password" autocomplete="new-password" minlength="12" required><em>12 caract\xE8res minimum.</em></label><label>Confirmer le mot de passe<input${ssrRenderAttr("value", unref(confirmation))} type="password" autocomplete="new-password" minlength="12" required></label><button type="submit">${ssrInterpolate(unref(loading) ? "Enregistrement\u2026" : "Enregistrer mon mot de passe")}</button>`);
      if (unref(error)) {
        _push(`<span>${ssrInterpolate(unref(error))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/changer-mot-de-passe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=changer-mot-de-passe-DxwDj1E8.mjs.map
