<script setup lang="ts">
import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  if (!import.meta.client) {
    console.error("Логин доступен только на клиентской стороне!");
    return;
  }

  try {
    await authStore.fetchCsrfToken();
    await authStore.login(email.value, password.value);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
  }

  if (authStore.isAuth()) {
    await router.push('/');
    return;
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">
    <HeaderComponent/>

    <main class="flex-grow container mx-auto py-8">
      <h1 class="text-3xl font-bold flex items-center justify-center mb-16 mt-10">Вход в личный кабинет</h1>

      <form @submit.prevent="handleLogin" class="max-w-sm mx-auto">
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Электронная
            Почта</label>
          <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Name@email.com"
              required
          />
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
          <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Введите пароль"
              required
          />
        </div>
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            />
          </div>
          <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Запомнить меня</label>
        </div>
        <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Войти
        </button>
      </form>

      <div class="mt-4 text-center">
        <span class="text-sm text-white dark:text-white">
          Вы еще не зарегистрированы? <a href="/register" class="hover:underline text-blue-500">Регистрация</a>
        </span>
      </div>
    </main>

    <FooterComponent/>
  </div>
</template>
