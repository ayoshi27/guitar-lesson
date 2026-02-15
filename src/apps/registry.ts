import type { Component } from 'vue'
import FretboardTrainerApp from './fretboard-trainer/FretboardTrainerApp.vue'
import IntervalDrillApp from './interval-drill/IntervalDrillApp.vue'

export type TrainingAppDefinition = {
  id: string
  name: string
  description: string
  path: string
  component: Component
}

export const TRAINING_APPS: TrainingAppDefinition[] = [
  {
    id: 'interval-drill',
    name: '音程反復トレーニング',
    description: '基準音と音程の対応を反復練習するアプリ',
    path: '/apps/interval-drill',
    component: IntervalDrillApp,
  },
  {
    id: 'fretboard-trainer',
    name: 'ギター指板トレーニング',
    description: 'キーに対する音名・音程を指板上で覚えるトレーニング',
    path: '/apps/fretboard-trainer',
    component: FretboardTrainerApp,
  },
]
