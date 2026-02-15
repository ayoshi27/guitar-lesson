<script setup lang="ts">
import { TRAINING_APP_CARDS } from '../apps/catalog'
</script>

<template>
  <section class="index-panel">
    <h1>トレーニング一覧</h1>
    <p class="lead">作成済みの音楽理論トレーニングにここからアクセスできます。</p>

    <ul class="app-list">
      <li v-for="app in TRAINING_APP_CARDS" :key="app.id" class="app-card">
        <h2>{{ app.name }}</h2>
        <p>{{ app.description }}</p>
        <RouterLink class="open-link" :to="app.path">開く</RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.index-panel {
  background: linear-gradient(155deg, #fffef8, #fff7e2);
  border: 1px solid #f0d8a8;
  border-radius: 20px;
  padding: 1.2rem;
  box-shadow: 0 24px 40px rgba(89, 64, 9, 0.18);
}

h1 {
  margin: 0;
  color: #2f2612;
  font-size: clamp(1.35rem, 2.2vw, 1.9rem);
}

.lead {
  margin: 0.45rem 0 1rem;
  color: #6a5630;
}

.app-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.8rem;
}

.app-card {
  border: 1px solid #dbc79a;
  border-radius: 14px;
  background: #fff;
  padding: 0.95rem;
}

h2 {
  margin: 0;
  font-size: 1.05rem;
  color: #2a2111;
}

.app-card p {
  margin: 0.35rem 0 0.8rem;
  color: #564626;
}

.open-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #d7971b;
  text-decoration: none;
  background: #f5b029;
  color: #2c1d00;
  font-weight: 700;
}

@media (max-width: 700px) {
  .index-panel {
    border-radius: 16px;
    padding: 1rem;
  }
}
</style>
