import type { DailyLog,AbsoluteLogProps } from "../../ui/stadistics/types/stadistics.types";

import dayjs from "dayjs"


export function getDataDays(prop: TrendProps, days: number, logs: DailyLog[]): { data: number; day: string }[] {

  const endDate = dayjs().endOf('day').valueOf();

  const startDate = dayjs()
    .subtract(days - 1, 'day')
    .startOf('day')
    .valueOf();

  const Logs = getLogsBetweenDates(startDate, endDate, logs);

  // Inicializar el arreglo con -1 y los nombres de los días
  const result: { data: number; day: string }[] = [];
  for (let i = 0; i < days; i++) {
    const date = dayjs(startDate).add(i, 'day');
    result.push({
      data: 0,
      day: date.format('ddd'), // 'Mon', 'Tue', 'Wed', etc.
    });
  }

  // Rellenar con los valores reales de los logs
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


 ///1
export function getTotalDays(logs:DailyLog[]){
  if(logs.length===0) return 0
  return getDaysBetweenDates(logs[0].date,Date.now())
}
export function getDaysBetweenDates(endDate:number,startDate:number){

  //dayjs.extend(utc)

  const end=dayjs(endDate).startOf('day')
  const start =dayjs(startDate).startOf('day')
  const diff=start.diff(end,'day')
  if(diff<0) return 0

  return diff+1

}


///2
export function getActiveDays(logs:DailyLog[]
){
  if(logs.length===0) return []
  return logs.filter((log:DailyLog)=>
    log.habitsCompleted>0||log.tasksCompleted>0
  )

}

///3

export function getInactiveDays(logs:DailyLog[]){
  
  if(logs.length===0) return 0

  const totalDays=getTotalDays(logs)
  return totalDays-getActiveDays(logs).length

}



//4
export function getSumLog(prop:AbsoluteLogProps,logs:DailyLog[]){
  if(logs.length===0) return 0

  let cont:number=0
  for(let i =0;i<logs.length;i++){
    cont+=logs[i][prop]||0
  }
  return cont
}
//5
export function getAveragePropLogs(prop:AbsoluteLogProps,logs:DailyLog[]){
 
  if (logs.length==0) return 0

  return getSumLog(prop,logs)/getTotalDays(logs)
}

//6
export function getVeryProdutiveDays(logs:DailyLog[]){
      if(logs.length===0) return []

  const mediumPoints=getAveragePropLogs('pointsAcummulated',logs)
  return logs.filter(log=>log.pointsAcummulated>mediumPoints*1.4)

}
//7
export function getLowProdutiveDays(logs:DailyLog[]){

      if(logs.length===0) return [] 

  const mediumPoints=getAveragePropLogs('pointsAcummulated',logs)
  return logs.filter(log=>log.pointsAcummulated<mediumPoints*0.45&&log.pointsAcummulated>0)

}
//8
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



//CONSISTENCY %
{/*export function calculateConsistencyInPeriod(start:number,end:number){
const HistoryLogs=useEvents().dailyLogs()

    if (start>=end||start<=0) return 1

  const startDay=dayjs(start)
  const endDay=dayjs(end)
  let diff:number=endDay.diff(startDay,'day')
   if (diff<1) diff=1
  const cantLogsBetweenDays=getLogsBetweenDates(start,end,HistoryLogs).length
  return cantLogsBetweenDays/diff
}*/}


//TREND
export type TrendProps='productivity'|'points'

{/*export function getTrend(days:number,logs:DailyLog[],prop:TrendProps){
  
   if(logs.length===0 || days<=0||logs.length<days) return 'stable'

  const LogsSevenDays=logs.filter(log=>
    dayjs(log.date).isAfter(
    dayjs().subtract(days,'day'))
    ||dayjs(log.date).isSame(
    dayjs().subtract(days,'day'))
  )

    const LogsPrevuisSevenDays=logs.filter(log=>
   ( dayjs(log.date).isAfter(
    dayjs().subtract(days*2,'day'))
    ||dayjs(log.date).isSame(
    dayjs().subtract(days*2,'day'))
  )
    &&
    dayjs(log.date).isBefore(
    dayjs().subtract(days,'day')))
    
    let averageSevenDays:number
    let averagePrevuisSevenDays:number

    if(prop='points'){
     averageSevenDays=getAveragePropLogs('pointsAcummulated',LogsSevenDays)
     averagePrevuisSevenDays=getAveragePropLogs('pointsAcummulated',LogsPrevuisSevenDays)
    }else{
     averageSevenDays=getProductivity(LogsSevenDays)
     averagePrevuisSevenDays=getProductivity(LogsPrevuisSevenDays)
    }
    if (averagePrevuisSevenDays===0) return 'stable'
    if(averageSevenDays>averagePrevuisSevenDays){
      return 'up'
    }else if(averageSevenDays<averagePrevuisSevenDays){
      return 'down'
    }else{
      return 'stable'
    }
     
}*/}

//DAYS

{/*export function getConsistencyRate(logs:DailyLog[]){
  if(logs.length===0) return 0 

 return getActiveDays(logs).length/getDaysBetweenDates(logs[0].date,logs[logs.length-1].date)
}*/}

export type getProductivityProps={logs:DailyLog[]}|{log:DailyLog}




export function getMoodProductivyCorrelation(logs:DailyLog[]){
    if(logs.length===0) return 0 
 
  const bestDays=getVeryProdutiveDays(logs)
    const worstDays=getLowProdutiveDays(logs)

    const totalDays =bestDays.length+worstDays.length
    if(totalDays===0) return 0

    const isCorrelationBest=bestDays.filter(log=>log.mood!=undefined&&log.mood>=4).length
    const isCorrelationWorst=worstDays.filter(log=>log.mood!=undefined&&log.mood<=3).length
    return  (((isCorrelationBest+isCorrelationWorst)/totalDays)*100)

}

