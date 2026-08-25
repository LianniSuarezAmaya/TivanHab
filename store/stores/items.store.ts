import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { UnsavedEvent } from "../types/events.types.ts.ts"

import EventStore from "./events.store"
import {FindHabitByKey,FindTaskByKey,AddEvent, FindItemByKey, IsSameKey, FindItemByName ,splitText} from "../utils/items.store.utils"
import { isSameDay ,isHabit,isTask} from "../utils/items.utils"
import type { Task,Habit,HabitUnfound,TaskUnfound } from "@/ui/items/types/items.types"

type ItemStoreProps={

  selectedHabit:Habit|null,
  selectedTask:Task|null,
  taskIsDoing:Task|null,
  order:'newest'|'oldest',
  error:string|null,
  isSubmitting:boolean,
  addItem:(event:HabitUnfound|TaskUnfound)=>void,
  editItem:(event:HabitUnfound|TaskUnfound)=>void,
  deleteItem:(key:number)=>void,
  moveItem:(key:number)=>void,
  
  setOrder:(order:'newest'|'oldest')=>void
  setHabit:(habit:Habit|null)=>void
  setTask:(task:Task|null)=>void,
  setTaskIsDoing:(task:Task|null)=>void,
  setError:(e:string)=>void
  setIsSubmitting:(value:boolean)=>void

}

export const ItemStore=create<ItemStoreProps>()(
  persist(
    (set,get)=>({

      order:'newest',
      error:null,
      selectedHabit:null,
      selectedTask:null,
      taskIsDoing:null,
      isSubmitting:false,

      addItem(item){
         
        if(FindItemByName(item)){
             set({error:` ${item.name} alredy exist`})
             return 
          }

        let newEvent:UnsavedEvent
        
        const baseItem={   
          key:Math.floor(Math.random() * 1000),
          name:splitText(item.name,11).toUpperCase(),
          description:item.description,
          duration :item.duration,
          date:item.date,
          completed:false,
        }

        const baseEvent={
           eventKey:baseItem.key,
           date:Date.now()
        }

          if(isHabit(item)){
   
            const newHabit={
             ...baseItem,
              repeat: item.repeat,
              daysOfWeek: item.daysOfWeek||undefined,
            }

           newEvent={
            ...baseEvent,
           type:'Habit',
           action:'added',
           newData:{
            Habit:newHabit,
           },
          }
          
          }

          else if(isTask(item)) {

          const newTask={
            ...baseItem,
            date:item.date,
              ...(item.habit !== undefined && { habit: item.habit })

          }
           newEvent={
            ...baseEvent,
           type:'Task',   
           action:'added', 
           newData:{
            Task:newTask,
           },
          }

          } else {
            set({ 
              error: `Invalid item type: "${item.name}" is neither a Habit nor a Task` 
            });
            return;
          }
                      
      set({isSubmitting:true})
       AddEvent(newEvent)
       set({error:null})

      },

      editItem(item){
   
        const itemFound=FindItemByKey(item.key)

         if(!itemFound) {
            set({error:'An error ocurred. Please try again', isSubmitting:false})
            return 
          } 
        
        const newEvent: UnsavedEvent = isHabit(itemFound)
        ? {
            type: 'Habit',
            action: 'edited',
            eventKey: itemFound.key,
            date: Date.now(),
            newData: { Habit: { ...itemFound, ...item } }
          }
        : {
            type: 'Task',
            action: 'edited',
            eventKey: itemFound.key,
            date: Date.now(),
            newData: { Task: { ...itemFound, ...item } }
          };

        set({isSubmitting:true})
        AddEvent(newEvent) 
           
      },

      deleteItem(key) {
        let event:UnsavedEvent
        
        const item=FindHabitByKey(key) ||FindTaskByKey(key)
        if(!item) {
          set({error:'An error ocurred. Please try again',isSubmitting:false})
          return 
        }
         
        const selectedHabit=get().selectedHabit
        const selectedTask=get().selectedTask
        
        if(IsSameKey(key,selectedTask?.key,selectedHabit?.key)){
          set({selectedHabit:null,isSubmitting:false,selectedTask:null})
          return
        }
         
         event={
          type: isHabit(item) ? 'Habit' : 'Task',
          action:'deleted',
          eventKey:item.key,
          date:Date.now(),
        }

        set({isSubmitting:true})
        AddEvent(event) 
      },

      moveItem(key) {
    
       const item=FindItemByKey(key)
        if(!item){
          alert('error')
            set({error:'An error ocurred . Please try again'})
            return 
          }
       

          const {getLastCompleted}=EventStore.getState()
          let completedToday
          if(isHabit(item)) {
               completedToday = getLastCompleted(item).some(ts => isSameDay(ts, Date.now()))
          }
            const event:UnsavedEvent={
                    eventKey:key,
          date:Date.now(), 
          duration:(item.duration*60000),                        
    
              type: isHabit(item) ? 'Habit' : 'Task',
              action: isHabit(item) ? completedToday ? 'uncompleted' : 'completed' : item.completed ? 'uncompleted' : 'completed',
           }
        
        set({isSubmitting:true})
        AddEvent(event)

        const today = new Date(Date.now())
        today.setHours(0, 0, 0, 0)             
        
      },             

      setOrder(order){
        set({order :order})   
      },

      setError(e) {
        set({error:e})
      },

      setHabit(habit) {
        set({selectedHabit:habit})
      },
      setTask(task) {
         set({selectedTask:task})
      },
      setTaskIsDoing(task) {
      set({taskIsDoing:task})

      },
      setIsSubmitting(value) {
         set({isSubmitting:value})    
      },

    }
    ),{name:'event-storage' ,
      partialize:(state)=>({
        selectedHabit:state.selectedHabit,
        selectedTask:state.selectedTask,
        taskIsDoing:state.taskIsDoing,
        order:state.order
      })
    }

  )
)



    