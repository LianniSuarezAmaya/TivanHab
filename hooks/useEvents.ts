'use client'

import { useState ,useCallback,useEffect} from "react"
import type { Event } from "@/store/types/events.types.ts"
import EventStore from "@/store/stores/events.store"

export function useEvents(){
  
  const [loading, setLoading] = useState<boolean>(true)

  const loadEvents = useCallback(() => {
    const events = EventStore.getState().events
    setEvents(events)
    setLoading(false)
  }, [])

  
  useEffect(() => {

    loadEvents()

    const unsubscribe = EventStore.subscribe(() => {
      loadEvents()
    })
    
    const handleDateChange = () => {
      loadEvents()
    }
    
    window.addEventListener('dateChanged', handleDateChange)
    
    return () => {
      unsubscribe()
      window.removeEventListener('dateChanged', handleDateChange)
    }
  }, [loadEvents])

  const [events, setEvents] = useState<Event[]>([])
 
  const dailyLogs=EventStore((e)=>e.getDailyLogs)
 
  return{
    events,
    dailyLogs,
    loading,
  }
}