<script setup lang="ts">
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import { useRuntimeConfig } from "#app";
import type { Product } from "~/types/ProductTypes";
import { parse } from 'cookie';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;
const authStore = useAuthStore();
const router = useRouter();

const route = useRoute();
const {data: product} = await useFetch<Product>(`${baseURL}/api/products/${route.params.id}`, {
  credentials: 'include',
})

const addToCart = async () => {
  try {
    await authStore.fetchCsrfToken();
    const cookies = parse(document.cookie);
    const csrfToken = cookies['XSRF-TOKEN'] ?? '';

    await $fetch(`${baseURL}/api/cart`, {
      method: "POST",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
      body: {
        product_id: product.value?.id,
        quantity: 1
      },
    });

    await navigateTo('/cart');
  } catch (error) {
    console.error("Ошибка добавления в корзину:", error);
  }
};

const preOrder = () => {
  navigateTo(`/pre-order/${route.params.id}`);
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">

    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <div class="bg-gray-100 dark:bg-gray-800 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex md:flex-row items-center">
            <div class="md:flex-1 w-1/2 h-1/2 px-4 mb-4 md:mb-0 flex">
              <div class="w-full h-full rounded-lg bg-gray-300 dark:bg-gray-700 overflow-hidden">
                <img class="w-full h-full object-cover" src="public/images/no-image.jpg"
                     alt="Product Image">
              </div>
            </div>
            <div class="md:flex-1 px-4">
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">{{ product.name }}</h2>
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Описание: {{ product.description }}
              </p>
              <div class="flex mb-6">
                <div class="mr-6">
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Цена:</span>
                  <span class="text-lg text-gray-600 dark:text-gray-300">{{ product.price }} руб</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700 dark:text-gray-300">Товар:</span>
                  <span
                      class="text-gray-600 dark:text-gray-300">{{ product.is_available ? 'В наличии' : 'Нет в наличии' }}</span>
                </div>
              </div>
            </div>
            <div class="w-1/2 px-2">
              <!-- Предзаказ -->
              <div v-if="product?.quantity === 0">
                <button
                    @click="preOrder"
                    class="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Под заказ
                </button>
              </div>

              <!-- Добавление в корзину -->
              <div v-else>
                <form @submit.prevent="addToCart">
                  <input type="hidden" :value="product?.id" />
                  <input type="hidden" :value="1" />
                  <button
                      type="submit"
                      class="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Добавить в корзину
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>


    <FooterComponent />
  </div>
</template>