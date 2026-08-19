<script setup lang="ts">
import type {Product} from '~/types/shop';
import styles from '~/assets/css/site.module.css'

const props = defineProps<{ product: Product }>();
const imageFor = useThemedImage();
const {add} = useShopCart();
const added = ref(false)

function addNow() {
  add(props.product);
  added.value = true;
  setTimeout(() => added.value = false, 1500)
}
</script>
<template>
  <article :class="styles.productCard">
    <NuxtLink :to="`/produits/${product.slug}`" :class="styles.productImage">
      <img v-if="imageFor(product.image)"
          :src="imageFor(product.image)?.content + `?size=${imageFor(product.image)?.width}x${imageFor(product.image)?.height}`"
          :alt="product.name"
          :width="imageFor(product.image)?.width"
          :height="imageFor(product.image)?.height">
    </NuxtLink>
    <div :class="styles.productInfo">
      <div><small>{{ product.categories.map(item => item.label).join(' · ') }}</small>
        <h3>{{ product.name }}</h3><strong>{{ (product.priceCents / 100).toFixed(2).replace('.', ',') }} €</strong>
      </div>
      <button @click="addNow" :aria-label="`Ajouter ${product.name}`">{{ added ? '✓' : '+' }}</button>
    </div>
  </article>
</template>
