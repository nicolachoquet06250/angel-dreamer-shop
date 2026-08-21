import { _ as __nuxt_component_0 } from "./nuxt-link-DpXmWH_x.js";
import { defineComponent, ref, mergeProps, unref, withCtx, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useShopCart, s as styles } from "./StoreHeader-BX76lEQZ.js";
import { u as useThemedImage } from "./useThemedImage-HZxF4Y-0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {},
    cartDisabled: { type: Boolean, default: false }
  },
  setup(__props) {
    const imageFor = useThemedImage();
    useShopCart();
    const added = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: unref(styles).productCard
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/produits/${__props.product.slug}`,
        class: unref(styles).productImage
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(imageFor)(__props.product.image)) {
              _push2(`<img${ssrRenderAttr("src", unref(imageFor)(__props.product.image)?.content + `?size=${unref(imageFor)(__props.product.image)?.width}x${unref(imageFor)(__props.product.image)?.height}`)}${ssrRenderAttr("alt", __props.product.name)}${ssrRenderAttr("width", unref(imageFor)(__props.product.image)?.width)}${ssrRenderAttr("height", unref(imageFor)(__props.product.image)?.height)}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(imageFor)(__props.product.image) ? (openBlock(), createBlock("img", {
                key: 0,
                src: unref(imageFor)(__props.product.image)?.content + `?size=${unref(imageFor)(__props.product.image)?.width}x${unref(imageFor)(__props.product.image)?.height}`,
                alt: __props.product.name,
                width: unref(imageFor)(__props.product.image)?.width,
                height: unref(imageFor)(__props.product.image)?.height
              }, null, 8, ["src", "alt", "width", "height"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="${ssrRenderClass(unref(styles).productInfo)}"><div><small>${ssrInterpolate(__props.product.categories.map((item) => item.label).join(" · "))}</small><h3>${ssrInterpolate(__props.product.name)}</h3><div class="${ssrRenderClass(unref(styles).productPrice)}">`);
      if (__props.product.discountedPriceCents != null) {
        _push(`<strong class="${ssrRenderClass(unref(styles).discountedPrice)}">${ssrInterpolate((__props.product.discountedPriceCents / 100).toFixed(2).replace(".", ","))} €</strong>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass(__props.product.discountedPriceCents != null ? unref(styles).originalPrice : "")}">${ssrInterpolate((__props.product.priceCents / 100).toFixed(2).replace(".", ","))} €</span></div></div><button${ssrIncludeBooleanAttr(__props.cartDisabled) ? " disabled" : ""}${ssrRenderAttr("aria-label", __props.cartDisabled ? "Panier indisponible avec un compte de démonstration" : `Ajouter ${__props.product.name}`)}${ssrRenderAttr("title", __props.cartDisabled ? "Panier indisponible en mode démonstration" : void 0)}>${ssrInterpolate(__props.cartDisabled ? "×" : unref(added) ? "✓" : "+")}</button></div></article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "ProductCard" });
export {
  __nuxt_component_3 as _
};
//# sourceMappingURL=ProductCard-tdFpQDYF.js.map
