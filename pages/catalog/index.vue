<script setup lang="ts">
import itemComponent from "~/components/Item.vue";
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import { useRuntimeConfig } from "#app";
import type { ApiResponse, Product } from "~/types/ProductTypes";

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;

const page = ref(1);
const products = ref<Product[]>([]);
const totalPages = ref(0);
const isLoading = ref(false);

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    const { data } = await useFetch<ApiResponse>(`${baseURL}/api/products?page=${page.value}`);
    if (data.value) {
      products.value = data.value.data;
      totalPages.value = data.value.last_page;
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  } finally {
    isLoading.value = false;
  }
};

await fetchProducts();

const goToPage = async (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage;
    await fetchProducts();
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">

    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <h1 class="text-3xl font-bold flex items-center justify-center mb-16 mt-10">Каталог</h1>

      <div v-if="isLoading" class="flex justify-center items-center">
        <span>Загрузка...</span>
      </div>

      <div v-else>
        <div class="flex flex-wrap justify-center">
          <div v-for="product in products" :key="product.id">
            <itemComponent :product="product" />
          </div>
        </div>

        <div class="flex items-center justify-center m-auto mt-8 w-1/4">
          <button
              @click="goToPage(page - 1)"
              :disabled="page === 1"
              class="flex items-center justify-center px-4 h-10 w-1/2 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg
              hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            Previous
          </button>

          <button
              @click="goToPage(page + 1)"
              :disabled="page === totalPages"
              class="flex items-center justify-center px-4 h-10 w-1/2 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg
              hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:pointer-events-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>