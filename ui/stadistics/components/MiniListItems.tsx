'use client'

import { useRouter } from "next/navigation";
import type { Habit,Task } from "../../items/types/items.types";
import { generateMiniListEventsMessage } from "../utils/stadistics.components.utils";

import { Button } from "../../components/components/Button"
import MiniListItem from "./MiniListItem";

interface MiniListEventsProps{
  items:Task[]|Habit[];
  label:'Habits'|'Tasks';
  moveItem:(key:number)=>void;
}

export default function MiniListItems({items,moveItem,label}:MiniListEventsProps){
   
  const message=generateMiniListEventsMessage(label)
  const router=useRouter()
  let  navigateTo='/'
  if(label==='Tasks')
  {
    navigateTo='/tasks'
  }else{
  navigateTo='/habits' 
  }

  return (
    <div className={`w-[28vw] h-auto  min-h-50  flex py-6 gap-2 flex-col bg-primary/10 rounded-[50px] border border-primary/30 px-5 max-[550px]:gap-1  max-[550px]:min-h-38  max-[550px]:h-min max-[550px]:py-5 max-[550px]:px-4 max-[550px]:w-[65vw] max-[900px]:w-[40vw]  max-[900px]:gap-2    max-[1300px]:w-[35vw] `}>
      <div className="flex  items-center justify-between ">
        <h1 className="text-2xl font-light max-[530px]:text-lg max-[900px]:text-xl">{label}</h1>
        <Button onClick={()=>router.push(navigateTo)} variant='secondary' className="w-min text-sm px-3 rounded-3xl py-1.5 max-[530px]:text-xs  max-[550px]:py-1  max-[550px]:px-1.5 ">Details</Button>
      </div>
       
      {items.length>0&&(
        <div >
          {[...items].slice(0,4).map((item,index)=><MiniListItem item={item} moveItem={moveItem} key={index} />)}
        </div>
      )}


       {message&&(
        <div className= ' py-auto max-[550px]:h-20'>
          <h1 className="text-2xl my-auto text-white/80 text-start ml-1 font-extralight whitespace-pre-line max-[550px]:text-sm max-[550px]:whitespace-normal max-[900px]:text-xl">{message}</h1>
        </div>  
      )}
    </div>
  )
}