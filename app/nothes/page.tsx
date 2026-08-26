'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useTemporaryHover } from "@/ui/hooks/useTemporaryHover";
import { useNothes } from "@/hooks/useNothes";

import { NotheList } from "@/ui/nothes/components/NotheList";
import AddElement from "@/ui/components/components/AddElement";


export default function NothesPage(){

  const {Nothes,selectedNothe}=useNothes()
  const {isHovered,triggerHover}=useTemporaryHover()

  const router=useRouter()
    
  useEffect(() => {
    if(selectedNothe){
      router.push('/nothesform')
    }
  },[selectedNothe]);

  return (
    <div className="min-h-[80vh] pt-15">
      
      <h1 className="text-4xl  text-start font-light max-[600px]:text-xl   mb-8  ">Nothes</h1>
      {Nothes.length==0&&(
        <div className="text-start max-[550px]:text-center ">
          <h3 className="text-5xl font-light max-[550px]:text-xl  max-[1000px]:text-3xl">There is not nothes to do </h3>
          <h4 className="text-3xl font-light cursor-pointer max-[550px]:text-sm max-[1000px]:text-xl " onClick={()=>triggerHover()}>Lets create a Nothe</h4>
        </div>)
      }

      <AddElement onClick={()=>router.push('/nothesform')} label="Nothe" isHovered={isHovered}/>
      <NotheList nothes={Nothes}/>

    </div>
  )
}