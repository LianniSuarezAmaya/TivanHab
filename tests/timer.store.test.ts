import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { Task } from '../ui/items/types/items.types'

import { TimerStore } from '../store/stores/timer.store'
import { ItemStore } from '../store/stores/items.store'


describe('TimerStore', () => {

  const task: Task = {
    key: 1,
    name: 'TEST TASK',
    description: 'test',
    duration: 60,
    date: Date.now(),
    completed: false,
  }

  beforeEach(() => {
    vi.useFakeTimers()

    vi.spyOn(ItemStore, 'getState').mockReturnValue({
      taskIsDoing: task,
      setTaskIsDoing: vi.fn(),
      editItem: vi.fn(),
      moveItem: vi.fn(),
    } as any)

    TimerStore.setState({
      cont: 0,
      time: 0,
      accumulatedTime: 0,
      isRunning: false,
      intervalID: undefined,
      start: 0,
      error: null,
    })
  })

  afterEach(() => {
    const interval = TimerStore.getState().intervalID

    if (interval) {
      clearInterval(interval)
    }

    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('getActiveTask', () => {

    it('should return the active task', () => {
      const result = TimerStore.getState().getActiveTask()

      expect(result).toEqual(task)
    })

    it('should return null when there is no active task', () => {
      vi.spyOn(ItemStore, 'getState').mockReturnValue({
        taskIsDoing: null,
      } as any)

      expect(
        TimerStore.getState().getActiveTask()
      ).toBeNull()
    })

    it('should return null when the active task is completed', () => {
      vi.spyOn(ItemStore, 'getState').mockReturnValue({
        taskIsDoing: {
          ...task,
          completed: true,
        },
      } as any)

      expect(
        TimerStore.getState().getActiveTask()
      ).toBeNull()
    })
  })

  describe('timeIsValid', () => {

    it('should return false when no time has elapsed', () => {
      expect(
        TimerStore.getState().timeIsValid()
      ).toBe(false)
    })

    it('should return true when time is greater than zero', () => {
      TimerStore.setState({
        time: 1000,
      })

      expect(
        TimerStore.getState().timeIsValid()
      ).toBe(true)
    })

    it('should return true when accumulated time is greater than zero', () => {
      TimerStore.setState({
        accumulatedTime: 1000,
      })

      expect(
        TimerStore.getState().timeIsValid()
      ).toBe(true)
    })
  })

  describe('startTimer', () => {

    it('should not start without an active task', () => {
      vi.spyOn(ItemStore, 'getState').mockReturnValue({
        taskIsDoing: null,
      } as any)

      TimerStore.getState().startTimer()

      expect(
        TimerStore.getState().isRunning
      ).toBe(false)
    })

    it('should start the timer when there is an active task', () => {
      vi.setSystemTime(10000)

      TimerStore.getState().startTimer()

      const state = TimerStore.getState()

      expect(state.isRunning).toBe(true)
      expect(state.intervalID).toBeDefined()
      expect(state.error).toBeNull()
    })

    it('should update elapsed time every second', () => {
      vi.setSystemTime(10000)

      TimerStore.getState().startTimer()

      vi.advanceTimersByTime(3000)

      expect(
        TimerStore.getState().time
      ).toBe(3000)
    })
  })

  describe('pauseTimer', () => {

    it('should do nothing when there is no elapsed time', () => {
      TimerStore.getState().pauseTimer()

      expect(
        TimerStore.getState().isRunning
      ).toBe(false)
    })

    it('should pause the timer and preserve elapsed time', () => {
      vi.setSystemTime(10000)

      TimerStore.getState().startTimer()

      vi.advanceTimersByTime(3000)

      TimerStore.getState().pauseTimer()

      const state = TimerStore.getState()

      expect(state.isRunning).toBe(false)
      expect(state.accumulatedTime).toBe(3000)
      expect(state.intervalID).toBeUndefined()
    })
  })

  describe('resetTimer', () => {

    it('should remove the active task and reset the timer', () => {
      vi.setSystemTime(10000)

      TimerStore.getState().startTimer()

      vi.advanceTimersByTime(3000)

      TimerStore.getState().resetTimer()

      const state = TimerStore.getState()

      expect(state.time).toBe(0)
      expect(state.accumulatedTime).toBe(0)
      expect(state.isRunning).toBe(false)
      expect(state.intervalID).toBeUndefined()
    })
  })

  describe('resetInterval', () => {

    it('should reset all timer values', () => {
      TimerStore.setState({
        cont: 5,
        time: 5000,
        accumulatedTime: 5000,
        isRunning: true,
        start: 1000,
        error: 'error',
      })

      TimerStore.getState().resetInterval()

      const state = TimerStore.getState()

      expect(state.time).toBe(0)
      expect(state.accumulatedTime).toBe(0)
      expect(state.start).toBe(0)
      expect(state.isRunning).toBe(false)
      expect(state.intervalID).toBeUndefined()
      expect(state.error).toBeNull()
      expect(state.cont).toBe(6)
    })
  })

  describe('completeTimer', () => {

    it('should do nothing without an active task', () => {
      vi.spyOn(ItemStore, 'getState').mockReturnValue({
        taskIsDoing: null,
      } as any)

      TimerStore.setState({
        time: 5000,
        accumulatedTime: 5000,
      })

      TimerStore.getState().completeTimer()

      expect(
        TimerStore.getState().time
      ).toBe(5000)
    })

    it('should edit and complete the active task', () => {
      const editItem = vi.fn()
      const moveItem = vi.fn()

      vi.spyOn(ItemStore, 'getState').mockReturnValue({
        taskIsDoing: task,
        editItem,
        moveItem,
        setTaskIsDoing: vi.fn(),
      } as any)

      TimerStore.setState({
        time: 5000,
        accumulatedTime: 5000,
      })

      TimerStore.getState().completeTimer()

      expect(editItem).toHaveBeenCalledWith({
        ...task,
        duration: 5000,
        key: task.key,
      })

      expect(moveItem).toHaveBeenCalledWith(task.key)
    })
  })

  describe('restoreTimer', () => {

    it('should restore a running timer', () => {
      vi.setSystemTime(10000)

      TimerStore.setState({
        isRunning: true,
        accumulatedTime: 5000,
        time: 5000,
      })

      TimerStore.getState().restoreTimer()

      const state = TimerStore.getState()

      expect(state.intervalID).toBeDefined()
      expect(state.isRunning).toBe(true)
    })

    it('should stop a running timer with no accumulated time', () => {
      TimerStore.setState({
        isRunning: true,
        accumulatedTime: 0,
      })

      TimerStore.getState().restoreTimer()

      expect(
        TimerStore.getState().isRunning
      ).toBe(false)
    })
  })
})