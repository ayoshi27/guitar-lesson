import type { Component } from 'vue'
import FretboardTrainerApp from './fretboard-trainer/FretboardTrainerApp.vue'
import IntervalDrillApp from './interval-drill/IntervalDrillApp.vue'
import StaffReadingApp from './staff-reading/StaffReadingApp.vue'

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
  {
    id: 'staff-reading',
    name: '五線譜トレーニング',
    description: '五線譜上の音符の位置から音名を読み取る練習',
    path: '/apps/staff-reading',
    component: StaffReadingApp,
  },
]
