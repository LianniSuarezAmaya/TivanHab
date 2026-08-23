import { describe, it, expect, beforeEach, vi } from 'vitest'

import { ItemStore } from '../store/stores/items.store'
import EventStore from '../store/stores/events.store'

import {
  FindHabitByKey,
  FindTaskByKey,
  FindItemByKey,
  FindItemByName,
  AddEvent,
  IsSameKey,
} from '../store/utils/itemsStore.utils'


vi.mock('../store/utils/itemsStore.utils', () => ({
  FindHabitByKey: vi.fn(),
  FindTaskByKey: vi.fn(),
  FindItemByKey: vi.fn(),
  FindItemByName: vi.fn(),
  AddEvent: vi.fn(),
  IsSameKey: vi.fn(),
  splitText: vi.fn((text: string) => text),
}))

vi.mock('../store/stores/events.store', () => ({
  default: {
    getState: vi.fn(() => ({
      getLastCompleted: vi.fn(() => []),
    })),
  },
}))




vi.mock('./events.store', () => ({
  default: {
    getState: vi.fn(),
  },
}))

describe('ItemStore', () => {
  const habit = {
    key: 1,
    name: 'READ BOOK',
    description: 'Read every day',
    duration: 30,
    date: new Date('2026-08-22').getTime(),
    repeat: 'daily' as const,
    completed: false,
  }

  const task = {
    key: 2,
    name: 'STUDY',
    description: 'Study TypeScript',
    duration: 60,
    date: new Date('2026-08-22').getTime(),
    completed: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    ItemStore.setState({
      order: 'newest',
      error: null,
      selectedHabit: null,
      selectedTask: null,
      taskIsDoing: null,
      isSubmitting: false,
    })

    vi.mocked(FindItemByName).mockReturnValue(undefined)
    vi.mocked(FindItemByKey).mockReturnValue(undefined)
    vi.mocked(FindHabitByKey).mockReturnValue(undefined)
    vi.mocked(FindTaskByKey).mockReturnValue(undefined)
  })

  describe('addItem', () => {
 it('should reject an item with a duplicated name', () => {
  vi.mocked(FindItemByName).mockReturnValue(habit)

  ItemStore.getState().addItem(habit)

  expect(FindItemByName).toHaveBeenCalledWith(habit)
  expect(AddEvent).not.toHaveBeenCalled()

  expect(ItemStore.getState().error)
    .toBe(' READ BOOK alredy exist')
})

    it('should create a Habit added event', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.123)

      ItemStore.getState().addItem(habit)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock.calls[0][0]

      expect(event).toMatchObject({
        type: 'Habit',
        action: 'added',
        eventKey: 123,
        newData: {
          Habit: {
            key: 123,
            name: 'READ BOOK',
            description: habit.description,
            duration: habit.duration,
            date: habit.date,
            completed: false,
            repeat: 'daily',
            daysOfWeek: undefined,
          },
        },
      })

      expect(event.date).toEqual(expect.any(Number))

      expect(ItemStore.getState().error).toBeNull()
      expect(ItemStore.getState().isSubmitting).toBe(true)

      vi.restoreAllMocks()
    })

    it('should create a Task added event', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.456)

      ItemStore.getState().addItem(task)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock.calls[0][0]

      expect(event).toMatchObject({
        type: 'Task',
        action: 'added',
        eventKey: 456,
        newData: {
          Task: {
            key: 456,
            name: 'STUDY',
            description: task.description,
            duration: task.duration,
            date: task.date,
            completed: false,
          },
        },
      })

      vi.restoreAllMocks()
    })



    it('should include the habit property on a task', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.222)

  const taskWithHabit = {
    ...task,
    habit: 123,
  }

  ItemStore.getState().addItem(taskWithHabit)

  const event = vi.mocked(AddEvent).mock.calls[0][0]

  expect(event.type).toBe('Task')

  if (event.type !== 'Task') {
    throw new Error('Expected Task event')
  }

  expect(event.newData?.Task?.habit)
    .toBe(123)

  vi.restoreAllMocks()
})

  })

  describe('editItem', () => {
    it('should set an error when the item does not exist', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(undefined)

      ItemStore.getState().editItem({
        ...habit,
        name: 'NEW NAME',
      })

      expect(AddEvent).not.toHaveBeenCalled()

      expect(ItemStore.getState().error)
        .toBe(
          'An error ocurred. Please try again',
        )

      expect(ItemStore.getState().isSubmitting)
        .toBe(false)
    })

    it('should create a Habit edited event', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(habit)

      const editedHabit = {
        ...habit,
        name: 'NEW NAME',
      }

      ItemStore.getState().editItem(editedHabit)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Habit',
        action: 'edited',
        eventKey: habit.key,
        newData: {
          Habit: editedHabit,
        },
      })

      expect(ItemStore.getState().isSubmitting)
        .toBe(true)
    })

    it('should create a Task edited event', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(task)

      const editedTask = {
        ...task,
        name: 'NEW TASK',
      }

      ItemStore.getState().editItem(editedTask)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Task',
        action: 'edited',
        eventKey: task.key,
        newData: {
          Task: {
            ...task,
            name: 'NEW TASK',
          },
        },
      })
    })
  })

  describe('deleteItem', () => {
    it('should set an error when the item does not exist', () => {
      vi.mocked(FindHabitByKey)
        .mockReturnValue(undefined)

      vi.mocked(FindTaskByKey)
        .mockReturnValue(undefined)

      ItemStore.getState().deleteItem(999)

      expect(AddEvent).not.toHaveBeenCalled()

      expect(ItemStore.getState().error)
        .toBe(
          'An error ocurred. Please try again',
        )

      expect(ItemStore.getState().isSubmitting)
        .toBe(false)
    })

    it('should delete a habit', () => {
      vi.mocked(FindHabitByKey)
        .mockReturnValue(habit)

      ItemStore.getState().deleteItem(habit.key)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Habit',
        action: 'deleted',
        eventKey: habit.key,
      })

      expect(event.date).toEqual(expect.any(Number))

      expect(ItemStore.getState().isSubmitting)
        .toBe(true)
    })

    it('should delete a task', () => {
      vi.mocked(FindTaskByKey)
        .mockReturnValue(task)

      ItemStore.getState().deleteItem(task.key)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Task',
        action: 'deleted',
        eventKey: task.key,
      })
    })

    it('should clear selected item when deleting the selected item', () => {
      vi.mocked(FindHabitByKey)
        .mockReturnValue(habit)

      ItemStore.setState({
        selectedHabit: habit,
      })

      /*
       * IsSameKey está mockeado. Lo hacemos devolver true
       * para simular que el elemento eliminado es el seleccionado.
       */
    

      vi.mocked(IsSameKey)
        .mockReturnValue(true)

      ItemStore.getState().deleteItem(habit.key)

      expect(AddEvent).not.toHaveBeenCalled()

      expect(ItemStore.getState().selectedHabit)
        .toBeNull()

      expect(ItemStore.getState().selectedTask)
        .toBeNull()

      expect(ItemStore.getState().isSubmitting)
        .toBe(false)
    })
  })

  describe('moveItem', () => {
    it('should set an error when the item does not exist', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(undefined)

      ItemStore.getState().moveItem(999)

      expect(AddEvent).not.toHaveBeenCalled()

      expect(ItemStore.getState().error)
        .toBe(
          'An error ocurred . Please try again',
        )
    })

    it('should complete an incomplete task', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(task)

      ItemStore.getState().moveItem(task.key)

      expect(AddEvent).toHaveBeenCalledTimes(1)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Task',
        action: 'completed',
        eventKey: task.key,
        duration: task.duration * 60000,
      })

      expect(ItemStore.getState().isSubmitting)
        .toBe(true)
    })

    it('should uncomplete a completed task', () => {
      const completedTask = {
        ...task,
        completed: true,
      }

      vi.mocked(FindItemByKey)
        .mockReturnValue(completedTask)

      ItemStore.getState().moveItem(
        completedTask.key,
      )

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Task',
        action: 'uncompleted',
        eventKey: completedTask.key,
        duration: completedTask.duration * 60000,
      })
    })

    it('should complete a habit when it was not completed today', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(habit)

      vi.mocked(EventStore.getState)
        .mockReturnValue({
          getLastCompleted: vi.fn()
            .mockReturnValue([]),
        } as any)

      ItemStore.getState().moveItem(habit.key)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Habit',
        action: 'completed',
        eventKey: habit.key,
        duration: habit.duration * 60000,
      })
    })

    it('should uncomplete a habit when it was already completed today', () => {
      vi.mocked(FindItemByKey)
        .mockReturnValue(habit)

      vi.mocked(EventStore.getState)
        .mockReturnValue({
          getLastCompleted: vi.fn()
            .mockReturnValue([
              Date.now(),
            ]),
        } as any)

      ItemStore.getState().moveItem(habit.key)

      const event = vi.mocked(AddEvent).mock
        .calls[0][0]

      expect(event).toMatchObject({
        type: 'Habit',
        action: 'uncompleted',
        eventKey: habit.key,
        duration: habit.duration * 60000,
      })
    })
  })

  describe('simple state setters', () => {
    it('should change the order', () => {
      ItemStore.getState().setOrder('oldest')

      expect(ItemStore.getState().order)
        .toBe('oldest')
    })

    it('should set an error', () => {
      ItemStore.getState()
        .setError('Something went wrong')

      expect(ItemStore.getState().error)
        .toBe('Something went wrong')
    })

    it('should select a habit', () => {
      ItemStore.getState().setHabit(habit)

      expect(ItemStore.getState().selectedHabit)
        .toEqual(habit)
    })

    it('should select a task', () => {
      ItemStore.getState().setTask(task)

      expect(ItemStore.getState().selectedTask)
        .toEqual(task)
    })

    it('should set the task being done', () => {
      ItemStore.getState().setTaskIsDoing(task)

      expect(ItemStore.getState().taskIsDoing)
        .toEqual(task)
    })

    it('should change submitting state', () => {
      ItemStore.getState().setIsSubmitting(true)

      expect(ItemStore.getState().isSubmitting)
        .toBe(true)
    })
  })
})