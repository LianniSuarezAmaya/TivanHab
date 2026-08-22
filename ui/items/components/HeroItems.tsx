
import { Button } from "../../components/components/Button"
import Select from "../../components/components/Select"

import { HeroChart } from "../../components/components/HeroChart"

import { useRouter } from "next/navigation"
import EventsActions from "../../components/components/AddElement"
import { useTemporaryHover } from "@/ui/hooks/useTemporaryHover"
export default function HeroItems({message,label,order,setOrder,onClick}:{message: boolean,label:'habits'|'tasks', order:"newest" | "oldest",setOrder: (order: "newest" | "oldest") => void,onClick:()=>void}){

  const router=useRouter()
    const {isHovered,triggerHover}=useTemporaryHover()
  
  return(
    <div className="flex   flex-col gap-3 pt-0  w-full ">
      <p className="text-4xl  text-start font-light whitespace-pre-line max-[600px]:text-xl ">{`Let's work in  your daily goal`}</p>
      
      <div className="flex  gap-5">
        <Button variant='primary' className="w-min text-md px-3 rounded-3xl py-1.5 " onClick={()=>router.push('/')}>
          Dashboard
        </Button>
        <Select options={[{value:'newest',label:'Newest'},{value:'oldest',label:'Oldest'}]} value={order} onClick={(value)=>setOrder(value)}/>
      </div>

      <div className="flex max-[550px]:flex-col  w-full items-center justify-start h-auto  max-[370px]:justify-center max-[370px]:mx-auto max-[370px]:w-auto  max-[530px]:mt-[-1vh]">
          <HeroChart type={ label=='tasks' ? 'Task' : 'Habit'} />
           {message&&(<div className="text-start  max-[550px]:text-center ">
              <h3 className="text-5xl font-light max-[550px]:text-xl  max-[1000px]:text-3xl">There is not {label} to do </h3>
              <h4 className="text-3xl font-light cursor-pointer max-[550px]:text-sm max-[1000px]:text-xl " onClick={()=>triggerHover()}>Lets create a {label.slice(0,-1)}</h4>
            </div>)}
            
      </div>

      <EventsActions onClick={onClick} isHovered={isHovered} label={label==='habits' ? 'Habit' :'Task'}/>
    </div>
  )
}