
import { useState } from 'react'

import type {  ItemListProps } from '../types/items.types'

import { ChevronDownIcon,ChevronUpIcon } from '@heroicons/react/24/solid'
import { ItemCard } from './ItemCard'

export function ItemList({items,label}:ItemListProps){

  const [visible,setVisible]=useState<boolean>(true)
 if(items.length===0) return <></>
  return(
    <div className='flex  flex-col'>

        <div className='border border-primary/20  rounded-[30px] w-full mt-7 mb-3 flex justify-between items-center align-center px-9 max-[500px]:px-5' onClick={()=>setVisible(!visible)}>
          <div className=' flex text-start items-center gap-2'>
          <p className=' text-2xl font-light ml-6 w-auto max-[500px]:ml-2  max-[500px]:text-xl'>{label} </p>
          <p className='bg-white/5 h-7 w-7 square rounded-full text-center'>{items.length}</p>
          </div>
            {visible&&<ChevronDownIcon className='size-9' onClick={()=>setVisible(false)}/>}
            {!visible&&<ChevronUpIcon className='size-9' onClick={()=>setVisible(true)}/>}
        </div>
    
      {visible&&( 
    <div className="grid grid-cols-3 max-[850px]:grid-cols-2 gap-3 max-[550px]:grid-cols-1">
          {items.map((i)=>{
              return <ItemCard key={i.key}  item={i} />}
          )
}
          
        </div>
      )}
      
    </div>

  )
}