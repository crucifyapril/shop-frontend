<script setup lang="ts">
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import { useRuntimeConfig } from "#app";
import type { Product } from "~/types/ProductTypes";
import type { PreOrderForm } from "~/types/PreOrderTypes";
import { parse } from 'cookie';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;
const authStore = useAuthStore();
const route = useRoute();

const { data: product } = await useFetch<Product>(`${baseURL}/api/products/${route.params.id}`, {
  credentials: 'include',
});

const formData = ref<PreOrderForm>({
  product_id: Number(route.params.id),
  email: authStore.user?.email ?? '',
  description: ''
});

const errors = ref<string[]>([]);
const successMessage = ref<string>('');

const submitPreOrder = async () => {
  try {
    errors.value = [];
    successMessage.value = '';

    await authStore.fetchCsrfToken();
    const cookies = parse(document.cookie);
    const csrfToken = cookies['XSRF-TOKEN'] ?? '';

    const response = await $fetch<{ message: string }>(`${baseURL}/api/pre-order/submit`, {
      method: "POST",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
      body: formData.value,
    });

    successMessage.value = response.message;

    setTimeout(() => {
      navigateTo('/catalog');
    }, 2000);
  } catch (error: any) {
    if (error.data?.errors) {
      errors.value = Object.values(error.data.errors).flat() as string[];
    } else if (error.data?.message) {
      errors.value = [error.data.message];
    } else {
      errors.value = ['Произошла ошибка при отправке предзаказа'];
    }
    console.error("Ошибка отправки предзаказа:", error);
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">
    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold flex items-center justify-center mb-8 mt-10">
        Мы отправим вам на почту уведомление о поступлении
      </h1>

      <div v-if="product" class="mb-6 text-center">
        <p class="text-xl text-gray-300">Товар: <span class="font-semibold">{{ product.name }}</span></p>
        <p class="text-lg text-gray-400">Цена: {{ product.price }} руб.</p>
      </div>

      <div v-if="errors.length > 0" class="mb-5 text-red-500 text-center">
        <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
      </div>

      <div v-if="successMessage" class="mb-5 text-green-500 text-center">
        <p>{{ successMessage }}</p>
      </div>

      <form @submit.prevent="submitPreOrder" class="max-w-2xl mx-auto">
        <div class="mb-6">
          <div class="mb-8">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Электронная почта
            </label>
            <input
              type="email"
              v-model="formData.email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="johnDoe@email.com"
              required
            />
          </div>
          <div class="mb-6">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Комментарий
            </label>
            <input
              type="text"
              id="description"
              v-model="formData.description"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
            />
          </div>
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Отправить
        </button>
      </form>
    </main>

    <FooterComponent />
  </div>
</template>
