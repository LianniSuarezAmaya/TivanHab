import {create } from 'zustand'
import { persist } from "zustand/middleware"
import { ItemStore } from './items.store'
import type { Task } from '../../ui/items/types/items.types'

type TimerStoreProps={

  cont:number,
  time:number,
  accumulatedTime: number, 
  isRunning:boolean,
  intervalID:NodeJS.Timeout|undefined,
  start:number,
  error:string|null,

  startTimer:()=>void,
  pauseTimer:()=>void,
  resetTimer:()=>void
  completeTimer:()=>void
  resetInterval:()=>void,
  restoreTimer:()=>void,
  getActiveTask:()=>Task|null
  timeIsValid:()=>boolean
}
  export const TimerStore=create<TimerStoreProps>()(

  persist(
    (set,get)=>({
      
      cont:0,
      time:0,
      accumulatedTime: 0, 
      isRunning:false,
      intervalID:undefined,
      start:0,
      error:null,

      startTimer:function(){
        const taskIsDoing=get().getActiveTask()
        if(!taskIsDoing) return 

        if(get().intervalID){
          clearInterval(get().intervalID)
        }

        const now=Date.now()
        const currentStart = now - get().accumulatedTime

        if(get().time>Date.now()){
          set({error:'Fecha de inicio posterior a la actual' , isRunning :false})
          return 
        }

      
        const newInterval=setInterval(()=>{
          const now=Date.now()
          set({error:null , time:now-currentStart,accumulatedTime:now-currentStart})
          return 

        },1000)



        
        set({
          isRunning: true ,
          error:null,
          intervalID:newInterval,
          start:currentStart
        })

      },
      pauseTimer() {

        if(!get().timeIsValid()){ 
          return
        }

        clearInterval(get().intervalID)
        const currentTime=get().time

        set({
          isRunning:false,
          accumulatedTime:currentTime,
          intervalID:undefined
        })
      },

      resetTimer() {
      
        if(!get().timeIsValid()){
        return 
        }

        const setTaskIsDoing=ItemStore.getState().setTaskIsDoing
        setTaskIsDoing(null)

      get().resetInterval()
      },

      completeTimer() {
        
        const {editItem,moveItem}=ItemStore.getState()
        const taskIsDoing=get().getActiveTask()
        if(!taskIsDoing) return 

        if(!get().timeIsValid() && !get().isRunning ||get().time>1000*60*60*24*7){
        return
        }

        const newTask:Task={
        ...taskIsDoing,duration:get().time,key:taskIsDoing?.key
        }
      
        editItem(newTask)
        moveItem(taskIsDoing.key)

        get().resetTimer()
        
      },

      resetInterval() {
            clearInterval(get().intervalID)
          set({
            start:0,
            time:0,
            accumulatedTime:0,
            isRunning:false,
            error:null,
            intervalID:undefined,
            cont:get().cont+1,
          })
      },

      getActiveTask() {

  const taskIsDoing=ItemStore.getState().taskIsDoing
        if (!taskIsDoing||taskIsDoing?.completed) return null
        return taskIsDoing 
      },

      timeIsValid(){
    const { time, accumulatedTime } = get()
    return time > 0 || accumulatedTime > 0
      },
        restoreTimer: function() {
        const state = get();
        if (state.isRunning && state.accumulatedTime > 0) {

          const now = Date.now();
          const currentStart = now - state.accumulatedTime;
          
          const newInterval = setInterval(() => {
            const now = Date.now();
            set({ error: null, time: now - currentStart });
          }, 1000);

          set({
            intervalID: newInterval,
            start: currentStart
          });
        } else if (state.isRunning && state.accumulatedTime === 0) {
          // Si está corriendo pero no hay tiempo acumulado, resetear
          set({ isRunning: false });
        }
      },


    }), {
        name: 'timer-storage',

        partialize: (state) => ({
          intervalID:state.intervalID,
          cont: state.cont,
          time: state.time,
          accumulatedTime: state.accumulatedTime,
          isRunning: state.isRunning,  // ✅ Esto hará que persista
          start: state.start,
          error: state.error,
        }),
           onRehydrateStorage: () => (state) => {
        if (state?.isRunning) {
           setTimeout(() => {
            const store = TimerStore.getState();
            store.restoreTimer();
          }, 0);
        }
      }
      }
      
  )

  )


