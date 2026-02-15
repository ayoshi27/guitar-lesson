<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type Direction = 'note-to-interval' | 'interval-to-note'
type BaseMode = 'random' | 'fixed'

type IntervalDef = {
  id: string
  label: string
  semitones: number
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const INTERVALS: IntervalDef[] = [
  { id: 'm2', label: 'm2', semitones: 1 },
  { id: 'M2', label: 'M2', semitones: 2 },
  { id: 'm3', label: 'm3', semitones: 3 },
  { id: 'M3', label: 'M3', semitones: 4 },
  { id: 'P4', label: 'P4', semitones: 5 },
  { id: 'aug4_dim5', label: 'aug4/dim5', semitones: 6 },
  { id: 'P5', label: 'P5', semitones: 7 },
  { id: 'm6', label: 'm6', semitones: 8 },
  { id: 'M6', label: 'M6', semitones: 9 },
  { id: 'm7', label: 'm7', semitones: 10 },
  { id: 'M7', label: 'M7', semitones: 11 },
]

const direction = ref<Direction>('note-to-interval')
const baseMode = ref<BaseMode>('random')
const fixedBaseNote = ref('C')

const started = ref(false)
const revealed = ref(false)
const questionCount = ref(0)

const currentBaseNote = ref('')
const currentTargetNote = ref('')
const currentInterval = ref<IntervalDef | null>(null)

const randomItem = <T,>(items: T[]): T => {
  if (items.length === 0) {
    throw new Error('items must not be empty')
  }
  return items[Math.floor(Math.random() * items.length)] as T
}

const addSemitones = (note: string, semitones: number): string => {
  const start = NOTES.indexOf(note)
  if (start < 0) return note
  return NOTES[(start + semitones) % NOTES.length] ?? note
}

const FLAT_FIRST_MAP: Record<string, string> = {
  'C#': 'D♭',
  'D#': 'E♭',
  'F#': 'G♭',
  'G#': 'A♭',
  'A#': 'B♭',
}

const formatFlatFirst = (sharpBasedNote: string): string => {
  const flatName = FLAT_FIRST_MAP[sharpBasedNote]
  if (!flatName) return sharpBasedNote
  return `${flatName} (${sharpBasedNote})`
}

const generateQuestion = (): void => {
  const base = baseMode.value === 'random' ? randomItem(NOTES) : fixedBaseNote.value
  const interval = randomItem(INTERVALS)
  const target = addSemitones(base, interval.semitones)

  currentBaseNote.value = base
  currentInterval.value = interval
  currentTargetNote.value = target
  revealed.value = false
  questionCount.value += 1
  started.value = true
}

const startQuiz = (): void => {
  questionCount.value = 0
  generateQuestion()
}

const showAnswer = (): void => {
  if (!started.value) return
  revealed.value = true
}

const nextQuestion = (): void => {
  if (!started.value) return
  generateQuestion()
}

const onKeydown = (event: KeyboardEvent): void => {
  const key = event.key.toLowerCase()
  if (key === 's') {
    startQuiz()
    return
  }
  if (key === 'c') {
    showAnswer()
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
  if (!currentInterval.value) return ''
  if (direction.value === 'note-to-interval') {
    return `答え: ${currentInterval.value.label}`
  }
  return `答え: ${formatFlatFirst(currentTargetNote.value)}`
})
</script>

<template>
  <section class="panel">
    <h1>音程反復トレーニング</h1>
    <p class="sub">基準音と音程の対応を素早く思い出す練習</p>

    <div class="controls">
      <label>
        出題方向
        <select v-model="direction">
          <option value="note-to-interval">音名 → 音程</option>
          <option value="interval-to-note">音程 → 音名</option>
        </select>
      </label>

      <label>
        基準音
        <select v-model="baseMode">
          <option value="random">ランダム</option>
          <option value="fixed">固定</option>
        </select>
      </label>

      <label v-if="baseMode === 'fixed'">
        固定する音
        <select v-model="fixedBaseNote">
          <option v-for="note in NOTES" :key="note" :value="note">{{ note }}</option>
        </select>
      </label>
    </div>

    <div class="qa-card">
      <p class="count">Question {{ questionCount || '-' }}</p>
      <p class="question" v-if="started && currentInterval">
        <template v-if="direction === 'note-to-interval'">
          基準音 <strong>{{ formatFlatFirst(currentBaseNote) }}</strong> から
          <strong>{{ formatFlatFirst(currentTargetNote) }}</strong> までの音程は？
        </template>
        <template v-else>
          基準音 <strong>{{ formatFlatFirst(currentBaseNote) }}</strong> から
          <strong>{{ currentInterval.label }}</strong> の音は？
        </template>
      </p>
      <p class="question" v-else>Startを押して開始</p>
      <p class="answer" :class="{ visible: revealed }">
        {{ started && revealed ? answerText : '答えはCheckで表示' }}
      </p>
    </div>

    <div class="actions">
      <button class="primary" @click="startQuiz">Start</button>
      <button :disabled="!started" @click="showAnswer">Check</button>
      <button :disabled="!started" @click="nextQuestion">Next</button>
    </div>
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

.controls {
  display: grid;
  gap: 0.8rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

label {
  display: grid;
  gap: 0.3rem;
  font-weight: 600;
  color: #493914;
}

select {
  border: 1px solid #b9a064;
  border-radius: 10px;
  padding: 0.5rem 0.65rem;
  font-size: 1rem;
  background: #fffdf7;
}

.qa-card {
  margin-top: 1.2rem;
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

.question {
  margin: 0.3rem 0 0;
  font-size: 1.2rem;
  color: #2a2111;
  min-height: 2.2em;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.answer {
  margin-top: 0.8rem;
  padding: 0.8rem;
  border-radius: 10px;
  background: #fdf4dc;
  color: #8c4f00;
  font-weight: 700;
  min-height: 2.8em;
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

@media (max-width: 700px) {
  .panel {
    padding: 1rem;
    border-radius: 16px;
  }

  .sub {
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .controls {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .qa-card {
    margin-top: 1rem;
    padding: 0.9rem;
  }

  .question {
    font-size: 1.08rem;
    min-height: 3em;
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

  .question {
    font-size: 1rem;
  }
}
</style>
