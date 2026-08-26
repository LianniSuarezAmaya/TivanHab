import type { DashboardStatsProps } from "../types/stadistics.types";
import { generateAfterStatsItem } from "../utils/stadistics.components.utils";
import DashboardStatsItem from "./DashboardStatsItem";
 
export default function  DashboardStatsList(props:DashboardStatsProps){
  const {stats,label}=props

  return (
    <div className="flex relative h-min flex-col  w-full mt-15 mx-auto ">
      <h3 className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white/5     hover:bg-white/7
        px-6 rounded-2xl  backdrop-blur-[7px] text-lg font-light max-[550px]:text-[10px] max-[550px]:px-2 z-10  hover:scale-[1.02]
        active:scale-[0.98] cursor-pointer   transition-all
        duration-200 ease-in-out">{label}</h3>
      <div className="flex  h-full flex-row  border-primary/30  border w-full rounded-[40px] overflow-hidden ">
        {stats.map((stat,index)=><DashboardStatsItem key={index} value={`${stat.value}${generateAfterStatsItem(props)}`}  label={stat.label}/>)}
      </div>
    </div>
  )
}
