<script setup lang="ts">
import type { SymbolDef } from './symbols'

defineProps<{ symbol: SymbolDef }>()
</script>

<template>
  <span v-if="symbol.render === 'text'" class="glyph-text">{{ symbol.text }}</span>
  <svg v-else viewBox="0 0 80 80" class="glyph-svg" role="img" aria-hidden="true">
    <circle v-if="symbol.svgId === 'staccato'" cx="40" cy="40" r="7" fill="currentColor" />

    <rect v-else-if="symbol.svgId === 'tenuto'" x="18" y="37" width="44" height="6" rx="3" fill="currentColor" />

    <path
      v-else-if="symbol.svgId === 'accent'"
      d="M14 24 L58 40 L14 56"
      stroke="currentColor"
      stroke-width="6"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <template v-else-if="symbol.svgId === 'fermata'">
      <path d="M14 52 A 26 26 0 0 1 66 52" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" />
      <circle cx="40" cy="40" r="5" fill="currentColor" />
    </template>

    <template v-else-if="symbol.svgId === 'slur'">
      <path d="M14 55 Q40 18 66 38" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <circle cx="14" cy="55" r="5" fill="currentColor" />
      <circle cx="66" cy="38" r="5" fill="currentColor" />
    </template>

    <template v-else-if="symbol.svgId === 'tie'">
      <path d="M14 45 Q40 18 66 45" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
      <circle cx="14" cy="45" r="5" fill="currentColor" />
      <circle cx="66" cy="45" r="5" fill="currentColor" />
    </template>

    <path
      v-else-if="symbol.svgId === 'breath'"
      d="M34 22 Q44 40 34 58"
      stroke="currentColor"
      stroke-width="5"
      fill="none"
      stroke-linecap="round"
    />

    <template v-else-if="symbol.svgId === 'caesura'">
      <line x1="28" y1="16" x2="44" y2="64" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="44" y1="16" x2="60" y2="64" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
    </template>

    <template v-else-if="symbol.svgId === 'ending-1'">
      <path d="M16 20 L16 40 L64 40" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <text x="30" y="34" font-size="18" fill="currentColor" font-weight="700">1.</text>
    </template>

    <template v-else-if="symbol.svgId === 'ending-2'">
      <path d="M16 20 L16 40 L64 40 L64 20" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <text x="30" y="34" font-size="18" fill="currentColor" font-weight="700">2.</text>
    </template>

    <template v-else-if="symbol.svgId === 'rhythm-slash'">
      <line x1="14" y1="58" x2="26" y2="26" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="34" y1="58" x2="46" y2="26" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      <line x1="54" y1="58" x2="66" y2="26" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
    </template>

    <template v-else-if="symbol.svgId === 'repeat-start'">
      <rect x="18" y="10" width="3" height="60" fill="currentColor" />
      <rect x="26" y="10" width="7" height="60" fill="currentColor" />
      <circle cx="48" cy="30" r="4" fill="currentColor" />
      <circle cx="48" cy="50" r="4" fill="currentColor" />
    </template>

    <template v-else-if="symbol.svgId === 'repeat-end'">
      <circle cx="32" cy="30" r="4" fill="currentColor" />
      <circle cx="32" cy="50" r="4" fill="currentColor" />
      <rect x="47" y="10" width="7" height="60" fill="currentColor" />
      <rect x="59" y="10" width="3" height="60" fill="currentColor" />
    </template>

    <template v-else-if="symbol.svgId === 'segno'">
      <line x1="58" y1="22" x2="22" y2="58" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <circle cx="58" cy="22" r="6" fill="currentColor" />
      <circle cx="22" cy="58" r="6" fill="currentColor" />
      <circle cx="40" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="3" />
    </template>

    <template v-else-if="symbol.svgId === 'coda'">
      <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="5" />
      <line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" stroke-width="5" />
      <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" stroke-width="5" />
    </template>
  </svg>
</template>

<style scoped>
.glyph-text {
  font-family: 'Bravura Text', 'Noto Music', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  line-height: 1;
}

.glyph-svg {
  width: 100%;
  height: 100%;
  color: #2a2111;
  overflow: visible;
}
</style>
