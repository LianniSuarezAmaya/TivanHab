import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect,useState ,useCallback} from 'react'
import { TimerStore } from '@/store/stores/timer.store'
import EventStore from '@/store/stores/events.store'
import type { Task } from '@/ui/items/types/items.types'
import { useItems } from './useItems'
export function useTimer(){

  const {setTaskIsDoing}=useItems()
  const time=TimerStore((t)=>t.time)
  const cont=TimerStore((t)=>t.cont)
  const isRunning=TimerStore((t)=>t.isRunning)
  const error=TimerStore((t)=>t.error)

  const completeTimer=TimerStore((t)=>t.completeTimer)
  const pauseTimer=TimerStore((t)=>t.pauseTimer)
  const resetTimer=TimerStore((t)=>t.resetTimer)
  const startTimer=TimerStore((t)=>t.startTimer)

   const [loading, setLoading] = useState(true)

  const loadTime = useCallback(() => {
    const freshTasks = EventStore.getState().getTotalTime()
    SetTotalTime(freshTasks)
    setLoading(false)
  }, [])

   const startTask=(task:Task)=>{
     if(task?.completed) return
     setTaskIsDoing(task)
     startTimer() 
    }
  
  useEffect(() => {
    loadTime()
    
    const unsubscribe = EventStore.subscribe(() => {
      loadTime()
    })
    
    const handleDateChange = () => {
      loadTime()
    }
    
    window.addEventListener('dateChanged', handleDateChange)
    
    return () => {
      unsubscribe()
      window.removeEventListener('dateChanged', handleDateChange)
    }
  }, [loadTime])

  const [totalTime, SetTotalTime] = useState<number>(0)
 
  dayjs.extend(duration)

  const formatTime = (ms:number) => {
    const dur = dayjs.duration(ms)
    const hours = Math.floor(dur.asHours())
    const minutes = dur.minutes()
    const seconds = dur.seconds()

    return `${ hours<10 ? `0${hours}` : hours }:${ minutes<10 ? `0${minutes}`: minutes }:${ seconds<10 ? `0${seconds}` : seconds }`
  }

  return {
    cont,
    time :formatTime(time),
    isRunning,
    startTask,
    error,
    loading,
    totalTime:formatTime(totalTime),
    startTimer,
    pauseTimer,
    completeTimer,
    resetTimer
  }
}