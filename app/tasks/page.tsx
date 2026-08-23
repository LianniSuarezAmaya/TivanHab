'use client'
import { useEffect} from "react"
import { useRouter } from "next/navigation"

import { useItems } from "@/hooks/useItems"

import HeroItems from "@/ui/items/components/HeroItems"
import { ItemList } from "@/ui/items/components/ItemList"
import { Timer } from "@/ui/timer/components/Timer"

export default  function TasksPage(){
  
  const router=useRouter()
  const {
    Tasks,
    taskIsDoing,
    selectedTask,
    tasksDone,
    tasksToDo,
    error,
    order,
    setOrder
  }=useItems()
  
  useEffect(() => {
  if(selectedTask){
    router.push('/tasksform')
  }
  }, [selectedTask]);

  return(
    <div className="min-h-[80vh] pt-[7vh]  ">
      {taskIsDoing&&(<Timer/>)}
      
      <HeroItems message={Tasks.length===0} onClick={()=>router.push('/tasksform')} label="tasks" order={order} setOrder={setOrder}/>
    
      <ItemList items={tasksToDo} label="To Do"/> 
      <ItemList items={tasksDone} label="Done" />

      {error && (<p className='error'>{error}</p>)}

    </div>
  )
}