import { a as useState } from "./StoreHeader-BX76lEQZ.js";
function resolveImageVariant(image, dark) {
  if (!image) return null;
  if (dark && image.darkVariant) return {
    ...image.darkVariant,
    width: image.width,
    height: image.height
  };
  return image;
}
function useThemedImage() {
  const dark = useState(
    "theme",
    () => false
  );
  return (image) => resolveImageVariant(image, dark.value);
}
export {
  resolveImageVariant as r,
  useThemedImage as u
};
//# sourceMappingURL=useThemedImage-HZxF4Y-0.js.map
