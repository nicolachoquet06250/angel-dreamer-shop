import { s as styles, _ as __nuxt_component_0 } from "./StoreHeader-BX76lEQZ.js";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { _ as __nuxt_component_1$1, e as engagementStyles } from "./engagement-icons.module-BtNn5Pri.js";
import { defineComponent, mergeProps, withCtx, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext, computed, unref, useCssModule, ref, useId, watch, useModel, mergeModels, isRef, reactive, withAsyncContext, createTextVNode, createVNode, createCommentVNode } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrLooseContain, ssrLooseEqual, ssrGetDirectiveProps } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { u as useThemedImage, r as resolveImageVariant } from "./useThemedImage-HZxF4Y-0.js";
import { c as catalog } from "./catalog.module-BY5p-w8A.js";
import { j as useRequestURL, f as useRoute, a as useRouter, n as navigateTo, g as useFetch, i as defaultSiteContent, u as useHead, _ as __nuxt_component_7 } from "../server.mjs";
import { r as renderSeoTemplate } from "./seo-template-BqCbrlBi.js";
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
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AdminSubTabs",
  __ssrInlineRender: true,
  props: {
    tabs: {},
    active: {},
    label: {},
    idPrefix: {},
    panelPrefix: {}
  },
  emits: ["select"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HorizontalCarousel = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_HorizontalCarousel, mergeProps({
        "track-class": _ctx.$style.subTabs,
        label: __props.label
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.tabs, (tab) => {
              _push2(`<button${ssrRenderAttr("id", `${__props.idPrefix}-${tab.id}`)} type="button" role="tab" data-demo-interactive${ssrRenderAttr("aria-selected", __props.active === tab.id)}${ssrRenderAttr("aria-controls", `${__props.panelPrefix}-${tab.id}`)}${ssrRenderAttr("tabindex", __props.active === tab.id ? 0 : -1)}${_scopeId}>${ssrInterpolate(tab.label)}</button>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.tabs, (tab) => {
                return openBlock(), createBlock("button", {
                  id: `${__props.idPrefix}-${tab.id}`,
                  key: tab.id,
                  type: "button",
                  role: "tab",
                  "data-demo-interactive": "",
                  "aria-selected": __props.active === tab.id,
                  "aria-controls": `${__props.panelPrefix}-${tab.id}`,
                  tabindex: __props.active === tab.id ? 0 : -1,
                  onClick: ($event) => _ctx.$emit("select", tab.id)
                }, toDisplayString(tab.label), 9, ["id", "aria-selected", "aria-controls", "tabindex", "onClick"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const subTabs = "_subTabs_190pr_2";
const style0$9 = {
  subTabs
};
const cssModules$9 = {
  "$style": style0$9
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminSubTabs.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$9, [["__cssModules", cssModules$9]]), { __name: "AdminSubTabs" });
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "FieldValidation",
  __ssrInlineRender: true,
  props: {
    issues: {},
    field: {}
  },
  setup(__props) {
    const props = __props;
    const messages2 = computed(() => (props.issues || []).filter((issue2) => issue2.field === props.field));
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(messages2).length) {
        _push(`<ul${ssrRenderAttrs(mergeProps({
          class: _ctx.$style.messages,
          "aria-live": "polite"
        }, _attrs))}><!--[-->`);
        ssrRenderList(unref(messages2), (message, index) => {
          _push(`<li class="${ssrRenderClass(_ctx.$style[message.level])}"><strong>${ssrInterpolate(message.level === "error" ? "Erreur" : message.level === "warning" ? "Attention" : "Info")}</strong> ${ssrInterpolate(message.message)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const messages = "_messages_dtkbz_2";
const error = "_error_dtkbz_22";
const warning = "_warning_dtkbz_26";
const info = "_info_dtkbz_30";
const style0$8 = {
  messages,
  error,
  warning,
  info
};
const cssModules$8 = {
  "$style": style0$8
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FieldValidation.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$8, [["__cssModules", cssModules$8]]), { __name: "FieldValidation" });
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: { default: "Image" },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const styles2 = useCssModule();
    const props = __props;
    const emit = __emit;
    const imageFor = useThemedImage();
    const error2 = ref("");
    const inputId = useId();
    const open = ref(false);
    const loading = ref(false);
    const library2 = ref([]);
    const previewStyle = computed(() => {
      const image = imageFor(props.modelValue);
      if (!image) return {};
      const scale = Math.max(0.15, Math.min(2, image.width / Math.max(1, image.naturalWidth)));
      return { width: `${110 * scale}px`, height: `${76 * scale}px` };
    });
    watch(() => props.modelValue, (image) => {
      if (!image || image.naturalWidth > 1 || image.naturalHeight > 1) return;
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > 1 || probe.naturalHeight > 1) emit("update:modelValue", {
          ...image,
          width: probe.naturalWidth,
          height: probe.naturalHeight,
          naturalWidth: probe.naturalWidth,
          naturalHeight: probe.naturalHeight
        });
      };
      probe.src = image.content;
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(styles2).field
      }, _attrs))}><span>${ssrInterpolate(__props.label)}</span><div class="${ssrRenderClass(unref(styles2).box)}"><div class="${ssrRenderClass(unref(styles2).previewBox)}">`);
      if (__props.modelValue) {
        _push(`<img${ssrRenderAttr("src", __props.modelValue.content)} style="${ssrRenderStyle(unref(previewStyle))}" alt="Aperçu de l’image">`);
      } else {
        _push(`<div class="${ssrRenderClass(unref(styles2).placeholder)}">Aucune image</div>`);
      }
      _push(`</div><button type="button" data-demo-interactive>${ssrInterpolate(__props.modelValue ? "Changer dans la bibliothèque" : "Choisir dans la bibliothèque")}</button>`);
      if (__props.modelValue) {
        _push(`<button type="button">Retirer</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.modelValue) {
        _push(`<div class="${ssrRenderClass(unref(styles2).dimensions)}"><label>Largeur affichée <span><input${ssrRenderAttr("value", __props.modelValue.width)}${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} type="number" min="1"> px</span></label><b aria-label="Ratio verrouillé">🔒 Ratio ${ssrInterpolate(__props.modelValue.naturalWidth)}:${ssrInterpolate(__props.modelValue.naturalHeight)}</b><label>Hauteur affichée <span><input${ssrRenderAttr("value", __props.modelValue.height)}${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} type="number" min="1"> px</span></label></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<small>Image réutilisable depuis la bibliothèque · dimensions synchronisées avec l’aperçu</small>`);
      if (unref(error2)) {
        _push(`<em>${ssrInterpolate(unref(error2))}</em>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(open)) {
          _push2(`<div class="${ssrRenderClass(unref(styles2).overlay)}"><section class="${ssrRenderClass(unref(styles2).library)}" role="dialog" aria-modal="true"${ssrRenderAttr("aria-label", `Bibliothèque — ${__props.label}`)}><header><div><small>MÉDIATHÈQUE</small><h2>Choisir une image</h2></div><button type="button" aria-label="Fermer">×</button></header><div class="${ssrRenderClass(unref(styles2).grid)}"><label class="${ssrRenderClass(unref(styles2).add)}"${ssrRenderAttr("for", unref(inputId))}><b>+</b><span>Ajouter une image</span><input${ssrRenderAttr("id", unref(inputId))} type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"></label><!--[-->`);
          ssrRenderList(unref(library2), (image) => {
            _push2(`<article class="${ssrRenderClass(__props.modelValue?.id === image.id ? unref(styles2).selected : "")}"><button type="button"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} class="${ssrRenderClass(unref(styles2).pick)}"><span class="${ssrRenderClass(unref(styles2).pair)}"><img${ssrRenderAttr("src", image.content)} alt="Version claire">`);
            if (image.darkVariant) {
              _push2(`<img${ssrRenderAttr("src", image.darkVariant.content)} alt="Version sombre">`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span><span>${ssrInterpolate(image.width)} × ${ssrInterpolate(image.height)} px</span></button><label class="${ssrRenderClass(unref(styles2).darkUpload)}">${ssrInterpolate(image.darkVariant ? "Remplacer la version sombre" : "＋ Ajouter une version sombre")}<input type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"></label><button type="button"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} class="${ssrRenderClass(unref(styles2).deleteImage)}"${ssrRenderAttr("title", image.usageCount ? `Image utilisée ${image.usageCount} fois` : "Supprimer cette image")}${ssrRenderAttr("aria-label", `Supprimer l’image ${image.id}`)}>Supprimer </button></article>`);
          });
          _push2(`<!--]--></div>`);
          if (unref(loading)) {
            _push2(`<p>Chargement…</p>`);
          } else if (unref(library2).length === 0) {
            _push2(`<p>Aucune image enregistrée pour le moment.</p>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(error2)) {
            _push2(`<em>${ssrInterpolate(unref(error2))}</em>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</section></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const field$1 = "_field_rmmx5_2";
const box = "_box_rmmx5_12";
const previewBox = "_previewBox_rmmx5_22";
const placeholder = "_placeholder_rmmx5_36";
const dimensions = "_dimensions_rmmx5_54";
const library = "_library_rmmx5_100";
const overlay$2 = "_overlay_rmmx5_105";
const grid$4 = "_grid_rmmx5_146";
const add$1 = "_add_rmmx5_152";
const selected$2 = "_selected_rmmx5_170";
const pick = "_pick_rmmx5_174";
const pair = "_pair_rmmx5_185";
const darkUpload = "_darkUpload_rmmx5_205";
const deleteImage = "_deleteImage_rmmx5_223";
const style0$7 = {
  field: field$1,
  box,
  previewBox,
  placeholder,
  dimensions,
  library,
  overlay: overlay$2,
  grid: grid$4,
  add: add$1,
  selected: selected$2,
  pick,
  pair,
  darkUpload,
  deleteImage
};
const cssModules$7 = {
  "$style": style0$7
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageUpload.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__cssModules", cssModules$7]]), { __name: "ImageUpload" });
const layout$2 = "_layout_r5fka_1";
const controls$2 = "_controls_r5fka_8";
const fields$1 = "_fields_r5fka_46";
const images = "_images_r5fka_47";
const universeEditor = "_universeEditor_r5fka_58";
const universeToolbar = "_universeToolbar_r5fka_90";
const addUniverse = "_addUniverse_r5fka_103";
const active = "_active_r5fka_120";
const preview$3 = "_preview_r5fka_137";
const previewLabel = "_previewLabel_r5fka_147";
const miniAnnouncement = "_miniAnnouncement_r5fka_155";
const miniHeader$3 = "_miniHeader_r5fka_163";
const miniHero = "_miniHero_r5fka_168";
const miniValues = "_miniValues_r5fka_195";
const miniSectionTitle = "_miniSectionTitle_r5fka_209";
const miniWorkshopCopy = "_miniWorkshopCopy_r5fka_214";
const miniUniverses = "_miniUniverses_r5fka_229";
const miniProducts = "_miniProducts_r5fka_247";
const miniWorkshop = "_miniWorkshop_r5fka_214";
const miniWorkshopIcon = "_miniWorkshopIcon_r5fka_269";
const editor$1 = {
  layout: layout$2,
  controls: controls$2,
  fields: fields$1,
  images,
  universeEditor,
  universeToolbar,
  addUniverse,
  active,
  preview: preview$3,
  previewLabel,
  miniAnnouncement,
  miniHeader: miniHeader$3,
  miniHero,
  miniValues,
  miniSectionTitle,
  miniWorkshopCopy,
  miniUniverses,
  miniProducts,
  miniWorkshop,
  miniWorkshopIcon
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "HomeContentEditor",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    products: {},
    previewDark: { type: Boolean },
    readonly: { type: Boolean, default: false },
    validationIssues: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {},
    "universes": { required: true },
    "universesModifiers": {},
    "categories": { required: true },
    "categoriesModifiers": {},
    "favoriteIds": { required: true },
    "favoriteIdsModifiers": {}
  }),
  emits: ["update:modelValue", "update:universes", "update:categories", "update:favoriteIds"],
  setup(__props) {
    const pickerStyles = useCssModule("pickerStyles");
    const fourCardStyles = useCssModule("fourCardStyles");
    const previewTheme = useCssModule("previewTheme");
    const engagementPreview = useCssModule("engagementPreview");
    const props = __props;
    const model = useModel(__props, "modelValue");
    const universes = useModel(__props, "universes");
    const categories = useModel(__props, "categories");
    const favoriteIds = useModel(__props, "favoriteIds");
    const imageFor = useThemedImage();
    function previewImage(image) {
      return resolveImageVariant(image, props.previewDark);
    }
    const pickerOpen = ref(false);
    const replaceIndex = ref(null);
    const selectedProducts = computed(() => favoriteIds.value.map((id) => props.products.find((product) => product.id === id)).filter((product) => Boolean(product)));
    const topGroups = [{
      title: "Barre et navigation",
      fields: [["announcement", "Annonce"], ["paymentLabel", "Mention de paiement"], ["logoText", "Nom de la marque"]]
    }, {
      title: "Bannière principale",
      fields: [["heroTitle", "Titre principal"], ["heroSubtitle", "Sous-titre"], ["heroCta", "Texte du bouton"]]
    }];
    const universeFields = [["universesEyebrow", "Surtitre"], ["universesTitle", "Titre"]];
    const selectionFields = [["favoritesEyebrow", "Surtitre"], ["favoritesTitle", "Titre"]];
    const workshopFields = [["workshopEyebrow", "Surtitre"], ["workshopTitle", "Titre"], ["workshopText", "Description"]];
    const footerFields = [["footerBrand", "Marque"], ["footerText", "Mention de pied de page"]];
    function imageScale(image) {
      return image ? Math.max(0.1, Math.min(3, image.width / Math.max(1, image.naturalWidth))) : 1;
    }
    function previewPixels(image, base) {
      return Math.round(base * imageScale(image));
    }
    function scaled(image) {
      const selected2 = previewImage(image);
      if (!selected2) return {};
      return {
        backgroundImage: `linear-gradient(#0004,#0009),url(${selected2.content})`,
        backgroundSize: `${imageScale(image) * 100}% auto`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FieldValidation = __nuxt_component_9;
      const _component_ImageUpload = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(editor$1).layout
      }, _attrs))}><div class="${ssrRenderClass(unref(editor$1).controls)}"><!--[-->`);
      ssrRenderList(topGroups, (group, index) => {
        _push(`<!--[--><details${ssrIncludeBooleanAttr(index === 0) ? " open" : ""}><summary>${ssrInterpolate(group.title)}<span>${ssrInterpolate(group.fields?.length)} champs</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><!--[-->`);
        ssrRenderList(group.fields, (field2) => {
          _push(`<label>${ssrInterpolate(field2[1])}`);
          if (field2[0] === "heroTitle" || field2[0] === "heroSubtitle" || field2[0] === "workshopText") {
            _push(`<textarea rows="3" maxlength="500">${ssrInterpolate(model.value[field2[0]])}</textarea>`);
          } else {
            _push(`<input${ssrRenderAttr("value", model.value[field2[0]])} maxlength="500">`);
          }
          _push(ssrRenderComponent(_component_FieldValidation, {
            issues: __props.validationIssues,
            field: field2[0]
          }, null, _parent));
          _push(`</label>`);
        });
        _push(`<!--]--></div>`);
        if (group.title === "Bannière principale") {
          _push(`<div class="${ssrRenderClass(unref(editor$1).images)}">`);
          _push(ssrRenderComponent(_component_ImageUpload, {
            modelValue: model.value.heroImage,
            "onUpdate:modelValue": ($event) => model.value.heroImage = $event,
            label: "Image principale",
            readonly: __props.readonly
          }, null, _parent));
          _push(ssrRenderComponent(_component_FieldValidation, {
            issues: __props.validationIssues,
            field: "heroImage"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</details>`);
        if (index === 0) {
          _push(`<details><summary>Liens de navigation<span>${ssrInterpolate(categories.value.length)} liens</span></summary><div class="${ssrRenderClass(unref(editor$1).universeEditor)}"><!--[-->`);
          ssrRenderList(categories.value, (category, categoryIndex) => {
            _push(`<article><div class="${ssrRenderClass(unref(editor$1).universeToolbar)}"><strong>Lien ${ssrInterpolate(categoryIndex + 1)}</strong><span><button type="button"${ssrIncludeBooleanAttr(categoryIndex === 0) ? " disabled" : ""}>↑</button><button type="button"${ssrIncludeBooleanAttr(categoryIndex === categories.value.length - 1) ? " disabled" : ""}>↓</button><button type="button">Supprimer</button></span></div><label>Label<input${ssrRenderAttr("value", category.label)} maxlength="80" required>`);
            _push(ssrRenderComponent(_component_FieldValidation, {
              issues: __props.validationIssues,
              field: `categories.${categoryIndex}.label`
            }, null, _parent));
            _push(`</label><label>Slug<input${ssrRenderAttr("value", category.slug)} maxlength="80" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required>`);
            _push(ssrRenderComponent(_component_FieldValidation, {
              issues: __props.validationIssues,
              field: `categories.${categoryIndex}.slug`
            }, null, _parent));
            _push(`</label><label class="${ssrRenderClass(unref(editor$1).active)}"><input${ssrIncludeBooleanAttr(Array.isArray(category.active) ? ssrLooseContain(category.active, null) : category.active) ? " checked" : ""} type="checkbox"> Visible dans la navigation</label></article>`);
          });
          _push(`<!--]--><button type="button" class="${ssrRenderClass(unref(editor$1).addUniverse)}">+ Ajouter un lien</button></div></details>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><details><summary>Engagements<span>3 engagements</span></summary><div class="${ssrRenderClass(unref(editor$1).universeEditor)}"><article><label>Premier engagement<input${ssrRenderAttr("value", model.value.value1)} maxlength="500"></label>`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        modelValue: model.value.value1Image,
        "onUpdate:modelValue": ($event) => model.value.value1Image = $event,
        label: "Icône du premier engagement",
        readonly: __props.readonly,
        required: ""
      }, null, _parent));
      _push(`</article><article><label>Deuxième engagement<input${ssrRenderAttr("value", model.value.value2)} maxlength="500"></label>`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        modelValue: model.value.value2Image,
        "onUpdate:modelValue": ($event) => model.value.value2Image = $event,
        label: "Icône du deuxième engagement",
        readonly: __props.readonly,
        required: ""
      }, null, _parent));
      _push(`</article><article><label>Troisième engagement<input${ssrRenderAttr("value", model.value.value3)} maxlength="500"></label>`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        modelValue: model.value.value3Image,
        "onUpdate:modelValue": ($event) => model.value.value3Image = $event,
        label: "Icône du troisième engagement",
        readonly: __props.readonly,
        required: ""
      }, null, _parent));
      _push(`</article></div></details><details><summary>Univers<span>${ssrInterpolate(universes.value?.length)} univers</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><!--[-->`);
      ssrRenderList(universeFields, (field2) => {
        _push(`<label>${ssrInterpolate(field2[1])}<input${ssrRenderAttr("value", model.value[field2[0]])} maxlength="500"></label>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass(unref(editor$1).universeEditor)}"><!--[-->`);
      ssrRenderList(universes.value, (universe, index) => {
        _push(`<article><div class="${ssrRenderClass(unref(editor$1).universeToolbar)}"><strong>Univers ${ssrInterpolate(index + 1)}</strong><span><button type="button"${ssrIncludeBooleanAttr(index === 0) ? " disabled" : ""}>↑</button><button type="button"${ssrIncludeBooleanAttr(index === universes.value?.length - 1) ? " disabled" : ""}>↓</button><button type="button">Supprimer</button></span></div><label>Nom<input${ssrRenderAttr("value", universe.title)} maxlength="100" required>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: `universes.${index}.title`
        }, null, _parent));
        _push(`</label><label>Slug (facultatif)<input${ssrRenderAttr("value", universe.slug)} maxlength="100" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="L’identifiant sera utilisé si vide">`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: `universes.${index}.slug`
        }, null, _parent));
        _push(`</label>`);
        _push(ssrRenderComponent(_component_ImageUpload, {
          modelValue: universe.image,
          "onUpdate:modelValue": ($event) => universe.image = $event,
          label: `Image de ${universe.title}`,
          readonly: __props.readonly,
          required: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: `universes.${index}.image`
        }, null, _parent));
        _push(`<label class="${ssrRenderClass(unref(editor$1).active)}"><input${ssrIncludeBooleanAttr(Array.isArray(universe.active) ? ssrLooseContain(universe.active, null) : universe.active) ? " checked" : ""} type="checkbox"> Visible sur la boutique</label></article>`);
      });
      _push(`<!--]--><button type="button" class="${ssrRenderClass(unref(editor$1).addUniverse)}">+ Ajouter un univers </button></div></details><details><summary>Sélection produits<span>${ssrInterpolate(selectionFields.length)} champs</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><!--[-->`);
      ssrRenderList(selectionFields, (field2) => {
        _push(`<label>${ssrInterpolate(field2[1])}<input${ssrRenderAttr("value", model.value[field2[0]])} maxlength="500"></label>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass(unref(pickerStyles).selection)}"><!--[-->`);
      ssrRenderList(unref(selectedProducts), (product, index) => {
        _push(`<article>`);
        if (unref(imageFor)(product.image)) {
          _push(`<img${ssrRenderAttr("src", unref(imageFor)(product.image)?.content + `?size=${unref(imageFor)(product.image)?.width}x${unref(imageFor)(product.image)?.height}`)}${ssrRenderAttr("alt", product.name)}>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><strong>${ssrInterpolate(product.name)}</strong><small>${ssrInterpolate((product.priceCents / 100).toFixed(2).replace(".", ","))} €</small></div><button type="button" data-demo-interactive>Modifier</button><button type="button">Supprimer</button></article>`);
      });
      _push(`<!--]-->`);
      if (favoriteIds.value.length < 4) {
        _push(`<button type="button" data-demo-interactive class="${ssrRenderClass(unref(pickerStyles).add)}">+ Sélectionner un produit </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p>${ssrInterpolate(favoriteIds.value.length)} produit${ssrInterpolate(favoriteIds.value.length > 1 ? "s" : "")} sur 4 sélectionné${ssrInterpolate(favoriteIds.value.length > 1 ? "s" : "")}</p>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "favoriteIds"
      }, null, _parent));
      _push(`</div></details><details><summary>Atelier<span>${ssrInterpolate(workshopFields.length)} champs</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><!--[-->`);
      ssrRenderList(workshopFields, (field2) => {
        _push(`<label>${ssrInterpolate(field2[1])}`);
        if (field2[0] === "workshopText") {
          _push(`<textarea rows="3" maxlength="500">${ssrInterpolate(model.value[field2[0]])}</textarea>`);
        } else {
          _push(`<input${ssrRenderAttr("value", model.value[field2[0]])} maxlength="500">`);
        }
        _push(`</label>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass(unref(editor$1).images)}">`);
      _push(ssrRenderComponent(_component_ImageUpload, {
        modelValue: model.value.workshopImage,
        "onUpdate:modelValue": ($event) => model.value.workshopImage = $event,
        label: "Image de l’atelier",
        readonly: __props.readonly
      }, null, _parent));
      _push(`</div></details><details><summary>Pied de page<span>${ssrInterpolate(footerFields.length)} champs</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><!--[-->`);
      ssrRenderList(footerFields, (field2) => {
        _push(`<label>${ssrInterpolate(field2[1])}<input${ssrRenderAttr("value", model.value[field2[0]])} maxlength="500"></label>`);
      });
      _push(`<!--]--></div></details></div><aside class="${ssrRenderClass([unref(editor$1).preview, props.previewDark ? unref(previewTheme).dark : unref(previewTheme).light])}"><div class="${ssrRenderClass(unref(editor$1).previewLabel)}">APERÇU EN DIRECT</div><div class="${ssrRenderClass(unref(editor$1).miniAnnouncement)}">${ssrInterpolate(model.value.announcement)}</div><div class="${ssrRenderClass([unref(editor$1).miniHeader, _ctx.$style.miniHeader])}">${ssrInterpolate(model.value.logoText)}<i>.</i></div><div class="${ssrRenderClass([unref(editor$1).miniHero, props.previewDark ? unref(previewTheme).heroDark : unref(previewTheme).heroLight])}" style="${ssrRenderStyle(previewImage(model.value.heroImage) ? { backgroundImage: `linear-gradient(90deg,${props.previewDark ? "#111d,#1114" : "#f5f2ebee,#f5f2eb33"}),url(${previewImage(model.value.heroImage)?.content})`, backgroundSize: `${imageScale(model.value.heroImage) * 100}% auto`, backgroundRepeat: "no-repeat", backgroundPosition: "center" } : {})}"><h2>${ssrInterpolate(model.value.heroTitle)}</h2><p>${ssrInterpolate(model.value.heroSubtitle)}</p><button>${ssrInterpolate(model.value.heroCta)}</button></div><div class="${ssrRenderClass(unref(editor$1).miniValues)}"><span class="${ssrRenderClass([unref(engagementStyles).publicItem, unref(engagementPreview).item])}">`);
      if (previewImage(model.value.value1Image)) {
        _push(`<img${ssrRenderAttr("src", previewImage(model.value.value1Image)?.content + `?size=${previewImage(model.value.value1Image)?.width}x${previewImage(model.value.value1Image)?.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(model.value.value1)}</b></span><span class="${ssrRenderClass([unref(engagementStyles).publicItem, unref(engagementPreview).item])}">`);
      if (previewImage(model.value.value2Image)) {
        _push(`<img${ssrRenderAttr("src", previewImage(model.value.value2Image)?.content + `?size=${previewImage(model.value.value2Image)?.width}x${previewImage(model.value.value2Image)?.height}`)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(model.value.value2)}</b></span><span class="${ssrRenderClass([unref(engagementStyles).publicItem, unref(engagementPreview).item])}">`);
      if (previewImage(model.value.value3Image)) {
        _push(`<img${ssrRenderAttr("src", previewImage(model.value.value3Image)?.content)} alt="">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<b>${ssrInterpolate(model.value.value3)}</b></span></div><div class="${ssrRenderClass(unref(editor$1).miniSectionTitle)}"><small>${ssrInterpolate(model.value.universesEyebrow)}</small><h3>${ssrInterpolate(model.value.universesTitle)}</h3></div><div class="${ssrRenderClass(unref(editor$1).miniUniverses)}"><!--[-->`);
      ssrRenderList(universes.value.filter((item2) => item2.active), (universe) => {
        _push(`<div style="${ssrRenderStyle(scaled(universe.image))}">${ssrInterpolate(universe.title)}</div>`);
      });
      _push(`<!--]--></div><div class="${ssrRenderClass(unref(editor$1).miniSectionTitle)}"><small>${ssrInterpolate(model.value.favoritesEyebrow)}</small><h3>${ssrInterpolate(model.value.favoritesTitle)}</h3></div><div class="${ssrRenderClass([unref(styles).productGrid, unref(pickerStyles).previewProductGrid, unref(fourCardStyles).grid])}"><!--[-->`);
      ssrRenderList(unref(selectedProducts), (product) => {
        _push(`<article class="${ssrRenderClass(unref(styles).productCard)}"><div class="${ssrRenderClass(unref(styles).productImage)}">`);
        if (previewImage(product.image)) {
          _push(`<img${ssrRenderAttr("src", previewImage(product.image)?.content + `?size=${previewImage(product.image)?.width}x${previewImage(product.image)?.height}`)}${ssrRenderAttr("alt", product.name)}>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="${ssrRenderClass(unref(styles).productInfo)}"><div><small>${ssrInterpolate(product.categories.map((category) => category.label).join(" · "))}</small><h3>${ssrInterpolate(product.name)}</h3><strong>${ssrInterpolate((product.priceCents / 100).toFixed(2).replace(".", ","))} €</strong></div><button type="button" tabindex="-1" aria-hidden="true">+</button></div></article>`);
      });
      _push(`<!--]-->`);
      if (!unref(selectedProducts).length) {
        _push(`<p class="${ssrRenderClass(unref(pickerStyles).previewEmpty)}">Sélectionnez jusqu’à 4 produits favoris</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([unref(editor$1).miniWorkshop, props.previewDark && unref(previewTheme).workshopDark])}" style="${ssrRenderStyle(previewImage(model.value.workshopImage) ? { gridTemplateColumns: `${previewPixels(model.value.workshopImage, 58)}px minmax(0,1fr)` } : {})}">`);
      if (previewImage(model.value.workshopImage)) {
        _push(`<img${ssrRenderAttr("src", previewImage(model.value.workshopImage)?.content + `?size=${previewImage(model.value.workshopImage)?.width}x${previewImage(model.value.workshopImage)?.height}`)} style="${ssrRenderStyle({
          width: `${previewPixels(model.value.workshopImage, 20)}px`,
          height: `${previewPixels(model.value.workshopImage, 20) * (previewImage(model.value.workshopImage)?.naturalHeight || 1) / (previewImage(model.value.workshopImage)?.naturalWidth || 1)}px`,
          maxWidth: "100%",
          maxHeight: "100%"
        })}" alt="">`);
      } else {
        _push(`<span class="${ssrRenderClass(unref(editor$1).miniWorkshopIcon)}" aria-hidden="true">▤</span>`);
      }
      _push(`<div class="${ssrRenderClass(unref(editor$1).miniWorkshopCopy)}"><small>${ssrInterpolate(model.value.workshopEyebrow)}</small><h3>${ssrInterpolate(model.value.workshopTitle)}</h3><p>${ssrInterpolate(model.value.workshopText)}</p></div></div><footer class="${ssrRenderClass(_ctx.$style.footerMain)}"><span>${ssrInterpolate(model.value.footerBrand)}<i>•</i></span><span>${ssrInterpolate(model.value.footerText)}</span></footer></aside>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(pickerOpen)) {
          _push2(`<div class="${ssrRenderClass(unref(pickerStyles).overlay)}"><section class="${ssrRenderClass(unref(pickerStyles).modal)}" role="dialog" aria-modal="true" aria-label="Sélection des produits favoris"><header><div><small>FAVORIS DU MOMENT</small><h2>${ssrInterpolate(unref(replaceIndex) === null ? "Sélectionner les produits" : "Choisir un produit de remplacement")}</h2><p>${ssrInterpolate(unref(replaceIndex) === null ? "Vous pouvez retenir jusqu’à quatre articles." : "Le produit choisi remplacera le favori actuel.")}</p></div><button type="button" aria-label="Fermer">×</button></header><div class="${ssrRenderClass(unref(pickerStyles).grid)}"><!--[-->`);
          ssrRenderList(__props.products, (product) => {
            _push2(`<button type="button" class="${ssrRenderClass(favoriteIds.value.includes(product.id) ? unref(pickerStyles).selected : "")}"${ssrIncludeBooleanAttr(__props.readonly || unref(replaceIndex) !== null && favoriteIds.value.some((id, index) => id === product.id && index !== unref(replaceIndex))) ? " disabled" : ""}>`);
            if (unref(imageFor)(product.image)) {
              _push2(`<img${ssrRenderAttr("src", unref(imageFor)(product.image)?.content + `?size=${unref(imageFor)(product.image)?.width}x${unref(imageFor)(product.image)?.height}`)}${ssrRenderAttr("alt", product.name)}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span><strong>${ssrInterpolate(product.name)}</strong><small>${ssrInterpolate((product.priceCents / 100).toFixed(2).replace(".", ","))} €</small></span><b>${ssrInterpolate(favoriteIds.value.includes(product.id) ? "✓" : "+")}</b></button>`);
          });
          _push2(`<!--]--></div><footer class="${ssrRenderClass(_ctx.$style.footerMain)}"><span>${ssrInterpolate(favoriteIds.value.length)} / 4 sélectionnés</span><button type="button">Terminer</button></footer></section></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const selection = "_selection_1afbs_2";
const add = "_add_1afbs_33";
const overlay$1 = "_overlay_1afbs_57";
const modal$1 = "_modal_1afbs_67";
const grid$3 = "_grid_1afbs_108";
const selected$1 = "_selected_1afbs_158";
const previewProductGrid = "_previewProductGrid_1afbs_184";
const previewEmpty = "_previewEmpty_1afbs_222";
const style0$6 = {
  selection,
  add,
  overlay: overlay$1,
  modal: modal$1,
  grid: grid$3,
  selected: selected$1,
  previewProductGrid,
  previewEmpty
};
const grid$2 = "_grid_1gqeg_2";
const style1 = {
  grid: grid$2
};
const light = "_light_1x1lq_2";
const dark = "_dark_1x1lq_17";
const heroLight = "_heroLight_1x1lq_32";
const heroDark = "_heroDark_1x1lq_37";
const workshopDark = "_workshopDark_1x1lq_42";
const style2 = {
  light,
  dark,
  heroLight,
  heroDark,
  workshopDark
};
const item = "_item_pf918_1";
const style3 = {
  item
};
const footerMain$2 = "_footerMain_dibx6_2";
const miniHeader$2 = "_miniHeader_dibx6_2";
const style4 = {
  footerMain: footerMain$2,
  miniHeader: miniHeader$2
};
const cssModules$6 = {
  "pickerStyles": style0$6,
  "fourCardStyles": style1,
  "previewTheme": style2,
  "engagementPreview": style3,
  "$style": style4
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomeContentEditor.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["__cssModules", cssModules$6]]), { __name: "HomeContentEditor" });
const full = "_full_10tix_1";
const preview$2 = "_preview_10tix_16";
const previewDark = "_previewDark_10tix_27";
const page = "_page_10tix_49";
const empty$1 = "_empty_10tix_74";
const page$1 = {
  full,
  preview: preview$2,
  previewDark,
  page,
  empty: empty$1
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CategoryPageEditor",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    previewDark: { type: Boolean },
    validationIssues: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FieldValidation = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(editor$1).layout
      }, _attrs))}><div class="${ssrRenderClass([unref(editor$1).controls, _ctx.$style.controls])}"><details open style="${ssrRenderStyle({ "cursor": "default" })}"><summary>Contenu générique <span>PAGE CATÉGORIE</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><label class="${ssrRenderClass(unref(page$1).full)}">Titre de la page<input value="Nom de la catégorie (dynamique)" disabled><small>Le titre reprend automatiquement le nom de la catégorie consultée.</small></label><label>Surtitre<input${ssrRenderAttr("value", model.value.categoryEyebrow)}>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "categoryEyebrow"
      }, null, _parent));
      _push(`</label><label class="${ssrRenderClass(unref(page$1).full)}">Texte d’introduction<textarea rows="3">${ssrInterpolate(model.value.categoryDescription)}</textarea>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "categoryDescription"
      }, null, _parent));
      _push(`</label><label class="${ssrRenderClass(unref(page$1).full)}">Message si la catégorie est vide<textarea rows="3">${ssrInterpolate(model.value.categoryEmptyText)}</textarea>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "categoryEmptyText"
      }, null, _parent));
      _push(`</label></div></details></div><aside class="${ssrRenderClass([unref(editor$1).preview, unref(page$1).preview, __props.previewDark && unref(page$1).previewDark])}"><div class="${ssrRenderClass(unref(editor$1).previewLabel)}">APERÇU · PAGE CATÉGORIE VIDE</div><div class="${ssrRenderClass(unref(editor$1).miniAnnouncement)}">${ssrInterpolate(model.value.announcement)}</div><header class="${ssrRenderClass([unref(editor$1).miniHeader, _ctx.$style.miniHeader])}"><span>${ssrInterpolate(model.value.logoText)} <i>•</i></span></header><section class="${ssrRenderClass(unref(page$1).page)}"><small>${ssrInterpolate(model.value.logoText)}<i>•</i></small><h2>Nom de la catégorie</h2><p>${ssrInterpolate(model.value.categoryDescription)}</p><div class="${ssrRenderClass(unref(page$1).empty)}">${ssrInterpolate(model.value.categoryEmptyText)}</div></section><footer class="${ssrRenderClass(_ctx.$style.footerMain)}"><strong>${ssrInterpolate(model.value.footerBrand)}<i>•</i></strong><span>${ssrInterpolate(model.value.footerText)}</span></footer></aside></div>`);
    };
  }
});
const footerMain$1 = "_footerMain_1ohmk_2";
const miniHeader$1 = "_miniHeader_1ohmk_2";
const controls$1 = "_controls_1ohmk_14";
const style0$5 = {
  footerMain: footerMain$1,
  miniHeader: miniHeader$1,
  controls: controls$1
};
const cssModules$5 = {
  "$style": style0$5
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategoryPageEditor.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__cssModules", cssModules$5]]), { __name: "CategoryPageEditor" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "UniversePageEditor",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    previewDark: { type: Boolean },
    categories: {},
    validationIssues: {}
  }, {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FieldValidation = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(editor$1).layout
      }, _attrs))}><div class="${ssrRenderClass([unref(editor$1).controls, _ctx.$style.controls])}"><details open style="${ssrRenderStyle({ "cursor": "default" })}"><summary>Contenu générique <span>PAGE UNIVERS</span></summary><div class="${ssrRenderClass(unref(editor$1).fields)}"><label class="${ssrRenderClass(unref(page$1).full)}">Titre de la page<input value="Nom de l’univers (dynamique)" disabled><small>Le titre reprend automatiquement le nom de l’univers consulté.</small></label><label>Surtitre<input${ssrRenderAttr("value", model.value.universeEyebrow)}>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "universeEyebrow"
      }, null, _parent));
      _push(`</label><label>Libellé du filtre global<input${ssrRenderAttr("value", model.value.universeAllLabel)}>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "universeAllLabel"
      }, null, _parent));
      _push(`</label><label class="${ssrRenderClass(unref(page$1).full)}">Message si aucun produit ne correspond<textarea rows="3">${ssrInterpolate(model.value.universeEmptyText)}</textarea>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: __props.validationIssues,
        field: "universeEmptyText"
      }, null, _parent));
      _push(`</label></div></details></div><aside class="${ssrRenderClass([unref(editor$1).preview, unref(page$1).preview, __props.previewDark && unref(page$1).previewDark])}"><div class="${ssrRenderClass(unref(editor$1).previewLabel)}">APERÇU · PAGE UNIVERS VIDE</div><div class="${ssrRenderClass(unref(editor$1).miniAnnouncement)}">${ssrInterpolate(model.value.announcement)}</div><header class="${ssrRenderClass([unref(editor$1).miniHeader, _ctx.$style.miniHeader])}"><span>${ssrInterpolate(model.value.logoText)} <i>•</i></span></header><section class="${ssrRenderClass(unref(page$1).page)}"><small>${ssrInterpolate(model.value.universeEyebrow)}</small><h2>Nom de l’univers</h2><nav class="${ssrRenderClass(unref(catalog).filterNav)}"><button data-demo-interactive class="${ssrRenderClass(unref(catalog).filterActive)}">${ssrInterpolate(model.value.universeAllLabel)}</button><!--[-->`);
      ssrRenderList(__props.categories.slice(0, 3), (item2) => {
        _push(`<button data-demo-interactive>${ssrInterpolate(item2.label)}</button>`);
      });
      _push(`<!--]--></nav><div class="${ssrRenderClass(unref(page$1).empty)}">${ssrInterpolate(model.value.universeEmptyText)}</div></section><footer class="${ssrRenderClass(_ctx.$style.footerMain)}"><strong>${ssrInterpolate(model.value.footerBrand)}<i>•</i></strong><span>${ssrInterpolate(model.value.footerText)}</span></footer></aside></div>`);
    };
  }
});
const footerMain = "_footerMain_1ohmk_2";
const miniHeader = "_miniHeader_1ohmk_2";
const controls = "_controls_1ohmk_14";
const style0$4 = {
  footerMain,
  miniHeader,
  controls
};
const cssModules$4 = {
  "$style": style0$4
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UniversePageEditor.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__cssModules", cssModules$4]]), { __name: "UniversePageEditor" });
const facebookIcon = "" + __buildAssetsURL("facebook.C8eXrwbB.png");
const instagramIcon = "" + __buildAssetsURL("instagram.D-uA-gcM.png");
const whatsappIcon = "" + __buildAssetsURL("whatsapp.COYr-lUP.png");
const xIcon$2 = "" + __buildAssetsURL("x.B2tJsFmU.png");
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SeoPageTemplates",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    page: {},
    readonly: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const content = computed({ get: () => props.modelValue, set: (value2) => emit("update:modelValue", value2) });
    const preview2 = ref("facebook");
    const socialIcons = { facebook: facebookIcon, x: xIcon$2, whatsapp: whatsappIcon, instagram: instagramIcon };
    const definitions = {
      product: {
        label: "Page produit",
        path: "/produits/t-shirt-horizon",
        image: true,
        fields: {
          title: "seoProductTitle",
          description: "seoProductDescription",
          ogTitle: "seoProductOgTitle",
          ogDescription: "seoProductOgDescription"
        },
        variables: {
          "Nom du produit": "T-shirt Horizon",
          "Description du produit": "Un t-shirt en coton doux, imprimé à la demande en France.",
          "Prix": "29,90 €",
          ["Catégories"]: "Vêtements",
          "Univers": "Manga & Japon",
          "Nom du site": "Angel Dreamer"
        }
      },
      universe: {
        label: "Page univers",
        path: "/univers/manga-japon",
        image: true,
        fields: {
          title: "seoUniverseTitle",
          description: "seoUniverseDescription",
          ogTitle: "seoUniverseOgTitle",
          ogDescription: "seoUniverseOgDescription"
        },
        variables: { ["Nom de l’univers"]: "Manga & Japon", "Nom du site": "Angel Dreamer" }
      },
      category: {
        label: "Page catégorie",
        path: "/categories/vetements",
        image: false,
        fields: {
          title: "seoCategoryTitle",
          description: "seoCategoryDescription",
          ogTitle: "seoCategoryOgTitle",
          ogDescription: "seoCategoryOgDescription"
        },
        variables: { ["Nom de la catégorie"]: "Vêtements", "Nom du site": "Angel Dreamer" }
      },
      universeCategory: {
        label: "Catégorie d’univers",
        path: "/univers/manga-japon/vetements",
        image: true,
        fields: {
          title: "seoUniverseCategoryTitle",
          description: "seoUniverseCategoryDescription",
          ogTitle: "seoUniverseCategoryOgTitle",
          ogDescription: "seoUniverseCategoryOgDescription"
        },
        variables: {
          ["Nom de l’univers"]: "Manga & Japon",
          ["Nom de la catégorie"]: "Vêtements",
          "Nom du site": "Angel Dreamer"
        }
      }
    };
    const definition = computed(() => definitions[props.page]);
    const value = (key) => String(content.value[key] ?? "");
    const replace = (template) => Object.entries(definition.value.variables).reduce((text, [label, example]) => text.replaceAll(`[${label}]`, label === "Nom du site" ? content.value.seoSiteName : example), template);
    const renderedTitle = computed(() => replace(value(definition.value.fields.title)));
    const renderedDescription = computed(() => replace(value(definition.value.fields.description)));
    const renderedOgTitle = computed(() => replace(value(definition.value.fields.ogTitle)));
    const renderedOgDescription = computed(() => replace(value(definition.value.fields.ogDescription)));
    const productUsesLibraryImage = computed(() => content.value.seoProductImageMode === "library");
    const socialPreviewImageUrl = computed(() => {
      if (props.page === "product" && productUsesLibraryImage.value) return content.value.seoProductOgImage?.content || "/og.png";
      return content.value.seoOgImage?.content || "/og.png";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageUpload = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.layout
      }, _attrs))}><section class="${ssrRenderClass(_ctx.$style.editor)}"><header><small>MODÈLE DYNAMIQUE</small><h3>${ssrInterpolate(unref(definition).label)}</h3><p>Cliquez sur les informations à insérer. Elles seront remplacées automatiquement pour chaque page.</p></header><!--[-->`);
      ssrRenderList([
        { key: unref(definition).fields.title, label: "Titre SEO", limit: 60, rows: 2 },
        { key: unref(definition).fields.description, label: "Meta description", limit: 160, rows: 4 },
        { key: unref(definition).fields.ogTitle, label: "Titre du partage social", limit: 60, rows: 2 },
        { key: unref(definition).fields.ogDescription, label: "Description du partage social", limit: 160, rows: 4 }
      ], (field2) => {
        _push(`<article class="${ssrRenderClass(_ctx.$style.field)}"><label><strong>${ssrInterpolate(field2.label)}</strong><span class="${ssrRenderClass(replace(value(field2.key)).length > field2.limit ? _ctx.$style.over : "")}">${ssrInterpolate(field2.limit - replace(value(field2.key)).length)} caractères restants dans l’exemple</span></label><textarea${ssrRenderAttr("rows", field2.rows)}>${ssrInterpolate(value(field2.key))}</textarea><div class="${ssrRenderClass(_ctx.$style.variables)}"><small>Insérer :</small><!--[-->`);
        ssrRenderList(unref(definition).variables, (_, label) => {
          _push(`<button type="button">+ ${ssrInterpolate(label)}</button>`);
        });
        _push(`<!--]--></div></article>`);
      });
      _push(`<!--]-->`);
      if (__props.page === "product") {
        _push(`<article class="${ssrRenderClass(_ctx.$style.field)}"><label><strong>Meta image</strong></label><div class="${ssrRenderClass(_ctx.$style.imageChoice)}" role="radiogroup" aria-label="Source de la meta image produit"><label><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(content).seoProductImageMode, "product")) ? " checked" : ""} type="radio" value="product"> Utiliser l’image du produit</label><label><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(content).seoProductImageMode, "library")) ? " checked" : ""} type="radio" value="library"> Choisir une image dans la médiathèque</label></div>`);
        if (unref(productUsesLibraryImage)) {
          _push(ssrRenderComponent(_component_ImageUpload, {
            modelValue: unref(content).seoProductOgImage,
            "onUpdate:modelValue": ($event) => unref(content).seoProductOgImage = $event,
            readonly: __props.readonly,
            label: "Image sociale des pages produit"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><aside class="${ssrRenderClass(_ctx.$style.preview)}"><small>EXEMPLE RÉEL</small><h3>${ssrInterpolate(unref(definition).label)}</h3><section class="${ssrRenderClass(_ctx.$style.google)}"><small>${ssrInterpolate((unref(content).seoCanonicalUrl || "https://votre-boutique.fr") + unref(definition).path)}</small><strong>${ssrInterpolate(unref(renderedTitle))}</strong><p>${ssrInterpolate(unref(renderedDescription))}</p></section><div class="${ssrRenderClass(_ctx.$style.socialPreviewHead)}"><small>APERÇU SOCIAL</small><div class="${ssrRenderClass(_ctx.$style.previewSelector)}"><h3>${ssrInterpolate(unref(preview2) === "x" ? "X (Twitter)" : unref(preview2)[0].toUpperCase() + unref(preview2).slice(1))}</h3><div class="${ssrRenderClass(_ctx.$style.switcher)}"><!--[-->`);
      ssrRenderList(["facebook", "x", "whatsapp", "instagram"], (network) => {
        _push(`<button type="button" data-demo-interactive${ssrRenderAttr("aria-label", `Aperçu ${network}`)}${ssrRenderAttr("title", network)}${ssrRenderAttr("aria-pressed", unref(preview2) === network)}><img${ssrRenderAttr("src", socialIcons[network])} class="${ssrRenderClass(network === "x" && _ctx.$style.xIcon)}" alt="" aria-hidden="true"></button>`);
      });
      _push(`<!--]--></div></div></div><section class="${ssrRenderClass([_ctx.$style.social, _ctx.$style[unref(preview2)]])}"><img${ssrRenderAttr("src", unref(socialPreviewImageUrl))} alt="Aperçu de l’image sociale"><div><small>${ssrInterpolate(unref(content).seoSiteName)}</small><strong>${ssrInterpolate(unref(renderedOgTitle))}</strong><p>${ssrInterpolate(unref(renderedOgDescription))}</p></div></section>`);
      if (unref(preview2) === "instagram") {
        _push(`<p class="${ssrRenderClass(_ctx.$style.platformNote)}">Instagram n’affiche pas de carte dans les légendes ; cet aperçu correspond au partage du lien en message privé.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="${ssrRenderClass(_ctx.$style.note)}">${ssrInterpolate(__props.page === "product" ? unref(productUsesLibraryImage) ? "L’image sélectionnée dans la médiathèque sera utilisée pour tous les produits." : "L’image propre à chaque produit sera utilisée automatiquement." : unref(definition).image ? "L’image propre à l’univers sera utilisée en priorité." : "L’image Open Graph générale sera utilisée pour les catégories.")}</p></aside></div>`);
    };
  }
});
const layout$1 = "_layout_151j6_2";
const editor = "_editor_151j6_8";
const field = "_field_151j6_13";
const preview$1 = "_preview_151j6_13";
const over = "_over_151j6_45";
const variables$1 = "_variables_151j6_59";
const imageChoice = "_imageChoice_151j6_85";
const google = "_google_151j6_108";
const socialPreviewHead = "_socialPreviewHead_151j6_134";
const previewSelector$1 = "_previewSelector_151j6_140";
const switcher$1 = "_switcher_151j6_151";
const xIcon$1 = "_xIcon_151j6_181";
const social = "_social_151j6_134";
const x$1 = "_x_151j6_181";
const whatsapp$1 = "_whatsapp_151j6_226";
const instagram$1 = "_instagram_151j6_231";
const platformNote = "_platformNote_151j6_235";
const note = "_note_151j6_235";
const style0$3 = {
  layout: layout$1,
  editor,
  field,
  preview: preview$1,
  over,
  variables: variables$1,
  imageChoice,
  google,
  socialPreviewHead,
  previewSelector: previewSelector$1,
  switcher: switcher$1,
  xIcon: xIcon$1,
  social,
  x: x$1,
  whatsapp: whatsapp$1,
  instagram: instagram$1,
  platformNote,
  note
};
const cssModules$3 = {
  "$style": style0$3
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeoPageTemplates.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__cssModules", cssModules$3]]), { __name: "SeoPageTemplates" });
const adminPageTabs = [
  { id: "content", label: "Page d’accueil", slug: "accueil" },
  { id: "category", label: "Page catégorie", slug: "categorie" },
  { id: "universe", label: "Page univers", slug: "univers" },
  { id: "cart", label: "Page panier", slug: "panier" },
  { id: "profile", label: "Page profil", slug: "profil" },
  { id: "contact", label: "Page contact", slug: "contact" },
  { id: "cgu", label: "Page CGU", slug: "cgu" },
  { id: "cgv", label: "Page CGV", slug: "cgv" }
];
const adminSeoTabs = [
  { id: "home", label: "Page d’accueil", slug: "accueil" },
  { id: "product", label: "Pages produit", slug: "produits" },
  { id: "universe", label: "Pages univers", slug: "univers" },
  { id: "universeCategory", label: "Page catégories d’univers", slug: "categories-univers" },
  { id: "category", label: "Pages catégorie", slug: "categories" }
];
function adminPagePath(id) {
  const tab = adminPageTabs.find((item2) => item2.id === id);
  return `/admin/pages/${tab.slug}`;
}
function adminSeoPath(id) {
  const tab = adminSeoTabs.find((item2) => item2.id === id);
  return `/admin/seo/${tab.slug}`;
}
function routeSegments(value) {
  if (typeof value === "string" && value) return [value];
  if (Array.isArray(value) && value.every((segment) => typeof segment === "string")) return value;
  return [];
}
function pageState(pageTab) {
  return {
    mainTab: "pages",
    activeTab: pageTab,
    pageTab,
    seoSection: "home",
    canonicalPath: adminPagePath(pageTab)
  };
}
function seoState(seoSection) {
  return {
    mainTab: "seo",
    activeTab: "seo",
    pageTab: "content",
    seoSection,
    canonicalPath: adminSeoPath(seoSection)
  };
}
function mainState(mainTab) {
  return {
    mainTab,
    activeTab: mainTab,
    pageTab: "content",
    seoSection: "home",
    canonicalPath: `/admin/${mainTab}`
  };
}
function resolveAdminRoute(routeParam, queryTab) {
  const path = routeSegments(routeParam);
  const segments = path.length ? path : routeSegments(queryTab);
  if (segments.length === 2 && segments[0] === "pages") {
    const page2 = adminPageTabs.find((item2) => item2.slug === segments[1]);
    if (page2) return pageState(page2.id);
  }
  if (segments.length === 2 && segments[0] === "seo") {
    const section = adminSeoTabs.find((item2) => item2.slug === segments[1]);
    if (section) return seoState(section.id);
  }
  if (segments.length === 1) {
    const legacyPage = adminPageTabs.find((item2) => item2.id === segments[0]);
    if (legacyPage) return pageState(legacyPage.id);
    if (segments[0] === "seo") return seoState("home");
    if (segments[0] === "products" || segments[0] === "promotions" || segments[0] === "users") {
      return mainState(segments[0]);
    }
  }
  return pageState("content");
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SeoEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    section: {},
    readonly: { type: Boolean, default: false },
    validationIssues: {}
  },
  emits: ["update:modelValue", "update:section"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const $requestUrl = useRequestURL();
    const content = computed({ get: () => props.modelValue, set: (value) => emit("update:modelValue", value) });
    const audit2 = ref(null);
    const auditing = ref(false);
    const auditError = ref("");
    const preview2 = ref("facebook");
    const socialIcons = { facebook: facebookIcon, x: xIcon$2, whatsapp: whatsappIcon, instagram: instagramIcon };
    const imageUrl = computed(() => content.value.seoOgImage?.content || "/og.png");
    const displayUrl = computed(() => content.value.seoCanonicalUrl || (() => {
      const href = $requestUrl.href;
      const url = new URL(href);
      return url.protocol + "//" + url.hostname;
    })());
    function selectSeoSection(section) {
      const selected2 = adminSeoTabs.find((item2) => item2.id === section);
      if (selected2) emit("update:section", selected2.id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminSubTabs = __nuxt_component_3;
      const _component_SeoPageTemplates = __nuxt_component_1;
      const _component_FieldValidation = __nuxt_component_9;
      const _component_ImageUpload = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_AdminSubTabs, {
        tabs: unref(adminSeoTabs),
        active: __props.section,
        label: "les sous-onglets de référencement",
        "id-prefix": "seo-tab",
        "panel-prefix": "seo-panel",
        onSelect: selectSeoSection
      }, null, _parent));
      _push(`<div${ssrRenderAttr("id", `seo-panel-${__props.section}`)} role="tabpanel"${ssrRenderAttr("aria-labelledby", `seo-tab-${__props.section}`)}>`);
      if (__props.section !== "home") {
        _push(ssrRenderComponent(_component_SeoPageTemplates, {
          modelValue: unref(content),
          "onUpdate:modelValue": ($event) => isRef(content) ? content.value = $event : null,
          page: __props.section,
          readonly: __props.readonly
        }, null, _parent));
      } else {
        _push(`<div class="${ssrRenderClass(_ctx.$style.layout)}"><div class="${ssrRenderClass(_ctx.$style.fields)}"><details open><summary>Référencement général</summary><div class="${ssrRenderClass(_ctx.$style.grid)}"><label>Nom du site <span>${ssrInterpolate(70 - unref(content).seoSiteName.length)} caractères restants</span><input${ssrRenderAttr("value", unref(content).seoSiteName)} maxlength="70"></label><label>Titre principal <span>${ssrInterpolate(60 - unref(content).seoTitle.length)} caractères restants</span><input${ssrRenderAttr("value", unref(content).seoTitle)} maxlength="60">`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: "seoTitle"
        }, null, _parent));
        _push(`</label><label class="${ssrRenderClass(_ctx.$style.wide)}">Meta description <span>${ssrInterpolate(160 - unref(content).seoDescription.length)} caractères restants</span><textarea maxlength="160" rows="3">${ssrInterpolate(unref(content).seoDescription)}</textarea>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: "seoDescription"
        }, null, _parent));
        _push(`</label><label class="${ssrRenderClass(_ctx.$style.wide)}">Mots-clés<textarea rows="2" placeholder="mot-clé, autre mot-clé">${ssrInterpolate(unref(content).seoKeywords)}</textarea></label><label>URL canonique<input${ssrRenderAttr("value", unref(content).seoCanonicalUrl)} type="url" placeholder="https://example.com">`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: "seoCanonicalUrl"
        }, null, _parent));
        _push(`</label><label>Directives robots<select><option${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoRobots) ? ssrLooseContain(unref(content).seoRobots, null) : ssrLooseEqual(unref(content).seoRobots, null)) ? " selected" : ""}>index, follow, max-image-preview:large</option><option${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoRobots) ? ssrLooseContain(unref(content).seoRobots, null) : ssrLooseEqual(unref(content).seoRobots, null)) ? " selected" : ""}>index, nofollow</option><option${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoRobots) ? ssrLooseContain(unref(content).seoRobots, null) : ssrLooseEqual(unref(content).seoRobots, null)) ? " selected" : ""}>noindex, follow</option><option${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoRobots) ? ssrLooseContain(unref(content).seoRobots, null) : ssrLooseEqual(unref(content).seoRobots, null)) ? " selected" : ""}>noindex, nofollow</option></select></label><label>Auteur<input${ssrRenderAttr("value", unref(content).seoAuthor)}></label><label>Langue<input${ssrRenderAttr("value", unref(content).seoLanguage)} placeholder="fr"></label><label>Couleur du navigateur<input${ssrRenderAttr("value", unref(content).seoThemeColor)} type="color"></label></div></details><details><summary>Open Graph et réseaux sociaux</summary><div class="${ssrRenderClass(_ctx.$style.grid)}"><label>Titre Open Graph <span>${ssrInterpolate(60 - unref(content).seoOgTitle.length)} caractères restants</span><input${ssrRenderAttr("value", unref(content).seoOgTitle)} maxlength="60"></label><label>Type<select><option value="website"${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoOgType) ? ssrLooseContain(unref(content).seoOgType, "website") : ssrLooseEqual(unref(content).seoOgType, "website")) ? " selected" : ""}>Site web</option><option value="product.group"${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoOgType) ? ssrLooseContain(unref(content).seoOgType, "product.group") : ssrLooseEqual(unref(content).seoOgType, "product.group")) ? " selected" : ""}>Catalogue produit</option><option value="business.business"${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoOgType) ? ssrLooseContain(unref(content).seoOgType, "business.business") : ssrLooseEqual(unref(content).seoOgType, "business.business")) ? " selected" : ""}>Entreprise</option></select></label><label class="${ssrRenderClass(_ctx.$style.wide)}">Description Open Graph <span>${ssrInterpolate(160 - unref(content).seoOgDescription.length)} caractères restants</span><textarea maxlength="160" rows="3">${ssrInterpolate(unref(content).seoOgDescription)}</textarea></label><label>Locale<input${ssrRenderAttr("value", unref(content).seoOgLocale)} placeholder="fr_FR"></label>`);
        _push(ssrRenderComponent(_component_ImageUpload, {
          modelValue: unref(content).seoOgImage,
          "onUpdate:modelValue": ($event) => unref(content).seoOgImage = $event,
          class: _ctx.$style.wide,
          readonly: __props.readonly,
          label: "Image sociale (1200 × 630 px recommandé)"
        }, null, _parent));
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: __props.validationIssues,
          field: "seoOgImage"
        }, null, _parent));
        _push(`<label>Format de carte X<select><option value="summary_large_image"${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoTwitterCard) ? ssrLooseContain(unref(content).seoTwitterCard, "summary_large_image") : ssrLooseEqual(unref(content).seoTwitterCard, "summary_large_image")) ? " selected" : ""}>Grande image</option><option value="summary"${ssrIncludeBooleanAttr(Array.isArray(unref(content).seoTwitterCard) ? ssrLooseContain(unref(content).seoTwitterCard, "summary") : ssrLooseEqual(unref(content).seoTwitterCard, "summary")) ? " selected" : ""}>Résumé compact</option></select></label><label>Compte X du site<input${ssrRenderAttr("value", unref(content).seoTwitterSite)} placeholder="@angel_dreamer"></label><label>Créateur X<input${ssrRenderAttr("value", unref(content).seoTwitterCreator)} placeholder="@createur"></label><label>Titre X <span>${ssrInterpolate(70 - unref(content).seoTwitterTitle.length)} caractères restants</span><input${ssrRenderAttr("value", unref(content).seoTwitterTitle)} maxlength="70"></label><label class="${ssrRenderClass(_ctx.$style.wide)}">Description X <span>${ssrInterpolate(200 - unref(content).seoTwitterDescription.length)} caractères restants</span><textarea maxlength="200" rows="2">${ssrInterpolate(unref(content).seoTwitterDescription)}</textarea></label></div></details><details><summary>Organisation et données structurées</summary><div class="${ssrRenderClass(_ctx.$style.grid)}"><label>Nom public<input${ssrRenderAttr("value", unref(content).seoOrganizationName)}></label><label>Raison sociale<input${ssrRenderAttr("value", unref(content).seoOrganizationLegalName)}></label><label>Site officiel<input${ssrRenderAttr("value", unref(content).seoOrganizationUrl)} type="url"></label><label>Email<input${ssrRenderAttr("value", unref(content).seoOrganizationEmail)} type="email"></label><label>Téléphone<input${ssrRenderAttr("value", unref(content).seoOrganizationPhone)} type="tel"></label><label>Pays (ISO)<input${ssrRenderAttr("value", unref(content).seoOrganizationCountry)} maxlength="2"></label></div></details><details><summary>Outils pour webmasters</summary><div class="${ssrRenderClass(_ctx.$style.grid)}"><label>Validation Google Search Console<input${ssrRenderAttr("value", unref(content).seoGoogleVerification)}></label><label>Validation Bing Webmaster Tools<input${ssrRenderAttr("value", unref(content).seoBingVerification)}></label></div></details></div><aside class="${ssrRenderClass(_ctx.$style.preview)}"><div class="${ssrRenderClass(_ctx.$style.googlePreviewHead)}"><small>APERÇU GOOGLE</small><h3>Résultat de recherche</h3></div><article class="${ssrRenderClass(_ctx.$style.googlePreview)}"><small>${ssrInterpolate(unref(displayUrl))}</small><strong>${ssrInterpolate(unref(content).seoTitle)}</strong><p>${ssrInterpolate(unref(content).seoDescription)}</p></article><div class="${ssrRenderClass(_ctx.$style.previewHead)}"><small>APERÇU SOCIAL</small><div class="${ssrRenderClass(_ctx.$style.previewSelector)}"><h3>${ssrInterpolate(unref(preview2) === "x" ? "X (Twitter)" : unref(preview2)[0].toUpperCase() + unref(preview2).slice(1))}</h3><div class="${ssrRenderClass(_ctx.$style.switcher)}"><!--[-->`);
        ssrRenderList(["facebook", "x", "whatsapp", "instagram"], (network) => {
          _push(`<button type="button" data-demo-interactive${ssrRenderAttr("aria-label", `Aperçu ${network}`)}${ssrRenderAttr("title", network)}${ssrRenderAttr("aria-pressed", unref(preview2) === network)}><img${ssrRenderAttr("src", socialIcons[network])} class="${ssrRenderClass(network === "x" && _ctx.$style.xIcon)}" alt="" aria-hidden="true"></button>`);
        });
        _push(`<!--]--></div></div></div><article class="${ssrRenderClass([_ctx.$style.card, _ctx.$style[unref(preview2)]])}"><img${ssrRenderAttr("src", unref(imageUrl))} alt="Aperçu Open Graph"><div><small>${ssrInterpolate(unref(displayUrl).replace(/^https?:\/\//, ""))}</small><strong>${ssrInterpolate(unref(preview2) === "x" ? unref(content).seoTwitterTitle || unref(content).seoOgTitle : unref(content).seoOgTitle)}</strong><p>${ssrInterpolate(unref(preview2) === "x" ? unref(content).seoTwitterDescription || unref(content).seoOgDescription : unref(content).seoOgDescription)}</p></div></article><p class="${ssrRenderClass(_ctx.$style.hint)}">Instagram n’affiche pas de carte dans les légendes ; cet aperçu correspond au partage du lien en message privé.</p><section class="${ssrRenderClass(_ctx.$style.audit)}"><header><div><small>AUDIT INTERNE</small><h3>Score SEO</h3></div>`);
        if (unref(audit2)) {
          _push(`<strong class="${ssrRenderClass(unref(audit2).score >= 80 ? _ctx.$style.good : unref(audit2).score >= 50 ? _ctx.$style.medium : _ctx.$style.bad)}">${ssrInterpolate(unref(audit2).score)}/100 · ${ssrInterpolate(unref(audit2).grade)}</strong>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</header><button type="button" data-demo-interactive${ssrIncludeBooleanAttr(unref(auditing)) ? " disabled" : ""}>${ssrInterpolate(unref(auditing) ? "Analyse…" : "Lancer l’audit complet")}</button>`);
        if (unref(auditError)) {
          _push(`<p>${ssrInterpolate(unref(auditError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(audit2)) {
          _push(`<ul><!--[-->`);
          ssrRenderList(unref(audit2).checks, (check) => {
            _push(`<li class="${ssrRenderClass(check.passed ? _ctx.$style.pass : _ctx.$style.fail)}"><b>${ssrInterpolate(check.passed ? "✓" : "!")}</b><span><strong>${ssrInterpolate(check.label)}</strong><small>${ssrInterpolate(check.advice)}</small></span><em>${ssrInterpolate(check.passed ? "+" + check.points : "0")}</em></li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></aside></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const layout = "_layout_wc9s4_2";
const fields = "_fields_wc9s4_8";
const grid$1 = "_grid_wc9s4_33";
const wide = "_wide_wc9s4_63";
const preview = "_preview_wc9s4_67";
const audit = "_audit_wc9s4_75";
const previewSelector = "_previewSelector_wc9s4_75";
const previewHead = "_previewHead_wc9s4_82";
const googlePreviewHead = "_googlePreviewHead_wc9s4_88";
const googlePreview = "_googlePreview_wc9s4_88";
const switcher = "_switcher_wc9s4_124";
const xIcon = "_xIcon_wc9s4_157";
const card = "_card_wc9s4_161";
const x = "_x_wc9s4_157";
const whatsapp = "_whatsapp_wc9s4_211";
const instagram = "_instagram_wc9s4_216";
const hint = "_hint_wc9s4_220";
const pass = "_pass_wc9s4_282";
const fail = "_fail_wc9s4_286";
const good = "_good_wc9s4_290";
const medium = "_medium_wc9s4_294";
const bad = "_bad_wc9s4_298";
const style0$2 = {
  layout,
  fields,
  grid: grid$1,
  wide,
  preview,
  audit,
  previewSelector,
  previewHead,
  googlePreviewHead,
  googlePreview,
  switcher,
  xIcon,
  card,
  x,
  whatsapp,
  instagram,
  hint,
  pass,
  fail,
  good,
  medium,
  bad
};
const cssModules$2 = {
  "$style": style0$2
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeoEditor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__cssModules", cssModules$2]]), { __name: "SeoEditor" });
const issue = (field2, level, message) => ({ field: field2, level, message });
const empty = (value) => !String(value ?? "").trim();
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validateHomeContent(content, categories, universes, favoriteIds) {
  const issues = [];
  for (const key of ["announcement", "logoText", "heroTitle", "heroSubtitle", "heroCta"]) {
    if (empty(content[key])) issues.push(issue(key, "error", "Ce champ est obligatoire."));
  }
  if (!content.heroImage) issues.push(issue("heroImage", "warning", "Une image principale améliore fortement la présentation de la page."));
  if (String(content.heroTitle).trim().length < 20) issues.push(issue("heroTitle", "info", "Un titre plus descriptif aide les visiteurs à comprendre immédiatement l’offre."));
  const categorySlugs = /* @__PURE__ */ new Set();
  categories.forEach((category, index) => {
    if (empty(category.label)) issues.push(issue(`categories.${index}.label`, "error", "Le label est obligatoire."));
    if (!slugPattern.test(category.slug || "")) issues.push(issue(`categories.${index}.slug`, "error", "Utilisez uniquement des minuscules, chiffres et tirets."));
    if (categorySlugs.has(category.slug)) issues.push(issue(`categories.${index}.slug`, "error", "Ce slug est déjà utilisé."));
    categorySlugs.add(category.slug);
  });
  const universeSlugs = /* @__PURE__ */ new Set();
  universes.forEach((universe, index) => {
    if (empty(universe.title)) issues.push(issue(`universes.${index}.title`, "error", "Le nom de l’univers est obligatoire."));
    if (universe.slug && !slugPattern.test(universe.slug)) issues.push(issue(`universes.${index}.slug`, "error", "Utilisez uniquement des minuscules, chiffres et tirets."));
    if (universe.slug && universeSlugs.has(universe.slug)) issues.push(issue(`universes.${index}.slug`, "error", "Ce slug est déjà utilisé."));
    if (universe.slug) universeSlugs.add(universe.slug);
    if (!universe.image) issues.push(issue(`universes.${index}.image`, "warning", "Cet univers sera plus facilement identifiable avec une image."));
  });
  if (!universes.length) issues.push(issue("universes", "warning", "Ajoutez au moins un univers pour structurer le catalogue."));
  if (!categories.length) issues.push(issue("categories", "error", "Ajoutez au moins une catégorie de navigation."));
  if (!favoriteIds.length) issues.push(issue("favoriteIds", "info", "Aucun favori ne sera affiché sur la page d’accueil."));
  if (favoriteIds.length > 4) issues.push(issue("favoriteIds", "error", "La sélection est limitée à quatre produits."));
  return issues;
}
function validateCategoryPage(content) {
  const issues = [];
  if (empty(content.categoryEyebrow)) issues.push(issue("categoryEyebrow", "warning", "Le surtitre permet de contextualiser la page."));
  if (empty(content.categoryDescription)) issues.push(issue("categoryDescription", "error", "Le texte d’introduction est obligatoire."));
  if (String(content.categoryDescription).trim().length < 60) issues.push(issue("categoryDescription", "info", "Une introduction d’au moins 60 caractères est généralement plus utile."));
  if (empty(content.categoryEmptyText)) issues.push(issue("categoryEmptyText", "error", "Précisez le message affiché lorsqu’aucun produit n’est disponible."));
  return issues;
}
function validateUniversePage(content) {
  const issues = [];
  if (empty(content.universeEyebrow)) issues.push(issue("universeEyebrow", "warning", "Le surtitre permet de contextualiser la page."));
  if (empty(content.universeAllLabel)) issues.push(issue("universeAllLabel", "error", "Le libellé du filtre global est obligatoire."));
  if (empty(content.universeEmptyText)) issues.push(issue("universeEmptyText", "error", "Précisez le message affiché lorsqu’aucun produit ne correspond."));
  return issues;
}
function validateSeo(content) {
  const issues = [];
  const title = String(content.seoTitle || "").trim();
  const description = String(content.seoDescription || "").trim();
  if (!title) issues.push(issue("seoTitle", "error", "Le titre SEO est obligatoire."));
  else if (title.length < 30) issues.push(issue("seoTitle", "warning", "Un titre entre 30 et 60 caractères est recommandé."));
  if (title.length > 60) issues.push(issue("seoTitle", "warning", "Le titre risque d’être tronqué au-delà de 60 caractères."));
  if (!description) issues.push(issue("seoDescription", "error", "La meta description est obligatoire."));
  else if (description.length < 120) issues.push(issue("seoDescription", "warning", "Visez 120 à 160 caractères pour une description plus informative."));
  if (description.length > 160) issues.push(issue("seoDescription", "error", "La meta description ne doit pas dépasser 160 caractères."));
  if (content.seoCanonicalUrl) {
    try {
      new URL(content.seoCanonicalUrl);
    } catch {
      issues.push(issue("seoCanonicalUrl", "error", "Saisissez une URL absolue valide."));
    }
  } else issues.push(issue("seoCanonicalUrl", "info", "Sans URL canonique explicite, l’adresse courante sera utilisée."));
  if (!content.seoOgImage) issues.push(issue("seoOgImage", "warning", "Ajoutez une image Open Graph pour les partages sociaux."));
  return issues;
}
function validateCartSeo(content) {
  const issues = [];
  if (empty(content.seoCartTitle)) issues.push(issue("seoCartTitle", "error", "Le titre de la page panier est obligatoire."));
  return issues;
}
function validateProfileSeo(content) {
  const issues = [];
  if (empty(content.seoProfileTitle)) issues.push(issue("seoProfileTitle", "error", "Le titre de la page profil est obligatoire."));
  return issues;
}
function validateProduct(product) {
  const issues = [];
  if (empty(product.name)) issues.push(issue("product.name", "error", "Le nom du produit est obligatoire."));
  if (!slugPattern.test(product.slug || "")) issues.push(issue("product.slug", "error", "Utilisez uniquement des minuscules, chiffres et tirets."));
  if (!Number.isInteger(product.priceCents) || product.priceCents < 1) issues.push(issue("product.priceCents", "error", "Le prix doit être un nombre entier supérieur à zéro."));
  if (!product.categoryIds.length) issues.push(issue("product.categoryIds", "error", "Sélectionnez au moins une catégorie."));
  if (!product.universeIds.length) issues.push(issue("product.universeIds", "error", "Sélectionnez au moins un univers."));
  if (empty(product.description)) issues.push(issue("product.description", "error", "La description est obligatoire."));
  else if (product.description.trim().length < 80) issues.push(issue("product.description", "warning", "Une description plus détaillée rassurera davantage les acheteurs."));
  if (!product.image) issues.push(issue("product.image", "warning", "Le produit sera enregistré sans image."));
  if (!product.active) issues.push(issue("product.active", "info", "Le produit restera masqué dans la boutique."));
  return issues;
}
const mediaIcon = "" + __buildAssetsURL("image.CiSJumt6.png");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MediaLibrary",
  __ssrInlineRender: true,
  props: {
    readonly: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const library2 = ref([]);
    const loading = ref(false);
    const issues = ref([]);
    const lightFile = ref(null);
    const darkFile = ref(null);
    ref();
    ref();
    const dragging2 = reactive({ light: false, dark: false });
    reactive({ light: 0, dark: 0 });
    const lightFileName = computed(() => lightFile.value?.name || "Choisir la version claire");
    const darkFileName = computed(() => darkFile.value?.name || "Choisir une alternative sombre");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FieldValidation = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.overlay
      }, _attrs))}><section class="${ssrRenderClass(_ctx.$style.modal)}" role="dialog" aria-modal="true" aria-labelledby="media-title"><header><div><small>ADMINISTRATION DES IMAGES</small><h2 id="media-title">Médiathèque</h2></div><button type="button" aria-label="Fermer">×</button></header><form class="${ssrRenderClass(_ctx.$style.upload)}" novalidate><h3>Ajouter une image et ses alternatives</h3>`);
      if (props.readonly) {
        _push(`<p class="${ssrRenderClass(_ctx.$style.readOnly)}">Compte de démonstration : médiathèque disponible en consultation uniquement.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass(_ctx.$style.fileField)}"><div class="${ssrRenderClass(_ctx.$style.fileHeading)}"><strong>Version claire</strong><span>Obligatoire</span></div><label class="${ssrRenderClass([_ctx.$style.dropzone, unref(lightFile) && _ctx.$style.selected, unref(dragging2).light && _ctx.$style.dragging])}"><input type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"><img${ssrRenderAttr("src", unref(mediaIcon))} alt=""><b>${ssrInterpolate(unref(dragging2).light ? "Déposez la version claire ici" : unref(lightFileName))}</b><small>${ssrInterpolate(unref(lightFile) ? `${(unref(lightFile).size / 1024).toFixed(0)} Ko` : "Cliquez ou glissez une image · JPG, PNG, WebP ou GIF · 2 Mo maximum")}</small></label>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: unref(issues),
        field: "media.light"
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass(_ctx.$style.fileField)}"><div class="${ssrRenderClass(_ctx.$style.fileHeading)}"><strong>Version sombre</strong><span>Optionnelle</span></div><label class="${ssrRenderClass([_ctx.$style.dropzone, unref(darkFile) && _ctx.$style.selected, unref(dragging2).dark && _ctx.$style.dragging])}"><input type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"><img${ssrRenderAttr("src", unref(mediaIcon))} alt=""><b>${ssrInterpolate(unref(dragging2).dark ? "Déposez l’alternative sombre ici" : unref(darkFileName))}</b><small>${ssrInterpolate(unref(darkFile) ? `${(unref(darkFile).size / 1024).toFixed(0)} Ko` : "Cliquez ou glissez une image · utilisée automatiquement en thème sombre")}</small></label>`);
      _push(ssrRenderComponent(_component_FieldValidation, {
        issues: unref(issues),
        field: "media.dark"
      }, null, _parent));
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(loading) || __props.readonly) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Envoi…" : "Ajouter à la médiathèque")}</button></form><div class="${ssrRenderClass(_ctx.$style.grid)}"><!--[-->`);
      ssrRenderList(unref(library2), (image) => {
        _push(`<article><div class="${ssrRenderClass(_ctx.$style.previews)}"><img${ssrRenderAttr("src", image.content)} alt="Version claire">`);
        if (image.darkVariant) {
          _push(`<img${ssrRenderAttr("src", image.darkVariant.content)} alt="Version sombre">`);
        } else {
          _push(`<span>Pas de version sombre</span>`);
        }
        _push(`</div><small>${ssrInterpolate(image.width)} × ${ssrInterpolate(image.height)} px · ${ssrInterpolate(image.usageCount)} utilisation(s)</small><div class="${ssrRenderClass(_ctx.$style.actions)}"><label>Modifier la version claire<input type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"></label><label>${ssrInterpolate(image.darkVariant ? "Modifier" : "Ajouter")} la version sombre<input type="file"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""} accept="image/jpeg,image/png,image/webp,image/gif"></label></div><button type="button" class="${ssrRenderClass(_ctx.$style.delete)}"${ssrIncludeBooleanAttr(__props.readonly) ? " disabled" : ""}>Supprimer l’image </button>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(issues),
          field: `media.${image.id}.light`
        }, null, _parent));
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(issues),
          field: `media.${image.id}.dark`
        }, null, _parent));
        _push(`</article>`);
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(`<p>Traitement en cours…</p>`);
      } else if (!unref(library2).length) {
        _push(`<p>Aucune image enregistrée.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div>`);
    };
  }
});
const overlay = "_overlay_98lky_2";
const modal = "_modal_98lky_12";
const upload = "_upload_98lky_41";
const readOnly = "_readOnly_98lky_68";
const fileField = "_fileField_98lky_82";
const fileHeading = "_fileHeading_98lky_88";
const dropzone = "_dropzone_98lky_103";
const selected = "_selected_98lky_118";
const dragging = "_dragging_98lky_123";
const grid = "_grid_98lky_170";
const previews = "_previews_98lky_182";
const actions$1 = "_actions_98lky_206";
const style0$1 = {
  overlay,
  modal,
  upload,
  readOnly,
  fileField,
  fileHeading,
  dropzone,
  selected,
  dragging,
  grid,
  previews,
  actions: actions$1,
  "delete": "_delete_98lky_229"
};
const cssModules$1 = {
  "$style": style0$1
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MediaLibrary.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_11 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__cssModules", cssModules$1]]), { __name: "MediaLibrary" });
const trashIcon = "" + __buildAssetsURL("trash.Dou1gWBt.png");
const copyIcon = "" + __buildAssetsURL("copy.CN-86aZa.png");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const actionStyles = useCssModule("actionStyles");
    const previewDark2 = ref(false);
    const categoryPreviewDark = ref(false);
    const universePreviewDark = ref(false);
    const route = useRoute();
    const router = useRouter();
    const adminRoute = computed(() => resolveAdminRoute(route.params.path ?? route.params.tab, route.query.tab));
    const activeTab = computed(() => adminRoute.value.activeTab);
    const activeMainTab = computed(() => adminRoute.value.mainTab);
    const activePageTab = computed(() => adminRoute.value.pageTab);
    const activeSeoSection = computed(() => adminRoute.value.seoSection);
    const showPageThemePreview = computed(() => activePageTab.value === "content" || activePageTab.value === "category" || activePageTab.value === "universe");
    const activePagePreviewDark = computed({
      get() {
        if (activePageTab.value === "category") return categoryPreviewDark.value;
        if (activePageTab.value === "universe") return universePreviewDark.value;
        return previewDark2.value;
      },
      set(value) {
        if (activePageTab.value === "category") categoryPreviewDark.value = value;
        else if (activePageTab.value === "universe") universePreviewDark.value = value;
        else previewDark2.value = value;
      }
    });
    if (route.path !== adminRoute.value.canonicalPath || route.query.tab) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(adminRoute.value.canonicalPath, { replace: true })), await __temp, __restore();
    }
    const { data: me } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/me",
      "$ELCrxteX-a"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const isDemo = computed(() => Boolean(me.value?.readOnly));
    function syncDemoReadOnly(element, active2) {
      element.dataset.demoReadonly = String(active2);
      element.querySelectorAll("input,textarea,select,button").forEach((control) => {
        const allowed = control.tagName === "BUTTON" && control.hasAttribute("data-demo-interactive");
        if (active2 && !allowed) {
          if (!control.disabled) control.dataset.disabledByDemo = "true";
          control.disabled = true;
        } else if (control.dataset.disabledByDemo === "true") {
          control.disabled = false;
          delete control.dataset.disabledByDemo;
        }
      });
    }
    const vDemoReadonly = {
      mounted(element, binding) {
        syncDemoReadOnly(element, binding.value);
        element.demoObserver = new MutationObserver(() => syncDemoReadOnly(element, binding.value));
        element.demoObserver.observe(element, { childList: true, subtree: true });
      },
      updated(element, binding) {
        syncDemoReadOnly(element, binding.value);
      },
      unmounted(element) {
        element.demoObserver?.disconnect();
      }
    };
    const products = ref([]);
    const favoriteIds = ref([]);
    const users = ref([]);
    const universes = ref([]);
    const categories = ref([]);
    const discounts = ref([]);
    const promoCodes = ref([]);
    const tabs = computed(() => [{
      id: "pages",
      label: "Pages"
    }, {
      id: "seo",
      label: "Référencement"
    }, {
      id: "products",
      label: "Produits",
      count: products.value.length
    }, {
      id: "promotions",
      label: "Promotions",
      count: discounts.value.length + promoCodes.value.length
    }, {
      id: "users",
      label: "Utilisateurs",
      count: users.value.length
    }]);
    const content = reactive({ ...defaultSiteContent });
    const saving = ref("");
    const message = ref("");
    const messageIsError = ref(false);
    const validation = reactive({
      content: [],
      category: [],
      universe: [],
      seo: [],
      cart: [],
      profile: [],
      product: []
    });
    const mediaOpen = ref(false);
    const resettingUserId = ref(null);
    const deletingUserId = ref(null);
    const creatingDemo = ref(false);
    const demoCredentials2 = ref(null);
    const copiedDemoField = ref(null);
    const validationAttempted = reactive({
      content: false,
      category: false,
      universe: false,
      seo: false,
      cart: false,
      profile: false,
      product: false
    });
    const adminDocumentTitle = computed(() => {
      const section = mediaOpen.value ? "Médiathèque" : activeMainTab.value === "pages" ? adminPageTabs.find((tab) => tab.id === activePageTab.value)?.label : activeMainTab.value === "seo" ? `${adminSeoTabs.find((tab) => tab.id === activeSeoSection.value)?.label} — Référencement` : tabs.value.find((tab) => tab.id === activeMainTab.value)?.label;
      return `${section} — Administration — Angel Dreamer`;
    });
    useHead(() => ({
      title: adminDocumentTitle.value,
      meta: [{ name: "robots", content: "noindex, nofollow" }]
    }));
    let messageTimer;
    watch(message, (value) => {
      if (messageTimer) clearTimeout(messageTimer);
      if (value) messageTimer = setTimeout(() => {
        message.value = "";
      }, 1e4);
    });
    const draft = ref(null);
    async function selectTab(tab) {
      const destination = tab === "pages" ? adminPagePath(activePageTab.value) : tab === "seo" ? adminSeoPath(activeSeoSection.value) : `/admin/${tab}`;
      await router.replace(destination);
    }
    async function selectPageTab(tab) {
      const selected2 = adminPageTabs.find((item2) => item2.id === tab);
      if (selected2) await router.replace(adminPagePath(selected2.id));
    }
    async function selectSeoSection(section) {
      await router.replace(adminSeoPath(section));
    }
    const activePageSaveLabel = computed(() => {
      if (activePageTab.value === "cgu") return "Enregistrer les CGU";
      if (activePageTab.value === "cgv") return "Enregistrer les CGV";
      if (activePageTab.value === "contact") return "Enregistrer";
      return "Enregistrer la page";
    });
    watch([content, categories, universes, favoriteIds], () => {
      if (validationAttempted.content) validation.content = validateHomeContent(content, categories.value, universes.value, favoriteIds.value);
      if (validationAttempted.category) validation.category = validateCategoryPage(content);
      if (validationAttempted.universe) validation.universe = validateUniversePage(content);
      if (validationAttempted.seo) validation.seo = validateSeo(content);
      if (validationAttempted.cart) validation.cart = validateCartSeo(content);
      if (validationAttempted.profile) validation.profile = validateProfileSeo(content);
    }, { deep: true });
    watch(draft, (value) => {
      if (value && validationAttempted.product) validation.product = validateProduct(value);
    }, { deep: true });
    const discountDraft = ref(null);
    const promoCodeDraft = ref(null);
    const promotionSaving = ref(false);
    const discountValueEuros = computed({
      get: () => discountDraft.value && discountDraft.value.type === "fixed" ? discountDraft.value.value / 100 : discountDraft.value?.value ?? 0,
      set: (v) => {
        if (discountDraft.value) discountDraft.value.value = discountDraft.value.type === "fixed" ? Math.round(v * 100) : v;
      }
    });
    function scopeLabel(scope, targetId) {
      if (scope === "all") return "Tout le catalogue";
      if (scope === "product") {
        const p = products.value.find((item2) => item2.id === targetId);
        return p ? `Produit : ${p.name}` : `Produit #${targetId}`;
      }
      if (scope === "category") {
        const c = categories.value.find((item2) => item2.id === targetId);
        return c ? `Catégorie : ${c.label}` : `Catégorie #${targetId}`;
      }
      if (scope === "universe") {
        const u = universes.value.find((item2) => item2.id === targetId);
        return u ? `Univers : ${u.title}` : `Univers #${targetId}`;
      }
      return scope;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_StoreHeader = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_HorizontalCarousel = __nuxt_component_1$1;
      const _component_AdminSubTabs = __nuxt_component_3;
      const _component_HomeContentEditor = __nuxt_component_4;
      const _component_CategoryPageEditor = __nuxt_component_5;
      const _component_UniversePageEditor = __nuxt_component_6;
      const _component_ClientOnly = __nuxt_component_7;
      const _component_SeoEditor = __nuxt_component_8;
      const _component_FieldValidation = __nuxt_component_9;
      const _component_ImageUpload = __nuxt_component_10;
      const _component_MediaLibrary = __nuxt_component_11;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_StoreHeader, null, null, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).admin)}"><div class="${ssrRenderClass([unref(styles).adminTitle, unref(actionStyles).responsiveTitle])}"><div><small>ESPACE ADMINISTRATEUR</small><h1>Administration</h1></div><div class="${ssrRenderClass(unref(actionStyles).titleActions)}"><button type="button" class="${ssrRenderClass(unref(actionStyles).mediaButton)}" title="Ouvrir la médiathèque" aria-label="Ouvrir la médiathèque"><img${ssrRenderAttr("src", unref(mediaIcon))} alt=""></button>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Voir la boutique &gt;`);
          } else {
            return [
              createTextVNode("Voir la boutique >")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (!unref(me)?.allowed) {
        _push(`<div class="${ssrRenderClass(unref(styles).adminNotice)}"><h2>Accès protégé</h2><p>Connectez-vous avec un compte disposant du rôle administrateur.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/connexion?returnTo=/admin",
          class: unref(styles).cta
        }, {
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
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(isDemo)) {
          _push(`<p class="${ssrRenderClass(unref(actionStyles).demoNotice)}">Mode démonstration — toutes les zones administratives sont accessibles en lecture seule.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_HorizontalCarousel, {
          "track-class": unref(styles).adminTabs,
          label: "les onglets d’administration"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(tabs), (tab) => {
                _push2(`<button${ssrRenderAttr("id", `tab-${tab.id}`)} type="button" role="tab"${ssrRenderAttr("aria-selected", unref(activeMainTab) === tab.id)}${ssrRenderAttr("aria-controls", tab.id === "pages" ? `panel-${unref(activePageTab)}` : `panel-${tab.id}`)} class="${ssrRenderClass(unref(activeMainTab) === tab.id ? unref(styles).adminTabActive : "")}"${_scopeId}><span${_scopeId}>${ssrInterpolate(tab.label)}</span>`);
                if (tab.count !== void 0) {
                  _push2(`<b${_scopeId}>${ssrInterpolate(tab.count)}</b>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</button>`);
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(tabs), (tab) => {
                  return openBlock(), createBlock("button", {
                    id: `tab-${tab.id}`,
                    key: tab.id,
                    type: "button",
                    role: "tab",
                    "aria-selected": unref(activeMainTab) === tab.id,
                    "aria-controls": tab.id === "pages" ? `panel-${unref(activePageTab)}` : `panel-${tab.id}`,
                    class: unref(activeMainTab) === tab.id ? unref(styles).adminTabActive : "",
                    onClick: ($event) => selectTab(tab.id)
                  }, [
                    createVNode("span", null, toDisplayString(tab.label), 1),
                    tab.count !== void 0 ? (openBlock(), createBlock("b", { key: 0 }, toDisplayString(tab.count), 1)) : createCommentVNode("", true)
                  ], 10, ["id", "aria-selected", "aria-controls", "onClick"]);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<fieldset${ssrRenderAttrs(mergeProps({
          class: unref(actionStyles).readOnlyScope
        }, ssrGetDirectiveProps(_ctx, vDemoReadonly, unref(isDemo))))}>`);
        if (unref(activeMainTab) === "pages") {
          _push(`<section class="${ssrRenderClass(unref(styles).adminPanel)}"><div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}"><div><small>CONTENU ET APPARENCE</small><h2>Pages</h2><p>Gérez le contenu et l’apparence des différentes pages de votre boutique.</p></div><div class="${ssrRenderClass(unref(actionStyles).actions)}">`);
          if (unref(showPageThemePreview)) {
            _push(`<button type="button" data-demo-interactive class="${ssrRenderClass(unref(actionStyles).themeToggle)}"${ssrRenderAttr("aria-pressed", unref(activePagePreviewDark))}>${ssrInterpolate(unref(activePagePreviewDark) ? "☾" : "☀")}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button type="button"${ssrIncludeBooleanAttr(unref(saving) === unref(activePageTab)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) === unref(activePageTab) ? "Enregistrement…" : unref(activePageSaveLabel))}</button></div></div>`);
          _push(ssrRenderComponent(_component_AdminSubTabs, {
            tabs: unref(adminPageTabs),
            active: unref(activePageTab),
            label: "les sous-onglets des pages",
            "id-prefix": "page-tab",
            "panel-prefix": "panel",
            onSelect: selectPageTab
          }, null, _parent));
          if (unref(activeTab) === "content") {
            _push(`<section id="panel-content" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-content"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>PAGE D’ACCUEIL</small><h3>Éditeur visuel</h3><p>Contrôlez les textes, la navigation, les univers et leurs images avec un aperçu immédiat.</p></header>`);
            _push(ssrRenderComponent(_component_HomeContentEditor, {
              modelValue: unref(content),
              "onUpdate:modelValue": ($event) => isRef(content) ? content.value = $event : null,
              universes: unref(universes),
              "onUpdate:universes": ($event) => isRef(universes) ? universes.value = $event : null,
              categories: unref(categories),
              "onUpdate:categories": ($event) => isRef(categories) ? categories.value = $event : null,
              "favorite-ids": unref(favoriteIds),
              "onUpdate:favoriteIds": ($event) => isRef(favoriteIds) ? favoriteIds.value = $event : null,
              products: unref(products),
              "preview-dark": unref(previewDark2),
              readonly: unref(isDemo),
              "validation-issues": unref(validation).content
            }, null, _parent));
            _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button" data-demo-interactive class="${ssrRenderClass(unref(actionStyles).themeToggle)}"${ssrRenderAttr("aria-pressed", unref(previewDark2))}>${ssrInterpolate(unref(previewDark2) ? "☾" : "☀")}</button><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "content") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "content" ? "Enregistrement…" : "Enregistrer la page")}</button></div></section>`);
          } else if (unref(activeTab) === "category") {
            _push(`<section id="panel-category" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-category"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>PAGE CATÉGORIE</small><h3>Éditeur visuel</h3><p>Personnalisez les contenus génériques de toutes les pages catégorie. Leur titre reste déterminé par la catégorie consultée.</p></header>`);
            _push(ssrRenderComponent(_component_CategoryPageEditor, {
              modelValue: unref(content),
              "onUpdate:modelValue": ($event) => isRef(content) ? content.value = $event : null,
              "preview-dark": unref(categoryPreviewDark),
              "validation-issues": unref(validation).category
            }, null, _parent));
            _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button" data-demo-interactive class="${ssrRenderClass(unref(actionStyles).themeToggle)}"${ssrRenderAttr("aria-pressed", unref(categoryPreviewDark))}>${ssrInterpolate(unref(categoryPreviewDark) ? "☾" : "☀")}</button><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "category") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "category" ? "Enregistrement…" : "Enregistrer la page")}</button></div></section>`);
          } else if (unref(activeTab) === "universe") {
            _push(`<section id="panel-universe" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-universe"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>PAGE UNIVERS</small><h3>Éditeur visuel</h3><p>Personnalisez les libellés communs à toutes les pages univers. Le titre reprend automatiquement l’univers consulté.</p></header>`);
            _push(ssrRenderComponent(_component_UniversePageEditor, {
              modelValue: unref(content),
              "onUpdate:modelValue": ($event) => isRef(content) ? content.value = $event : null,
              categories: unref(categories),
              "preview-dark": unref(universePreviewDark),
              "validation-issues": unref(validation).universe
            }, null, _parent));
            _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button" data-demo-interactive class="${ssrRenderClass(unref(actionStyles).themeToggle)}"${ssrRenderAttr("aria-pressed", unref(universePreviewDark))}>${ssrInterpolate(unref(universePreviewDark) ? "☾" : "☀")}</button><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "universe") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "universe" ? "Enregistrement…" : "Enregistrer la page")}</button></div></section>`);
          } else if (unref(activeTab) === "cart") {
            _push(`<section id="panel-cart" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-cart"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>VOTRE PANIER</small><h3>Page panier</h3><p>Configurez le titre affiché dans l’onglet du navigateur pour la page panier.</p></header><label>Modèle du titre<input${ssrRenderAttr("value", unref(content).seoCartTitle)} placeholder="Votre panier | [Nom du site]"></label><div class="${ssrRenderClass(unref(actionStyles).variables)}"><small>Insérer :</small><button type="button">+ Nom du site</button></div><div class="${ssrRenderClass(unref(actionStyles).previewTitle)}">Aperçu : ${ssrInterpolate(unref(renderSeoTemplate)(unref(content).seoCartTitle, { "Nom du site": unref(content).seoSiteName }))}</div><div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "cart") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "cart" ? "Enregistrement…" : "Enregistrer la page")}</button></div></section>`);
          } else if (unref(activeTab) === "profile") {
            _push(`<section id="panel-profile" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-profile"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>MON COMPTE</small><h3>Page profil</h3><p>Personnalisez le titre de la page de gestion du compte client.</p></header><label>Modèle du titre<input${ssrRenderAttr("value", unref(content).seoProfileTitle)} placeholder="Mon compte | [Nom du site]"></label><div class="${ssrRenderClass(unref(actionStyles).variables)}"><small>Insérer :</small><button type="button">+ Nom du site</button><button type="button">+ Prénom</button><button type="button">+ Nom</button><button type="button">+ Email</button></div><div class="${ssrRenderClass(unref(actionStyles).previewTitle)}">Aperçu : ${ssrInterpolate(unref(renderSeoTemplate)(unref(content).seoProfileTitle, {
              "Nom du site": unref(content).seoSiteName,
              ["Prénom"]: "Jean",
              "Nom": "Dupont",
              "Email": "jean.dupont@example.com"
            }))}</div><div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "profile") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "profile" ? "Enregistrement…" : "Enregistrer la page")}</button></div></section>`);
          } else if (unref(activeTab) === "cgu") {
            _push(`<section id="panel-cgu" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-cgu"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>MENTIONS LÉGALES</small><h3>CGU</h3><p>Rédigez les Conditions Générales d&#39;Utilisation. Le lien apparaîtra dans le footer si le contenu n&#39;est pas vide.</p></header>`);
            _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
            _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "cgu") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "cgu" ? "Enregistrement…" : "Enregistrer les CGU")}</button></div></section>`);
          } else if (unref(activeTab) === "cgv") {
            _push(`<section id="panel-cgv" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-cgv"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>MENTIONS LÉGALES</small><h3>CGV</h3><p>Rédigez les Conditions Générales de Vente. Le lien apparaîtra dans le footer si le contenu n&#39;est pas vide.</p></header>`);
            _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
            _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "cgv") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "cgv" ? "Enregistrement…" : "Enregistrer les CGV")}</button></div></section>`);
          } else if (unref(activeTab) === "contact") {
            _push(`<section id="panel-contact" class="${ssrRenderClass(unref(actionStyles).pagePanel)}" role="tabpanel" aria-labelledby="page-tab-contact"><header class="${ssrRenderClass(unref(actionStyles).pageEditorHeader)}"><small>FORMULAIRE DE CONTACT</small><h3>Page contact</h3><p>Configurez l&#39;adresse e-mail qui recevra les messages envoyés via le formulaire de contact.</p></header><label class="${ssrRenderClass(unref(styles).panelHeading)}"> Email de contact <input${ssrRenderAttr("value", unref(content).contactEmail)} type="email" placeholder="contact@example.com"></label><div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "contact") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "contact" ? "Enregistrement…" : "Enregistrer")}</button></div></section>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else if (unref(activeTab) === "seo") {
          _push(`<section id="panel-seo" class="${ssrRenderClass(unref(styles).adminPanel)}" role="tabpanel" aria-labelledby="tab-seo"><div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}"><div><small>VISIBILITÉ ET PARTAGE</small><h2>Référencement</h2><p>Configurez les moteurs de recherche, les aperçus sociaux et les données structurées du site.</p></div><div class="${ssrRenderClass(unref(actionStyles).actions)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "seo") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "seo" ? "Enregistrement…" : "Enregistrer le référencement")}</button></div></div>`);
          _push(ssrRenderComponent(_component_SeoEditor, {
            modelValue: unref(content),
            "onUpdate:modelValue": ($event) => isRef(content) ? content.value = $event : null,
            section: unref(activeSeoSection),
            readonly: unref(isDemo),
            "validation-issues": unref(validation).seo,
            "onUpdate:section": selectSeoSection
          }, null, _parent));
          _push(`<div class="${ssrRenderClass(unref(actionStyles).bottomSave)}"><button type="button"${ssrIncludeBooleanAttr(unref(saving) === "seo") ? " disabled" : ""}>${ssrInterpolate(unref(saving) === "seo" ? "Enregistrement…" : "Enregistrer le référencement")}</button></div></section>`);
        } else if (unref(activeTab) === "products") {
          _push(`<section id="panel-products" class="${ssrRenderClass(unref(styles).adminPanel)}" role="tabpanel" aria-labelledby="tab-products"><div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}"><div><small>CATALOGUE</small><h2>Produits</h2><p>Créez, modifiez ou masquez les articles de la boutique.</p></div><button data-demo-interactive>+ Nouveau produit</button></div>`);
          if (unref(products).length) {
            _push(`<div class="${ssrRenderClass(unref(styles).adminProducts)}"><!--[-->`);
            ssrRenderList(unref(products), (p) => {
              _push(`<article>`);
              if (p.image) {
                _push(`<img${ssrRenderAttr("src", p.image.content + `?size=${p.image.width}x${p.image?.height}`)}${ssrRenderAttr("alt", p.name)}${ssrRenderAttr("width", p.image.width)}${ssrRenderAttr("height", p.image.height)}>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<div><h3>${ssrInterpolate(p.name)}</h3><span>${ssrInterpolate((p.priceCents / 100).toFixed(2))} € · ${ssrInterpolate(p.active ? "En ligne" : "Masqué")}</span></div><button data-demo-interactive>Modifier</button><button>Supprimer</button></article>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="${ssrRenderClass(unref(styles).adminEmpty)}">Aucun produit dans le catalogue.</p>`);
          }
          _push(`</section>`);
        } else if (unref(activeTab) === "promotions") {
          _push(`<section id="panel-promotions" class="${ssrRenderClass(unref(styles).adminPanel)}" role="tabpanel" aria-labelledby="tab-promotions"><div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}"><div><small>RÉDUCTIONS ET CODES PROMO</small><h2>Promotions</h2><p>Gérez les réductions automatiques et les codes promo applicables au catalogue.</p></div></div><div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}" style="${ssrRenderStyle({ "margin-top": "24px" })}"><div><small>RÉDUCTIONS AUTOMATIQUES</small><h2>Réductions</h2></div><button type="button" data-demo-interactive>+ Nouvelle réduction</button></div>`);
          if (unref(discounts).length) {
            _push(`<div class="${ssrRenderClass(unref(styles).userRows)}"><!--[-->`);
            ssrRenderList(unref(discounts), (d) => {
              _push(`<article><div class="${ssrRenderClass(unref(actionStyles).discountProductCard)}"><!--[-->`);
              ssrRenderList(d.rules.filter((r) => r.scope === "product").slice(0, 1), (r) => {
                _push(`<!--[-->`);
                if (unref(products).find((p) => p.id === r.targetId)?.image) {
                  _push(`<img${ssrRenderAttr("src", unref(products).find((p) => p.id === r.targetId).image.content)}${ssrRenderAttr("alt", unref(products).find((p) => p.id === r.targetId).name)}>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`<!--]-->`);
              });
              _push(`<!--]--><div><strong>${ssrInterpolate(d.label)}</strong><small>${ssrInterpolate(d.type === "percent" ? `${d.value} %` : `${(d.value / 100).toFixed(2)} €`)} · ${ssrInterpolate(d.active ? "Active" : "Inactive")}</small>`);
              if (d.startsAt || d.endsAt) {
                _push(`<small>${ssrInterpolate(d.startsAt ? `Du ${d.startsAt.slice(0, 10)}` : "")}${ssrInterpolate(d.endsAt ? ` au ${d.endsAt.slice(0, 10)}` : "")}</small>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<small>${ssrInterpolate(d.rules.map((r) => scopeLabel(r.scope, r.targetId)).join(" · "))}</small></div></div><button type="button" data-demo-interactive>Modifier</button><button type="button">Supprimer</button></article>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="${ssrRenderClass(unref(styles).adminEmpty)}">Aucune réduction configurée.</p>`);
          }
          _push(`<div class="${ssrRenderClass([unref(styles).panelTitle, unref(actionStyles).responsivePanelTitle])}" style="${ssrRenderStyle({ "margin-top": "24px" })}"><div><small>CODES PROMO</small><h2>Codes promo</h2></div><button type="button" data-demo-interactive>+ Nouveau code promo</button></div>`);
          if (unref(promoCodes).length) {
            _push(`<div class="${ssrRenderClass(unref(styles).userRows)}"><!--[-->`);
            ssrRenderList(unref(promoCodes), (p) => {
              _push(`<article><div><strong>${ssrInterpolate(p.code)}</strong><small>${ssrInterpolate(p.active ? "Actif" : "Inactif")}${ssrInterpolate(p.startsAt || p.endsAt ? ` · ${p.startsAt ? `Du ${p.startsAt.slice(0, 10)}` : ""}${p.endsAt ? ` au ${p.endsAt.slice(0, 10)}` : ""}` : "")}</small><small>${ssrInterpolate(p.rules.map((r) => `${scopeLabel(r.scope, r.targetId)} — ${r.type === "percent" ? `${r.value} %` : `${(r.value / 100).toFixed(2)} €`}`).join(" · "))}</small></div><button type="button" data-demo-interactive>Modifier</button><button type="button">Supprimer</button></article>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="${ssrRenderClass(unref(styles).adminEmpty)}">Aucun code promo configuré.</p>`);
          }
          if (unref(discountDraft)) {
            _push(`<div class="${ssrRenderClass(unref(styles).modal)}"><form${ssrRenderAttrs(mergeProps({
              class: unref(styles).editor
            }, ssrGetDirectiveProps(_ctx, vDemoReadonly, unref(isDemo))))}><button type="button" data-demo-interactive aria-label="Fermer">×</button><h2>${ssrInterpolate(unref(discountDraft).id ? "Modifier" : "Créer")} une réduction</h2><label>Libellé<input${ssrRenderAttr("value", unref(discountDraft).label)} required placeholder="Ex : Soldes été"></label><label>Type <select><option value="percent"${ssrIncludeBooleanAttr(Array.isArray(unref(discountDraft).type) ? ssrLooseContain(unref(discountDraft).type, "percent") : ssrLooseEqual(unref(discountDraft).type, "percent")) ? " selected" : ""}>Pourcentage (%)</option><option value="fixed"${ssrIncludeBooleanAttr(Array.isArray(unref(discountDraft).type) ? ssrLooseContain(unref(discountDraft).type, "fixed") : ssrLooseEqual(unref(discountDraft).type, "fixed")) ? " selected" : ""}>Montant fixe (€)</option></select></label><label>Valeur <div class="${ssrRenderClass(unref(styles).inputSuffix)}"><input${ssrRenderAttr("value", unref(discountValueEuros))} type="number" min="0" step="0.01"${ssrRenderAttr("max", unref(discountDraft).type === "percent" ? 100 : 9999.99)} required><span>${ssrInterpolate(unref(discountDraft).type === "percent" ? "%" : "€")}</span></div></label><div class="${ssrRenderClass(unref(styles).checks)}"><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(discountDraft).active) ? ssrLooseContain(unref(discountDraft).active, null) : unref(discountDraft).active) ? " checked" : ""} type="checkbox"> Active</label></div><label>Date de début (optionnel)<input${ssrRenderAttr("value", unref(discountDraft).startsAt)} type="date"></label><label>Date de fin (optionnel)<input${ssrRenderAttr("value", unref(discountDraft).endsAt)} type="date"></label><fieldset><legend>Règles d&#39;application</legend><!--[-->`);
            ssrRenderList(unref(discountDraft).rules, (rule, index) => {
              _push(`<div class="${ssrRenderClass(unref(actionStyles).titleActions)}" style="${ssrRenderStyle({ "flex-wrap": "wrap", "margin-bottom": "8px" })}"><select${ssrRenderAttr("aria-label", `Scope règle ${index + 1}`)}><option value="product"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "product") : ssrLooseEqual(rule.scope, "product")) ? " selected" : ""}>Produit</option><option value="category"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "category") : ssrLooseEqual(rule.scope, "category")) ? " selected" : ""}>Catégorie</option><option value="universe"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "universe") : ssrLooseEqual(rule.scope, "universe")) ? " selected" : ""}>Univers</option></select>`);
              if (rule.scope === "product") {
                _push(`<select${ssrRenderAttr("aria-label", `Produit règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(products), (prod) => {
                  _push(`<option${ssrRenderAttr("value", prod.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, prod.id) : ssrLooseEqual(rule.targetId, prod.id)) ? " selected" : ""}>${ssrInterpolate(prod.name)}</option>`);
                });
                _push(`<!--]--></select>`);
              } else if (rule.scope === "category") {
                _push(`<select${ssrRenderAttr("aria-label", `Catégorie règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(categories), (cat) => {
                  _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, cat.id) : ssrLooseEqual(rule.targetId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`);
                });
                _push(`<!--]--></select>`);
              } else {
                _push(`<select${ssrRenderAttr("aria-label", `Univers règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(universes), (uni) => {
                  _push(`<option${ssrRenderAttr("value", uni.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, uni.id) : ssrLooseEqual(rule.targetId, uni.id)) ? " selected" : ""}>${ssrInterpolate(uni.title)}</option>`);
                });
                _push(`<!--]--></select>`);
              }
              _push(`<button type="button"${ssrIncludeBooleanAttr(unref(discountDraft).rules.length <= 1) ? " disabled" : ""}> − </button></div>`);
            });
            _push(`<!--]--><button type="button">+ Ajouter une règle</button></fieldset><div class="${ssrRenderClass(unref(actionStyles).actions)}"><button type="button">Annuler</button><button type="submit"${ssrIncludeBooleanAttr(unref(promotionSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(promotionSaving) ? "Enregistrement…" : "Enregistrer")}</button></div></form></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(promoCodeDraft)) {
            _push(`<div class="${ssrRenderClass(unref(styles).modal)}"><form${ssrRenderAttrs(mergeProps({
              class: unref(styles).editor
            }, ssrGetDirectiveProps(_ctx, vDemoReadonly, unref(isDemo))))}><button type="button" data-demo-interactive aria-label="Fermer">×</button><h2>${ssrInterpolate(unref(promoCodeDraft).id ? "Modifier" : "Créer")} un code promo</h2><label>Code<input${ssrRenderAttr("value", unref(promoCodeDraft).code)} required placeholder="Ex : ETE2025" style="${ssrRenderStyle({ "text-transform": "uppercase" })}"></label><div class="${ssrRenderClass(unref(styles).checks)}"><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(promoCodeDraft).active) ? ssrLooseContain(unref(promoCodeDraft).active, null) : unref(promoCodeDraft).active) ? " checked" : ""} type="checkbox"> Actif</label></div><label>Date de début (optionnel)<input${ssrRenderAttr("value", unref(promoCodeDraft).startsAt)} type="date"></label><label>Date de fin (optionnel)<input${ssrRenderAttr("value", unref(promoCodeDraft).endsAt)} type="date"></label><fieldset><legend>Règles de réduction</legend><!--[-->`);
            ssrRenderList(unref(promoCodeDraft).rules, (rule, index) => {
              _push(`<div class="${ssrRenderClass(unref(actionStyles).titleActions)}" style="${ssrRenderStyle({ "flex-wrap": "wrap", "margin-bottom": "8px" })}"><select${ssrRenderAttr("aria-label", `Scope règle ${index + 1}`)}><option value="all"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "all") : ssrLooseEqual(rule.scope, "all")) ? " selected" : ""}>Tout le catalogue</option><option value="product"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "product") : ssrLooseEqual(rule.scope, "product")) ? " selected" : ""}>Produit</option><option value="category"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "category") : ssrLooseEqual(rule.scope, "category")) ? " selected" : ""}>Catégorie</option><option value="universe"${ssrIncludeBooleanAttr(Array.isArray(rule.scope) ? ssrLooseContain(rule.scope, "universe") : ssrLooseEqual(rule.scope, "universe")) ? " selected" : ""}>Univers</option></select>`);
              if (rule.scope === "product") {
                _push(`<select${ssrRenderAttr("aria-label", `Produit règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(products), (prod) => {
                  _push(`<option${ssrRenderAttr("value", prod.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, prod.id) : ssrLooseEqual(rule.targetId, prod.id)) ? " selected" : ""}>${ssrInterpolate(prod.name)}</option>`);
                });
                _push(`<!--]--></select>`);
              } else if (rule.scope === "category") {
                _push(`<select${ssrRenderAttr("aria-label", `Catégorie règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(categories), (cat) => {
                  _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, cat.id) : ssrLooseEqual(rule.targetId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`);
                });
                _push(`<!--]--></select>`);
              } else if (rule.scope === "universe") {
                _push(`<select${ssrRenderAttr("aria-label", `Univers règle ${index + 1}`)}><!--[-->`);
                ssrRenderList(unref(universes), (uni) => {
                  _push(`<option${ssrRenderAttr("value", uni.id)}${ssrIncludeBooleanAttr(Array.isArray(rule.targetId) ? ssrLooseContain(rule.targetId, uni.id) : ssrLooseEqual(rule.targetId, uni.id)) ? " selected" : ""}>${ssrInterpolate(uni.title)}</option>`);
                });
                _push(`<!--]--></select>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<select${ssrRenderAttr("aria-label", `Type règle ${index + 1}`)}><option value="percent"${ssrIncludeBooleanAttr(Array.isArray(rule.type) ? ssrLooseContain(rule.type, "percent") : ssrLooseEqual(rule.type, "percent")) ? " selected" : ""}>%</option><option value="fixed"${ssrIncludeBooleanAttr(Array.isArray(rule.type) ? ssrLooseContain(rule.type, "fixed") : ssrLooseEqual(rule.type, "fixed")) ? " selected" : ""}>€ fixe</option></select><div class="${ssrRenderClass(unref(styles).inputSuffix)}"><input${ssrRenderAttr("value", rule.value)} type="number" min="0"${ssrRenderAttr("max", rule.type === "percent" ? 100 : 999999)}${ssrRenderAttr("aria-label", `Valeur règle ${index + 1}`)}><span>${ssrInterpolate(rule.type === "percent" ? "%" : "€")}</span></div><button type="button"${ssrIncludeBooleanAttr(unref(promoCodeDraft).rules.length <= 1) ? " disabled" : ""}>− </button></div>`);
            });
            _push(`<!--]--><button type="button">+ Ajouter une règle</button></fieldset><div class="${ssrRenderClass(unref(actionStyles).actions)}"><button type="button">Annuler</button><button type="submit"${ssrIncludeBooleanAttr(unref(promotionSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(promotionSaving) ? "Enregistrement…" : "Enregistrer")}</button></div></form></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<section id="panel-users" class="${ssrRenderClass(unref(styles).adminPanel)}" role="tabpanel" aria-labelledby="tab-users"><div class="${ssrRenderClass([unref(styles).panelHeading, unref(actionStyles).usersHeading])}"><div><small>ACCÈS ET DROITS</small><h2>Utilisateurs</h2><p>Gérez les rôles administrateur et l’activation des comptes.</p></div><button type="button" class="${ssrRenderClass(unref(actionStyles).secondaryButton)}"${ssrIncludeBooleanAttr(unref(creatingDemo)) ? " disabled" : ""}>${ssrInterpolate(unref(creatingDemo) ? "Création…" : "Créer un utilisateur temporaire de démo")}</button></div>`);
          if (unref(demoCredentials2)) {
            _push(`<div class="${ssrRenderClass(unref(actionStyles).demoCredentials)}"><strong>Identifiants temporaires à transmettre</strong><span class="${ssrRenderClass(unref(actionStyles).demoCredentialLine)}"><b>E-mail :</b><code>${ssrInterpolate(unref(demoCredentials2).email)}</code><button type="button" class="${ssrRenderClass([unref(actionStyles).copyButton, unref(copiedDemoField) === "email" && unref(actionStyles).copied])}" aria-label="Copier l’e-mail"${ssrRenderAttr("title", unref(copiedDemoField) === "email" ? "E-mail copié" : "Copier l’e-mail")}><img${ssrRenderAttr("src", unref(copyIcon))} alt=""></button></span><span class="${ssrRenderClass(unref(actionStyles).demoCredentialLine)}"><b>Mot de passe :</b><code>${ssrInterpolate(unref(demoCredentials2).password)}</code><button type="button" class="${ssrRenderClass([unref(actionStyles).copyButton, unref(copiedDemoField) === "password" && unref(actionStyles).copied])}" aria-label="Copier le mot de passe"${ssrRenderAttr("title", unref(copiedDemoField) === "password" ? "Mot de passe copié" : "Copier le mot de passe")}><img${ssrRenderAttr("src", unref(copyIcon))} alt=""></button></span><small>Le mot de passe n’est affiché qu’après la création de ce compte.</small></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(users).length) {
            _push(`<div class="${ssrRenderClass([unref(styles).userRows, unref(actionStyles).userRowsWithReset])}"><!--[-->`);
            ssrRenderList(unref(users), (user) => {
              _push(`<article><div><strong>${ssrInterpolate(user.email)}</strong><small>Créé le ${ssrInterpolate(new Date(user.createdAt).toLocaleDateString("fr-FR"))}</small></div><select${ssrRenderAttr("aria-label", `Rôle de ${user.email}`)}><option value="customer"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "customer") : ssrLooseEqual(user.role, "customer")) ? " selected" : ""}>Client</option><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "admin") : ssrLooseEqual(user.role, "admin")) ? " selected" : ""}>Administrateur</option><option value="demo"${ssrIncludeBooleanAttr(Array.isArray(user.role) ? ssrLooseContain(user.role, "demo") : ssrLooseEqual(user.role, "demo")) ? " selected" : ""}>Démonstration — lecture seule</option></select><label><input${ssrIncludeBooleanAttr(Array.isArray(user.active) ? ssrLooseContain(user.active, null) : user.active) ? " checked" : ""} type="checkbox"> Actif</label>`);
              if (user.role !== "demo") {
                _push(`<button type="button" class="${ssrRenderClass(unref(actionStyles).resetPassword)}"${ssrIncludeBooleanAttr(unref(resettingUserId) === user.id) ? " disabled" : ""}>${ssrInterpolate(unref(resettingUserId) === user.id ? "Envoi…" : "Réinitialiser le mot de passe")}</button>`);
              } else {
                _push(`<!---->`);
              }
              if (user.role === "demo") {
                _push(`<button type="button" class="${ssrRenderClass(unref(actionStyles).deleteUser)}"${ssrIncludeBooleanAttr(unref(deletingUserId) === user.id) ? " disabled" : ""}${ssrRenderAttr("aria-label", `Supprimer ${user.email}`)}${ssrRenderAttr("title", `Supprimer ${user.email}`)}><img${ssrRenderAttr("src", unref(trashIcon))} alt=""><span>Supprimer</span></button>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<button class="${ssrRenderClass(unref(actionStyles).saveUser)}">Enregistrer</button></article>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="${ssrRenderClass(unref(styles).adminEmpty)}">Aucun utilisateur inscrit.</p>`);
          }
          _push(`</section>`);
        }
        _push(`</fieldset><!--]-->`);
      }
      if (unref(message)) {
        _push(`<p class="${ssrRenderClass([unref(styles).adminMessage, unref(messageIsError) && unref(styles).adminMessageError])}">${ssrInterpolate(unref(messageIsError) ? "⚠" : "✓")} ${ssrInterpolate(unref(message))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(draft)) {
        _push(`<div class="${ssrRenderClass(unref(styles).modal)}"><form${ssrRenderAttrs(mergeProps({
          class: unref(styles).editor
        }, ssrGetDirectiveProps(_ctx, vDemoReadonly, unref(isDemo))))}><button type="button" data-demo-interactive aria-label="Fermer">×</button><h2>${ssrInterpolate(unref(draft).id ? "Modifier" : "Créer")} un produit</h2><label>Nom<input${ssrRenderAttr("value", unref(draft).name)} required>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.name"
        }, null, _parent));
        _push(`</label><label>Adresse de la page<input${ssrRenderAttr("value", unref(draft).slug)} required>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.slug"
        }, null, _parent));
        _push(`</label><label>Catégories<select multiple required><!--[-->`);
        ssrRenderList(unref(categories), (category) => {
          _push(`<option${ssrRenderAttr("value", category.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(draft).categoryIds) ? ssrLooseContain(unref(draft).categoryIds, category.id) : ssrLooseEqual(unref(draft).categoryIds, category.id)) ? " selected" : ""}>${ssrInterpolate(category.label)}</option>`);
        });
        _push(`<!--]--></select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs catégories.</small>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.categoryIds"
        }, null, _parent));
        _push(`</label><label>Univers<select multiple required><!--[-->`);
        ssrRenderList(unref(universes), (universe) => {
          _push(`<option${ssrRenderAttr("value", universe.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(draft).universeIds) ? ssrLooseContain(unref(draft).universeIds, universe.id) : ssrLooseEqual(unref(draft).universeIds, universe.id)) ? " selected" : ""}>${ssrInterpolate(universe.title)}</option>`);
        });
        _push(`<!--]--></select><small>Maintenez Ctrl ou Cmd pour sélectionner plusieurs univers.</small>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.universeIds"
        }, null, _parent));
        _push(`</label><label>Prix en centimes<input${ssrRenderAttr("value", unref(draft).priceCents)} type="number" min="1" required>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.priceCents"
        }, null, _parent));
        _push(`</label>`);
        _push(ssrRenderComponent(_component_ImageUpload, {
          modelValue: unref(draft).image,
          "onUpdate:modelValue": ($event) => unref(draft).image = $event,
          label: "Image du produit",
          readonly: unref(isDemo),
          required: ""
        }, null, _parent));
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.image"
        }, null, _parent));
        _push(`<label>Description<textarea rows="5" required>${ssrInterpolate(unref(draft).description)}</textarea>`);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.description"
        }, null, _parent));
        _push(`</label><div class="${ssrRenderClass(unref(styles).checks)}"><label><input${ssrIncludeBooleanAttr(Array.isArray(unref(draft).active) ? ssrLooseContain(unref(draft).active, null) : unref(draft).active) ? " checked" : ""} type="checkbox"> En ligne `);
        _push(ssrRenderComponent(_component_FieldValidation, {
          issues: unref(validation).product,
          field: "product.active"
        }, null, _parent));
        _push(`</label></div><button type="submit">${ssrInterpolate(unref(saving) === "product" ? "Enregistrement…" : "Enregistrer le produit")}</button></form></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(mediaOpen)) {
        _push(ssrRenderComponent(_component_MediaLibrary, {
          readonly: unref(isDemo),
          onClose: ($event) => mediaOpen.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});
const actions = "_actions_12xdj_2";
const bottomSave = "_bottomSave_12xdj_2";
const themeToggle = "_themeToggle_12xdj_27";
const pagePanel = "_pagePanel_12xdj_33";
const pageEditorHeader = "_pageEditorHeader_12xdj_44";
const titleActions = "_titleActions_12xdj_66";
const mediaButton = "_mediaButton_12xdj_72";
const resetPassword = "_resetPassword_12xdj_97";
const deleteUser = "_deleteUser_12xdj_103";
const previewTitle = "_previewTitle_12xdj_125";
const variables = "_variables_12xdj_134";
const discountProductCard = "_discountProductCard_12xdj_160";
const readOnlyScope = "_readOnlyScope_12xdj_176";
const demoNotice = "_demoNotice_12xdj_188";
const usersHeading = "_usersHeading_12xdj_197";
const secondaryButton = "_secondaryButton_12xdj_208";
const demoCredentials = "_demoCredentials_12xdj_224";
const demoCredentialLine = "_demoCredentialLine_12xdj_233";
const copyButton = "_copyButton_12xdj_249";
const copied = "_copied_12xdj_266";
const userRowsWithReset = "_userRowsWithReset_12xdj_275";
const saveUser = "_saveUser_12xdj_288";
const responsiveTitle = "_responsiveTitle_12xdj_328";
const responsivePanelTitle = "_responsivePanelTitle_12xdj_340";
const style0 = {
  actions,
  bottomSave,
  themeToggle,
  pagePanel,
  pageEditorHeader,
  titleActions,
  mediaButton,
  resetPassword,
  deleteUser,
  previewTitle,
  variables,
  discountProductCard,
  readOnlyScope,
  demoNotice,
  usersHeading,
  secondaryButton,
  demoCredentials,
  demoCredentialLine,
  copyButton,
  copied,
  userRowsWithReset,
  saveUser,
  responsiveTitle,
  responsivePanelTitle
};
const cssModules = {
  "actionStyles": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AdminPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__cssModules", cssModules]]);
export {
  AdminPage as default
};
//# sourceMappingURL=admin-CRC7E_fA.js.map
