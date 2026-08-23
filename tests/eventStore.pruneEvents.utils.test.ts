import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { Habit, Task } from '../ui/items/types/items.types.js'
import type { Nothe } from '../ui/nothes/types/nothes.types.js'

import {
 
  updateHabitCompletions,
  createSnapshotEvents,
  emptyPrunedInformation,
  getLocalStorageSizeBytes,
} from '../store/utils/eventStore.pruneEvents.utils.js'


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

