import type { Component } from 'vue'
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
]
