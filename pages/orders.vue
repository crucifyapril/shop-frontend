<script setup lang="ts">

import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">

    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <h1 class="flex items-center justify-center text-3xl font-bold mt-10 mb-16">Мои заказы</h1>



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
          <tbody>
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              order id
            </th>
            <td class="px-6 py-4 text-center">
              user.name | user.email
            </td>
            <td class="px-6 py-4 text-center">
              status.name
            </td>
            <td class="px-6 py-4 text-center">
              total_amount руб
            </td>
            <td class="px-6 py-4 text-center">
              created_at
            </td>
            <td class="px-6 py-4 text-center">
              <a href="#">
                <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  Перейти
                </button>
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </main>


    <FooterComponent />
  </div>
</template>

<style scoped>

</style>