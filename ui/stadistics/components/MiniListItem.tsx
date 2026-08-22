
import type { Habit,Task } from "../../items/types/items.types"
import { CheckIcon } from "@heroicons/react/24/solid"


interface MiniListItemsProps{
  item:Task|Habit,
  moveItem:(key:number)=>void,
}


export default function MiniListItem({item,moveItem}:MiniListItemsProps){


  return(
    <div className="w-full pl-3 border border-primary/10 pt-1.5 mb-1 gap-1 rounded-3xl flex items-center  max-[550px]:py-0.5 max-[550px]:mb-1">
       <div
          className="w-3 h-3 border-[1] border-white  rounded flex items-center justify-center mt-0 max-[550px]:mt-0 max-[550px]:w-2.5 max-[550px]:border"
          onClick={() => moveItem(item.key)}>
          {item.completed && <CheckIcon className="size-4 text-white" />}
        </div>
        
        <h3 className="text-md  truncate text-start  m-0 max-[550px]:text-[10px] max-[900px]:text-[15px] font-light ">
          {item.name}
        </h3>
    </div>  
  )
}