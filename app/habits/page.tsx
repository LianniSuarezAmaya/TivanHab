'use client'
import { useEffect} from "react"
import { useRouter } from "next/navigation"

import { useItems } from "@/hooks/useItems"

import HeroItems from "@/ui/items/components/HeroItems"
import { ItemList } from "@/ui/items/components/ItemList"

export default function HabitsPage(){
 
  const router=useRouter()
  const {
    Habits,
    HabitsDone,
    HabitsToDo,
    HabitsLater,
    error,
    order,
    setOrder,
    selectedHabit
  }=useItems()

  const ItemListData=[
    {label:'To Do',items:HabitsToDo},
    {label:'Done',items:HabitsDone},
    {label:'Later',items:HabitsLater},
  ]

  useEffect(()=>{ if(selectedHabit){
    router.push('/habitsform')
  }},[selectedHabit])

  return(
    <div className="min-h-[80vh] flex flex-col justify-between  pt-[7vh] ">
      <HeroItems message={Habits.length===0} onClick={()=>router.push('/habitsform')} label="habits" order={order} setOrder={setOrder}/>
      {ItemListData.map((d,index)=><ItemList label={d.label} items={d.items} key={index}/>)}
      {error && (<p className='error'>{error}</p>)}
    </div>
  )
}