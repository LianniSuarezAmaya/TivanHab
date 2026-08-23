import dayjs from "dayjs"
import type { Habit } from "../types/items.types"
import EventStore from "@/store/stores/events.store"
import { isSameDay ,calculateNextDue} from "@/store/utils/items.utils"

const {getLastCompleted}=EventStore.getState()

export function getStartHour(startDate:number) {
  return dayjs(startDate).format("HH:mm")
}


export function getEndHour(startDate:number,duration:number) {
  return dayjs(startDate)
    .add(duration, "minute")
    .format("HH:mm")
}

export function isHabitDoneToday(habit: Habit): boolean {

  const today = Date.now()

  const lastCompleted = getLastCompleted(habit)

  const last = lastCompleted.at(-1) ?? 0

  return isSameDay(last, today)
}

export function isHabitToDo(
  habit: Habit,
): boolean {
  
  const today = dayjs().endOf('day').valueOf();
  if (isHabitDoneToday(habit)) return false

  const lastCompleted = getLastCompleted(habit).at(-1);
  if (!lastCompleted) {
    return new Date(habit.date).getTime() <today;
  }

  const nextDue = calculateNextDue(habit, getLastCompleted(habit).at(-1) ?? habit.date)
  return nextDue === today||nextDue<today

}

export function isHabitToLater(habit: Habit): boolean {

  const today = dayjs().endOf('day').valueOf();

  if (isHabitDoneToday(habit)) return false
    const lastCompleted = getLastCompleted(habit).at(-1);
  
    if (!lastCompleted) {
   return new Date(habit.date).getTime() > today;
  }

  const nextDue = calculateNextDue(habit, lastCompleted);
  return nextDue > today;

}