import {create} from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'

import type { Habit,Task } from '../../ui/items/types/items.types.ts'
import type{ DailyLog } from '../../ui/stadistics/types/stadistics.types.ts'
import type { EventStoreProps } from '../types/events.types.ts.ts'
import type { Nothe } from '../../ui/nothes/types/nothes.types.ts'


import type { PrunedInformation } from '../types/prune.types.ts'
import { buildDailyLogs } from '../utils/eventsStore.utils'
import { reconstructEntitiesUntil,emptyPrunedInformation,mergeDailyLogsIntoPrunedInformation ,updateHabitCompletions,createSnapshotEvents,
  PRUNE_CHECK_INTERVAL,HISTORY_STORAGE_KEY,MAX_LOCAL_STORAGE_BYTES,getLocalStorageSizeBytes
} from '../utils/eventStore.pruneEvents.utils'
import type { Event } from '../types/events.types.ts.ts'
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
  const currentInfo = get().prunedInformation

  /*
   * No comprobamos el storage más de una vez
   * por intervalo.
   */
  if (
    currentInfo.lastPruneCheckAt > 0 &&
    now - currentInfo.lastPruneCheckAt <
      PRUNE_CHECK_INTERVAL
  ) {
    return
  }

  /*
   * Marcamos que hemos hecho la comprobación.
   */
  set({
    prunedInformation: {
      ...currentInfo,
      lastPruneCheckAt: now,
    },
  })

  const storageSize = getLocalStorageSizeBytes()

  /*
   * No hay nada que hacer.
   */
  if (storageSize <= MAX_LOCAL_STORAGE_BYTES) {
    return
  }

  const originalEvents = [...get().events]

  if (originalEvents.length === 0) {
    return
  }

  /*
   * Siempre trabajamos sobre una copia.
   */
  const sortedEvents = [...originalEvents].sort(
    (a, b) => a.date - b.date
  )

  /*
   * Eventos que podemos considerar "desechables".
   *
   * Estos eventos normalmente solo representan una
   * transición histórica y no necesitamos conservarlos
   * indefinidamente.
   */
  const disposableEvents = sortedEvents.filter(
    event =>
      event.action === 'completed' ||
      event.action === 'uncompleted' ||
      event.action === 'deleted'
  )

  /*
   * El resto de eventos tienen más valor histórico.
   */
  const normalEvents = sortedEvents.filter(
    event =>
      event.action !== 'completed' &&
      event.action !== 'uncompleted' &&
      event.action !== 'deleted'
  )

  /*
   * Intentamos eliminar primero los eventos desechables.
   *
   * En cada paso calculamos cuánto ocuparía el estado
   * resultante. Así no eliminamos más de lo necesario.
   */
  let remainingEvents = [...sortedEvents]

  const getCandidateSize = (events: Event[]) => {
    const historyJSON =
      localStorage.getItem(HISTORY_STORAGE_KEY) ?? ''

    let parsedHistory: unknown

    try {
      parsedHistory = JSON.parse(historyJSON)
    } catch {
      parsedHistory = undefined
    }

    /*
     * El persist de Zustand guarda:
     *
     * {
     *   state: {
     *     events: [...]
     *   },
     *   version: ...
     * }
     *
     * Construimos una representación equivalente
     * solamente para calcular el tamaño.
     */
    const currentPersisted =
      parsedHistory &&
      typeof parsedHistory === 'object'
        ? parsedHistory as Record<string, unknown>
        : {}

    const currentState =
      currentPersisted.state &&
      typeof currentPersisted.state === 'object'
        ? currentPersisted.state as Record<string, unknown>
        : {}

    const candidatePersisted = {
      ...currentPersisted,
      state: {
        ...currentState,
        events,
      },
    }

    const candidateJSON =
      JSON.stringify(candidatePersisted)

    const currentHistoryBytes =
      (
        HISTORY_STORAGE_KEY.length +
        historyJSON.length
      ) * 2

    const candidateHistoryBytes =
      (
        HISTORY_STORAGE_KEY.length +
        candidateJSON.length
      ) * 2

    return (
      storageSize -
      currentHistoryBytes +
      candidateHistoryBytes
    )
  }

  /*
   * --------------------------------------------------
   * 1. Eliminar eventos desechables antiguos
   * --------------------------------------------------
   */
  for (const event of disposableEvents) {
    if (
      getCandidateSize(remainingEvents) <=
      MAX_LOCAL_STORAGE_BYTES
    ) {
      break
    }

    remainingEvents = remainingEvents.filter(
      current => current !== event
    )
  }

  /*
   * --------------------------------------------------
   * 2. Si todavía no cabe, eliminar eventos antiguos
   * --------------------------------------------------
   *
   * Aquí ya no distinguimos el tipo de evento.
   */
  if (
    getCandidateSize(remainingEvents) >
    MAX_LOCAL_STORAGE_BYTES
  ) {
    for (const event of sortedEvents) {
      if (
        getCandidateSize(remainingEvents) <=
        MAX_LOCAL_STORAGE_BYTES
      ) {
        break
      }

      /*
       * Puede que ya haya sido eliminado durante
       * la primera fase.
       */
      if (!remainingEvents.includes(event)) {
        continue
      }

      remainingEvents = remainingEvents.filter(
        current => current !== event
      )
    }
  }

  /*
   * Si ni eliminando todos los eventos conseguimos
   * bajar del límite, conservamos lo que quede.
   *
   * En un portfolio esto es preferible a intentar
   * reconstruir snapshots, estadísticas, etc.
   */
  const finalEvents = [...remainingEvents].sort(
    (a, b) => a.date - b.date
  )

  /*
   * Si no hemos eliminado nada, no hacemos un set
   * innecesario de events.
   */
  if (finalEvents.length === originalEvents.length) {
    return
  }

  set({
    events: finalEvents,
  })
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
}
,
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
    }) , {name:'history-storage', 
           partialize: (state) => ({
        events: state.events,
      }),
   
    
    },
  
        

  )
)

export default EventStore