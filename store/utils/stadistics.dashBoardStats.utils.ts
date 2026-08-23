
import dayjs from "dayjs"
import  duration  from "dayjs/plugin/duration"

import type { DashboardStatsProps,Stats,DailyLog} from "../../ui/stadistics/types/stadistics.types"
import { getTotalDays,getVeryProdutiveDays,getLowProdutiveDays,getActiveDays,getInactiveDays,
  getProductivity,getSumLog,getAveragePropLogs,
 } from "./stadistics.utils"


export const formatTime = (ms:number) => {
  dayjs.extend(duration)

  const dur = dayjs.duration(ms)
  const days=Math.floor(dur.asDays())
  const hours = Math.floor(dur.asHours())
  const minutes = dur.minutes()
  const seconds = dur.seconds()
  
  return `${days>0 ? `${days}d` :''}  ${hours-(days*24)}h ${minutes}m  ${days===0 ? `${seconds}s` :''} `
} 

  
export function GenerateDataStats(DailyLogs:DailyLog[]){

  const totalDays = getTotalDays(DailyLogs);
  const veryProductive = getVeryProdutiveDays(DailyLogs).length;
  const lowProductivity = getLowProdutiveDays(DailyLogs).length;
  const active = getActiveDays(DailyLogs).length;
  const inactive = getInactiveDays(DailyLogs);

  const statsDataRatio: Stats[] = [
    { value: veryProductive, label: 'High Output' },
    { value: lowProductivity, label: 'Focus Days' },
    { value: active, label: 'Engaged Days' },
    { value: inactive, label: 'Missed Days' },
  ];

  const productivity=getProductivity(DailyLogs)
  const statsDataGlobal: Stats[] = [
  { value:Number.isInteger(productivity) ? productivity : productivity.toFixed(2), label: 'Score Producivity' },
  { value: getSumLog('habitsCompleted',DailyLogs), label: 'Habits Completed' },
  { value: formatTime(getSumLog('timeWorked',DailyLogs)), label: 'Time Worked' },
  { value: getSumLog('tasksCompleted',DailyLogs), label: 'Tasks Completed' },
  ];

  const averageHabitsCompleted=getAveragePropLogs('habitsCompleted',DailyLogs)
  const averageTasksCompleted=getAveragePropLogs('tasksCompleted',DailyLogs)
  const averagePointsAcummulated=getAveragePropLogs('pointsAcummulated',DailyLogs)
  const averageMood=getAveragePropLogs('mood',DailyLogs)

  const statsDataAverage: Stats[] = [
    { value:Number.isInteger( averageHabitsCompleted) ? averageHabitsCompleted:averageHabitsCompleted.toFixed(2), label: 'Habits ' },
    { value:Number.isInteger( averageTasksCompleted) ? averageTasksCompleted:averageTasksCompleted.toFixed(2), label: 'Tasks' },
    { value: Number.isInteger( averagePointsAcummulated) ? averagePointsAcummulated:averagePointsAcummulated.toFixed(2), label: 'Points' },
    { value: Number.isInteger( averageMood) ? averageMood:averageMood.toFixed(2), label: 'Mood' },
  ];

  const DashboardStatsData : DashboardStatsProps[] = [{
    type: 'number',
    label: 'Per Day Performance', // o el título que quieras
    stats: statsDataAverage,
  },
  {
    type: 'number',
    label: 'Overall Impact', // o el título que quieras
    stats: statsDataGlobal,
  },
  {
    type: 'ratio',
    label: 'Productivity Balance', // o el título que quieras
    stats: statsDataRatio,
    totalDays, // obligatorio para 'ratio'
  }
  ]

  return DashboardStatsData
}
