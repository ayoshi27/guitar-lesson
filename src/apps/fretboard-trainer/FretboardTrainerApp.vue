<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type DisplayMode = 'note' | 'interval' | 'both'
type ScaleId = 'none' | 'major' | 'natural-minor' | 'major-pentatonic' | 'minor-pentatonic'

type StringDef = {
  string: number
  openNote: string
}

type Position = {
  string: number
  fret: number
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const STRING_DEFS: StringDef[] = [
  { string: 1, openNote: 'E' },
  { string: 2, openNote: 'B' },
  { string: 3, openNote: 'G' },
  { string: 4, openNote: 'D' },
  { string: 5, openNote: 'A' },
  { string: 6, openNote: 'E' },
]

const INTERVAL_LABELS: Record<number, string> = {
  0: 'R',
  1: 'm2',
  2: 'M2',
  3: 'm3',
  4: 'M3',
  5: 'P4',
  6: 'aug4/dim5',
  7: 'P5',
  8: 'm6',
  9: 'M6',
  10: 'm7',
  11: 'M7',
}

const SCALE_OPTIONS: Array<{ id: ScaleId; label: string; intervals: number[] }> = [
  { id: 'none', label: 'なし', intervals: [] },
  { id: 'major', label: 'メジャースケール', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'natural-minor', label: 'ナチュラルマイナー', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'major-pentatonic', label: 'メジャーペンタトニック', intervals: [0, 2, 4, 7, 9] },
  { id: 'minor-pentatonic', label: 'マイナーペンタトニック', intervals: [0, 3, 5, 7, 10] },
]

const FLAT_FIRST_MAP: Record<string, string> = {
  'C#': 'D♭',
  'D#': 'E♭',
  'F#': 'G♭',
  'G#': 'A♭',
  'A#': 'B♭',
}

const rootNote = ref('C')
const displayMode = ref<DisplayMode>('interval')
const selectedScale = ref<ScaleId>('none')

const quizStarted = ref(false)
const revealed = ref(false)
const questionCount = ref(0)
const currentQuestion = ref<Position | null>(null)
const notice = ref('')

const fretStart = ref(0)
const fretEnd = ref(24)
const stringStart = ref(1)
const stringEnd = ref(6)

const frets = Array.from({ length: 25 }, (_, i) => i)

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

const formatFlatFirst = (sharpBasedNote: string): string => {
  const flatName = FLAT_FIRST_MAP[sharpBasedNote]
  if (!flatName) return sharpBasedNote
  return `${flatName} (${sharpBasedNote})`
}

const noteIndex = (note: string): number => NOTES.indexOf(note)

const noteAtPosition = (stringNumber: number, fret: number): string => {
  const stringDef = STRING_DEFS.find((def) => def.string === stringNumber)
  if (!stringDef) return 'C'
  const openIdx = noteIndex(stringDef.openNote)
  return NOTES[(openIdx + fret) % NOTES.length] ?? 'C'
}

const intervalFromRoot = (note: string): number => {
  const rootIdx = noteIndex(rootNote.value)
  const noteIdx = noteIndex(note)
  if (rootIdx < 0 || noteIdx < 0) return 0
  return (noteIdx - rootIdx + 12) % 12
}

const noteLabelAtPosition = (stringNumber: number, fret: number): string => {
  const note = noteAtPosition(stringNumber, fret)
  return formatFlatFirst(note)
}

const intervalLabelAtPosition = (stringNumber: number, fret: number): string => {
  const note = noteAtPosition(stringNumber, fret)
  const interval = intervalFromRoot(note)
  return INTERVAL_LABELS[interval] ?? ''
}

const quizLabelVisible = computed(() => !quizStarted.value || revealed.value)

const quizRange = computed(() => ({
  fretMin: Math.min(clamp(fretStart.value, 0, 24), clamp(fretEnd.value, 0, 24)),
  fretMax: Math.max(clamp(fretStart.value, 0, 24), clamp(fretEnd.value, 0, 24)),
  stringMin: Math.min(clamp(stringStart.value, 1, 6), clamp(stringEnd.value, 1, 6)),
  stringMax: Math.max(clamp(stringStart.value, 1, 6), clamp(stringEnd.value, 1, 6)),
}))

const candidatePositions = computed(() => {
  const positions: Position[] = []
  for (let string = quizRange.value.stringMin; string <= quizRange.value.stringMax; string += 1) {
    for (let fret = quizRange.value.fretMin; fret <= quizRange.value.fretMax; fret += 1) {
      const note = noteAtPosition(string, fret)
      if (intervalFromRoot(note) === 0) continue
      positions.push({ string, fret })
    }
  }
  return positions
})

const randomPosition = (positions: Position[]): Position | null => {
  if (positions.length === 0) return null
  return positions[Math.floor(Math.random() * positions.length)] ?? null
}

const setNextQuestion = (): boolean => {
  const next = randomPosition(candidatePositions.value)
  if (!next) {
    currentQuestion.value = null
    notice.value = '出題範囲にルート以外の音がありません。範囲を広げてください。'
    return false
  }
  currentQuestion.value = next
  revealed.value = false
  questionCount.value += 1
  notice.value = ''
  return true
}

const startQuiz = (): void => {
  questionCount.value = 0
  quizStarted.value = true
  setNextQuestion()
}

const checkAnswer = (): void => {
  if (!quizStarted.value || !currentQuestion.value) return
  revealed.value = true
}

const nextQuestion = (): void => {
  if (!quizStarted.value) return
  setNextQuestion()
}

const onKeydown = (event: KeyboardEvent): void => {
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

const isRootPosition = (stringNumber: number, fret: number): boolean => {
  const note = noteAtPosition(stringNumber, fret)
  return intervalFromRoot(note) === 0
}

const isQuestionPosition = (stringNumber: number, fret: number): boolean => {
  if (!currentQuestion.value) return false
  return currentQuestion.value.string === stringNumber && currentQuestion.value.fret === fret
}

const isInQuizRange = (stringNumber: number, fret: number): boolean => {
  return (
    stringNumber >= quizRange.value.stringMin &&
    stringNumber <= quizRange.value.stringMax &&
    fret >= quizRange.value.fretMin &&
    fret <= quizRange.value.fretMax
  )
}

const selectedScaleIntervals = computed(() => {
  return SCALE_OPTIONS.find((scale) => scale.id === selectedScale.value)?.intervals ?? []
})

const isScalePosition = (stringNumber: number, fret: number): boolean => {
  if (selectedScale.value === 'none') return false
  if (!isInQuizRange(stringNumber, fret)) return false
  const note = noteAtPosition(stringNumber, fret)
  const interval = intervalFromRoot(note)
  return selectedScaleIntervals.value.includes(interval)
}

const questionAnswerText = computed(() => {
  if (!currentQuestion.value) return ''
  const note = noteAtPosition(currentQuestion.value.string, currentQuestion.value.fret)
  const interval = INTERVAL_LABELS[intervalFromRoot(note)] ?? ''
  return `答え: ${formatFlatFirst(note)} / ${interval}`
})
</script>

<template>
  <section class="panel">
    <h1>ギター指板トレーニング</h1>
    <p class="sub">キーを基準に、指板上の音名と音程を覚える練習</p>

    <div class="controls">
      <label>
        キー（ルート）
        <select v-model="rootNote">
          <option v-for="note in NOTES" :key="note" :value="note">{{ formatFlatFirst(note) }}</option>
        </select>
      </label>

      <label>
        表示内容
        <select v-model="displayMode">
          <option value="interval">音程（R, m2, M2...）</option>
          <option value="note">音名（C, C#, ...）</option>
          <option value="both">音名 + 音程</option>
        </select>
      </label>

      <label>
        スケールハイライト
        <select v-model="selectedScale">
          <option v-for="scale in SCALE_OPTIONS" :key="scale.id" :value="scale.id">{{ scale.label }}</option>
        </select>
      </label>
    </div>

    <fieldset class="range-box">
      <legend>クイズ出題範囲</legend>
      <div class="range-grid">
        <label>
          フレット開始
          <input v-model.number="fretStart" type="number" min="0" max="24" />
        </label>
        <label>
          フレット終了
          <input v-model.number="fretEnd" type="number" min="0" max="24" />
        </label>
        <label>
          弦開始（1-6）
          <input v-model.number="stringStart" type="number" min="1" max="6" />
        </label>
        <label>
          弦終了（1-6）
          <input v-model.number="stringEnd" type="number" min="1" max="6" />
        </label>
      </div>
      <p class="range-help">
        現在の範囲: {{ quizRange.stringMin }}弦〜{{ quizRange.stringMax }}弦 /
        {{ quizRange.fretMin }}F〜{{ quizRange.fretMax }}F
      </p>
    </fieldset>

    <div class="actions">
      <button class="primary" @click="startQuiz">Start</button>
      <button :disabled="!quizStarted || !currentQuestion" @click="checkAnswer">Check</button>
      <button :disabled="!quizStarted || !currentQuestion" @click="nextQuestion">Next</button>
    </div>

    <p class="quiz-state">
      <template v-if="!quizStarted">
        通常表示: 指板全体に
        {{
          displayMode === 'interval'
            ? '音程'
            : displayMode === 'note'
              ? '音名'
              : '音名 + 音程'
        }}
        を表示中
      </template>
      <template v-else-if="notice">{{ notice }}</template>
      <template v-else-if="revealed">{{ questionAnswerText }}</template>
      <template v-else>Question {{ questionCount }}: ハイライトされたポジションの音名と音程を答える</template>
    </p>

    <div class="fretboard-wrap">
      <div class="fretboard">
        <div class="header-row">
          <div class="string-header">弦\F</div>
          <div
            v-for="fret in frets"
            :key="`head-${fret}`"
            class="fret-header"
            :class="{ nut: fret === 0 }"
          >
            {{ fret }}
          </div>
        </div>

        <div v-for="stringDef in STRING_DEFS" :key="`string-${stringDef.string}`" class="string-row">
          <div class="string-label">{{ stringDef.string }}弦</div>
          <div
            v-for="fret in frets"
            :key="`p-${stringDef.string}-${fret}`"
            class="note-cell"
            :class="{
              root: isRootPosition(stringDef.string, fret),
              target: isQuestionPosition(stringDef.string, fret),
              scaleTone:
                isScalePosition(stringDef.string, fret) &&
                !isRootPosition(stringDef.string, fret) &&
                !isQuestionPosition(stringDef.string, fret),
              nut: fret === 0,
              inRange: isInQuizRange(stringDef.string, fret),
            }"
          >
            <template v-if="quizLabelVisible && isInQuizRange(stringDef.string, fret)">
              <span v-if="displayMode !== 'interval'" class="label-note">{{
                noteLabelAtPosition(stringDef.string, fret)
              }}</span>
              <span v-if="displayMode !== 'note'" class="label-interval">{{
                intervalLabelAtPosition(stringDef.string, fret)
              }}</span>
            </template>
          </div>
        </div>

        <div class="inlay-row">
          <div class="inlay-label">Inlay</div>
          <div v-for="fret in frets" :key="`inlay-${fret}`" class="inlay-cell" :class="{ nut: fret === 0 }">
            <template v-if="[3, 5, 7, 9, 15, 17, 19, 21].includes(fret)">
              <span class="inlay-dot" />
            </template>
            <template v-else-if="fret === 12 || fret === 24">
              <span class="inlay-dot dual top" />
              <span class="inlay-dot dual bottom" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: linear-gradient(160deg, #fffef8, #fff7e2);
  border: 1px solid #f0d8a8;
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 24px 40px rgba(89, 64, 9, 0.18);
}

h1 {
  margin: 0;
  color: #2f2612;
  font-size: clamp(1.25rem, 2.2vw, 1.8rem);
}

.sub {
  margin: 0.35rem 0 0.95rem;
  color: #6a5630;
}

.controls {
  display: grid;
  gap: 0.7rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

label {
  display: grid;
  gap: 0.3rem;
  font-weight: 600;
  color: #493914;
}

select,
input {
  border: 1px solid #b9a064;
  border-radius: 10px;
  padding: 0.5rem 0.65rem;
  font-size: 0.95rem;
  background: #fffdf7;
}

.range-box {
  margin: 0.9rem 0 0;
  border: 1px solid #d8be86;
  border-radius: 12px;
  padding: 0.7rem;
}

.range-box legend {
  padding: 0 0.4rem;
  font-weight: 700;
}

.range-grid {
  display: grid;
  gap: 0.6rem;
  grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
}

.range-help {
  margin: 0.65rem 0 0;
  font-size: 0.9rem;
  color: #6b572e;
}

.actions {
  margin-top: 0.9rem;
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

.quiz-state {
  margin: 0.8rem 0 0.65rem;
  font-weight: 700;
  color: #644f26;
}

.fretboard-wrap {
  overflow-x: auto;
  border: 1px solid #b89959;
  border-radius: 12px;
  background:
    linear-gradient(180deg, rgba(255, 245, 218, 0.95), rgba(242, 217, 164, 0.95)),
    repeating-linear-gradient(
      90deg,
      rgba(121, 83, 35, 0.09) 0 12px,
      rgba(121, 83, 35, 0.03) 12px 24px
    );
}

.fretboard {
  width: max-content;
  min-width: 0;
  padding: 0.5rem;
}

.header-row,
.inlay-row,
.string-row {
  display: grid;
  grid-template-columns: 60px repeat(25, 72px);
  gap: 2px;
}

.fret-header,
.string-header,
.string-label,
.inlay-label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  font-size: 0.76rem;
  font-weight: 700;
  background: #f6ecd4;
  color: #624e25;
}

.string-label {
  height: 52px;
}

.inlay-label {
  height: 22px;
  font-size: 0.65rem;
  background: #e8d0a0;
}

.fret-header.nut,
.inlay-cell.nut,
.note-cell.nut {
  border-right: 3px solid #5c4520;
}

.inlay-cell {
  height: 22px;
  border: 1px solid #e6cf9f;
  background: rgba(255, 249, 235, 0.7);
  position: relative;
}

.inlay-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #6d5328;
  opacity: 0.72;
}

.inlay-dot.dual {
  left: 50%;
}

.inlay-dot.top {
  top: 31%;
}

.inlay-dot.bottom {
  top: 69%;
}

.note-cell {
  height: 52px;
  border: 1px solid #ecd9ac;
  background:
    linear-gradient(180deg, rgba(255, 250, 238, 0.9), rgba(248, 233, 197, 0.92)),
    repeating-linear-gradient(
      90deg,
      rgba(107, 74, 31, 0.06) 0 14px,
      rgba(107, 74, 31, 0.02) 14px 28px
    );
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.68rem;
  color: #3f300f;
  padding: 0.15rem;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.note-cell {
  flex-direction: column;
  gap: 0.1rem;
}

.note-cell span {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  line-height: 1.15;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.label-note {
  font-weight: 800;
  color: #3f300f;
}

.label-interval {
  font-size: 0.85em;
  font-weight: 500;
  font-style: italic;
  color: #7a5f2e;
}

.note-cell.inRange {
  background:
    linear-gradient(180deg, rgba(255, 247, 221, 0.95), rgba(248, 231, 183, 0.95)),
    repeating-linear-gradient(
      90deg,
      rgba(113, 77, 33, 0.07) 0 14px,
      rgba(113, 77, 33, 0.03) 14px 28px
    );
}

.note-cell.root {
  background: #ffe4a5;
  border-color: #e3a82a;
  font-weight: 700;
}

.note-cell.target {
  background: #b8f0da;
  border-color: #299f6f;
  font-weight: 800;
}

.note-cell.scaleTone {
  box-shadow: inset 0 0 0 2px rgba(64, 112, 199, 0.65);
}

@media (max-width: 700px) {
  .panel {
    border-radius: 16px;
    padding: 0.85rem;
  }

  .range-grid {
    grid-template-columns: 1fr 1fr;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  button {
    width: 100%;
  }
}
</style>
