<script setup lang="ts">

import HeaderComponent from "~/components/Header.vue";
import FooterComponent from "~/components/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-900 text-gray-100 w-full">

    <HeaderComponent />

    <main class="flex-grow container mx-auto py-8">
      <h1 class="text-3xl font-bold flex items-center justify-center mb-16 mt-10">Каталог</h1>

      <products apiUrl="/api/products" />
    </main>


    <FooterComponent />
  </div>
</template>

<style scoped>

</style>