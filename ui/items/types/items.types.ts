
export type Item=Task |Habit

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

export type HabitUnfound={
key?:number,
name:string,
description?:string,
duration:number,
date:number,
repeat: 'daily' | 'weekly' | 'monthly',
daysOfWeek?: number[] , 
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



