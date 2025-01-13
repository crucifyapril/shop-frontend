<script setup lang="ts">
import { useRuntimeConfig } from '#app';
import itemComponent from "~/components/Item.vue";

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;

interface Product {
  id: number
  name: string
  description: string
  price: number
}

const {data: products} = await useFetch<Product[]>(`${baseURL}/api/products/random`)
</script>

<template>
  <div class="flex flex-wrap justify-center">
    <div v-for="product in products" :key="product.id">
      <itemComponent :product="product"/>
    </div>
  </div>
</template>
