import type { Event } from "../types/events.types.ts"
import type { DailyLog } from "../../ui/stadistics/types/stadistics.types"
import dayjs from "dayjs"
export function buildDailyLogs(
  events: Event[],
): DailyLog[] {

  if (events.length === 0) {
    return []
  }

  const LogsMap = new Map<string, DailyLog>()

  for (const event of events) {

    const eventDate =
      dayjs(event.date).format('YYYY-MM-DD')

    const log =
      LogsMap.get(eventDate) ??
      {
        date: event.date,
        mood: undefined,
        streak: false,
        pointsAcummulated: 0,
        timeWorked: 0,
        tasksCompleted: 0,
        habitsCompleted: 0,
      }

    if (event.type === 'Mood') {

      LogsMap.set(
        eventDate,
        {
          ...log,
          mood: event.newData.mood,
        }
      )
    }

    if (event.action === 'completed') {

      if (event.type === 'Habit') {

        LogsMap.set(
          eventDate,
          {
            ...log,
            streak:
              log.habitsCompleted > 2 ||
              log.tasksCompleted > 3,

            pointsAcummulated:
              log.pointsAcummulated +
              event.duration / 40000,

            timeWorked:
              log.timeWorked +
              event.duration,

            habitsCompleted:
              log.habitsCompleted + 1,
          }
        )

      } else if (event.type === 'Task') {

        LogsMap.set(
          eventDate,
          {
            ...log,
            streak:
              log.habitsCompleted > 2 ||
              log.tasksCompleted > 3,

            pointsAcummulated:
              log.pointsAcummulated +
              event.duration / 40000,

            timeWorked:
              log.timeWorked +
              event.duration,

            tasksCompleted:
              log.tasksCompleted + 1,
          }
        )
      }
    }

    if (event.action === 'uncompleted') {

      if (event.type === 'Habit') {

        LogsMap.set(
          eventDate,
          {
            ...log,
            streak:
              log.habitsCompleted > 2 ||
              log.tasksCompleted > 3,

            pointsAcummulated:
              Math.max(
                0,
                log.pointsAcummulated -
                event.duration / 40000
              ),

            timeWorked:
              Math.max(
                0,
                log.timeWorked -
                event.duration
              ),

            habitsCompleted:
              Math.max(
                0,
                log.habitsCompleted - 1
              ),
          }
        )

      } else if (event.type === 'Task') {

        LogsMap.set(
          eventDate,
          {
            ...log,
            streak:
              log.habitsCompleted > 2 ||
              log.tasksCompleted > 3,

            timeWorked:
              Math.max(
                0,
                log.timeWorked -
                event.duration
              ),

            tasksCompleted:
              Math.max(
                0,
                log.tasksCompleted - 1
              ),

            pointsAcummulated:
              Math.max(
                0,
                log.pointsAcummulated -
                event.duration / 40000
              ),
          }
        )
      }
    }
  }

  return Array.from(
    LogsMap.values()
  ).sort(
    (a, b) => a.date - b.date
  )
}