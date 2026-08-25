import type { Mood } from "../../forms/types/forms.type"
import type { TrendProps } from "@/ui/stadistics/utils/stadistics.utils"
export type DailyLog={
  date:number,
  mood:Mood,
  streak:boolean,
  pointsAcummulated:number,
  timeWorked:number,
  tasksCompleted:number,
  habitsCompleted:number,
}

export type StatsListItem={
value:number|string,
label:string
}

export type DashboardStatsPropsBase={
  type:'porcentaje'|'number'|'ratio'
  stats:StatsListItem[],
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





   export interface ChartProps{
  logs:DailyLog[],
  time:'Days'|'Weeks'
  prop:TrendProps,
  }