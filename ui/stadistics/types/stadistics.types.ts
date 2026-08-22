import type { Mood } from "../../forms/types/forms.type"
import type { TrendProps } from "@/store/utils/stadistics.utils"
export type DailyLog={
  date:number,
  mood:Mood,
  streak:boolean,
  pointsAcummulated:number,
  timeWorked:number,
  tasksCompleted:number,
  habitsCompleted:number,
}

export type Stats={
value:number|string,
label:string
}

export type DashboardStatsPropsBase={
  type:'porcentaje'|'number'|'ratio'
  stats:Stats[],
  label:string
}
export interface DashboardStatsItems{
  value:string
  label:string
}


export type DashboardStatsProps =
  |(DashboardStatsPropsBase & {type:'ratio' , totalDays:number} )
  |(DashboardStatsPropsBase & {type:'porcentaje'|'number' } )



export type AbsoluteLogProps=
'mood'
|'pointsAcummulated'
|'timeWorked'
|'tasksCompleted'
|'habitsCompleted'



 export type dataChartType={
  name: string,
      Accumulated: number,
      pv: 0,
      amt: 0,
  }

   export interface ChartProps{
  logs:DailyLog[],
  time:'Days'|'Weeks'
  prop:TrendProps,
  }