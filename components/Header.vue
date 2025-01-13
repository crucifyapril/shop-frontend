<script setup lang="ts">
import {useAuthStore} from '~/stores/auth';
import {computed} from 'vue';

const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuth());
const userName = computed(() => authStore.user?.name || 'Гость');

const logout = async () => {
  await authStore.logout();
};
</script>

<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <a href="/" class="flex items-center">
          <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Logo Shop"/>
          <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Logo Shop</span>
        </a>

        <div class="flex items-center lg:order-2">
          <!-- Корзина -->
          <a
              v-if="isAuthenticated"
              href="/cart"
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium
              rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            Корзина
          </a>

          <!-- Вход -->
          <a
              v-if="!isAuthenticated"
              href="/login"
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium
              rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            Вход в личный кабинет
          </a>

          <!-- Выход -->
          <button
              v-if="isAuthenticated"
              @click="logout"
              class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium
              rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          >
            Выйти
          </button>

          <!-- Пользователь -->
          <div>{{ userName}}</div>
        </div>

        <!-- Навигация -->
        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <a
                  :class="{
                  'text-primary-700 bg-primary-700': $route.name === 'index',
                  'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 dark:text-gray-400 dark:hover:text-white': $route.name !== 'index'
                }"
                  href="/"
                  class="block py-2 pr-4 pl-3 rounded lg:bg-transparent lg:p-0"
              >
                Главная
              </a>
            </li>
            <li>
              <a
                  :class="{
                  'text-primary-700 bg-primary-700': $route.name === 'catalog',
                  'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 dark:text-gray-400 dark:hover:text-white': $route.name !== 'catalog'
                }"
                  href="/catalog"
                  class="block py-2 pr-4 pl-3 rounded lg:bg-transparent lg:p-0"
              >
                Каталог товаров
              </a>
            </li>
            <li v-if="isAuthenticated">
              <a
                  :class="{
                  'text-primary-700 bg-primary-700': $route.name === 'orders',
                  'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 dark:text-gray-400 dark:hover:text-white': $route.name !== 'orders'
                }"
                  href="/orders"
                  class="block py-2 pr-4 pl-3 rounded lg:bg-transparent lg:p-0"
              >
                Мои заказы
              </a>
            </li>
            <li v-if="authStore.user?.role === 'admin'">
              <a
                  :class="{
                  'text-primary-700 bg-primary-700': $route.name === 'admin',
                  'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 dark:text-gray-400 dark:hover:text-white': $route.name !== 'admin'
                }"
                  href="/admin"
                  class="block py-2 pr-4 pl-3 rounded lg:bg-transparent lg:p-0"
              >
                Админ панель
              </a>
            </li>
            <li>
              <a
                  :class="{
                  'text-primary-700 bg-primary-700': $route.name === 'about',
                  'text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:hover:text-primary-700 dark:text-gray-400 dark:hover:text-white': $route.name !== 'about'
                }"
                  href="/about"
                  class="block py-2 pr-4 pl-3 rounded lg:bg-transparent lg:p-0"
              >
                О нас
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
