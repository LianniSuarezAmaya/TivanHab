import dayjs from 'dayjs'

import type { Habit, Task } from '../../ui/items/types/items.types.ts'
import type { DailyLog } from '../../ui/stadistics/types/stadistics.types.ts'
import type { Nothe } from '../../ui/nothes/types/nothes.types.ts'

import type { Event } from '../types/events.types.ts.ts'
import type {
  PrunedEntitySnapshots,PrunedInformation
} from '../types/prune.types.ts'





type EntitySnapshotState = {
  habits: Habit[]
  tasks: Task[]
  nothes: Nothe[]
}





export function updateHabitCompletions(
  previous: Record<number, number[]>,
  events: Event[],
): Record<number, number[]> {

  const result: Record<number, number[]> =
    Object.fromEntries(
      Object.entries(previous).map(
        ([key, dates]) => [
          Number(key),
          [...dates],
        ],
      ),
    )

  const sorted =
    [...events].sort(
      (a, b) => a.date - b.date,
    )

  for (const event of sorted) {

    if (event.type !== 'Habit') {
      continue
    }

    const key = event.eventKey

    if (!result[key]) {
      result[key] = []
    }

    if (event.action === 'completed') {
      result[key].push(event.date)
    }

    if (event.action === 'uncompleted') {
      result[key].pop()
    }
  }

  return result
}


export function createSnapshotEvents(
  entities: PrunedEntitySnapshots,
  snapshotDate: number,
): Event[] {

  const events: Event[] = []

  for (const habit of entities.habits) {

    events.push({
      id: -(
        snapshotDate +
        events.length +
        1
      ),

      type: 'Habit',
      action: 'added',
      eventKey: habit.key,
      date: snapshotDate,

      newData: {
        Habit: {
          ...habit,
        },
      },
    })
  }

  for (const task of entities.tasks) {

    events.push({
      id: -(
        snapshotDate +
        events.length +
        1
      ),

      type: 'Task',
      action: 'added',
      eventKey: task.key,
      date: snapshotDate,

      newData: {
        Task: {
          ...task,
        },
      },
    })
  }

  for (const nothe of entities.nothes) {

    events.push({
      id: -(
        snapshotDate +
        events.length +
        1
      ),

      type: 'Nothe',
      action: 'added',
      eventKey: nothe.key,
      date: snapshotDate,

      newData: {
        Nothe: {
          ...nothe,
        },
      },
    })
  }

  return events
}


export const MAX_LOCAL_STORAGE_BYTES =
  3.5 * 1024 * 1024

export const PRUNE_CHECK_INTERVAL =
  24 * 60 * 60 * 1000

export const HISTORY_STORAGE_KEY =
  'history-storage'


export const emptyPrunedInformation =
  (): PrunedInformation => ({
    firstDate: 0,
    totalDays: 0,

    totals: {
      pointsAcummulated: 0,
      timeWorked: 0,
      tasksCompleted: 0,
      habitsCompleted: 0,
    },

    historicalPoints: [],

    activeDays: 0,

    mood: {
      sum: 0,
      count: 0,
    },

    entities: {
      habits: [],
      tasks: [],
      nothes: [],
    },

    habitCompletions: {},

    lastPrunedAt: 0,
    lastPruneCheckAt: 0,
  })


export function getLocalStorageSizeBytes(): number {

  if (typeof window === 'undefined') {
    return 0
  }

  let bytes = 0

  for (
    let i = 0;
    i < localStorage.length;
    i++
  ) {

    const key =
      localStorage.key(i)

    if (!key) {
      continue
    }

    const value =
      localStorage.getItem(key) ?? ''

    bytes +=
      (key.length + value.length) * 2
  }

  return bytes
}


function getDaysBetweenDates(
  start: number,
  end: number,
): number {

  if (start <= 0) {
    return 0
  }

  return Math.max(
    0,
    dayjs(end)
      .startOf('day')
      .diff(
        dayjs(start).startOf('day'),
        'day',
      ) + 1,
  )
}