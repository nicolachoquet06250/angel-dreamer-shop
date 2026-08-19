import type {ImageAsset} from '~/types/shop'

export function resolveImageVariant(image: ImageAsset | null | undefined, dark: boolean) {
    if (!image) return null;
    if (dark && image.darkVariant) return {
        ...image.darkVariant,
        width: image.width,
        height: image.height
    };
    return image
}

export function useThemedImage() {
    const dark = useState<boolean>(
        'theme', () => false);
    return (image: ImageAsset | null | undefined) =>
        resolveImageVariant(image, dark.value)
}
