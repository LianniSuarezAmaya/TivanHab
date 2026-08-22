import {create} from 'zustand'
import { persist } from 'zustand/middleware'

import type { UnsavedEvent } from '../types/events.types.ts.ts'
import type { Nothe,NotheFormType } from '../../ui/nothes/types/nothes.types.ts'

import { AddEvent } from '../utils/itemsStore.utils'
import EventStore from './events.store'
type NothesStore={

  selectedNothe:Nothe|null,
   error:string|null,
  addNothe:(nothe:NotheFormType)=>void,
  editNothe:(Nothe:NotheFormType)=>void,
  deleteNothe:(key:number)=>void,
  setSelectedNothe:(nothe:Nothe|null)=>void
}

function FindNotheByKey(key:number){
const Nothes=EventStore.getState().getNothes()

return [...Nothes].some(n=>n.key===key)
}

export const NothesStore=create<NothesStore>()(
  persist(
    (set,get)=>({
  error:null,
      selectedNothe:null,
    
      addNothe(nothe) {
        const newNothe={
          key:Date.now(),
          content:nothe.content,
          title:nothe.title,
        }

        const event: UnsavedEvent={
        type:'Nothe',
        action:'added', 
        eventKey:newNothe.key,
        date:Date.now(),
        newData:{
          Nothe:newNothe,
        }

      }
      AddEvent(event)

},

      editNothe(Nothe) {
      
        const key=get().selectedNothe?.key

        if(!key||(key&&!FindNotheByKey(key))) {
        set({error:'An error ocurred . Please try again'})
        return 
      }

        const event: UnsavedEvent={
          eventKey:key,
          type:'Nothe',
          action:'edited', 
          date:Date.now(),
          newData:{
            Nothe:{...Nothe,key},
          }
        }
        AddEvent(event)
      },

      deleteNothe(key) {
     
        if(!FindNotheByKey(key)){
          set({error:'An error ocurred . Please try again'}
            
        )
        alert('error')}
        else{
        const event: UnsavedEvent={
          eventKey:key,
          type:'Nothe',
          action:'deleted', 
          date:Date.now(),
      
        }
        AddEvent(event)}
      },
  
      setSelectedNothe(nothe) {

        set({selectedNothe:nothe})
   

      },

    }) , {name:'nothes-storage',
      partialize:(state)=>({
        selectedNothe:state.selectedNothe,
      })
    })
)