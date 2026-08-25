import { useItems } from "@/hooks/useItems"
import { getDataDays,getDataWeeks } from "@/ui/stadistics/utils/stadistics.utils"
import type { DashboardStatsProps,ChartProps } from "../types/stadistics.types"

type dataChartType={
  name: string,
      Accumulated: number,
      pv: 0,
      amt: 0,
}

export function generateAfterStatsItem(props:DashboardStatsProps){
  const {type}=props
  let after:string=' '
  
  if(type==='porcentaje'){
    after='%'
  }else if (type==='ratio'){
    const {totalDays}=props
    after=`/${totalDays}`
  }
  return after
}

export const generateDataBarChart=({logs,time,prop}:ChartProps)=>{
 
  let baseDataDays:{data:number,day:string}[]
  let data:dataChartType[]
   
  if(time==='Days'){
      
    baseDataDays=prop==='points' ? getDataDays('points',7,logs) : getDataDays('productivity',7,logs)  
    data=[...baseDataDays].map((d)=>({
      name: d.day,        // "Mon", "Tue", ...
      Accumulated: d.data,         // valor numérico (puntos o productividad)
      pv: 0,                 // valor por defecto
      amt: 0,    
    }))

  }else{
      let baseData:number[]
      baseData=prop==='points' ? getDataWeeks('points',4,logs) : getDataWeeks('productivity',4,logs)  
      data=[...baseData].map((d,index)=>({
        name:`Week${index}`,Accumulated:d,pv:0,amt:0
      }))
  }

  return data
}




export function generateMiniListEventsMessage(type:'Tasks'|'Habits'){

  const{tasksDone,HabitsDone,tasksToDo,HabitsToDo}=useItems()
  let message:string=''
  if(type==='Tasks'){
    if(tasksDone.length===0&&tasksToDo.length===0){
      message='There is not tasks to do'
    }else if(tasksDone.length>0&&tasksToDo.length===0){
      message="Alright, you've already completed all of today's tasks."
    }
  }else{
    if(HabitsDone.length===0&&HabitsToDo.length===0){
      message='There is not habits to do'
    }else if(HabitsDone.length>0&&HabitsToDo.length===0){
      message="Alright, you've already completed all of today's habits."
    }
  }
 return message
}