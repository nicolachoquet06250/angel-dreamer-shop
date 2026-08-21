import { _ as __nuxt_component_0$1 } from "./nuxt-link-DpXmWH_x.js";
import { toRef, isRef, computed, defineComponent, ref, withAsyncContext, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { b as useNuxtApp, g as useFetch } from "../server.mjs";
const workshop = "_workshop_ioq45_2";
const productPrice = "_productPrice_ioq45_4";
const discountedPrice = "_discountedPrice_ioq45_11";
const originalPrice = "_originalPrice_ioq45_17";
const announcement = "_announcement_ioq45_71";
const header = "_header_ioq45_86";
const logo = "_logo_ioq45_98";
const footerMain = "_footerMain_ioq45_102";
const nav = "_nav_ioq45_112";
const headerActions = "_headerActions_ioq45_124";
const bag = "_bag_ioq45_140";
const menuButton = "_menuButton_ioq45_159";
const hero = "_hero_ioq45_166";
const heroImage = "_heroImage_ioq45_174";
const heroCopy = "_heroCopy_ioq45_186";
const cta = "_cta_ioq45_224";
const values = "_values_ioq45_237";
const container = "_container_ioq45_257";
const sectionTitle = "_sectionTitle_ioq45_263";
const admin = "_admin_ioq45_267";
const universes = "_universes_ioq45_279";
const productGrid = "_productGrid_ioq45_301";
const productCard = "_productCard_ioq45_307";
const productImage = "_productImage_ioq45_313";
const productInfo = "_productInfo_ioq45_342";
const footer = "_footer_ioq45_102";
const detail = "_detail_ioq45_417";
const detailImage = "_detailImage_ioq45_426";
const detailCopy = "_detailCopy_ioq45_439";
const cartPage = "_cartPage_ioq45_475";
const empty = "_empty_ioq45_489";
const cartLine = "_cartLine_ioq45_496";
const cartLinePrice = "_cartLinePrice_ioq45_528";
const cartLineDiscounted = "_cartLineDiscounted_ioq45_535";
const cartLineOriginal = "_cartLineOriginal_ioq45_541";
const checkout = "_checkout_ioq45_548";
const paypal = "_paypal_ioq45_579";
const promoSection = "_promoSection_ioq45_590";
const promoRow = "_promoRow_ioq45_608";
const promoError = "_promoError_ioq45_649";
const promoApplied = "_promoApplied_ioq45_656";
const promoLabel = "_promoLabel_ioq45_682";
const checkoutTotalRow = "_checkoutTotalRow_ioq45_692";
const checkoutTotalStrike = "_checkoutTotalStrike_ioq45_700";
const checkoutTotalAccent = "_checkoutTotalAccent_ioq45_707";
const success = "_success_ioq45_711";
const adminTabs = "_adminTabs_ioq45_728";
const adminTabActive = "_adminTabActive_ioq45_728";
const adminPanel = "_adminPanel_ioq45_728";
const panelHeading = "_panelHeading_ioq45_728";
const panelTitle = "_panelTitle_ioq45_728";
const adminEmpty = "_adminEmpty_ioq45_728";
const adminSubTabs = "_adminSubTabs_ioq45_730";
const adminSubTab = "_adminSubTab_ioq45_730";
const adminSubTabActive = "_adminSubTabActive_ioq45_755";
const adminTitle = "_adminTitle_ioq45_766";
const adminNotice = "_adminNotice_ioq45_780";
const editor = "_editor_ioq45_791";
const adminProducts = "_adminProducts_ioq45_819";
const adminMessage = "_adminMessage_ioq45_852";
const adminMessageError = "_adminMessageError_ioq45_861";
const modal = "_modal_ioq45_866";
const inputSuffix = "_inputSuffix_ioq45_894";
const checks = "_checks_ioq45_952";
const authPage = "_authPage_ioq45_962";
const authCard = "_authCard_ioq45_969";
const account = "_account_ioq45_976";
const userRows = "_userRows_ioq45_1062";
const footerLinks = "_footerLinks_ioq45_1100";
const footerCopyright = "_footerCopyright_ioq45_1106";
const legalPage = "_legalPage_ioq45_1120";
const legalContent = "_legalContent_ioq45_1133";
const contactPage = "_contactPage_ioq45_1191";
const contactCard = "_contactCard_ioq45_1198";
const attachmentList = "_attachmentList_ioq45_1213";
const attachmentItem = "_attachmentItem_ioq45_1220";
const codeStep = "_codeStep_ioq45_1237";
const codeInput = "_codeInput_ioq45_1247";
const contactBtn = "_contactBtn_ioq45_1265";
const successMsg = "_successMsg_ioq45_1287";
const navOpen = "_navOpen_ioq45_1294";
const styles = {
  workshop,
  productPrice,
  discountedPrice,
  originalPrice,
  announcement,
  header,
  logo,
  footerMain,
  nav,
  headerActions,
  bag,
  menuButton,
  hero,
  heroImage,
  heroCopy,
  cta,
  values,
  container,
  sectionTitle,
  admin,
  universes,
  productGrid,
  productCard,
  productImage,
  productInfo,
  footer,
  detail,
  detailImage,
  detailCopy,
  cartPage,
  empty,
  cartLine,
  cartLinePrice,
  cartLineDiscounted,
  cartLineOriginal,
  checkout,
  paypal,
  promoSection,
  promoRow,
  promoError,
  promoApplied,
  promoLabel,
  checkoutTotalRow,
  checkoutTotalStrike,
  checkoutTotalAccent,
  success,
  adminTabs,
  adminTabActive,
  adminPanel,
  panelHeading,
  panelTitle,
  adminEmpty,
  adminSubTabs,
  adminSubTab,
  adminSubTabActive,
  adminTitle,
  adminNotice,
  editor,
  adminProducts,
  adminMessage,
  adminMessageError,
  modal,
  inputSuffix,
  checks,
  authPage,
  authCard,
  account,
  userRows,
  footerLinks,
  footerCopyright,
  legalPage,
  legalContent,
  contactPage,
  contactCard,
  attachmentList,
  attachmentItem,
  codeStep,
  codeInput,
  contactBtn,
  successMsg,
  navOpen
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (init) {
    nuxtApp._state[key] ??= { _default: init };
  }
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useShopCart() {
  const cart = useState("cart", () => []);
  const save = () => {
  };
  const add = (product) => {
    const line = cart.value.find((l) => l.product.id === product.id);
    if (line) line.quantity++;
    else cart.value.push({ product, quantity: 1 });
  };
  const remove = (id) => {
    cart.value = cart.value.filter((l) => l.product.id !== id);
  };
  const count = computed(() => cart.value.reduce((s, l) => s + l.quantity, 0));
  const total = computed(() => cart.value.reduce((s, l) => s + l.product.priceCents * l.quantity, 0));
  return { cart, add, remove, count, total, save };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StoreHeader",
  __ssrInlineRender: true,
  props: {
    announcement: {},
    paymentLabel: { default: "Paiement sécurisé" },
    logoText: { default: "ANGEL DREAMER" }
  },
  async setup(__props) {
    let __temp, __restore;
    const { count } = useShopCart();
    const menu = ref(false);
    const dark = useState("theme", () => false);
    const { data: session } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/auth/me",
      "$9Pe_rAHqbc"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      { default: () => [] },
      "$ZAGyGy858e"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><div class="${ssrRenderClass(unref(styles).announcement)}">${ssrInterpolate(__props.announcement || "🇫🇷 Imprimé en France · Livraison dès 3,90 €")}<span>${ssrInterpolate(__props.paymentLabel)}</span></div><header class="${ssrRenderClass(unref(styles).header)}"><button class="${ssrRenderClass(unref(styles).menuButton)}" aria-label="Menu">☰</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: unref(styles).logo
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.logoText)}<i${_scopeId}>.</i>`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.logoText), 1),
              createVNode("i", null, ".")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="${ssrRenderClass([unref(styles).nav, unref(menu) && unref(styles).navOpen])}"><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: category.id,
          to: `/categories/${category.slug}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(category.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(category.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
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
      if (["admin", "demo"].includes(unref(session)?.user?.role || "")) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Administrer`);
            } else {
              return [
                createTextVNode("Administrer")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div class="${ssrRenderClass(unref(styles).headerActions)}"><button${ssrRenderAttr("aria-label", unref(dark) ? "Mode clair" : "Mode sombre")}>${ssrInterpolate(unref(dark) ? "☾" : "☀")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(session)?.user ? "/compte" : "/connexion",
        "aria-label": unref(session)?.user ? "Mon compte" : "Se connecter"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`♙ `);
          } else {
            return [
              createTextVNode("♙ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(session)?.user?.role !== "demo") {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/panier",
          class: unref(styles).bag
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`▢<b${_scopeId}>${ssrInterpolate(unref(count))}</b>`);
            } else {
              return [
                createTextVNode("▢"),
                createVNode("b", null, toDisplayString(unref(count)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StoreHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "StoreHeader" });
export {
  __nuxt_component_0 as _,
  useState as a,
  styles as s,
  useShopCart as u
};
//# sourceMappingURL=StoreHeader-BX76lEQZ.js.map
