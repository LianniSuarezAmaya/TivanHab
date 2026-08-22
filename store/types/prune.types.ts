import type { Task,Habit } from "../../ui/items/types/items.types"
import type { Nothe } from "../../ui/nothes/types/nothes.types"

export type PrunedEntitySnapshots = {
  habits: Habit[]
  tasks: Task[]
  nothes: Nothe[]
}

export type PrunedInformation = {

  firstDate: number

  totalDays: number

  totals: {
    pointsAcummulated: number
    timeWorked: number
    tasksCompleted: number
    habitsCompleted: number
  }


  historicalPoints: number[]

  
  activeDays: number


  mood: {
    sum: number
    count: number
  }


  entities: PrunedEntitySnapshots

  habitCompletions: Record<number, number[]>

  lastPrunedAt: number

  lastPruneCheckAt: number
}