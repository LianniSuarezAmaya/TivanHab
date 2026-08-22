
import type { KeyboardEvent,LabelHTMLAttributes } from "react"
import type{ TaskFormType,HabitFormType } from "../../items/types/items.types"
export interface FormProps{
  onAbort:()=>void

}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
  children: React.ReactNode
}

export interface InputFormProps{
  id:string,
  type:'date'|'time'|'text',
  placeHolder:string,
  className?:string,

  onKeyDown?:(e:KeyboardEvent<HTMLInputElement>)=>void,
  registerName?:string ,
  value?:string,
}



export interface FormItemsProps{
onAbort:()=>void,
onSubmit:(data:HabitFormType|TaskFormType)=>void
}
export type Mood=1|2|3|4|5|undefined 
