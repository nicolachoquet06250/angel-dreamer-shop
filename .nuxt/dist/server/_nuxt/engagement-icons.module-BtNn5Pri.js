import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HorizontalCarousel",
  __ssrInlineRender: true,
  props: {
    trackClass: {},
    label: {},
    role: {}
  },
  setup(__props) {
    const props = __props;
    const track2 = ref(null);
    const overflow = ref(false);
    const index = ref(0);
    const canPrev = computed(() => overflow.value && index.value > 0);
    const canNext = computed(() => overflow.value && index.value < (track2.value?.children.length || 0) - 1);
    const compact2 = computed(() => props.label.includes("onglets"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: _ctx.$style.root
      }, _attrs))}><button type="button" class="${ssrRenderClass([_ctx.$style.arrow, _ctx.$style.previous])}"${ssrRenderAttr("aria-label", `Faire défiler ${__props.label} vers la gauche`)} style="${ssrRenderStyle(unref(canPrev) ? null : { display: "none" })}">&lt; </button><div class="${ssrRenderClass([_ctx.$style.track, unref(compact2) && _ctx.$style.compact, __props.trackClass])}"${ssrRenderAttr("role", __props.role || (unref(compact2) ? "tablist" : void 0))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><button type="button" class="${ssrRenderClass([_ctx.$style.arrow, _ctx.$style.next])}"${ssrRenderAttr("aria-label", `Faire défiler ${__props.label} vers la droite`)} style="${ssrRenderStyle(unref(canNext) ? null : { display: "none" })}">&gt; </button></div>`);
    };
  }
});
const root = "_root_izn0u_2";
const track = "_track_izn0u_7";
const arrow = "_arrow_izn0u_20";
const previous = "_previous_izn0u_39";
const next = "_next_izn0u_43";
const compact = "_compact_izn0u_64";
const style0 = {
  root,
  track,
  arrow,
  previous,
  next,
  compact
};
const cssModules = {
  "$style": style0
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HorizontalCarousel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__cssModules", cssModules]]), { __name: "HorizontalCarousel" });
const previewItem = "_previewItem_kdxrd_1";
const publicItem = "_publicItem_kdxrd_18";
const engagementStyles = {
  previewItem,
  publicItem
};
export {
  __nuxt_component_1 as _,
  engagementStyles as e
};
//# sourceMappingURL=engagement-icons.module-BtNn5Pri.js.map
