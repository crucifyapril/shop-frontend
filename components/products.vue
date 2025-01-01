<template>
  <div>
    <h1>Products</h1>
    <h1 v-if="data === null">no data</h1>
    <ul>
      <li v-for="product in data" :key="product.id">
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p>Price: {{ product.price }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  description: string
  price: number
}

const { data } = await useFetch<Product[]>('http://localhost/api/products')


</script>