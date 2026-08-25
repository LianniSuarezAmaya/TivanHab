
import type { Habit,Task } from "../../ui/items/types/items.types"
import type { Mood } from "../../ui/forms/types/forms.type"
import type { DailyLog } from "../../ui/stadistics/types/stadistics.types"
import type { Nothe } from "../../ui/nothes/types/nothes.types"
import type { PrunedInformation } from "./prune.types"

export type Event=
  |TaskEvent
  |HabitEvent
  |MoodEvent
  |NotheEvent

export type TaskEventBase={
  id:number,

  type:'Task',
  action:
  |'completed'
  |'uncompleted' 
  |'edited' 
  |'deleted' 
  |'added', 
  eventKey:number,
  date:number,
  newData?:{
     Task?:Task,
  }

}

export type NotheEvent={
  id:number,
  type:'Nothe',
  action:
  |'edited' 
  |'deleted' 
  |'added', 
  eventKey:number,
  date:number,
  newData?:{
     Nothe?:Nothe,
  }

}

 export type HabitEventBase={
  id:number,
  type:'Habit', 
  eventKey:number,
  date:number,
  newData?:{
     Habit?:Habit,
  }

}

export type TaskEvent =
  |(TaskEventBase & {action:'completed'|'uncompleted', duration:number} )
  |(TaskEventBase & {action:'added'|'deleted'|'edited'}) 

export type HabitEvent =
   |(HabitEventBase & {action:'completed'|'uncompleted', duration:number} )
  |(HabitEventBase & {action:'added'|'deleted'|'edited'}) 

export type MoodEvent={
  id:number,
  type:'Mood',
  action:'added', 
  eventKey:number,
  date:number,
  newData:{
    mood: Mood , 
  }

}

type DistributiveOmit<T, K extends keyof any> =
  T extends any
    ? Omit<T, K>
    : never

export type UnsavedEvent =
 | DistributiveOmit<TaskEvent,'id'>
 | DistributiveOmit<HabitEvent,'id'>
 | DistributiveOmit<MoodEvent,'id'>
  | DistributiveOmit<NotheEvent,'id'>

 
export type UnsavedEventt=|Omit<TaskEvent ,'id'>|Omit<HabitEvent ,'id'>|Omit<MoodEvent ,'id'>


export type Error={
  type: 'Task'|'Habit'|'Mood',
  content:string,
  section?:string,
}


 
export type HabitError = {
    id: number
    code: 'DUPLICATE_NAME' | 'INVALID_KEY' | 'NOT_FOUND' | 'RECONSTRUCTION_FAILED'
    content: string
    section: 'form' | 'list' | 'system'
    timestamp: number
    eventId?: number
}