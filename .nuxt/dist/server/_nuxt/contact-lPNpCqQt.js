import { s as styles, _ as __nuxt_component_0 } from "./StoreHeader-BX76lEQZ.js";
import { defineComponent, watch, mergeProps, unref, useSSRContext, withAsyncContext, ref, isRef, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { g as useFetch, k as useSeoMeta } from "../server.mjs";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TiptapEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: {},
    isDemo: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editor2 = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit,
        Underline,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: props.placeholder || "Rédigez votre contenu ici…" })
      ],
      editable: !props.isDemo,
      onUpdate({ editor: editor22 }) {
        emit("update:modelValue", editor22.getHTML());
      }
    });
    watch(() => props.modelValue, (value) => {
      if (editor2.value && editor2.value.getHTML() !== value) {
        editor2.value.commands.setContent(value, false);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["tiptap-wrapper", { [_ctx.$style.demoMode]: __props.isDemo }]
      }, _attrs))} data-v-6ac9a695>`);
      if (unref(editor2)) {
        _push(`<div class="tiptap-toolbar" data-v-6ac9a695><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("bold") })}" title="Gras" data-v-6ac9a695><b data-v-6ac9a695>B</b></button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("italic") })}" title="Italique" data-v-6ac9a695><i data-v-6ac9a695>I</i></button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("underline") })}" title="Souligné" data-v-6ac9a695><u data-v-6ac9a695>U</u></button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 1 }) })}" title="Titre 1" data-v-6ac9a695>H1</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 2 }) })}" title="Titre 2" data-v-6ac9a695>H2</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 3 }) })}" title="Titre 3" data-v-6ac9a695>H3</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 4 }) })}" title="Titre 4" data-v-6ac9a695>H4</button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("bulletList") })}" title="Liste à puces" data-v-6ac9a695>• —</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("orderedList") })}" title="Liste numérotée" data-v-6ac9a695>1.</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("blockquote") })}" title="Citation" data-v-6ac9a695>&quot;</button><button type="button" title="Séparateur horizontal" data-v-6ac9a695>—</button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("link") })}" title="Lien" data-v-6ac9a695>🔗</button><span class="sep" data-v-6ac9a695></span><button type="button" title="Annuler"${ssrIncludeBooleanAttr(!unref(editor2).can().undo()) ? " disabled" : ""} data-v-6ac9a695>↩</button><button type="button" title="Rétablir"${ssrIncludeBooleanAttr(!unref(editor2).can().redo()) ? " disabled" : ""} data-v-6ac9a695>↪</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(EditorContent), {
        editor: unref(editor2),
        class: "tiptap-content"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const demoMode = "_demoMode_lzvoq_2";
const style1 = {
  demoMode
};
const cssModules$1 = {
  "$style": style1
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TiptapEditor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__cssModules", cssModules$1], ["__scopeId", "data-v-6ac9a695"]]), { __name: "TiptapEditor" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: content } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/content",
      "$2-IY3kkP9B"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: session } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$I0ffQl4eZZ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    useSeoMeta({ title: "Contact | Angel Dreamer" });
    const step = ref("form");
    const firstName = ref(session.value?.user?.firstName || "");
    const lastName = ref(session.value?.user?.lastName || "");
    const email = ref(session.value?.user?.email || "");
    const subject = ref("");
    const message = ref("");
    const code = ref("");
    const error = ref("");
    const loading = ref(false);
    const attachments = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_TiptapEditor = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: unref(styles).contactPage
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).contactCard)}"><h1>Contact</h1>`);
      if (unref(step) === "success") {
        _push(`<div class="${ssrRenderClass(unref(styles).successMsg)}">✓ Message envoyé ! Nous vous répondrons rapidement. </div>`);
      } else if (unref(step) === "code") {
        _push(`<div class="${ssrRenderClass(unref(styles).codeStep)}"><p>Un code de vérification a été envoyé à <strong>${ssrInterpolate(unref(email))}</strong></p><div><input${ssrRenderAttr("value", unref(code))} class="${ssrRenderClass(unref(styles).codeInput)}" type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code"></div>`);
        if (unref(error)) {
          _push(`<p style="${ssrRenderStyle({ "color": "var(--accent)", "margin-bottom": "12px" })}">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="${ssrRenderClass(unref(styles).contactBtn)}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Envoi…" : "Valider et envoyer")}</button><br><br><button style="${ssrRenderStyle({ "background": "none", "border": "none", "color": "var(--muted)", "cursor": "pointer", "font-size": "13px" })}">← Retour </button></div>`);
      } else {
        _push(`<form><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px", "margin-bottom": "14px" })}"><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px" })}"> Prénom <input${ssrRenderAttr("value", unref(firstName))} type="text" autocomplete="given-name" maxlength="80" required${ssrIncludeBooleanAttr(!!unref(session)?.user) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px" })}"> Nom <input${ssrRenderAttr("value", unref(lastName))} type="text" autocomplete="family-name" maxlength="80" required${ssrIncludeBooleanAttr(!!unref(session)?.user) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label></div><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Adresse e-mail <input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required${ssrIncludeBooleanAttr(!!unref(session)?.user) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Sujet <input${ssrRenderAttr("value", unref(subject))} type="text" maxlength="200" required style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Message `);
        _push(ssrRenderComponent(_component_TiptapEditor, {
          modelValue: unref(message),
          "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
          class: _ctx.$style.editor
        }, null, _parent));
        _push(`</label><div style="${ssrRenderStyle({ "margin-bottom": "14px" })}"><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "margin-bottom": "6px", "cursor": "pointer" })}"> Pièces jointes <input type="file" multiple style="${ssrRenderStyle({ "display": "none" })}" accept="image/*,.pdf,.txt,.doc,.docx"></label><label style="${ssrRenderStyle({ "display": "inline-block", "padding": "8px 14px", "border": "1px solid var(--line)", "font-size": "12px", "cursor": "pointer", "background": "var(--bg)", "color": "var(--text)" })}"> + Ajouter un fichier <input type="file" multiple style="${ssrRenderStyle({ "display": "none" })}" accept="image/*,.pdf,.txt,.doc,.docx"></label>`);
        if (unref(attachments).length) {
          _push(`<div class="${ssrRenderClass(unref(styles).attachmentList)}"><!--[-->`);
          ssrRenderList(unref(attachments), (att) => {
            _push(`<div class="${ssrRenderClass(unref(styles).attachmentItem)}"><span>${ssrInterpolate(att.filename)}</span><span style="${ssrRenderStyle({ "color": "var(--muted)" })}">(${ssrInterpolate(Math.round(att.size / 1024))} Ko)</span><button type="button" aria-label="Supprimer">×</button></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(error)) {
          _push(`<p style="${ssrRenderStyle({ "color": "var(--accent)", "margin-bottom": "12px", "font-size": "13px" })}">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="${ssrRenderClass(unref(styles).contactBtn)}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Envoi…" : "Envoyer")}</button></form>`);
      }
      _push(`</div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate(unref(content)?.footerBrand)} <span><span><span>${ssrInterpolate(unref(content)?.footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
      if (unref(content)?.cguContent) {
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
      if (unref(content)?.cgvContent) {
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
const editor = "_editor_1su4e_2";
const style0 = {
  editor
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  contact as default
};
//# sourceMappingURL=contact-lPNpCqQt.js.map
