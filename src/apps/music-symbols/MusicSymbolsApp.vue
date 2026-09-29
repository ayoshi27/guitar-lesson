<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SymbolGlyph from './SymbolGlyph.vue'
import { CATEGORIES, SYMBOLS, type SymbolCategoryId, type SymbolDef } from './symbols'

type Mode = 'learn' | 'quiz'

const mode = ref<Mode>('learn')
const selectedCategoryIds = ref<Set<SymbolCategoryId>>(new Set(CATEGORIES.map((c) => c.id)))

const toggleCategory = (id: SymbolCategoryId): void => {
  const next = new Set(selectedCategoryIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedCategoryIds.value = next
}

const filteredSymbols = computed(() => SYMBOLS.filter((s) => selectedCategoryIds.value.has(s.category)))

const symbolsByCategory = computed(() =>
  CATEGORIES.map((cat) => ({
    ...cat,
    symbols: filteredSymbols.value.filter((s) => s.category === cat.id),
  })).filter((group) => group.symbols.length > 0),
)

const started = ref(false)
const revealed = ref(false)
const questionCount = ref(0)
const currentSymbol = ref<SymbolDef | null>(null)

const randomItem = <T,>(items: T[]): T => {
  if (items.length === 0) {
    throw new Error('items must not be empty')
  }
  return items[Math.floor(Math.random() * items.length)] as T
}

const generateQuestion = (): void => {
  const pool = filteredSymbols.value
  if (pool.length === 0) return
  currentSymbol.value = randomItem(pool)
  revealed.value = false
  questionCount.value += 1
  started.value = true
}

const startQuiz = (): void => {
  questionCount.value = 0
  generateQuestion()
}

const checkAnswer = (): void => {
  if (!started.value || !currentSymbol.value) return
  revealed.value = true
}

const nextQuestion = (): void => {
  if (!started.value) return
  generateQuestion()
}

const onKeydown = (event: KeyboardEvent): void => {
  if (mode.value !== 'quiz') return
  const targetTag = (event.target as HTMLElement | null)?.tagName?.toLowerCase()
  if (targetTag === 'input' || targetTag === 'select' || targetTag === 'textarea') {
    return
  }
  const key = event.key.toLowerCase()
  if (key === 's') {
    startQuiz()
    return
  }
  if (key === 'c') {
    checkAnswer()
    return
  }
  if (key === 'n') {
    nextQuestion()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

const answerText = computed(() => {
  if (!started.value || !currentSymbol.value) return ''
  return `答え: ${currentSymbol.value.meaning}`
})
</script>

<template>
  <section class="panel">
    <h1>楽譜記号トレーニング</h1>
    <p class="sub">楽譜で使われる記号とその意味を学習・テストできるトレーニング</p>

    <div class="mode-tabs">
      <button type="button" :class="{ active: mode === 'learn' }" @click="mode = 'learn'">学習</button>
      <button type="button" :class="{ active: mode === 'quiz' }" @click="mode = 'quiz'">テスト</button>
    </div>

    <fieldset class="category-filter">
      <legend>対象にする記号の種類</legend>
      <label v-for="cat in CATEGORIES" :key="cat.id" class="checkbox-label">
        <input
          type="checkbox"
          :checked="selectedCategoryIds.has(cat.id)"
          @change="toggleCategory(cat.id)"
        />
        {{ cat.label }}
      </label>
    </fieldset>

    <template v-if="mode === 'learn'">
      <div class="learn-list">
        <div v-for="group in symbolsByCategory" :key="group.id" class="learn-group">
          <h2>{{ group.label }}</h2>
          <ul class="symbol-grid">
            <li v-for="sym in group.symbols" :key="sym.id" class="symbol-card">
              <div class="glyph-box">
                <SymbolGlyph :symbol="sym" />
              </div>
              <p class="meaning">{{ sym.meaning }}</p>
            </li>
          </ul>
        </div>
        <p v-if="symbolsByCategory.length === 0" class="empty-note">
          対象にする記号の種類を1つ以上選んでください
        </p>
      </div>
    </template>

    <template v-else>
      <div class="qa-card">
        <p class="count">Question {{ questionCount || '-' }}</p>
        <div class="symbol-area">
          <div v-if="started && currentSymbol" class="glyph-box big">
            <SymbolGlyph :symbol="currentSymbol" />
          </div>
          <p v-else class="placeholder">Startを押して開始</p>
        </div>
        <p class="answer" :class="{ visible: revealed }">
          {{ started ? (revealed ? answerText : '答えはCheckで表示') : '' }}
        </p>
      </div>

      <div class="actions">
        <button class="primary" :disabled="filteredSymbols.length === 0" @click="startQuiz">Start</button>
        <button :disabled="!started" @click="checkAnswer">Check</button>
        <button :disabled="!started" @click="nextQuestion">Next</button>
      </div>
      <p v-if="filteredSymbols.length === 0" class="empty-note">
        対象にする記号の種類を1つ以上選んでください
      </p>
    </template>
  </section>
</template>

<style scoped>
.panel {
  background: linear-gradient(155deg, #fffef8, #fff7e2);
  border: 1px solid #f0d8a8;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 24px 40px rgba(89, 64, 9, 0.18);
}

h1 {
  margin: 0;
  color: #2f2612;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
}

.sub {
  margin: 0.4rem 0 1.2rem;
  color: #6a5630;
}

.mode-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-tabs button {
  border: 1px solid #b99a56;
  background: #fff9ea;
  color: #473715;
  border-radius: 10px;
  padding: 0.6rem 1.1rem;
  min-height: 44px;
  font-weight: 700;
}

.mode-tabs button.active {
  background: #f5b029;
  border-color: #d7971b;
  color: #2c1d00;
}

.category-filter {
  border: 1px solid #dbc79a;
  border-radius: 14px;
  background: #fff;
  padding: 0.8rem 1rem 1rem;
  margin: 0 0 1.2rem;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.category-filter legend {
  grid-column: 1 / -1;
  font-weight: 700;
  color: #493914;
  padding: 0 0.2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #493914;
}

.checkbox-label input[type='checkbox'] {
  width: 1.1rem;
  height: 1.1rem;
}

.learn-group {
  margin-bottom: 1.2rem;
}

.learn-group h2 {
  margin: 0 0 0.6rem;
  font-size: 1.05rem;
  color: #2a2111;
}

.symbol-grid {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.symbol-card {
  border: 1px solid #dbc79a;
  border-radius: 14px;
  background: #fff;
  padding: 0.8rem;
  display: grid;
  gap: 0.5rem;
  justify-items: center;
  text-align: center;
}

.glyph-box {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #2a2111;
}

.glyph-box.big {
  width: 120px;
  height: 120px;
  font-size: 3.4rem;
}

.meaning {
  margin: 0;
  font-size: 0.85rem;
  color: #564626;
  line-height: 1.4;
}

.qa-card {
  border-radius: 14px;
  border: 1px solid #dbc79a;
  background: #fff;
  padding: 1rem;
}

.count {
  margin: 0;
  color: #836a34;
  font-size: 0.9rem;
}

.symbol-area {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
}

.placeholder {
  margin: 0;
  color: #8c7a4a;
}

.answer {
  margin-top: 0.8rem;
  padding: 0.8rem;
  border-radius: 10px;
  background: #fdf4dc;
  color: #8c4f00;
  font-weight: 700;
  min-height: 2.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.answer.visible {
  background: #ffe9ba;
}

.actions {
  margin-top: 1.1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

button {
  border: 1px solid #b99a56;
  background: #fff9ea;
  color: #473715;
  border-radius: 10px;
  padding: 0.72rem 1rem;
  min-height: 44px;
  font-weight: 700;
}

button.primary {
  background: #f5b029;
  border-color: #d7971b;
  color: #2c1d00;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-note {
  margin-top: 0.8rem;
  color: #8c4f00;
  font-weight: 600;
}

@media (max-width: 700px) {
  .panel {
    padding: 1rem;
    border-radius: 16px;
  }

  .sub {
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .category-filter {
    grid-template-columns: 1fr;
  }

  .qa-card {
    padding: 0.9rem;
  }

  .answer {
    min-height: 3.1em;
    font-size: 1rem;
  }

  .actions {
    margin-top: 0.9rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
  }

  button {
    width: 100%;
  }
}

@media (max-width: 420px) {
  h1 {
    font-size: 1.3rem;
  }

  .count {
    font-size: 0.84rem;
  }
}
</style>
