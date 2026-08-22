
import Circle from "./CircleForm"
import { HabitOptions } from "./HabitOptions"
import type { HabitSelectorProps } from "../../items/types/items.types"

export default function  HabitSelectorForm({value,setValue}:HabitSelectorProps){
  
  return ( 
    <div className='flex flex-col '>
      <div className='flex items-center'>
        <Circle/>
        <p className='text-2xl text-white font-light ml-5 mb-2 max-[700px]:text-xl '>Habit</p>
      </div>

      <HabitOptions value={value} onChange={(val:number)=>setValue(val)}/>
    
    </div>
  ) 
}