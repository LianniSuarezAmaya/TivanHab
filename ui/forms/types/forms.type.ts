import type{ TaskFormType,HabitFormType } from "../../items/types/items.types"
export interface FormProps{
  onAbort:()=>void

}
export type Repeat = 'daily' | 'weekly' | 'monthly'



export interface InputFormProps{
  id:string,
  type:'date'|'time'|'text',
  placeHolder:string,
  className?:string,

  registerName?:string ,
  value?:string,
}



export interface FormItemsProps{
onAbort:()=>void,
onSubmit:(data:HabitFormType|TaskFormType)=>void
}
export type Mood=1|2|3|4|5|undefined 
