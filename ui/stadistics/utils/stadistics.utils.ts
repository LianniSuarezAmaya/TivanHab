import dayjs from "dayjs"
import type { DailyLog,AbsoluteLogProps } from "../types/stadistics.types";


export function getDataDays(prop: TrendProps, days: number, logs: DailyLog[]): { data: number; day: string }[] {

  const endDate = dayjs().endOf('day').valueOf();

  const startDate = dayjs()
    .subtract(days - 1, 'day')
    .startOf('day')
    .valueOf();

  const Logs = getLogsBetweenDates(startDate, endDate, logs);

  const result: { data: number; day: string }[] = [];
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, 'day');
    result.push({
      data: 0,
      day: date.format('ddd'), // 'Mon', 'Tue', 'Wed', etc.
    });
  }

  for (let i = 0; i < Logs.length; i++) {
    const log = Logs[i];
    const index = dayjs(log.date).diff(startDate, 'day');

    if (index >= 0 && index < days) {
      let value = 0
      if (prop === 'points') value = log.pointsAcummulated;
      if (prop === 'productivity') value = getProductivity(log);
      result[index].data = value;
    }
  }

  return result;
}

export function getDataWeeks(
  prop: TrendProps,
  weeks: number,
  logs: DailyLog[]
): number[] {
  if (weeks <= 0) return [];
  if (logs.length === 0) return new Array(weeks).fill(0);

  const currentWeekStart = dayjs().startOf('week');
  const result: number[] = [];

  for (let i = weeks; i >= 1; i--) {
    const weekStart = currentWeekStart.subtract(i, 'week');
    const weekEnd = weekStart.add(7, 'day');
    const weekLogs = getLogsBetweenDates(weekStart.valueOf(), weekEnd.valueOf(), logs);

    let value: number;
    if (weekLogs.length === 0) {
      value = 0;
    } else if (prop === 'points') {
      value = getAveragePropLogs('pointsAcummulated', weekLogs);
    } else if (prop === 'productivity') {
      const sum = weekLogs.reduce((acc, log) => acc + getProductivity(log), 0);
      value = sum / weekLogs.length;
    } else {
      value = 0;
    }
    result.push(value);
  }

  return result;
}

export function getTotalDays(logs:DailyLog[]){
  if(logs.length===0) return 0
  return getDaysBetweenDates(logs[0].date,Date.now())
}
export function getDaysBetweenDates(endDate:number,startDate:number){

  const end=dayjs(endDate).startOf('day')
  const start =dayjs(startDate).startOf('day')
  const diff=start.diff(end,'day')
  if(diff<0) return 0

  return diff+1

}

export function getActiveDays(logs:DailyLog[]
){
  if(logs.length===0) return []
  return logs.filter((log:DailyLog)=>
    log.habitsCompleted>0||log.tasksCompleted>0
  )

}

export function getInactiveDays(logs:DailyLog[]){
  
  if(logs.length===0) return 0

  const totalDays=getTotalDays(logs)
  return totalDays-getActiveDays(logs).length

}

export function getSumLog(prop:AbsoluteLogProps,logs:DailyLog[]){
  if(logs.length===0) return 0

  let cont:number=0
  for(let i =0;i<logs.length;i++){
    cont+=logs[i][prop]||0
  }
  return cont
}

export function getAveragePropLogs(prop:AbsoluteLogProps,logs:DailyLog[]){
 
  if (logs.length==0) return 0
  return getSumLog(prop,logs)/getTotalDays(logs)
}

export function getVeryProdutiveDays(logs:DailyLog[]){
 
  if(logs.length===0) return []
  const mediumPoints=getAveragePropLogs('pointsAcummulated',logs)
  return logs.filter(log=>log.pointsAcummulated>mediumPoints*1.4)

}

export function getLowProdutiveDays(logs:DailyLog[]){

  if(logs.length===0) return [] 
  const mediumPoints=getAveragePropLogs('pointsAcummulated',logs)
  return logs.filter(log=>log.pointsAcummulated<mediumPoints*0.45&&log.pointsAcummulated>0)

}

export function getProductivity(data:DailyLog|DailyLog[]){

  let pointsScore:number
  let timeScore:number
  let taskScore:number
  let habitScore:number

  if(!Array.isArray(data)){
    pointsScore = Math.min(data.pointsAcummulated / 100,1)
    timeScore = Math.min(data.timeWorked / 120,1)
    taskScore = Math.min(data.tasksCompleted / 5,1)
    habitScore = Math.min(data.habitsCompleted / 4,1)
  }else{
    if(data.length===0) return 0 

    pointsScore = getSumLog('pointsAcummulated',data) / 100
    timeScore = getSumLog('timeWorked',data) / 120
    taskScore = getSumLog('tasksCompleted',data) 
    habitScore = getSumLog('habitsCompleted',data)
  }

  const productivity =
    (
      pointsScore * 0.4 +
      timeScore * 0.2 +
      taskScore * 0.2 +
      habitScore * 0.2
    ) /1000000

  return productivity

}



export function getLogsBetweenDates(start :number,end:number,logs:DailyLog[]){
 
  if(logs.length===0||start<=0||end<=0) return [] 
  return logs.filter(log=>log.date>=start&&log.date<=end)

}


export type TrendProps='productivity'|'points'

export type getProductivityProps={logs:DailyLog[]}|{log:DailyLog}

export function getMoodProductivyCorrelation(logs:DailyLog[]){
  
  if(logs.length===0) return 0 
 
  const bestDays=getVeryProdutiveDays(logs)
  const worstDays=getLowProdutiveDays(logs)

  const totalDays =bestDays.length+worstDays.length
  if(totalDays===0) return 0

  const isCorrelationBest=bestDays.filter(log=>log.mood!=undefined&&log.mood>=4).length
  const isCorrelationWorst=worstDays.filter(log=>log.mood!=undefined&&log.mood<=3).length
  return (((isCorrelationBest+isCorrelationWorst)/totalDays)*100)

}

