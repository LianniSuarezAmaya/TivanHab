
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  mergeDailyLogsIntoPrunedInformation,
  reconstructEntitiesUntil,
  updateHabitCompletions,
  createSnapshotEvents,
  emptyPrunedInformation,
  getLocalStorageSizeBytes,
} from './eventStore.pruneEvents.utils'

import type { Event } from '../types/events.types.ts.ts'
import type { Habit, Task } from '../../ui/items/types/items.types.ts'
import type { Nothe } from '../../ui/nothes/types/nothes.types.ts'
import type { DailyLog } from '../../ui/stadistics/types/stadistics.types.ts'




describe('eventStore.pruneEvents.utils', () => {

  describe('emptyPrunedInformation', () => {

    it('should return an empty pruning state', () => {
      const result = emptyPrunedInformation()

      expect(result).toEqual({
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
    })

  })


  describe('mergeDailyLogsIntoPrunedInformation', () => {

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-08-22T12:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })


    it('should update totalDays when logs are empty', () => {
      const previous = {
        ...emptyPrunedInformation(),
        firstDate: new Date('2026-08-01').getTime(),
      }

      const result =
        mergeDailyLogsIntoPrunedInformation(
          previous,
          [],
        )

      expect(result.firstDate).toBe(previous.firstDate)
      expect(result.totalDays).toBeGreaterThan(0)

      expect(result.totals).toEqual(
        previous.totals,
      )
    })


    it('should merge daily statistics', () => {
      const previous =
        emptyPrunedInformation()

      const logs: DailyLog[] = [
        {
          date: new Date('2026-08-01').getTime(),
          mood: 4,
          streak: true,
          pointsAcummulated: 10,
          timeWorked: 60,
          tasksCompleted: 2,
          habitsCompleted: 3,
        },
        {
          date: new Date('2026-08-02').getTime(),
          mood: 5,
          streak: true,
          pointsAcummulated: 20,
          timeWorked: 120,
          tasksCompleted: 1,
          habitsCompleted: 2,
        },
      ]

      const result =
        mergeDailyLogsIntoPrunedInformation(
          previous,
          logs,
        )

      expect(result.firstDate).toBe(
        logs[0].date,
      )

      expect(
        result.totals.pointsAcummulated,
      ).toBe(30)

      expect(
        result.totals.timeWorked,
      ).toBe(180)

      expect(
        result.totals.tasksCompleted,
      ).toBe(3)

      expect(
        result.totals.habitsCompleted,
      ).toBe(5)

      expect(result.activeDays).toBe(2)

      expect(result.mood).toEqual({
        sum: 9,
        count: 2,
      })

      expect(
        result.historicalPoints,
      ).toEqual([10, 20])
    })


    it('should preserve previous information', () => {
      const previous = {
        ...emptyPrunedInformation(),

        firstDate:
          new Date('2026-07-01').getTime(),

        totals: {
          pointsAcummulated: 100,
          timeWorked: 200,
          tasksCompleted: 10,
          habitsCompleted: 20,
        },

        historicalPoints: [50],

        activeDays: 5,

        mood: {
          sum: 20,
          count: 5,
        },
      }

      const log: DailyLog = {
        date:
          new Date('2026-08-01').getTime(),

        mood: 4,
        streak: true,
        pointsAcummulated: 10,
        timeWorked: 30,
        tasksCompleted: 1,
        habitsCompleted: 2,
      }

      const result =
        mergeDailyLogsIntoPrunedInformation(
          previous,
          [log],
        )

      expect(
        result.totals.pointsAcummulated,
      ).toBe(110)

      expect(
        result.totals.timeWorked,
      ).toBe(230)

      expect(
        result.totals.tasksCompleted,
      ).toBe(11)

      expect(
        result.totals.habitsCompleted,
      ).toBe(22)

      expect(result.activeDays).toBe(6)

      expect(result.historicalPoints)
        .toEqual([50, 10])

      expect(result.mood)
        .toEqual({
          sum: 24,
          count: 6,
        })
    })


    it('should process logs in chronological order', () => {
      const previous =
        emptyPrunedInformation()

      const logs: DailyLog[] = [
        {
          date:
            new Date('2026-08-03').getTime(),
          mood: 3,
          streak: false,
          pointsAcummulated: 30,
          timeWorked: 30,
          tasksCompleted: 1,
          habitsCompleted: 0,
        },
        {
          date:
            new Date('2026-08-01').getTime(),
          mood: 4,
          streak: false,
          pointsAcummulated: 10,
          timeWorked: 10,
          tasksCompleted: 0,
          habitsCompleted: 1,
        },
      ]

      const result =
        mergeDailyLogsIntoPrunedInformation(
          previous,
          logs,
        )

      expect(result.firstDate).toBe(
        new Date('2026-08-01').getTime(),
      )

      expect(
        result.historicalPoints,
      ).toEqual([10, 30])
    })

  })


  describe('reconstructEntitiesUntil', () => {

    const habit: Habit = {
      key: 1,
      name: 'Read',
      description: 'Read book',
      duration: 30,
      date: Date.now(),
      repeat: 'daily',
      completed: false,
    }

    const task: Task = {
      key: 10,
      name: 'Study',
      description: 'Study TypeScript',
      duration: 60,
      date: Date.now(),
      completed: false,
    }

    const nothe: Nothe = {
      key: 20,
      title: 'Note',
      content: 'Important',
    }


    it('should add entities', () => {
      const events: Event[] = [
        {
          id: 1,
          type: 'Habit',
          action: 'added',
          eventKey: 1,
          date: 100,
          newData: {
            Habit: habit,
          },
        },

        {
          id: 2,
          type: 'Task',
          action: 'added',
          eventKey: 10,
          date: 200,
          newData: {
            Task: task,
          },
        },

        {
          id: 3,
          type: 'Nothe',
          action: 'added',
          eventKey: 20,
          date: 300,
          newData: {
            Nothe: nothe,
          },
        },
      ]

      const result =
        reconstructEntitiesUntil(
          {
            habits: [],
            tasks: [],
            nothes: [],
          },
          events,
        )

      expect(result.habits).toHaveLength(1)
      expect(result.tasks).toHaveLength(1)
      expect(result.nothes).toHaveLength(1)

      expect(result.habits[0]).toEqual(habit)

      expect(result.tasks[0]).toEqual({
        ...task,
        completed: false,
      })

      expect(result.nothes[0]).toEqual(nothe)
    })


    it('should edit existing entities', () => {
      const originalHabit: Habit = {
        ...habit,
        name: 'Old name',
        completed: true,
      }

      const events: Event[] = [
        {
          id: 1,
          type: 'Habit',
          action: 'edited',
          eventKey: 1,
          date: 200,
          newData: {
            Habit: {
              ...habit,
              name: 'New name',
              completed: false,
            },
          },
        },
      ]

      const result =
        reconstructEntitiesUntil(
          {
            habits: [originalHabit],
            tasks: [],
            nothes: [],
          },
          events,
        )

      expect(result.habits[0]).toEqual({
        ...originalHabit,
        name: 'New name',
        completed: true,
      })
    })


    it('should delete entities', () => {
      const events: Event[] = [
        {
          id: 1,
          type: 'Habit',
          action: 'deleted',
          eventKey: 1,
          date: 100,
        },

        {
          id: 2,
          type: 'Task',
          action: 'deleted',
          eventKey: 10,
          date: 200,
        },

        {
          id: 3,
          type: 'Nothe',
          action: 'deleted',
          eventKey: 20,
          date: 300,
        },
      ]

      const result =
        reconstructEntitiesUntil(
          {
            habits: [habit],
            tasks: [task],
            nothes: [nothe],
          },
          events,
        )

      expect(result.habits).toEqual([])
      expect(result.tasks).toEqual([])
      expect(result.nothes).toEqual([])
    })


    it('should complete and uncomplete tasks', () => {
      const events: Event[] = [
        {
          id: 1,
          type: 'Task',
          action: 'completed',
          eventKey: 10,
          date: 100,
          duration: 60,
        },

        {
          id: 2,
          type: 'Task',
          action: 'uncompleted',
          eventKey: 10,
          date: 200,
          duration: 60,
        },
      ]

      const result =
        reconstructEntitiesUntil(
          {
            habits: [],
            tasks: [task],
            nothes: [],
          },
          events,
        )

      expect(result.tasks[0].completed)
        .toBe(false)
    })


    it('should not mutate the base entities', () => {
      const base = {
        habits: [habit],
        tasks: [task],
        nothes: [nothe],
      }

      reconstructEntitiesUntil(
        base,
        [],
      )

      expect(base.habits[0]).toEqual(habit)
      expect(base.tasks[0]).toEqual(task)
      expect(base.nothes[0]).toEqual(nothe)
    })


    it('should process events chronologically', () => {
      const events: Event[] = [
        {
          id: 2,
          type: 'Task',
          action: 'completed',
          eventKey: 10,
          date: 200,
          duration: 60,
        },

        {
          id: 1,
          type: 'Task',
          action: 'added',
          eventKey: 10,
          date: 100,
          newData: {
            Task: task,
          },
        },
      ]

      const result =
        reconstructEntitiesUntil(
          {
            habits: [],
            tasks: [],
            nothes: [],
          },
          events,
        )

      expect(result.tasks[0].completed)
        .toBe(true)
    })

  })


  describe('updateHabitCompletions', () => {

    it('should add completed dates', () => {
      const result =
        updateHabitCompletions(
          {},
          [
            {
              id: 1,
              type: 'Habit',
              action: 'completed',
              eventKey: 1,
              date: 100,
              duration: 30,
            },
          ],
        )

      expect(result).toEqual({
        1: [100],
      })
    })


    it('should ignore non-Habit events', () => {
      const result =
        updateHabitCompletions(
          {},
          [
            {
              id: 1,
              type: 'Task',
              action: 'completed',
              eventKey: 10,
              date: 100,
              duration: 30,
            },
          ],
        )

      expect(result).toEqual({})
    })


    it('should preserve previous completion history', () => {
      const result =
        updateHabitCompletions(
          {
            1: [100, 200],
          },
          [],
        )

      expect(result).toEqual({
        1: [100, 200],
      })
    })


    it('should not mutate previous completion history', () => {
      const previous = {
        1: [100, 200],
      }

      updateHabitCompletions(
        previous,
        [
          {
            id: 1,
            type: 'Habit',
            action: 'completed',
            eventKey: 1,
            date: 300,
            duration: 30,
          },
        ],
      )

      expect(previous).toEqual({
        1: [100, 200],
      })
    })


    it('should process completion events chronologically', () => {
      const result =
        updateHabitCompletions(
          {},
          [
            {
              id: 2,
              type: 'Habit',
              action: 'completed',
              eventKey: 1,
              date: 300,
              duration: 30,
            },

            {
              id: 1,
              type: 'Habit',
              action: 'completed',
              eventKey: 1,
              date: 100,
              duration: 30,
            },
          ],
        )

      expect(result[1]).toEqual([
        100,
        300,
      ])
    })


    it('should remove the last completion on uncompleted', () => {
      const result =
        updateHabitCompletions(
          {
            1: [100, 200],
          },
          [
            {
              id: 3,
              type: 'Habit',
              action: 'uncompleted',
              eventKey: 1,
              date: 300,
              duration: 30,
            },
          ],
        )

      expect(result).toEqual({
        1: [100],
      })
    })

  })


  describe('createSnapshotEvents', () => {

    it('should create snapshot events for all entities', () => {
      const habit: Habit = {
        key: 1,
        name: 'Habit',
        duration: 30,
        date: 100,
        repeat: 'daily',
        completed: false,
      }

      const task: Task = {
        key: 2,
        name: 'Task',
        duration: 60,
        date: 100,
        completed: true,
      }

      const nothe: Nothe = {
        key: 3,
        title: 'Note',
      }

      const result =
        createSnapshotEvents(
          {
            habits: [habit],
            tasks: [task],
            nothes: [nothe],
          },
          1000,
        )

      expect(result).toHaveLength(3)

      expect(result[0]).toMatchObject({
        type: 'Habit',
        action: 'added',
        eventKey: 1,
        date: 1000,
        newData: {
          Habit: habit,
        },
      })

      expect(result[1]).toMatchObject({
        type: 'Task',
        action: 'added',
        eventKey: 2,
        date: 1000,
        newData: {
          Task: task,
        },
      })

      expect(result[2]).toMatchObject({
        type: 'Nothe',
        action: 'added',
        eventKey: 3,
        date: 1000,
        newData: {
          Nothe: nothe,
        },
      })

      expect(result.every(e => e.id < 0))
        .toBe(true)
    })


    it('should return an empty array when there are no entities', () => {
      expect(
        createSnapshotEvents(
          {
            habits: [],
            tasks: [],
            nothes: [],
          },
          1000,
        ),
      ).toEqual([])
    })

 it('should not mutate entities', () => {
    const habit: Habit = {
      key: 1,
      name: 'Habit',
      duration: 30,
      date: 100,
      repeat: 'daily',
      completed: false,
    }

    const entities = {
      habits: [habit],
      tasks: [],
      nothes: [],
    }

    const result = createSnapshotEvents(
      entities,
      1000,
    )

    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('Habit')

    if (result[0].type !== 'Habit') {
      throw new Error('Expected Habit snapshot')
    }

    expect(result[0].newData?.Habit).not.toBe(habit)
    expect(result[0].newData?.Habit).toEqual(habit)
  })


  })




  describe('getLocalStorageSizeBytes', () => {

    beforeEach(() => {
      localStorage.clear()
    })


    it('should calculate localStorage size', () => {
      localStorage.setItem(
        'abc',
        '1234',
      )

      const expected =
        ('abc'.length + '1234'.length) * 2

      expect(
        getLocalStorageSizeBytes(),
      ).toBe(expected)
    })


    it('should include all localStorage entries', () => {
      localStorage.setItem(
        'abc',
        '1234',
      )

      localStorage.setItem(
        'hello',
        'world',
      )

      const expected =
        (
          'abc'.length +
          '1234'.length +
          'hello'.length +
          'world'.length
        ) * 2

      expect(
        getLocalStorageSizeBytes(),
      ).toBe(expected)
    })

  })

})

