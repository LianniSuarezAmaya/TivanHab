
import dayjs from 'dayjs'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import EventStore from './events.store'

import {
  MAX_LOCAL_STORAGE_BYTES,
  PRUNE_CHECK_INTERVAL,
  emptyPrunedInformation,
} from '../utils/eventStore.pruneEvents.utils'

import type { Event } from '../types/events.types.ts'
import { Habit } from '@/ui/items/types/items.types'


describe('EventStore derived functions', () => {
  beforeEach(() => {
    EventStore.setState({
      events: [],
      prunedInformation: {
        ...emptyPrunedInformation(),
      },
    })
  })

  describe('reconstructHabits', () => {
    it('should reconstruct a habit from an added event', () => {
      const habit:Habit = {
        key: 1,
        name: 'READ BOOK',
        description: 'Read every day',
        duration: 10,
        date: Date.now(),
        completed: false,
        repeat: 'daily',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Habit: habit,
            },
          },
        ],
      })

      expect(EventStore.getState().reconstructHabits())
        .toEqual([habit])
    })

    it('should apply habit edits', () => {
      const habit:Habit = {
        key: 1,
        name: 'READ BOOK',
        description: 'Old description',
        duration: 10,
        date: Date.now(),
        completed: false,
        repeat: 'daily',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Habit: habit,
            },
          },
          {
            id: 2,
            type: 'Habit',
            action: 'edited',
            eventKey: 1,
            date: 2000,
            newData: {
              Habit: {
                ...habit,
                name: 'NEW NAME',
              },
            },
          },
        ],
      })

      const result =
        EventStore.getState().reconstructHabits()

      expect(result[0].name).toBe('NEW NAME')
    })

    it('should remove a deleted habit', () => {
      const habit:Habit = {
        key: 1,
        name: 'READ BOOK',
        description: '',
        duration: 10,
        date: Date.now(),
        completed: false,
        repeat: 'daily',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Habit: habit,
            },
          },
          {
            id: 2,
            type: 'Habit',
            action: 'deleted',
            eventKey: 1,
            date: 2000,
          },
        ],
      })

      expect(
        EventStore.getState().reconstructHabits()
      ).toEqual([])
    })

    it('should mark a habit completed when completed today', () => {
      const habit:Habit = {
        key: 1,
        name: 'READ BOOK',
        description: '',
        duration: 10,
        date: Date.now(),
        completed: false,
        repeat: 'daily',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'added',
            eventKey: 1,
            date: Date.now() - 1000,
            newData: {
              Habit: habit,
            },
          },
          {
            id: 2,
            type: 'Habit',
            action: 'completed',
            eventKey: 1,
            date: Date.now(),
            duration: 10,
          },
        ],
      })

      const result =
        EventStore.getState().reconstructHabits()

      expect(result[0].completed).toBe(true)
    })
  })

  describe('reconstructTasks', () => {
    it('should reconstruct a task from an added event', () => {
      const task = {
        key: 1,
        name: 'DO WORK',
        description: 'Work',
        duration: 30,
        date: Date.now(),
        completed: false,
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Task: task,
            },
          },
        ],
      })

      expect(EventStore.getState().reconstructTasks())
        .toEqual([
          {
            ...task,
            completed: false,
          },
        ])
    })

    it('should mark a task as completed', () => {
      const task = {
        key: 1,
        name: 'DO WORK',
        description: '',
        duration: 30,
        date: Date.now(),
        completed: false,
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Task: task,
            },
          },
          {
            id: 2,
            type: 'Task',
            action: 'completed',
            eventKey: 1,
            date: 2000,
            duration: 30,
          },
        ],
      })

      const result =
        EventStore.getState().reconstructTasks()

      expect(result[0].completed).toBe(true)
    })

    it('should mark a task as uncompleted', () => {
      const task = {
        key: 1,
        name: 'DO WORK',
        description: '',
        duration: 30,
        date: Date.now(),
        completed: false,
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Task: task,
            },
          },
          {
            id: 2,
            type: 'Task',
            action: 'completed',
            eventKey: 1,
            date: 2000,
            duration: 30,
          },
          {
            id: 3,
            type: 'Task',
            action: 'uncompleted',
            eventKey: 1,
            date: 3000,
            duration: 30,
          },
        ],
      })

      const result =
        EventStore.getState().reconstructTasks()

      expect(result[0].completed).toBe(false)
    })

    it('should remove a deleted task', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Task: {
                key: 1,
                name: 'DO WORK',
                description: '',
                duration: 30,
                date: 1000,
                completed: false,
              },
            },
          },
          {
            id: 2,
            type: 'Task',
            action: 'deleted',
            eventKey: 1,
            date: 2000,
          },
        ],
      })

      expect(
        EventStore.getState().reconstructTasks()
      ).toEqual([])
    })
  })

  describe('reconstructNothes', () => {
    it('should reconstruct a Nothe', () => {
      const nothe = {
        key: 1,
        title: 'My note',
        content: 'Hello',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Nothe',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Nothe: nothe,
            },
          },
        ],
      })

      expect(EventStore.getState().reconstructNothes())
        .toEqual([nothe])
    })

    it('should apply a Nothe edit', () => {
      const nothe = {
        key: 1,
        title: 'Old title',
        content: 'Old content',
      }

      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Nothe',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Nothe: nothe,
            },
          },
          {
            id: 2,
            type: 'Nothe',
            action: 'edited',
            eventKey: 1,
            date: 2000,
            newData: {
              Nothe: {
                ...nothe,
                title: 'New title',
              },
            },
          },
        ],
      })

      const result =
        EventStore.getState().reconstructNothes()

      expect(result[0].title).toBe('New title')
    })

    it('should remove a deleted Nothe', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Nothe',
            action: 'added',
            eventKey: 1,
            date: 1000,
            newData: {
              Nothe: {
                key: 1,
                title: 'Note',
                content: 'Content',
              },
            },
          },
          {
            id: 2,
            type: 'Nothe',
            action: 'deleted',
            eventKey: 1,
            date: 2000,
          },
        ],
      })

      expect(
        EventStore.getState().reconstructNothes()
      ).toEqual([])
    })
  })

  describe('getLastCompleted', () => {
    it('should return historical habit completions', () => {
      EventStore.setState({
        events: [],
        prunedInformation: {
          ...emptyPrunedInformation(),
          habitCompletions: {
            1: [1000, 2000],
          },
        },
      })

      const habit = {
        key: 1,
      }

      expect(
        EventStore.getState().getLastCompleted(habit as any)
      ).toEqual([1000, 2000])
    })

    it('should add completed events', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'completed',
            duration:300,
            eventKey: 1,
            date: 3000,
          },
        ],
        prunedInformation: {
          ...emptyPrunedInformation(),
          lastPrunedAt: 0,
          habitCompletions: {},
        },
      })

      const result =
        EventStore.getState().getLastCompleted({
          key: 1,
        } as any)

      expect(result).toEqual([3000])
    })

    it('should remove the latest completion after uncompleted', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'completed',
            duration:300,
            eventKey: 1,
            date: 1000,
          },
          {
            id: 2,
            type: 'Habit',
            action: 'uncompleted',
            eventKey: 1,
            duration:300,
            date: 2000,
          },
        ],
        prunedInformation: {
          ...emptyPrunedInformation(),
          lastPrunedAt: 0,
          habitCompletions: {},
        },
      })

      expect(
        EventStore.getState().getLastCompleted({
          key: 1,
        } as any)
      ).toEqual([])
    })
  })

  describe('getTotalTime', () => {
    it('should return the total duration of completed tasks', () => {
      vi.spyOn(EventStore.getState(), 'getTasks')
        .mockReturnValue([
          {
            key: 1,
            completed: true,
            duration: 30,
          },
          {
            key: 2,
            completed: true,
            duration: 20,
          },
          {
            key: 3,
            completed: false,
            duration: 100,
          },
        ] as any)

      expect(
        EventStore.getState().getTotalTime()
      ).toBe(50)
    })

    it('should return zero when there are no completed tasks', () => {
      vi.spyOn(EventStore.getState(), 'getTasks')
        .mockReturnValue([])

      expect(
        EventStore.getState().getTotalTime()
      ).toBe(0)
    })
  })

  describe('getDailyLogs', () => {
    it('should return an empty array when there are no events', () => {
      EventStore.setState({
        events: [],
      })

      expect(
        EventStore.getState().getDailyLogs()
      ).toEqual([])
    })

    it('should count completed tasks', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'completed',
            eventKey: 1,
            date: new Date('2026-01-10').getTime(),
            duration: 1000,
          },
        ],
      })

      const result =
        EventStore.getState().getDailyLogs()

      expect(result[0].tasksCompleted).toBe(1)
      expect(result[0].timeWorked).toBe(1000)
    })

    it('should count completed habits', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Habit',
            action: 'completed',
            eventKey: 1,
            date: new Date('2026-01-10').getTime(),
            duration: 1000,
          },
        ],
      })

      const result =
        EventStore.getState().getDailyLogs()

      expect(result[0].habitsCompleted).toBe(1)
      expect(result[0].timeWorked).toBe(1000)
    })

    it('should apply mood to the daily log', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Mood',
            action: 'added',
            eventKey: 1,
            date: new Date('2026-01-10').getTime(),
            newData: {
              mood: 5,
            },
          },
        ],
      })

      const result =
        EventStore.getState().getDailyLogs()

      expect(result[0].mood).toBe(5)
    })

    it('should subtract task data after uncompleted', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'completed',
            eventKey: 1,
            date: new Date('2026-01-10').getTime(),
            duration: 1000,
          },
          {
            id: 2,
            type: 'Task',
            action: 'uncompleted',
            eventKey: 1,
            date: new Date('2026-01-10').getTime() + 1000,
            duration: 1000,
          },
        ],
      })

      const result =
        EventStore.getState().getDailyLogs()

      expect(result[0].tasksCompleted).toBe(0)
      expect(result[0].timeWorked).toBe(0)
    })

    it('should return logs ordered by date', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Task',
            action: 'completed',
            eventKey: 1,
            date: new Date('2026-01-12').getTime(),
            duration: 1000,
          },
          {
            id: 2,
            type: 'Task',
            action: 'completed',
            eventKey: 2,
            date: new Date('2026-01-10').getTime(),
            duration: 1000,
          },
        ],
      })

      const result =
        EventStore.getState().getDailyLogs()

      expect(result[0].date)
        .toBe(new Date('2026-01-10').getTime())

      expect(result[1].date)
        .toBe(new Date('2026-01-12').getTime())
    })
  })

  describe('getDailyMood', () => {
    it('should return the latest mood', () => {
      EventStore.setState({
        events: [
          {
            id: 1,
            type: 'Mood',
            action: 'added',
            eventKey: 1,
            date: new Date('2026-01-10').getTime(),
            newData: {
              mood: 2,
            },
          },
          {
            id: 2,
            type: 'Mood',
            action: 'added',
            eventKey: 2,
            date: new Date('2026-01-11').getTime(),
            newData: {
              mood: 5,
            },
          },
        ],
      })

      expect(
        EventStore.getState().getDailyMood()
      ).toBe(5)
    })

    it('should return 3 when there is no mood', () => {
      EventStore.setState({
        events: [],
      })

      expect(
        EventStore.getState().getDailyMood()
      ).toBe(3)
    })
  })
})