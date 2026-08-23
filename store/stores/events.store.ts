import {create} from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'

import type { Habit,Task } from '../../ui/items/types/items.types.ts'
import type{ DailyLog } from '../../ui/stadistics/types/stadistics.types.ts'
import type { EventStoreProps,Event } from '../types/events.types.ts.ts'
import type { Nothe } from '../../ui/nothes/types/nothes.types.ts'

import { emptyPrunedInformation ,updateHabitCompletions,createSnapshotEvents,
  PRUNE_CHECK_INTERVAL,HISTORY_STORAGE_KEY,MAX_LOCAL_STORAGE_BYTES,getLocalStorageSizeBytes
} from '../utils/eventStore.pruneEvents.utils'

const EventStore=create<EventStoreProps>()(
  persist(
    (set,get)=>({
      events:[],
      prunedInformation:emptyPrunedInformation(),
     
      addEvent(e) {
        const newEvent={...e,id:Date.now()}
        set({events:[...get().events,newEvent]})
      },

      clearEvents() {
        set({events:[]})
      },

      pruneEvents() {
       
        if (typeof window === 'undefined') {
          return
        }

        const now = Date.now()
        const info = get().prunedInformation

        if (
          info.lastPruneCheckAt > 0 &&
          now - info.lastPruneCheckAt < PRUNE_CHECK_INTERVAL
        ) {
          return
        }

        set({
          prunedInformation: {
            ...info,
            lastPruneCheckAt: now,
          },
        })

        const events = [...get().events]

        if (events.length === 0) {
          return
        }

        const getCandidateSize = (candidateEvents: Event[]) => {
          const currentJSON =
            localStorage.getItem(HISTORY_STORAGE_KEY) ?? ''

          const candidateJSON = JSON.stringify({
            state: {
              ...get(),
              events: candidateEvents,
            },
            version: 1,
          })

          const currentHistoryBytes =
            (
              HISTORY_STORAGE_KEY.length +
              currentJSON.length
            ) * 2

          const candidateHistoryBytes =
            (
              HISTORY_STORAGE_KEY.length +
              candidateJSON.length
            ) * 2

          const currentStorageSize =getLocalStorageSizeBytes()

        return (
          currentStorageSize -
          currentHistoryBytes +
          candidateHistoryBytes
        )
        }

        let remaining = [...events]

      
        const disposable = [...remaining]
          .filter(
            event =>
              event.action === 'completed' ||
              event.action === 'uncompleted' ||
              event.action === 'deleted'
          )
          .sort((a, b) => a.date - b.date)

        for (const event of disposable) {
          const candidate = remaining.filter(
            e => e.id !== event.id
          )

          if (
            getCandidateSize(candidate) <=
            MAX_LOCAL_STORAGE_BYTES
          ) {
            remaining = candidate
            break
          }

          remaining = candidate

          if (
            getCandidateSize(remaining) <=
            MAX_LOCAL_STORAGE_BYTES
          ) {
            break
          }
        }

  
        if (
          getCandidateSize(remaining) >
          MAX_LOCAL_STORAGE_BYTES
        ) {
          remaining = [...remaining].sort(
            (a, b) => a.date - b.date
          )

          while (
            remaining.length > 0 &&
            getCandidateSize(remaining) >
              MAX_LOCAL_STORAGE_BYTES
          ) {
            remaining.shift()
          }
        }

  
        if (remaining.length < events.length) {
          set({
            events: remaining,
          })
        }
      },

      getLastCompleted(habit) {

        const pruned =
          get().prunedInformation

        const historical =
          pruned.habitCompletions[habit.key] ?? []

        const CompleteEvents = [
          ...get().events,
        ]
          .filter(
            e =>
              e.type === 'Habit' &&
              e.eventKey === habit.key &&
              e.date > pruned.lastPrunedAt
          )
          .sort(
            (a, b) => a.date - b.date
          )

        const lastCompleted = [
          ...historical,
        ]

        for (const event of CompleteEvents) {

          if (event.action === 'completed') {
            lastCompleted.push(event.date)
          }

          if (event.action === 'uncompleted') {
            lastCompleted.pop()
          }
        }

        return lastCompleted
      },
      
      getHabits() {
        const habits= get().reconstructHabits()
        return habits  
      },

      getTasks() {
        const tasks = get().reconstructTasks()
        return tasks
      },

      getNothes() {
        const tasks = get().reconstructNothes()
        return tasks
      },

      reconstructHabits() {

        const events = [...get().events].sort((a, b) => a.date - b.date)
        
        const habitsMap = new Map<number, Habit>()
        
        for (const event of events) {
          if (event.type !== 'Habit') continue
            
          switch (event.action) {
            case 'added':

              if (event.newData?.Habit) {
                habitsMap.set(event.eventKey, {
                    ...(event.newData.Habit),
                })
              }
            break
                
            case 'edited':
              if (event.newData?.Habit && habitsMap.has(event.eventKey)) {
                const current = habitsMap.get(event.eventKey)
                if(!current) {
                  continue
                } 

                habitsMap.set(event.eventKey, {
                    ...current,
                    ...(event.newData.Habit),
                    key: current.key,
                    completed: current.completed
                })
              }
            break
                  
            case 'deleted':
            habitsMap.delete(event.eventKey)
            continue 
                
            case 'completed':
              const habitCompleted = habitsMap.get(event.eventKey)
              if (habitCompleted) {
                const isToday = dayjs(event.date).isSame(dayjs(), 'day')
                if (isToday) {
                  habitsMap.set(event.eventKey, {
                    ...habitCompleted,
                    completed: true
                  })
                }
              }
            break
                
            case 'uncompleted':
              const habitUncompleted = habitsMap.get(event.eventKey)
              if (habitUncompleted) {
                const isToday = dayjs(event.date).isSame(dayjs(), 'day')
                if (isToday) {
                  habitsMap.set(event.eventKey, {
                      ...habitUncompleted,
                      completed: false
                  })
                  }
              }
            break
          }
        }

        return Array.from(habitsMap.values())
      }
      ,

      reconstructTasks() {
        const events = [...get().events].sort((a, b) => a.date - b.date)
        const TasksMap = new Map<number, Task>()
        
        for (const event of events) {
          if (event.type !== 'Task') continue
          
          switch (event.action) {
            case 'added':
              if (event.newData?.Task) {
                 TasksMap.set(event.eventKey, {
                  ...(event.newData.Task),
                  completed: false
                })
              }
              break
               
            case 'edited':
              if (event.newData?.Task && TasksMap.has(event.eventKey)) {
                const current = TasksMap.get(event.eventKey)!
                TasksMap.set(event.eventKey, {
                  ...current,
                  ...(event.newData.Task),
                  key: current.key, // Aseguramos que la key no cambie
                  completed: current.completed
                })
              }
            break
              
            case 'deleted':
               TasksMap.delete(event.eventKey)
            break
            
            case 'completed':
              const taskCompleted = TasksMap.get(event.eventKey)
              if (taskCompleted) {
                TasksMap.set(event.eventKey, {
                  ...taskCompleted,
                  completed: true
                })
              }
            break
              
            case 'uncompleted':
              const taskUncompleted = TasksMap.get(event.eventKey)
              if (taskUncompleted) {
                TasksMap.set(event.eventKey, {
                  ...taskUncompleted,
                  completed: false
                })
              }
              break
          }
        }
        return Array.from(TasksMap.values())
      },

      reconstructNothes() {
        const events = [...get().events].sort((a, b) => a.date - b.date)
        const NothesMap = new Map<number, Nothe>()
        
        for (const event of events) {
          if (event.type !== 'Nothe') continue
          
          switch (event.action) {
            case 'added':
              if (event.newData?.Nothe) {
                 NothesMap.set(event.eventKey, {
                  ...(event.newData.Nothe),
                })
              }
            break
               
            case 'edited':
              if (event.newData?.Nothe && NothesMap.has(event.eventKey)) {
                const current = NothesMap.get(event.eventKey)
                if(!current){continue}

                NothesMap.set(event.eventKey, {
                  ...current,
                  ...(event.newData.Nothe),
                  key: current.key,
                })
              }
            break
              
            case 'deleted':
            NothesMap.delete(event.eventKey)
            break
          }
        }
        return Array.from(NothesMap.values())
      },
     
      getTotalTime() {
        const tasks=get().getTasks()
       
        let time:number=0
         for(let i=0;i<tasks.length;i++){
           if(tasks[i].completed){
            time+=tasks[i].duration
           }
         }
         return time
      },
      
      getDailyLogs(events) {
        const Events=events||get().events
        if(Events.length===0) return []
        const LogsMap=new Map<string,DailyLog>()
       
        for(const event of Events){

          const eventDate=dayjs(event.date).format('YYYY-MM-DD')

          const log:DailyLog=LogsMap.get(eventDate)||{
            date:event.date,
            mood:undefined,
            streak:false,
            pointsAcummulated:0,
            timeWorked:0,
            tasksCompleted:0,
            habitsCompleted:0,
          }
        
          if(event.type==='Mood'){

            const newLog:DailyLog={
              ...log,
              mood:event.newData.mood
            }
            LogsMap.set(eventDate,newLog)

          }
           
          if(event.action==='completed'){
          
            let newLog:DailyLog
          
            if(event.type==='Habit'){
              newLog={
                ...log,
                streak:(log.habitsCompleted>2||log.tasksCompleted>3) ? true : false,
                pointsAcummulated:log.pointsAcummulated+event.duration/50,
                timeWorked:log.timeWorked+event.duration,
                habitsCompleted:log.habitsCompleted+1,
              }
            }
            else{
              newLog={
                ...log,
                streak:(log.habitsCompleted>2||log.tasksCompleted>3) ? true : false,
                pointsAcummulated:log.pointsAcummulated+event.duration/40000,
                timeWorked:log.timeWorked+event.duration,   
                tasksCompleted:log.tasksCompleted+1,
              }

            }
            LogsMap.set(eventDate,newLog)
          }

          if(event.action==='uncompleted'){
          
            let newLog:DailyLog
          
            if(event.type==='Habit'){
              newLog={
                ...log,
                streak:(log.habitsCompleted>2||log.tasksCompleted>3) ? true : false,
                pointsAcummulated:Math.max(0,log.pointsAcummulated-event.duration/40000),
                timeWorked:Math.max(0,log.timeWorked-event.duration),
                habitsCompleted:log.habitsCompleted-1,
              }
                       }
            else{

              newLog={
                ...log,
                timeWorked:Math.max(0,log.timeWorked-event.duration),
                streak:(log.habitsCompleted>2||log.tasksCompleted>3) ? true : false,
                tasksCompleted:Math.max(0,log.tasksCompleted-1),
                pointsAcummulated:Math.max(0,log.pointsAcummulated-event.duration),

              }

            }
            LogsMap.set(eventDate,newLog)

          }
        }

        return Array.from(LogsMap.values()).sort((log,log2)=>log.date-log2.date)
      },

      getDailyMood() {
        return get().getDailyLogs().at(-1)?.mood||3
      },

    }),
    {name:'history-storage', 
      partialize: (state) => ({
        events: state.events,
      }),
    }    

  )
)

export default EventStore