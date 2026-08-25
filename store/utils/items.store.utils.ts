import type { UnsavedEvent } from "../types/events.types.ts";
import type { TaskUnfound,HabitUnfound } from "../../ui/items/types/items.types";

import EventStore from "../stores/events.store";

export function AddEvent(event:UnsavedEvent){
  EventStore.getState().addEvent(event)
}


export function splitText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }

  const breakPoint = text.lastIndexOf(" ", maxChars);

  if (breakPoint === -1) {
    return text.slice(0, maxChars/2) + "\n" + text.slice(maxChars/2,maxChars);
  }

  return (
    text.slice(0, breakPoint) +
    "\n" +
    text.slice(breakPoint + 1)
  );
}



export function FindHabitByName(name:string){
  const habits  = EventStore.getState().getHabits()
  return habits.find((h)=>h.name.trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase()) ?? undefined
}

export function FindItemByName(item:TaskUnfound|HabitUnfound){
 if('repeat' in  item ){
  return FindHabitByName(item.name)
 } 
 return FindTaskByName(item.name)
}

export function FindTaskByName(name:string){
  const habits  = EventStore.getState().getTasks()
  return habits.find((h)=>h.name.trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase()) ?? undefined
}


export function FindItemByKey(key:number|undefined){
  const habits  = EventStore.getState().getHabits()
  const tasks=EventStore.getState().getTasks()
  let item
   item= habits.find(h=>h.key===key)
  if(!item){
    item =tasks.find(h=>h.key===key)
  }
  return item ?? undefined 
}


export function FindHabitByKey(key:number|undefined){
  const habits  = EventStore.getState().getHabits()
  const Habit= habits.find(h=>h.key===key)
  return Habit ?? undefined 
}
  


  
export function FindTaskByKey(key:number|undefined){
  const habits  = EventStore.getState().getTasks()
  const Habit= habits.find(h=>h.key===key)
    return Habit ?? undefined 
}

export function IsSameKey(keyItem:number,keyHabit?:number,keyTask?:number){
  return keyItem===(keyHabit??0)||keyItem==(keyTask??0)
}


