<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showBackLink = computed(() => route.path !== '/')
</script>

<template>
  <main class="app-shell">
    <nav v-if="showBackLink" class="top-nav">
      <RouterLink to="/">← 一覧に戻る</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>

<style scoped>
.app-shell {
  width: min(900px, 100%);
}

.top-nav {
  margin-bottom: 0.65rem;
}

.top-nav a {
  color: #3e2e0a;
  font-weight: 700;
}
</style>
