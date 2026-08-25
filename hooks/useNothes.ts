'use client'

import { useState ,useCallback,useEffect} from "react"
import type { Nothe } from "@/ui/nothes/types/nothes.types"

import EventStore from "@/store/stores/events.store"
import { NothesStore } from "@/store/stores/nothes.store"

export function useNothes(){
  
   const [loading, setLoading] = useState(true)


  const loadNothes = useCallback(() => {
    const nothes = EventStore.getState().getNothes()
    SetNothes(nothes)

    setLoading(false)
  }, [])

  
  useEffect(() => {
    // Carga inicial
    loadNothes()
    
    // Suscribirse a cambios en EventStore
    const unsubscribe = EventStore.subscribe(() => {
      loadNothes()
    })
    // Escuchar cambios de fecha
    const handleDateChange = () => {
      loadNothes()
    }
    
    window.addEventListener('dateChanged', handleDateChange)
    
    // Limpiar
    return () => {
      unsubscribe()
      window.removeEventListener('dateChanged', handleDateChange)
    }
  }, [loadNothes])

  const [Nothes, SetNothes] = useState<Nothe[]>([])
 
  const addNothe=NothesStore((n)=>n.addNothe)
  const deleteNothe=NothesStore((n)=>n.deleteNothe)
  const editNothe=NothesStore((n)=>n.editNothe)

  const selectedNothe=NothesStore((n)=>n.selectedNothe)
  const setSelectedNothe=NothesStore((n)=>n.setSelectedNothe)

  return{
    Nothes,
    deleteNothe,
    addNothe,
    setSelectedNothe,
    selectedNothe,
    editNothe,
    loading
  }
  
}