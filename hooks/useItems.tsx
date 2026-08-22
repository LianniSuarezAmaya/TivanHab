'use client'


import dayjs from 'dayjs'

import { useCallback,useEffect,useState } from 'react'

import { isHabitDoneToday,isHabitToLater,isHabitToDo } from '@/ui/items/utils/items.utils'
import { ItemStore } from '@/store/stores/items.store'
import EventStore from '@/store/stores/events.store'
import type { Habit,Task } from '@/ui/items/types/items.types'


export function useItems(){

  const [loading, setLoading] = useState(true)

  const setIsSubmitting=ItemStore((h)=>h.setIsSubmitting)

 const loadItems = useCallback(() => {
  setLoading(true)
  setIsSubmitting(true)
    const freshTasks = EventStore.getState().getTasks()
    setTasks(freshTasks)
    const freshHabits = EventStore.getState().getHabits()
    setHabits(freshHabits)
    setIsSubmitting(false)
    setLoading(false)
  }, [])
  
  useEffect(() => {
    
    loadItems()
  
    const unsubscribe = EventStore.subscribe(() => {
      loadItems()
    })
    
    const handleDateChange = () => {
      loadItems()
    }

    window.addEventListener('dateChanged', handleDateChange)
    
    return () => {
      unsubscribe()
      window.removeEventListener('dateChanged', handleDateChange)
    }
  }, [])

  const [Habits, setHabits] = useState<Habit[]>([])
  const [Tasks, setTasks] = useState<Task[]>([])

  const order=ItemStore((h)=>h.order)
  const error=ItemStore((h)=>h.error)
  const selectedHabit=ItemStore((h)=>h.selectedHabit)
  const selectedTask=ItemStore((h)=>h.selectedTask)


  const addItem=ItemStore((h)=>h.addItem)
  const editItem=ItemStore((h)=>h.editItem)
  const deleteItem=ItemStore((h)=>h.deleteItem)
  const moveItem=ItemStore((h)=>h.moveItem)
  const isSubmitting=ItemStore((h)=>h.isSubmitting)

  const setOrder=ItemStore((h)=>h.setOrder)
  const setError=ItemStore((h)=>h.setError)
  const setHabit=ItemStore((h)=>h.setHabit)
  const setTask=ItemStore((h)=>h.setTask)

  const setTaskIsDoing=ItemStore((t)=>t.setTaskIsDoing)
  const taskIsDoing=ItemStore((t)=>t.taskIsDoing)

  const sortedHabit= [...Habits].sort((a,b)=>{
    if(order==='newest'){ 
     return dayjs(b.date).valueOf() - dayjs(a.date).valueOf() }
     return dayjs(a.date).valueOf() -dayjs(b.date).valueOf() 
  })


  const HabitsToDo=[...sortedHabit].filter(isHabitToDo)
  const HabitsDone=[...sortedHabit].filter(isHabitDoneToday)
  const HabitsLater=[...sortedHabit].filter(isHabitToLater)
  
    const sortedtask= [...Tasks].sort((a,b)=>{
      if(order==='newest'){
       return dayjs(b.date).valueOf() - dayjs(a.date).valueOf() }
       return dayjs(a.date).valueOf() -dayjs(b.date).valueOf() 
    })
  
    const tasksToDo=[...sortedtask].filter(t=>!t.completed)
    const tasksDone=[...sortedtask].filter(t=>t.completed)
  
  return{
    Habits,
    HabitsToDo,
    HabitsDone,
    HabitsLater,
    Tasks,
    setTask,
    tasksToDo,
    tasksDone,
    taskIsDoing,
  selectedTask,
  setTaskIsDoing,
    isHabitDoneToday,
    isHabitToDo,
    addItem,
    editItem,
    selectedHabit,
    setHabit,
    moveItem,
    deleteItem,
    order,
    setOrder,
    error,
    setError,
    loading,
    isSubmitting,

  }

}

