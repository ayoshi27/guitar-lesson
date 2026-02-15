<template>
  <section class="not-found">
    <h1>ページが見つかりません</h1>
    <p>トップページからアプリを選択してください。</p>
    <RouterLink to="/">トレーニング一覧へ</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  background: #fffef8;
  border: 1px solid #f0d8a8;
  border-radius: 16px;
  padding: 1rem;
}

h1 {
  margin-top: 0;
  font-size: 1.2rem;
}

a {
  color: #3e2e0a;
  font-weight: 700;
}
</style>
