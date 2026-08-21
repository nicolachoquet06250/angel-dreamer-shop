import { _ as __nuxt_component_0, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, withAsyncContext, ref, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { f as useRoute, g as useFetch, u as useHead } from "../server.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mot-de-passe-oublie",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { data: auth } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$TC8BHBsOa9"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const email = ref(auth.value?.user?.email || "");
    const token = typeof route.query.token === "string" ? route.query.token : "";
    const userId = Number(route.query.uid);
    const isResetLink = token.length >= 32 && Number.isInteger(userId) && userId > 0;
    const sent = ref(isResetLink), code = ref(""), password = ref(""), confirmation = ref("");
    const loading = ref(false), message = ref(""), error = ref("");
    const isProfile = computed(() => Boolean(auth.value?.user) && route.query.source === "profile");
    useHead(() => ({
      title: `${isProfile.value ? "Changer mon mot de passe" : "Mot de passe oublié"} — Angel Dreamer`,
      meta: [{ name: "robots", content: "noindex, nofollow" }]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).authPage)}"><form class="${ssrRenderClass(unref(styles).authCard)}" novalidate><small>SÉCURITÉ DU COMPTE</small><h1>${ssrInterpolate(unref(isProfile) ? "Changer mon mot de passe" : "Mot de passe oublié")}</h1>`);
      if (!unref(sent)) {
        _push(`<p>Nous vous enverrons un code à six chiffres afin de confirmer votre identité.</p>`);
      } else if (unref(isResetLink)) {
        _push(`<p>Choisissez immédiatement votre nouveau mot de passe. Le lien reçu par e-mail confirme votre identité.</p>`);
      } else {
        _push(`<p>Saisissez le code reçu par e-mail puis choisissez votre nouveau mot de passe.</p>`);
      }
      if (!unref(isResetLink) && !unref(isProfile)) {
        _push(`<label>E-mail<input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required></label>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(sent)) {
        _push(`<!--[-->`);
        if (!unref(isResetLink)) {
          _push(`<label>Code de sécurité<input${ssrRenderAttr("value", unref(code))} inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required><em>Le code expire après 10 minutes et cinq essais.</em></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label>Nouveau mot de passe<input${ssrRenderAttr("value", unref(password))} type="password" autocomplete="new-password" minlength="12" maxlength="128" required><em>12 caractères minimum.</em></label><label>Confirmer le mot de passe<input${ssrRenderAttr("value", unref(confirmation))} type="password" autocomplete="new-password" minlength="12" maxlength="128" required></label><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Traitement…" : unref(sent) ? "Changer mon mot de passe" : "Recevoir mon code")}</button>`);
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
        to: unref(auth)?.user ? "/compte" : "/connexion"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Retour ${ssrInterpolate(unref(auth)?.user ? "au profil" : "à la connexion")}`);
          } else {
            return [
              createTextVNode("Retour " + toDisplayString(unref(auth)?.user ? "au profil" : "à la connexion"), 1)
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
export {
  motDePasseOublie as default
};
//# sourceMappingURL=mot-de-passe-oublie-B5wVU_CF.js.map
