import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest'

import {
  calculateNextDue,
  recalculateNextDue,
  isItemLate,
  isSameDay,
  isHabit,
  isTask,
} from './items.utils'

import EventStore from '../../store/stores/events.store'

import type {
  Habit,
  Task,
} from '../../ui/items/types/items.types'


describe('items utils', () => {

  beforeEach(() => {
    vi.useFakeTimers()

    vi.setSystemTime(
      new Date('2026-08-22T12:00:00')
    )

    EventStore.setState({
      events: [],
      prunedInformation: {
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
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })


  function createHabit(
    overrides: Partial<Habit> = {}
  ): Habit {
    return {
      key: 1,
      name: 'Test habit',
      duration: 30,
      date: new Date(
        '2026-08-01T10:00:00'
      ).getTime(),
      repeat: 'daily',
      completed: false,
      ...overrides,
    }
  }


  function createTask(
    overrides: Partial<Task> = {}
  ): Task {
    return {
      key: 1,
      name: 'Test task',
      duration: 30,
      date: new Date(
        '2026-08-21T10:00:00'
      ).getTime(),
      completed: false,
      ...overrides,
    }
  }


  describe('calculateNextDue', () => {

    describe('daily', () => {

      it('should return the next day', () => {
        const habit = createHabit({
          repeat: 'daily',
        })

        const from = new Date(
          '2026-08-10T15:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-11T00:00:00'
          ).getTime()
        )
      })


      it('should not calculate a date before the habit start date', () => {
        const habit = createHabit({
          repeat: 'daily',
          date: new Date(
            '2026-08-15T10:00:00'
          ).getTime(),
        })

        const from = new Date(
          '2026-08-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-16T00:00:00'
          ).getTime()
        )
      })

    })


    describe('weekly', () => {

      it('should return the next configured weekday', () => {
        // 2026-08-10 = Monday
        const habit = createHabit({
          repeat: 'weekly',
          daysOfWeek: [3], // Wednesday
        })

        const from = new Date(
          '2026-08-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-12T00:00:00'
          ).getTime()
        )
      })


      it('should go to the next week when there is no later weekday', () => {
        // Monday -> configured Sunday
        const habit = createHabit({
          repeat: 'weekly',
          daysOfWeek: [0],
        })

        const from = new Date(
          '2026-08-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-16T00:00:00'
          ).getTime()
        )
      })


      it('should use a 7 day interval when no weekdays are configured', () => {
        const habit = createHabit({
          repeat: 'weekly',
          daysOfWeek: [],
        })

        const from = new Date(
          '2026-08-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-17T00:00:00'
          ).getTime()
        )
      })


      it('should sort configured weekdays before calculating', () => {
        const habit = createHabit({
          repeat: 'weekly',
          daysOfWeek: [5, 2, 4],
        })

        // Monday
        const from = new Date(
          '2026-08-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-08-11T00:00:00'
          ).getTime()
        )
      })

    })


    describe('monthly', () => {

      it('should return the same day in the next month', () => {
        const habit = createHabit({
          repeat: 'monthly',
          date: new Date(
            '2026-01-15T10:00:00'
          ).getTime(),
        })

        const from = new Date(
          '2026-02-10T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-03-15T00:00:00'
          ).getTime()
        )
      })


      it('should clamp the day when the next month is shorter', () => {
        const habit = createHabit({
          repeat: 'monthly',
          date: new Date(
            '2026-01-31T10:00:00'
          ).getTime(),
        })

        const from = new Date(
          '2026-01-31T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2026-02-28T00:00:00'
          ).getTime()
        )
      })


      it('should handle leap years', () => {
        const habit = createHabit({
          repeat: 'monthly',
          date: new Date(
            '2024-01-31T10:00:00'
          ).getTime(),
        })

        const from = new Date(
          '2024-01-31T10:00:00'
        ).getTime()

        const result =
          calculateNextDue(habit, from)

        expect(result).toBe(
          new Date(
            '2024-02-29T00:00:00'
          ).getTime()
        )
      })

    })


    it('should use the next day for an unknown repeat value', () => {
      const habit = createHabit({
        repeat: 'something-invalid' as Habit['repeat'],
      })

      const from = new Date(
        '2026-08-10T10:00:00'
      ).getTime()

      const result =
        calculateNextDue(habit, from)

      expect(result).toBe(
        new Date(
          '2026-08-11T00:00:00'
        ).getTime()
      )
    })

  })


  describe('recalculateNextDue', () => {

    it('should calculate from habit.date when there is no completion history', () => {
      const habit = createHabit({
        repeat: 'daily',
        date: new Date(
          '2026-08-20T10:00:00'
        ).getTime(),
      })

      const result =
        recalculateNextDue(habit)

      expect(result).toBe(
        new Date(
          '2026-08-21T00:00:00'
        ).getTime()
      )
    })


    it('should calculate from the last completion', () => {
      const habit = createHabit({
        key: 10,
        repeat: 'daily',
        date: new Date(
          '2026-08-01T10:00:00'
        ).getTime(),
      })

      EventStore.setState({
        prunedInformation: {
          ...EventStore.getState()
            .prunedInformation,

          habitCompletions: {
            10: [
              new Date(
                '2026-08-20T10:00:00'
              ).getTime(),
              new Date(
                '2026-08-21T10:00:00'
              ).getTime(),
            ],
          },
        },
      })

      const result =
        recalculateNextDue(habit)

      expect(result).toBe(
        new Date(
          '2026-08-22T00:00:00'
        ).getTime()
      )
    })

  })


  describe('isItemLate', () => {

    describe('habit', () => {

      it('should return false when the habit is due today', () => {
        const habit = createHabit({
          repeat: 'daily',
          date: new Date(
            '2026-08-21T10:00:00'
          ).getTime(),
        })

        const result =
          isItemLate(
            habit,
            new Date(
              '2026-08-22T12:00:00'
            ).getTime()
          )

        expect(result).toBe(false)
      })


      it('should return true when the habit due date is before today', () => {
        const habit = createHabit({
          repeat: 'daily',
          date: new Date(
            '2026-08-01T10:00:00'
          ).getTime(),
        })

        const result =
          isItemLate(
            habit,
            new Date(
              '2026-08-22T12:00:00'
            ).getTime()
          )

        expect(result).toBe(true)
      })

    })


    describe('task', () => {

      it('should return false when the task is dated today', () => {
        const task = createTask({
          date: new Date(
            '2026-08-22T10:00:00'
          ).getTime(),
        })

        const result =
          isItemLate(
            task,
            new Date(
              '2026-08-22T12:00:00'
            ).getTime()
          )

        expect(result).toBe(false)
      })


      it('should return true when the task date is before today', () => {
        const task = createTask({
          date: new Date(
            '2026-08-21T10:00:00'
          ).getTime(),
        })

        const result =
          isItemLate(
            task,
            new Date(
              '2026-08-22T12:00:00'
            ).getTime()
          )

        expect(result).toBe(true)
      })


      it('should return false when the task date is in the future', () => {
        const task = createTask({
          date: new Date(
            '2026-08-23T10:00:00'
          ).getTime(),
        })

        const result =
          isItemLate(
            task,
            new Date(
              '2026-08-22T12:00:00'
            ).getTime()
          )

        expect(result).toBe(false)
      })

    })

  })


  describe('isSameDay', () => {

    it('should return true for the same UTC day', () => {
      const a = Date.UTC(
        2026,
        7,
        22,
        10,
        0
      )

      const b = Date.UTC(
        2026,
        7,
        22,
        23,
        59
      )

      expect(
        isSameDay(a, b)
      ).toBe(true)
    })


    it('should return false for different UTC days', () => {
      const a = Date.UTC(
        2026,
        7,
        22,
        23,
        59
      )

      const b = Date.UTC(
        2026,
        7,
        23,
        0,
        1
      )

      expect(
        isSameDay(a, b)
      ).toBe(false)
    })


    it('should work across different months', () => {
      const a = Date.UTC(
        2026,
        7,
        31
      )

      const b = Date.UTC(
        2026,
        8,
        1
      )

      expect(
        isSameDay(a, b)
      ).toBe(false)
    })

  })


  describe('type guards', () => {

    it('should identify a habit', () => {
      const habit = createHabit()

      expect(
        isHabit(habit)
      ).toBe(true)

      expect(
        isTask(habit)
      ).toBe(false)
    })


    it('should identify a task', () => {
      const task = createTask()

      expect(
        isTask(task)
      ).toBe(true)

      expect(
        isHabit(task)
      ).toBe(false)
    })


    it('should return false for null', () => {
      expect(isHabit(null)).toBe(false)
      expect(isTask(null)).toBe(false)
    })


    it('should return false for undefined', () => {
      expect(isHabit(undefined)).toBe(false)
      expect(isTask(undefined)).toBe(false)
    })


    it('should return false for primitives', () => {
      expect(isHabit('habit')).toBe(false)
      expect(isTask('task')).toBe(false)

      expect(isHabit(123)).toBe(false)
      expect(isTask(123)).toBe(false)
    })

  })

})