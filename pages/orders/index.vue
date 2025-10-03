<script setup lang="ts">
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import { useRuntimeConfig } from "#app";
import type { ApiResponse, Order } from "~/types/OrderTypes";
import {useAuthStore} from '~/stores/auth';
import {computed} from 'vue';

const authStore = useAuthStore();

const userName = computed(() => authStore.user?.name || 'Гость');

const config = useRuntimeConfig();
const baseURL = config.public.apiBase;

const page = ref(1);
const orders = ref<Order[]>([]);
const totalPages = ref(0);
const isLoading = ref(false);

const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const { data } = await useFetch<ApiResponse>(`${baseURL}/api/orders?page=${page.value}`, {
      credentials: 'include',
    });
    if (data.value) {
      orders.value = data.value.data;
      totalPages.value = data.value.last_page;
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  } finally {
    isLoading.value = false;
  }
};

await fetchOrders();

const goToPage = async (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage;
    await fetchOrders();
  }
};

function formatDate(dateString: string) {
  const parsedDate = new Date(dateString);
  return `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds().toString().padStart(2, '0')}`;
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">

    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <h1 class="flex items-center justify-center text-3xl font-bold mt-10 mb-16">Мои заказы</h1>

      <div v-if="isLoading" class="flex justify-center items-center">
        <span>Загрузка...</span>
      </div>


      <div class="relative overflow-x-auto m-auto w-2/3">
        <table class="w-full text-sm rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Номер заказа
            </th>
            <th scope="col" class="px-6 py-3">
              Заказчик
            </th>
            <th scope="col" class="px-6 py-3">
              Статус
            </th>
            <th scope="col" class="px-6 py-3">
              Сумма
            </th>
            <th scope="col" class="px-6 py-3">
              Дата заказа
            </th>
            <th scope="col" class="px-6 py-3">
              Подробнее
            </th>
          </tr>
          </thead>
          <tbody v-for="order in orders" :key="order.id">
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ order.id }}
            </th>
            <td class="px-6 py-4 text-center">
              {{ userName }}
            </td>
            <td class="px-6 py-4 text-center">
              {{ order.status_id === 1 ? 'Pending' : 'unknown status' }}
            </td>
            <td class="px-6 py-4 text-center">
              {{ order.total_amount }} руб
            </td>
            <td class="px-6 py-4 text-center">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-6 py-4 text-center">
              <NuxtLink
                  :to="`/orders/${order.id}`"
                  class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Перейти
              </NuxtLink>
            </td>
          </tr>
          </tbody>
        </table>
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
    </main>


    <FooterComponent />
  </div>
</template>

<style scoped>

</style>