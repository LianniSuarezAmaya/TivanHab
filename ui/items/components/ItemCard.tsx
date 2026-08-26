import { TrashIcon,PencilIcon, PlayIcon , CheckIcon } from '@heroicons/react/24/solid'

import type{ Item } from '../types/items.types'

import { useItems } from '@/hooks/useItems'
import { useTimer } from '@/hooks/useTimer'

import { isHabit } from '@/store/utils/items.utils'
import { isHabitDoneToday,getEndHour,getStartHour } from '../utils/items.utils'

interface ItemCardProps{
  item:Item,
}

export function ItemCard({item}:ItemCardProps){

  const {moveItem,deleteItem,setTask,setHabit}=useItems()
  const {startTask}=useTimer()
  
  return(
    <div className="card border border-primary/30  bg-primary/5 rounded-[50px]  break-inside-avoid  text-white  py-8 px-10 h-min w-full  max-[400px]:pl-3 max-[400px]:pr-4 max-[400px]:flex max-[400px]:flex-col max-[530px]:px-6 max-[530px]:py-6 max-[700px]:px-5  max-[900px]:px-8 max-[900px]:py-10    ">
      
      <div className="grid  items-start w-full  grid-cols-[10px_minmax(0,1fr)]  max-[400px]:w-[90%] max-[400px]:ml-[7%]  max-[530px]:gap-x-0  max-[530px]:grid-cols-[20px_minmax(0,1fr)] max-[530px]: gap-x-2    gap-y-0  "> 
        <div
            className="w-4 h-4 border-2 mt-2 border-white rounded flex items-center justify-center  max-[530px]:w-3  max-[530px]:h-3 max-[530px]:border max-[530px]:mt-1.5 "
            onClick={ () => moveItem(item.key)}>
            {((item.completed)||(isHabit(item)&&isHabitDoneToday(item))) && <CheckIcon className="size-4 text-white" />}
        </div>

        <h1 className="text-[1.8rem] whitespace-pre-line text-start max-[530px]:text-[16px] max-[530px]:leading-5 leading-8 m-0  max-[900px]:text-3xl">
          {item.name}
        </h1>
              <div className=" col-start-2 w-[90%] ml-0 h-px mt-0 bg-primary/10 rounded-3xl"/>


        {item.description&&(
          <div className="col-start-2 flex flex-start   flex-wrap w-[98%]">
              <span className="  inline w-[95%] text-white/70 text-sm font-extralight max-[900px]:text-xs  text-start wrap-break-word" >
                {item.description}
                <p className=" inline-block font-light  items-center gap-2">
                       +{(item.duration /(50)).toFixed(1)} points
                </p>
              </span>
            </div>
         )}
        {!item.description&&(
          <div className="col-start-2 flex flex-start   flex-wrap w-[98%]">
                <p className=" inline   text-sm font-light  items-center gap-2 max-[900px]:text-xs">
                       +{(item.duration /(50)).toFixed(1)} points
                </p>

            </div>
         )}
      
        <p className="col-start-2 mt-4 text-md text-start max-[530px]:text-xs max-[900px]:text-md max-[700px]:text-sm">
          {`From ${getStartHour(item.date)} to ${getEndHour(item.date, item.duration)} p.m` }
        </p>
      </div>
      

       <div className="flex pl-7   justify-end  gap-2 mt-4 pt-2 max-[530px]:mt-2  "> 
        <TrashIcon 
          onClick={() => deleteItem(item.key)}
          className=" size-7   max-[530px]:size-6"
        />

          <PencilIcon 
          onClick={isHabit(item)? () => setHabit(item) : () => setTask(item)}
          className=" size-7    max-[530px]:size-6"
        />
          {!item.completed&&!isHabit(item)&&(<PlayIcon  onClick={() =>startTask(item)}
          className=" size-7  max-[530px]:size-6"/>)}
  
      </div>
    </div>
  )
}