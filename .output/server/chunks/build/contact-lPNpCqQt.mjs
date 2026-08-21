import { s as styles, _ as __nuxt_component_0 } from './StoreHeader-BX76lEQZ.mjs';
import { defineComponent, withAsyncContext, ref, mergeProps, unref, isRef, withCtx, createTextVNode, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-DpXmWH_x.mjs';
import { g as useFetch, k as useSeoMeta } from './server.mjs';
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
        Placeholder.configure({ placeholder: props.placeholder || "R\xE9digez votre contenu ici\u2026" })
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
        _push(`<div class="tiptap-toolbar" data-v-6ac9a695><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("bold") })}" title="Gras" data-v-6ac9a695><b data-v-6ac9a695>B</b></button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("italic") })}" title="Italique" data-v-6ac9a695><i data-v-6ac9a695>I</i></button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("underline") })}" title="Soulign\xE9" data-v-6ac9a695><u data-v-6ac9a695>U</u></button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 1 }) })}" title="Titre 1" data-v-6ac9a695>H1</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 2 }) })}" title="Titre 2" data-v-6ac9a695>H2</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 3 }) })}" title="Titre 3" data-v-6ac9a695>H3</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("heading", { level: 4 }) })}" title="Titre 4" data-v-6ac9a695>H4</button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("bulletList") })}" title="Liste \xE0 puces" data-v-6ac9a695>\u2022 \u2014</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("orderedList") })}" title="Liste num\xE9rot\xE9e" data-v-6ac9a695>1.</button><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("blockquote") })}" title="Citation" data-v-6ac9a695>&quot;</button><button type="button" title="S\xE9parateur horizontal" data-v-6ac9a695>\u2014</button><span class="sep" data-v-6ac9a695></span><button type="button" class="${ssrRenderClass({ active: unref(editor2).isActive("link") })}" title="Lien" data-v-6ac9a695>\u{1F517}</button><span class="sep" data-v-6ac9a695></span><button type="button" title="Annuler"${ssrIncludeBooleanAttr(!unref(editor2).can().undo()) ? " disabled" : ""} data-v-6ac9a695>\u21A9</button><button type="button" title="R\xE9tablir"${ssrIncludeBooleanAttr(!unref(editor2).can().redo()) ? " disabled" : ""} data-v-6ac9a695>\u21AA</button></div>`);
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
    var _a, _b, _c, _d, _e, _f;
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
    const firstName = ref(((_b = (_a = session.value) == null ? void 0 : _a.user) == null ? void 0 : _b.firstName) || "");
    const lastName = ref(((_d = (_c = session.value) == null ? void 0 : _c.user) == null ? void 0 : _d.lastName) || "");
    const email = ref(((_f = (_e = session.value) == null ? void 0 : _e.user) == null ? void 0 : _f.email) || "");
    const subject = ref("");
    const message = ref("");
    const code = ref("");
    const error = ref("");
    const loading = ref(false);
    const attachments = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g;
      const _component_StoreHeader = __nuxt_component_0;
      const _component_TiptapEditor = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<main${ssrRenderAttrs(mergeProps({
        class: unref(styles).contactPage
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).contactCard)}"><h1>Contact</h1>`);
      if (unref(step) === "success") {
        _push(`<div class="${ssrRenderClass(unref(styles).successMsg)}">\u2713 Message envoy\xE9 ! Nous vous r\xE9pondrons rapidement. </div>`);
      } else if (unref(step) === "code") {
        _push(`<div class="${ssrRenderClass(unref(styles).codeStep)}"><p>Un code de v\xE9rification a \xE9t\xE9 envoy\xE9 \xE0 <strong>${ssrInterpolate(unref(email))}</strong></p><div><input${ssrRenderAttr("value", unref(code))} class="${ssrRenderClass(unref(styles).codeInput)}" type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code"></div>`);
        if (unref(error)) {
          _push(`<p style="${ssrRenderStyle({ "color": "var(--accent)", "margin-bottom": "12px" })}">${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="${ssrRenderClass(unref(styles).contactBtn)}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Envoi\u2026" : "Valider et envoyer")}</button><br><br><button style="${ssrRenderStyle({ "background": "none", "border": "none", "color": "var(--muted)", "cursor": "pointer", "font-size": "13px" })}">\u2190 Retour </button></div>`);
      } else {
        _push(`<form><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "14px", "margin-bottom": "14px" })}"><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px" })}"> Pr\xE9nom <input${ssrRenderAttr("value", unref(firstName))} type="text" autocomplete="given-name" maxlength="80" required${ssrIncludeBooleanAttr(!!((_a2 = unref(session)) == null ? void 0 : _a2.user)) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px" })}"> Nom <input${ssrRenderAttr("value", unref(lastName))} type="text" autocomplete="family-name" maxlength="80" required${ssrIncludeBooleanAttr(!!((_b2 = unref(session)) == null ? void 0 : _b2.user)) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label></div><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Adresse e-mail <input${ssrRenderAttr("value", unref(email))} type="email" autocomplete="email" required${ssrIncludeBooleanAttr(!!((_c2 = unref(session)) == null ? void 0 : _c2.user)) ? " disabled" : ""} style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Sujet <input${ssrRenderAttr("value", unref(subject))} type="text" maxlength="200" required style="${ssrRenderStyle({ "padding": "12px", "background": "var(--bg)", "color": "var(--text)", "border": "1px solid var(--line)" })}"></label><label style="${ssrRenderStyle({ "display": "grid", "gap": "7px", "font-size": "12px", "margin-bottom": "14px" })}"> Message `);
        _push(ssrRenderComponent(_component_TiptapEditor, {
          modelValue: unref(message),
          "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
          class: _ctx.$style.editor
        }, null, _parent));
        _push(`</label><div style="${ssrRenderStyle({ "margin-bottom": "14px" })}"><label style="${ssrRenderStyle({ "display": "block", "font-size": "12px", "margin-bottom": "6px", "cursor": "pointer" })}"> Pi\xE8ces jointes <input type="file" multiple style="${ssrRenderStyle({ "display": "none" })}" accept="image/*,.pdf,.txt,.doc,.docx"></label><label style="${ssrRenderStyle({ "display": "inline-block", "padding": "8px 14px", "border": "1px solid var(--line)", "font-size": "12px", "cursor": "pointer", "background": "var(--bg)", "color": "var(--text)" })}"> + Ajouter un fichier <input type="file" multiple style="${ssrRenderStyle({ "display": "none" })}" accept="image/*,.pdf,.txt,.doc,.docx"></label>`);
        if (unref(attachments).length) {
          _push(`<div class="${ssrRenderClass(unref(styles).attachmentList)}"><!--[-->`);
          ssrRenderList(unref(attachments), (att) => {
            _push(`<div class="${ssrRenderClass(unref(styles).attachmentItem)}"><span>${ssrInterpolate(att.filename)}</span><span style="${ssrRenderStyle({ "color": "var(--muted)" })}">(${ssrInterpolate(Math.round(att.size / 1024))} Ko)</span><button type="button" aria-label="Supprimer">\xD7</button></div>`);
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
        _push(`<button type="submit" class="${ssrRenderClass(unref(styles).contactBtn)}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Envoi\u2026" : "Envoyer")}</button></form>`);
      }
      _push(`</div><footer class="${ssrRenderClass(unref(styles).footer)}"><div class="${ssrRenderClass(unref(styles).footerMain)}">${ssrInterpolate((_d2 = unref(content)) == null ? void 0 : _d2.footerBrand)} <span><span><span>${ssrInterpolate((_e2 = unref(content)) == null ? void 0 : _e2.footerText)}</span></span><span class="${ssrRenderClass(unref(styles).footerCopyright)}"></span></span></div><nav class="${ssrRenderClass(unref(styles).footerLinks)}">`);
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
      if ((_f2 = unref(content)) == null ? void 0 : _f2.cguContent) {
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
      if ((_g = unref(content)) == null ? void 0 : _g.cgvContent) {
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

export { contact as default };
//# sourceMappingURL=contact-lPNpCqQt.mjs.map
