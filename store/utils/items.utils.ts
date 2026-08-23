

import EventStore from "../stores/events.store"
import type { Task,TaskUnfound,Habit } from "../../ui/items/types/items.types"
const {getLastCompleted}=EventStore.getState()

export function calculateNextDue(
  habit: Habit,
  fromTimestamp: number
): number {

  const DAY = 24 * 60 * 60 * 1000

  const toStartOfDay = (ts: number) => {
    const d = new Date(ts)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  }

  const fromDate = toStartOfDay(fromTimestamp)
  const startDate = toStartOfDay(habit.date)

  const baseDate = Math.max(fromDate, startDate)

  switch (habit.repeat) {

    case 'daily':
      return baseDate + DAY

    case 'weekly': {
      if (habit.daysOfWeek?.length) {

        const today = new Date(baseDate).getDay()

        const sorted = [...habit.daysOfWeek].sort((a, b) => a - b)

        let nextDay = sorted.find(d => d > today)

        if (nextDay !== undefined) {
          return baseDate + (nextDay - today) * DAY
        } else {
          return baseDate + (sorted[0] + 7 - today) * DAY
        }
      }

      return baseDate + 7 * DAY
    }

    case 'monthly': {
      const targetDay = new Date(habit.date).getDate()

      const current = new Date(baseDate)
      const year = current.getFullYear()
      const month = current.getMonth()

      const nextMonth = new Date(year, month + 1, 1)

      const lastDay = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth() + 1,
        0
      ).getDate()

      const finalDay = Math.min(targetDay, lastDay)

      return new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        finalDay
      ).getTime()
    }

    default:
      return baseDate + DAY
  }
}

 

export function recalculateNextDue(habit: Habit): number {

  const lastCompleted = getLastCompleted(habit).at(-1)

  if (!lastCompleted) {

  const date=habit.date

    return calculateNextDue(habit, date)
  }

  return calculateNextDue(habit,lastCompleted)
}

export function isItemLate(
  item: Habit |Task,
  now: number = Date.now()
): boolean {
  if(isHabit(item)){
    const nextDue = recalculateNextDue(item)
    const today = toStartOfDay(now)
    return today > nextDue
  }else{
    const now = new Date()
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime()

    const taskDate = new Date(item.date).getTime()

    return taskDate < todayStart
  }

}


export function isSameDay(timestampA: number, timestampB: number): boolean {
  const a = new Date(timestampA)
  const b = new Date(timestampB)
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
}



const toStartOfDay = (ts: number) => {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}



  
export const isHabit = (item: any): item is Habit =>
  !!(
    item &&
    typeof item === 'object' &&
    'repeat' in item
  )

export const isTask = (item: any): item is TaskUnfound =>
  !!(
    item &&
    typeof item === 'object' &&
    !('repeat' in item)
  )