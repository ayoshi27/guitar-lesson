<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type AccidentalType = 'sharp' | 'flat'

type ClefDef = {
  id: string
  label: string
  symbol: string
  clefFontSize: number
  clefOffsetY: number
  bottomLineN: number
  keySignaturePositions: Record<AccidentalType, Record<string, number>>
}

type KeySignatureDef = {
  id: string
  label: string
  accidental: AccidentalType | null
  count: number
}

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
const ACCIDENTAL_SYMBOL: Record<AccidentalType, string> = { sharp: '♯', flat: '♭' }

const CLEFS: ClefDef[] = [
  {
    id: 'treble',
    label: 'ト音記号',
    symbol: '\u{1D11E}',
    clefFontSize: 120,
    clefOffsetY: -10,
    bottomLineN: 2,
    keySignaturePositions: {
      sharp: { F: 10, C: 7, G: 11, D: 8, A: 5, E: 9, B: 6 },
      flat: { B: 6, E: 9, A: 5, D: 8, G: 4, C: 7, F: 3 },
    },
  },
]

const KEY_SIGNATURES: KeySignatureDef[] = [
  { id: 'C', label: 'C（ハ長調・記号なし）', accidental: null, count: 0 },
  { id: 'G', label: 'G（ト長調・♯1）', accidental: 'sharp', count: 1 },
  { id: 'D', label: 'D（ニ長調・♯2）', accidental: 'sharp', count: 2 },
  { id: 'A', label: 'A（イ長調・♯3）', accidental: 'sharp', count: 3 },
  { id: 'E', label: 'E（ホ長調・♯4）', accidental: 'sharp', count: 4 },
  { id: 'B', label: 'B（ロ長調・♯5）', accidental: 'sharp', count: 5 },
  { id: 'F#', label: 'F#（嬰ヘ長調・♯6）', accidental: 'sharp', count: 6 },
  { id: 'C#', label: 'C#（嬰ハ長調・♯7）', accidental: 'sharp', count: 7 },
  { id: 'F', label: 'F（ヘ長調・♭1）', accidental: 'flat', count: 1 },
  { id: 'Bb', label: 'B♭（変ロ長調・♭2）', accidental: 'flat', count: 2 },
  { id: 'Eb', label: 'E♭（変ホ長調・♭3）', accidental: 'flat', count: 3 },
  { id: 'Ab', label: 'A♭（変イ長調・♭4）', accidental: 'flat', count: 4 },
  { id: 'Db', label: 'D♭（変ニ長調・♭5）', accidental: 'flat', count: 5 },
  { id: 'Gb', label: 'G♭（変ト長調・♭6）', accidental: 'flat', count: 6 },
  { id: 'Cb', label: 'C♭（変ハ長調・♭7）', accidental: 'flat', count: 7 },
]

const LEDGER_RANGE_OPTIONS = [
  { value: 0, label: '五線内のみ' },
  { value: 1, label: '加線 ±1本分' },
  { value: 2, label: '加線 ±2本分' },
  { value: 3, label: '加線 ±3本分' },
]

const selectedClefId = ref(CLEFS[0]!.id)
const selectedKeyId = ref('C')
const extraLedger = ref(1)

const started = ref(false)
const revealed = ref(false)
const questionCount = ref(0)
const currentN = ref<number | null>(null)

const selectedClef = computed(() => CLEFS.find((clef) => clef.id === selectedClefId.value) ?? CLEFS[0]!)
const selectedKey = computed(
  () => KEY_SIGNATURES.find((key) => key.id === selectedKeyId.value) ?? KEY_SIGNATURES[0]!,
)

const alteredLetters = computed(() => {
  const key = selectedKey.value
  if (!key.accidental) return []
  const order = key.accidental === 'sharp' ? SHARP_ORDER : FLAT_ORDER
  return order.slice(0, key.count)
})

const nToNote = (n: number): { letter: string; octave: number } => {
  const letterIndex = ((n % 7) + 7) % 7
  const octave = 4 + Math.floor(n / 7)
  return { letter: LETTERS[letterIndex]!, octave }
}

const ledgerLinesFor = (n: number, clef: ClefDef): number[] => {
  const bottom = clef.bottomLineN
  const top = bottom + 8
  const lines: number[] = []
  if (n < bottom) {
    const isLine = (n - bottom) % 2 === 0
    const bound = isLine ? n : n + 1
    for (let p = bottom - 2; p >= bound; p -= 2) {
      lines.push(p)
    }
  } else if (n > top) {
    const isLine = (n - bottom) % 2 === 0
    const bound = isLine ? n : n - 1
    for (let p = top + 2; p <= bound; p += 2) {
      lines.push(p)
    }
  }
  return lines
}

const STAFF_LINE_GAP = 18
const STEP_PX = STAFF_LINE_GAP / 2
const BOTTOM_LINE_Y = 150
const STAFF_X_START = 26
const STAFF_X_END = 246
const NOTE_X = 210

const yForN = (n: number): number => {
  return BOTTOM_LINE_Y - (n - selectedClef.value.bottomLineN) * STEP_PX
}

const staffLineNs = computed(() => {
  const bottom = selectedClef.value.bottomLineN
  return [0, 1, 2, 3, 4].map((i) => bottom + i * 2)
})

const keySignatureGlyphs = computed(() => {
  const key = selectedKey.value
  if (!key.accidental) return []
  const order = key.accidental === 'sharp' ? SHARP_ORDER : FLAT_ORDER
  const positions = selectedClef.value.keySignaturePositions[key.accidental]
  return order.slice(0, key.count).map((letter, index) => ({
    letter,
    x: 80 + index * 13,
    y: yForN(positions[letter] ?? selectedClef.value.bottomLineN),
    symbol: ACCIDENTAL_SYMBOL[key.accidental as AccidentalType],
  }))
})

const questionRange = computed(() => {
  const clef = selectedClef.value
  const extra = extraLedger.value
  return { min: clef.bottomLineN - 2 * extra, max: clef.bottomLineN + 8 + 2 * extra }
})

const currentLedgerLines = computed(() => {
  if (currentN.value === null) return []
  return ledgerLinesFor(currentN.value, selectedClef.value)
})

const currentNoteY = computed(() => (currentN.value === null ? null : yForN(currentN.value)))

const stemInfo = computed(() => {
  if (currentN.value === null || currentNoteY.value === null) return null
  const middle = selectedClef.value.bottomLineN + 4
  const stemLength = 34
  if (currentN.value >= middle) {
    return { x: NOTE_X - 8.5, y1: currentNoteY.value, y2: currentNoteY.value + stemLength }
  }
  return { x: NOTE_X + 8.5, y1: currentNoteY.value, y2: currentNoteY.value - stemLength }
})

const randomInRange = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min + 1))
}

const generateQuestion = (): void => {
  const { min, max } = questionRange.value
  currentN.value = randomInRange(min, max)
  revealed.value = false
  questionCount.value += 1
  started.value = true
}

const startQuiz = (): void => {
  questionCount.value = 0
  generateQuestion()
}

const checkAnswer = (): void => {
  if (!started.value || currentN.value === null) return
  revealed.value = true
}

const nextQuestion = (): void => {
  if (!started.value) return
  generateQuestion()
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

const answerText = computed(() => {
  if (!started.value || currentN.value === null) return ''
  const note = nToNote(currentN.value)
  const key = selectedKey.value
  const altered = key.accidental !== null && alteredLetters.value.includes(note.letter)
  const symbol = altered ? ACCIDENTAL_SYMBOL[key.accidental as AccidentalType] : ''
  return `答え: ${note.letter}${symbol}${note.octave}`
})
</script>

<template>
  <section class="panel">
    <h1>五線譜トレーニング</h1>
    <p class="sub">五線譜上の音符の位置から音名を読み取る練習</p>

    <div class="controls">
      <label>
        音部記号
        <select v-model="selectedClefId">
          <option v-for="clef in CLEFS" :key="clef.id" :value="clef.id">{{ clef.label }}</option>
        </select>
      </label>

      <label>
        調（キー）
        <select v-model="selectedKeyId">
          <option v-for="key in KEY_SIGNATURES" :key="key.id" :value="key.id">{{ key.label }}</option>
        </select>
      </label>

      <label>
        出題範囲
        <select v-model.number="extraLedger">
          <option v-for="opt in LEDGER_RANGE_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="qa-card">
      <p class="count">Question {{ questionCount || '-' }}</p>

      <div class="staff-area">
        <svg viewBox="0 0 260 220" class="staff-svg" role="img" aria-label="五線譜">
          <line
            v-for="n in staffLineNs"
            :key="`line-${n}`"
            :x1="STAFF_X_START"
            :x2="STAFF_X_END"
            :y1="yForN(n)"
            :y2="yForN(n)"
            class="staff-line"
          />

          <text
            :x="30"
            :y="BOTTOM_LINE_Y + selectedClef.clefOffsetY"
            :font-size="selectedClef.clefFontSize"
            class="clef-glyph"
          >{{ selectedClef.symbol }}</text>

          <text
            v-for="glyph in keySignatureGlyphs"
            :key="`ks-${glyph.letter}`"
            :x="glyph.x"
            :y="glyph.y + 6"
            class="key-glyph"
          >{{ glyph.symbol }}</text>

          <template v-if="started && currentN !== null">
            <line
              v-for="ledgerN in currentLedgerLines"
              :key="`ledger-${ledgerN}`"
              :x1="NOTE_X - 13"
              :x2="NOTE_X + 13"
              :y1="yForN(ledgerN)"
              :y2="yForN(ledgerN)"
              class="ledger-line"
            />

            <line
              v-if="stemInfo"
              :x1="stemInfo.x"
              :x2="stemInfo.x"
              :y1="stemInfo.y1"
              :y2="stemInfo.y2"
              class="note-stem"
            />

            <ellipse
              :cx="NOTE_X"
              :cy="currentNoteY ?? 0"
              rx="9.5"
              ry="7"
              class="notehead"
              :transform="`rotate(-18 ${NOTE_X} ${currentNoteY ?? 0})`"
            />
          </template>
        </svg>
      </div>

      <p class="answer" :class="{ visible: revealed }">
        {{ started ? (revealed ? answerText : '答えはCheckで表示') : 'Startを押して開始' }}
      </p>
    </div>

    <div class="actions">
      <button class="primary" @click="startQuiz">Start</button>
      <button :disabled="!started" @click="checkAnswer">Check</button>
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

.staff-area {
  margin-top: 0.6rem;
  display: flex;
  justify-content: center;
}

.staff-svg {
  width: 100%;
  max-width: 420px;
  height: auto;
}

.staff-line {
  stroke: #4a3a18;
  stroke-width: 1.6;
}

.ledger-line {
  stroke: #4a3a18;
  stroke-width: 1.6;
}

.clef-glyph {
  fill: #2a2111;
  font-family: 'Bravura Text', 'Noto Music', 'Apple Symbols', 'Segoe UI Symbol', serif;
}

.key-glyph {
  fill: #8c4f00;
  font-size: 26px;
  font-weight: 700;
  font-family: 'Bravura Text', 'Noto Music', 'Apple Symbols', 'Segoe UI Symbol', serif;
}

.notehead {
  fill: #2a2111;
}

.note-stem {
  stroke: #2a2111;
  stroke-width: 1.6;
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
