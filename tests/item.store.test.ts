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
  splitText,
} from '../store/utils/items.store.utils'
import { isHabit,isTask ,isSameDay} from '../store/utils/items.utils'
import { Habit, Task } from '../ui/items/types/items.types'


vi.mock('../store/utils/items.store.utils', () => ({
  FindHabitByKey: vi.fn(),
  FindTaskByKey: vi.fn(),
  FindItemByKey: vi.fn(),
  FindItemByName: vi.fn(),
  AddEvent: vi.fn(),
  IsSameKey: vi.fn(),
  splitText: vi.fn((text: string, limit: number) => text.substring(0, limit)),
}))

vi.mock('../store/utils/items.utils', () => ({

  isSameDay:vi.fn(),
  isHabit: vi.fn(),
  isTask: vi.fn(),
}))


// ✅ Mock de EventStore
vi.mock('../store/stores/events.store', () => ({
  default: {
    getState: vi.fn(() => ({
      getLastCompleted: vi.fn(() => []),
    })),
  },
}))

describe('ItemStore', () => {
  beforeEach(() => {
    // ✅ Resetear el store antes de cada test
    ItemStore.setState({
      order: 'newest',
      error: null,
      selectedHabit: null,
      selectedTask: null,
      taskIsDoing: null,
      isSubmitting: false,
    })
    
    // ✅ Resetear todos los mocks
    vi.clearAllMocks()
  })

  describe('addItem', () => {
    it('should reject an item with a duplicated name', () => {
      const mockItem = { 
        key: 1, 
        name: 'Test Item', 
        description: '', 
        duration: 10, 
        date: Date.now() 
      }
      
      // ✅ Mockear FindItemByName para que retorne true (item existe)
      ;(FindItemByName as any).mockReturnValue(mockItem)
      
      ItemStore.getState().addItem(mockItem as any)
      
      expect(ItemStore.getState().error).toBe(' Test Item alredy exist')
      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should create a Habit added event', () => {
      const mockHabit = {
        name: 'Exercise',
        description: 'Daily exercise',
        duration: 30,
        date: Date.now(),
        repeat: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
      }
      
      // ✅ Mockear FindItemByName para que retorne false (no existe)
      ;(FindItemByName as any).mockReturnValue(null)
      // ✅ Mockear isHabit para que retorne true
      ;(isHabit as any).mockReturnValue(true)
      ;(isTask as any).mockReturnValue(false)
      
      ItemStore.getState().addItem(mockHabit as any)
      
      expect(ItemStore.getState().error).toBeNull()
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should create a Task added event', () => {
      const mockTask = {
        name: 'Complete project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
      }
      
      // ✅ Mockear FindItemByName para que retorne false (no existe)
      ;(FindItemByName as any).mockReturnValue(null)
      // ✅ Mockear isHabit para que retorne false
      ;(isHabit as any).mockReturnValue(false)
      ;(isTask as any).mockReturnValue(true)
      
      ItemStore.getState().addItem(mockTask as any)
      
      expect(ItemStore.getState().error).toBeNull()
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should include the habit property on a task', () => {
      const mockTask = {
        name: 'Complete project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
        habit: 'Exercise',
      }
      
      ;(FindItemByName as any).mockReturnValue(null)
      ;(isHabit as any).mockReturnValue(false)
      ;(isTask as any).mockReturnValue(true)
      
      ItemStore.getState().addItem(mockTask as any)
      
      expect(AddEvent).toHaveBeenCalled()
      // ✅ Verificar que el evento incluye la propiedad habit
      const addEventCall = (AddEvent as any).mock.calls[0][0]
      expect(addEventCall.newData.Task.habit).toBe('Exercise')
    })
  })

  describe('editItem', () => {
    it('should set an error when the item does not exist', () => {
      ;(FindItemByKey as any).mockReturnValue(null)
      
      ItemStore.getState().editItem({ key: 999 } as any)
      
      expect(ItemStore.getState().error).toBe('An error ocurred. Please try again')
      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should create a Habit edited event', () => {
      const mockHabit = {
        key: 1,
        name: 'Exercise',
        description: 'Daily exercise',
        duration: 30,
        date: Date.now(),
        repeat: 'daily',
      }
      
      ;(FindItemByKey as any).mockReturnValue(mockHabit)
      ;(isHabit as any).mockReturnValue(true)
      
      ItemStore.getState().editItem({ ...mockHabit, name: 'New Exercise' } as any)
      
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should create a Task edited event', () => {
      const mockTask = {
        key: 1,
        name: 'Complete project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
      }
      
      ;(FindItemByKey as any).mockReturnValue(mockTask)
      ;(isHabit as any).mockReturnValue(false)
      ;(isTask as any).mockReturnValue(true)
      
      ItemStore.getState().editItem({ ...mockTask, name: 'New Project' } as any)
      
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })
  })

  describe('deleteItem', () => {
    it('should set an error when the item does not exist', () => {
      ;(FindHabitByKey as any).mockReturnValue(null)
      ;(FindTaskByKey as any).mockReturnValue(null)
      
      ItemStore.getState().deleteItem(999)
      
      expect(ItemStore.getState().error).toBe('An error ocurred. Please try again')
      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should delete a habit', () => {
      const mockHabit = {
        key: 1,
        name: 'Exercise',
        description: 'Daily exercise',
        duration: 30,
        date: Date.now(),
        repeat: 'daily',
      }
      
      ;(FindHabitByKey as any).mockReturnValue(mockHabit)
      ;(FindTaskByKey as any).mockReturnValue(null)
      ;(FindItemByKey as any).mockReturnValue(mockHabit)
      ;(isHabit as any).mockReturnValue(true)
      ;(IsSameKey as any).mockReturnValue(false)
      
      ItemStore.getState().deleteItem(1)
      
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should delete a task', () => {
      const mockTask = {
        key: 1,
        name: 'Complete project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
      }
      
      ;(FindHabitByKey as any).mockReturnValue(null)
      ;(FindTaskByKey as any).mockReturnValue(mockTask)
      ;(FindItemByKey as any).mockReturnValue(mockTask)
      ;(isHabit as any).mockReturnValue(false)
      ;(IsSameKey as any).mockReturnValue(false)
      
      ItemStore.getState().deleteItem(1)
      
      expect(AddEvent).toHaveBeenCalled()
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should clear selected item when deleting the selected item', () => {
      const mockHabit:Habit= {
        key: 1,
        name: 'Exercise',
        completed: false,
        description: 'Daily exercise',
        duration: 30,
        date: Date.now(),
        repeat: 'daily',
      }
      
      // ✅ Setear un habit seleccionado
      ItemStore.setState({ selectedHabit: mockHabit })
      
      ;(FindHabitByKey as any).mockReturnValue(mockHabit)
      ;(FindTaskByKey as any).mockReturnValue(null)
      ;(FindItemByKey as any).mockReturnValue(mockHabit)
      ;(isHabit as any).mockReturnValue(true)
      ;(IsSameKey as any).mockReturnValue(true) // ← El item seleccionado es el mismo
      
      ItemStore.getState().deleteItem(1)
      
      // ✅ Verificar que se limpió el selectedHabit
      expect(ItemStore.getState().selectedHabit).toBeNull()
      expect(ItemStore.getState().selectedTask).toBeNull()
      expect(AddEvent).not.toHaveBeenCalled()
    })
  })

  describe('moveItem', () => {
      beforeEach(() => {
    // ✅ Resetear el store
    ItemStore.setState({
      order: 'newest',
      error: null,
      selectedHabit: null,
      selectedTask: null,
      taskIsDoing: null,
      isSubmitting: false,
    })
    
    // ✅ Resetear todos los mocks
    vi.clearAllMocks()
    
      // ✅ Configurar mocks por defecto
   })

    it('should set an error when the item does not exist', () => {
      ;(FindItemByKey as any).mockReturnValue(null)
      
      ItemStore.getState().moveItem(999)
      
      expect(ItemStore.getState().error).toBe('An error ocurred . Please try again')
      expect(AddEvent).not.toHaveBeenCalled()
    })

    it('should complete an incomplete task', () => {
      const mockTask = {
        key: 1,
        name: 'Complete project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
        completed: false,
      }
      
      ;(FindItemByKey as any).mockReturnValue(mockTask)
      ;(isHabit as any).mockReturnValue(false)
      ;(isTask as any).mockReturnValue(true)
      
      ItemStore.getState().moveItem(1)
      
      expect(AddEvent).toHaveBeenCalled()
      const event = (AddEvent as any).mock.calls[0][0]
      expect(event.action).toBe('completed')
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })

    it('should uncomplete a completed task', () => {
      const mockTask:Task = {
        key: 1,
        name: 'Completed project',
        description: 'Finish the project',
        duration: 60,
        date: Date.now(),
        habit: 5,
        completed: true,
      }
      
      
      ;(FindItemByKey as any).mockReturnValue(mockTask)
     ItemStore.getState().moveItem(1)
      
      expect(AddEvent).toHaveBeenCalled()
      const event = (AddEvent as any).mock.calls[0][0]
      expect(event.action).toBe('uncompleted')
    })

    it('should complete a habit when it was not completed today', () => {
      const mockHabit = {
        key: 1,
        name: 'Exercise',
        description: 'Daily exercise',
        duration: 30,
        date: Date.now(),
        repeat: 'daily',
      }
       
console.log('TEST isHabit:', (isHabit as any)(mockHabit))
   
      
      ;(FindItemByKey as any).mockReturnValue(mockHabit)
      ;(isHabit as any).mockReturnValue(true)
      // ✅ Mockear EventStore para que retorne que NO se completó hoy
      const mockGetLastCompleted = vi.fn(() => [])
      ;(EventStore.getState as any).mockReturnValue({
        getLastCompleted: mockGetLastCompleted,
      })
      
      ItemStore.getState().moveItem(1)
      
      expect(AddEvent).toHaveBeenCalled()
      const event = (AddEvent as any).mock.calls[0][0]
      expect(event.action).toBe('completed')
    })


    it('should uncomplete a completed habit', () => {
      const now = Date.now()

      const mockHabit = {
        key: 1,
        name: 'Exercise',
        description: 'Daily exercise',
        duration: 30,
        date: now,
        repeat: 'daily',
      }

      ;(FindItemByKey as any).mockReturnValue(mockHabit)
      ;(isHabit as any).mockReturnValue(true)

      // El hábito fue completado hoy
      ;(isSameDay as any).mockReturnValue(true)

      const mockGetLastCompleted = vi.fn(() => {
        return [now]
      })

      ;(EventStore.getState as any).mockReturnValue({
        getLastCompleted: mockGetLastCompleted,
      })

      ItemStore.getState().moveItem(1)

      expect(AddEvent).toHaveBeenCalled()

      const event = (AddEvent as any).mock.calls[0][0]

      expect(event.action).toBe('uncompleted')
    })

  })

  describe('simple state setters', () => {
    it('should change the order', () => {
      ItemStore.getState().setOrder('oldest')
      expect(ItemStore.getState().order).toBe('oldest')
    })

    it('should set an error', () => {
      ItemStore.getState().setError('Test error')
      expect(ItemStore.getState().error).toBe('Test error')
    })

    it('should select a habit', () => {
      const habit = { key: 1, name: 'Exercise' } as any
      ItemStore.getState().setHabit(habit)
      expect(ItemStore.getState().selectedHabit).toBe(habit)
    })

    it('should select a task', () => {
      const task = { key: 1, name: 'Complete project' } as any
      ItemStore.getState().setTask(task)
      expect(ItemStore.getState().selectedTask).toBe(task)
    })

    it('should set the task being done', () => {
      const task = { key: 1, name: 'Complete project' } as any
      ItemStore.getState().setTaskIsDoing(task)
      expect(ItemStore.getState().taskIsDoing).toBe(task)
    })

    it('should change submitting state', () => {
      ItemStore.getState().setIsSubmitting(true)
      expect(ItemStore.getState().isSubmitting).toBe(true)
    })
  })
})