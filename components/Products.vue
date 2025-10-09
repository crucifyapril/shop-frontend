<script setup lang="ts">
import { useRuntimeConfig } from '#app';
import itemComponent from "~/components/Item.vue";
import { parse } from 'cookie';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;
const authStore = useAuthStore();

interface Product {
  id: number
  name: string
  description: string
  price: number
}

const {data: products} = await useFetch<Product[]>(`${baseURL}/api/products/random`)

const addToCart = async (productId: number) => {
  try {
    await authStore.fetchCsrfToken();
    const cookies = parse(document.cookie);
    const csrfToken = cookies['XSRF-TOKEN'] ?? '';

    await $fetch(`${baseURL}/api/cart`, {
      method: "POST",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
      body: {
        product_id: productId,
        quantity: 1
      },
    });

    await navigateTo('/cart');
  } catch (error) {
    console.error("Ошибка добавления в корзину:", error);
  }
};

provide("addToCart", addToCart);
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <div v-for="product in products" :key="product.id">
      <itemComponent :product="product"/>
    </div>
  </div>
</template>
