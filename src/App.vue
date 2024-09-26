<script setup>
import AstVisualizer from './components/AstVisualizer.vue'
import { useAstStore } from './stores/astStore'

const astStore = useAstStore()
</script>

<template>
  <div id="app">
    <AstVisualizer />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  color: #333;
}
</style>