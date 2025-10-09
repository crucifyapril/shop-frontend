<script setup lang="ts">
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import {ref, onMounted} from "vue";
import {useRuntimeConfig} from "#app";
import {parse} from 'cookie';
import {useAuthStore} from '~/stores/auth';

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;
const authStore = useAuthStore();

// Реактивное состояние корзины
const cart = ref([]);
const isLoading = ref(false);

const getCsrfToken = (): string => {
  if (import.meta.client) {
    const cookies = parse(document.cookie);
    return cookies['XSRF-TOKEN'] ?? '';
  }
  return '';
};

// Загрузка корзины
const loadCart = async () => {
  if (!import.meta.client) return;

  try {
    isLoading.value = true;
    const result = await $fetch(`${baseURL}/api/cart`, {
      credentials: 'include',
    });
    cart.value = result;
  } catch (error) {
    console.error("Ошибка загрузки корзины", error);
  } finally {
    isLoading.value = false;
  }
};

// Добавление товара в корзину
const addToCart = async (productId: number) => {
  if (!import.meta.client) return;

  try {
    await authStore.fetchCsrfToken();
    const csrfToken = getCsrfToken();

    await $fetch(`${baseURL}/api/cart`, {
      method: "POST",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
      body: { product_id: productId, quantity: 1 },
    });
    await loadCart();
  } catch (error) {
    console.error("Ошибка добавления товара", error);
  }
};

// Обновление количества товара в корзине
const updateQuantity = async (productId: number, quantity: number) => {
  if (!import.meta.client) return;

  try {
    await authStore.fetchCsrfToken();
    const csrfToken = getCsrfToken();

    await $fetch(`${baseURL}/api/cart`, {
      method: "POST",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
      body: { product_id: productId, quantity: quantity },
    });
    await loadCart();
  } catch (error) {
    console.error("Ошибка обновления количества", error);
  }
};

// Удаление товара из корзины
const removeItem = async (productId: number) => {
  if (!import.meta.client) return;

  try {
    await authStore.fetchCsrfToken();
    const csrfToken = getCsrfToken();

    await $fetch(`${baseURL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
    });
    await loadCart();
  } catch (error) {
    console.error("Ошибка удаления товара", error);
  }
};

// Очистка корзины
const clearCart = async () => {
  if (!import.meta.client) return;

  try {
    await authStore.fetchCsrfToken();
    const csrfToken = getCsrfToken();

    await $fetch(`${baseURL}/api/cart`, {
      method: "DELETE",
      headers: {'X-XSRF-TOKEN': csrfToken},
      credentials: 'include',
    });
    cart.value = [];
  } catch (error) {
    console.error("Ошибка очистки корзины", error);
  }
};

// Загрузить корзину при открытии страницы (только на клиенте)
onMounted(async () => {
  await loadCart();
});

defineExpose({ addToCart, loadCart, updateQuantity, removeItem, clearCart, cart });
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">
    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <h1 class="text-3xl font-bold flex items-center justify-center mb-16 mt-10">Корзина</h1>

      <div class="relative overflow-x-auto m-auto w-2/3">
        <table class="w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Наименование товара</th>
            <th scope="col" class="px-6 py-3">Количество</th>
            <th scope="col" class="px-6 py-3">Цена</th>
            <th scope="col" class="px-6 py-3">Сумма</th>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="cart.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              Корзина пуста
            </td>
          </tr>
          <tr
              v-for="item in cart"
              :key="item.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 text-center">{{ item.quantity }}</td>
            <td class="px-6 py-4 text-center">{{ item.price }} руб</td>
            <td class="px-6 py-4 text-center">
              {{ item.price * item.quantity }} руб
            </td>
            <td class="px-2 py-2 text-center">
              <button
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                -
              </button>
            </td>
            <td class="px-2 py-2 text-center">
              <button
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                +
              </button>
            </td>
            <td class="px-2 py-2 text-center">
              <button
                  @click="removeItem(item.id)"
                  class="bg-red-500 text-white py-2 px-4 rounded-full font-bold hover:bg-red-600"
              >
                Удалить
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-if="cart.length > 0" class="mt-6 flex justify-end">
          <button
              @click="clearCart"
          >
            Очистить корзину
          </button>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>