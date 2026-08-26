import { TrashIcon,PencilIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"

import type { Nothe } from "../types/nothes.types"
import { NothesStore } from "@/store/stores/nothes.store"

interface NotheCardProps{
  nothe:Nothe
}

export function NotheCard({nothe}:NotheCardProps){
  const {deleteNothe,setSelectedNothe}=NothesStore.getState()
  const router=useRouter()
  return (
    <div className="flex flex-col w-[90%] border border-primary/30  bg-primary/5 rounded-[50px] py-8 text-start px-8">
      <h1 className="text-[1.8rem] whitespace-pre-line text-start max-[530px]:text-[16px] max-[530px]:leading-5 leading-8 m-0  max-[900px]:text-3xl">{nothe.title}</h1>
      <div className="w-[90%] ml-0 h-px mt-2 bg-primary/10 rounded-3xl"/>
      <h3 className="wrap-break-word">{nothe.content||'No content'}</h3>
      <div className="flex pl-7  justify-end  gap-2 mt-4 pt-2 max-[530px]:mt-2  "> 
        <TrashIcon 
          onClick={() => deleteNothe(nothe.key)}
          className=" size-7  max-[530px]:size-6"
        />
          <PencilIcon 
          onClick={() =>{ setSelectedNothe(nothe),router.push('/nothesform')}}
          className=" size-7  max-[530px]:size-6"
        />
      </div>
    </div>
  )
}
