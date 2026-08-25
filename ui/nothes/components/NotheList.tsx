import type { Nothe } from "../types/nothes.types";
import { NotheCard } from "./NotheCard";

 interface NotheListProps{
  nothes:Nothe[]
}
export function NotheList({nothes}:NotheListProps){
  return (
    <div className="grid grid-cols-3 max-[850px]:grid-cols-2 gap-3 max-[550px]:grid-cols-1">
      {[...nothes].map((nothe,index)=><NotheCard key={index} nothe={nothe}/>)}
    </div>
  )
}