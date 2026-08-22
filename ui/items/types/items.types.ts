

export type Item=Task |Habit

export interface ItemListProps{
  items:Item[],
  label:string,
}

export interface ItemCardProps{
  item:Item,
}

export type ItemStoreProps={

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

export type Task ={
  key:number,
  name:string,
  description?:string,
  completed:boolean 
  duration : number,
  date:number,
  habit?:number,
}

export type TaskUnfound ={
  key?:number,
  name:string,
  description?:string,
  duration : number,
  date:number,
  habit?:number,
}
export type TaskFormType ={
  key?:number,
  name:string,
  description?:string,
  date:string,
  start:string,
  end:string,
  habit?:number,
}

export type List ='toDo'|'done'
export interface HabitOptionsProps{
  value: number|undefined,
  onChange: (value: number) => void
}

export interface HabitSelectorProps{
  value:number| undefined,
  setValue:(h:number)=>void
}


export interface TaskFormProps{
  onAbort:()=>void
}



export type Habit={
key:number,
name:string,
description?:string,
duration:number,
date:number,
repeat: 'daily' | 'weekly' | 'monthly'
daysOfWeek?: number[] , 
completed:boolean
}

export type HabitUnfound={
key?:number,
name:string,
description?:string,
duration:number,
date:number,
repeat: 'daily' | 'weekly' | 'monthly',
daysOfWeek?: number[] , 
}



export type HabitFormType={
key?:number,
name:string,
description?:string,
date:string,
start:string,
end:string,
repeat: 'daily' | 'weekly' | 'monthly',

daysOfWeek?: number[] , 

}



export type Repeat = 'daily' | 'weekly' | 'monthly'

export interface FrequencySelectorProps {
  value: Repeat
  onChange: (value: Repeat) => void
}

export interface SelectablePillProps {
  label: string
  active?: boolean
  onClick: () => void
  className?: string
}

