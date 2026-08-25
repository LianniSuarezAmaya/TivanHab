import { useState } from 'react'

import type {  Item } from '../types/items.types'

import { ChevronDownIcon,ChevronUpIcon } from '@heroicons/react/24/solid'
import { ItemCard } from './ItemCard'

interface ItemListProps{
  items:Item[],
  label:string,
}

export function ItemList({items,label}:ItemListProps){

  const [visible,setVisible]=useState<boolean>(true)
  if(items.length===0) return <></>
 
  return(
    <div className='flex  flex-col mt-3  mb-5'>

        <div className='border border-primary/20  rounded-[30px] w-full mb-2  flex justify-between items-center align-center px-9 max-[500px]:px-5' onClick={()=>setVisible(!visible)}>
          <div className=' flex text-start items-center gap-2'>
          <p className=' text-2xl font-light ml-6 w-auto max-[500px]:ml-2  max-[500px]:text-xl'>{label} </p>
          <p className='bg-white/5 h-7 w-7 square rounded-full text-center'>{items.length}</p>
          </div>
            {visible&&<ChevronDownIcon className='size-9' onClick={()=>setVisible(false)}/>}
            {!visible&&<ChevronUpIcon className='size-9' onClick={()=>setVisible(true)}/>}
        </div>
    
      {visible&&( 
        <div className="grid  gap-4 grid-cols-3 max-[850px]:grid-cols-2  max-[550px]:grid-cols-1 max-[550px]:gap-7">
          {items.map((i)=>{
              return <ItemCard key={i.key}  item={i} />}
          )}  
        </div>
      )}

    </div>
  )
}