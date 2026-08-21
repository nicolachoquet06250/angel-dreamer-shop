import { _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { defineComponent, ref, withAsyncContext, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { g as useFetch, n as navigateTo } from "../server.mjs";
import "./nuxt-link-DpXmWH_x.js";
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
  __name: "changer-mot-de-passe",
  __ssrInlineRender: true,
  async setup(__props) {
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
    if (!data.value?.user) [__temp, __restore] = withAsyncContext(() => navigateTo("/connexion?returnTo=/changer-mot-de-passe")), await __temp, __restore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}"><small>SÉCURITÉ</small><h1>Nouveau mot de passe</h1><p>Pour protéger l’administration, vous devez remplacer le mot de passe temporaire avant de continuer.</p><label>Nouveau mot de passe<input${ssrRenderAttr("value", unref(password))} type="password" autocomplete="new-password" minlength="12" required><em>12 caractères minimum.</em></label><label>Confirmer le mot de passe<input${ssrRenderAttr("value", unref(confirmation))} type="password" autocomplete="new-password" minlength="12" required></label><button type="submit">${ssrInterpolate(unref(loading) ? "Enregistrement…" : "Enregistrer mon mot de passe")}</button>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=changer-mot-de-passe-DxwDj1E8.js.map
