import { TRAINING_APPS } from './registry'

export type TrainingAppCard = Pick<(typeof TRAINING_APPS)[number], 'id' | 'name' | 'description' | 'path'>

export const TRAINING_APP_CARDS: TrainingAppCard[] = TRAINING_APPS.map(
  ({ id, name, description, path }) => ({
    id,
    name,
    description,
    path,
  }),
)
