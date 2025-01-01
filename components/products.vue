<template>
  <div>
    <h1>Products</h1>
    <h1 v-if="products === null">no data</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
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

const {data: products} = await useFetch<Product[]>('http://nginx-shop/api/products/random')
</script>
