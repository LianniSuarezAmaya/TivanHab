import dayjs from 'dayjs'

import type { Habit, Task } from '../../ui/items/types/items.types.ts'
import type { DailyLog } from '../../ui/stadistics/types/stadistics.types.ts'
import type { Nothe } from '../../ui/nothes/types/nothes.types.ts'

import type { Event } from '../types/events.types.ts.ts'
import type {
  PrunedInformation,
  PrunedEntitySnapshots,
} from '../types/prune.types.ts'


export function mergeDailyLogsIntoPrunedInformation(
  previous: PrunedInformation,
  logs: DailyLog[],
): PrunedInformation {

  if (logs.length === 0) {
    return {
      ...previous,

      totalDays:
        previous.firstDate > 0
          ? getDaysBetweenDates(
              previous.firstDate,
              Date.now(),
            )
          : 0,
    }
  }

  const sortedLogs = [...logs].sort(
    (a, b) => a.date - b.date,
  )

  const firstDate =
    previous.firstDate > 0
      ? Math.min(
          previous.firstDate,
          sortedLogs[0].date,
        )
      : sortedLogs[0].date

  let points = 0
  let timeWorked = 0
  let tasksCompleted = 0
  let habitsCompleted = 0
  let activeDays = 0

  let moodSum = previous.mood.sum
  let moodCount = previous.mood.count

  const historicalPoints = [
    ...previous.historicalPoints,
  ]

  for (const log of sortedLogs) {

    points += log.pointsAcummulated || 0
    timeWorked += log.timeWorked || 0
    tasksCompleted += log.tasksCompleted || 0
    habitsCompleted += log.habitsCompleted || 0

    historicalPoints.push(
      log.pointsAcummulated || 0,
    )

    if (
      log.habitsCompleted > 0 ||
      log.tasksCompleted > 0
    ) {
      activeDays++
    }

    if (typeof log.mood === 'number') {
      moodSum += log.mood
      moodCount++
    }
  }

  const totalDays =
    getDaysBetweenDates(
      firstDate,
      Date.now(),
    )

  return {
    ...previous,

    firstDate,

    totalDays,

    totals: {
      pointsAcummulated:
        previous.totals.pointsAcummulated +
        points,

      timeWorked:
        previous.totals.timeWorked +
        timeWorked,

      tasksCompleted:
        previous.totals.tasksCompleted +
        tasksCompleted,

      habitsCompleted:
        previous.totals.habitsCompleted +
        habitsCompleted,
    },

    historicalPoints,

    activeDays:
      previous.activeDays +
      activeDays,

    mood: {
      sum: moodSum,
      count: moodCount,
    },
  }
}


type EntitySnapshotState = {
  habits: Habit[]
  tasks: Task[]
  nothes: Nothe[]
}


export function reconstructEntitiesUntil(
  base: EntitySnapshotState,
  events: Event[],
): EntitySnapshotState {

  const habitsMap =
    new Map<number, Habit>(
      base.habits.map(h => [
        h.key,
        { ...h },
      ]),
    )

  const tasksMap =
    new Map<number, Task>(
      base.tasks.map(t => [
        t.key,
        { ...t },
      ]),
    )

  const nothesMap =
    new Map<number, Nothe>(
      base.nothes.map(n => [
        n.key,
        { ...n },
      ]),
    )

  const sortedEvents =
    [...events].sort(
      (a, b) => a.date - b.date,
    )

  for (const event of sortedEvents) {

    if (event.type === 'Habit') {

      switch (event.action) {

        case 'added':
          if (event.newData?.Habit) {
            habitsMap.set(
              event.eventKey,
              {
                ...event.newData.Habit,
              },
            )
          }
          break

        case 'edited': {
          const current =
            habitsMap.get(event.eventKey)

          if (
            current &&
            event.newData?.Habit
          ) {
            habitsMap.set(
              event.eventKey,
              {
                ...current,
                ...event.newData.Habit,
                key: current.key,
                completed: current.completed,
              },
            )
          }

          break
        }

        case 'deleted':
          habitsMap.delete(event.eventKey)
          break

        /*
         * completed/uncompleted históricos
         * no modifican el snapshot salvo que
         * correspondan al día actual.
         */
        case 'completed': {
          const current =
            habitsMap.get(event.eventKey)

          if (
            current &&
            dayjs(event.date).isSame(
              dayjs(),
              'day',
            )
          ) {
            habitsMap.set(
              event.eventKey,
              {
                ...current,
                completed: true,
              },
            )
          }

          break
        }

        case 'uncompleted': {
          const current =
            habitsMap.get(event.eventKey)

          if (
            current &&
            dayjs(event.date).isSame(
              dayjs(),
              'day',
            )
          ) {
            habitsMap.set(
              event.eventKey,
              {
                ...current,
                completed: false,
              },
            )
          }

          break
        }
      }

      continue
    }

    if (event.type === 'Task') {

      switch (event.action) {

        case 'added':
          if (event.newData?.Task) {
            tasksMap.set(
              event.eventKey,
              {
                ...event.newData.Task,
                completed: false,
              },
            )
          }
          break

        case 'edited': {
          const current =
            tasksMap.get(event.eventKey)

          if (
            current &&
            event.newData?.Task
          ) {
            tasksMap.set(
              event.eventKey,
              {
                ...current,
                ...event.newData.Task,
                key: current.key,
                completed: current.completed,
              },
            )
          }

          break
        }

        case 'deleted':
          tasksMap.delete(event.eventKey)
          break

        case 'completed': {
          const current =
            tasksMap.get(event.eventKey)

          if (current) {
            tasksMap.set(
              event.eventKey,
              {
                ...current,
                completed: true,
              },
            )
          }

          break
        }

        case 'uncompleted': {
          const current =
            tasksMap.get(event.eventKey)

          if (current) {
            tasksMap.set(
              event.eventKey,
              {
                ...current,
                completed: false,
              },
            )
          }

          break
        }
      }

      continue
    }

    if (event.type === 'Nothe') {

      switch (event.action) {

        case 'added':
          if (event.newData?.Nothe) {
            nothesMap.set(
              event.eventKey,
              {
                ...event.newData.Nothe,
              },
            )
          }
          break

        case 'edited': {
          const current =
            nothesMap.get(event.eventKey)

          if (
            current &&
            event.newData?.Nothe
          ) {
            nothesMap.set(
              event.eventKey,
              {
                ...current,
                ...event.newData.Nothe,
                key: current.key,
              },
            )
          }

          break
        }

        case 'deleted':
          nothesMap.delete(event.eventKey)
          break
      }
    }
  }

  return {
    habits:
      Array.from(habitsMap.values()),

    tasks:
      Array.from(tasksMap.values()),

    nothes:
      Array.from(nothesMap.values()),
  }
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