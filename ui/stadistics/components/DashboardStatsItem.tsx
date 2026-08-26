interface DashboardStatsItemProps{
  value:string
  label:string
}

export default function DashboardStatsItem({label,value}:DashboardStatsItemProps){
  
  return (
    <div className="border-x-primary/8   border-x grow first:border-l-0 last:border-r-0 flex flex-col justify-start py-4 gap-1  max-[550px]:pt-3 max-[550px]:pb-2 max-[550px]:gap-0
    cursor-pointer
    text-center
    transition-all
    duration-200 ease-in-out
    hover:bg-primary/1
    hover:backdrop-blur-sm
    hover:scale-[1.02]
    active:scale-[0.98]" >
     <h3 className="font-light text-white max-[550px]:text-[10px]">{label}</h3>
     <p className="text-4xl  text-white/80  max-[550px]:text-[10px] max-[950px]:text-3xl">{value}</p>
    </div>
   ) 
}