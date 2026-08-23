import { PlusIcon } from "@heroicons/react/24/solid"

export default function AddElement({isHovered,onClick,label}:{isHovered:boolean,onClick:()=>void,label:string}){

 return(
    <div className="flex w-full mb-10 justify-end pr-5 gap-2 items-center mt-[6vh]">
      <div className={`bg-white/7 flex items-center px-5 h-min py-2 text-xl rounded-[30px] cursor-pointer hover:bg-white/10 active:scale-[0.98] hover:shadow-md transition-all duration-300 ease-in-out  ${isHovered ? 'bg-white/20 scale-[0.98] shadow-xl' : ''}`} onClick={()=>onClick()} >Add a {label}</div>
      <PlusIcon className="w-11 max-[500px]:7.5 bg-primary/75 rounded-[50px] hover:-translate-y-px hover:bg-primary/95 active:scale-[0.98] hover:shadow-md transition-all duration-300"  onClick={()=>onClick()}/>
    </div>
 ) 
}