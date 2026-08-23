'use client'

import { useChartTypes } from "@/hooks/useChartTypes";
import { useItems } from "@/hooks/useItems";
import { useEvents } from "@/hooks/useEvents";

import { getMoodProductivyCorrelation } from "@/store/utils/stadistics.utils";

import { HeroChart } from "@/ui/components/components/HeroChart";
import BarChart from "@/ui/stadistics/components/Chart";
import MiniListItems from "@/ui/stadistics/components/MiniListItems";
import Select from "@/ui/components/components/Select";
import {WeeklyUsers } from "@/ui/stadistics/components/WeeklyUsers";
import DashboardStatsList from "@/ui/stadistics/components/DashboardStatsList";

import { GenerateDataStats } from "@/store/utils/stadistics.dashBoardStats.utils";

export default function StadisticsPage(){

  const DailyLogs=useEvents().dailyLogs()
  const DataStats=GenerateDataStats(DailyLogs)
  const {HabitsToDo,tasksToDo,moveItem}=useItems()
  const{
    typeChart,
    timeBar,
    typeBar,
    changeTypeChart,
    changeTimeBar,
    changeTypeBar
  }=useChartTypes()

  return (
    <div className="min-h-[80vh] pt-15   max-[550px]:pt-6">

      <div className="flex flex-col   items-start gap-2 pl-0 w-full">
        <div className="flex justify-between w-full pr-9">
          <h1 className="text-4xl  text-start ">Progress </h1>
          <WeeklyUsers/>
        </div>
        <Select options={[{value:'Task',label:'Tasks'},{value:'Habit',label:'Habits'},{value:'General',label:'General'},{value:'Today',label:'Today'},{value:'Week',label:'This Week'}]} value={typeChart} onClick={(val)=>changeTypeChart(val)} className={typeChart==='Week' ? 'w-34' : 'w-27`'}  />
      </div>
    
      <div className="h-auto mt-6 flex w-full flex-wrap justify-around items-start gap-10 mb-auto max-[1300px]:h-[40vh] max-[550px]:h-auto max-[550px]:gap-5 max-[1300px]:min-h-125">
        <div className="max-[900px]:w-full w-auto">
          <HeroChart type={typeChart}/>
          <p className="text-center ">Mood Impact : {getMoodProductivyCorrelation(DailyLogs)}%</p>
        </div>
        <div className="w-auto h-auto pt-6 flex flex-col gap-8 max-[550px]:gap-3 max-[550px]:flex-col  max-[900px]:flex-row max-[900px]:pt-2 ">
          <MiniListItems items={HabitsToDo} moveItem={(val)=>moveItem(val)} label="Habits" />
          <MiniListItems items={tasksToDo} moveItem={(val)=>moveItem(val)} label="Tasks" />
        </div>
      </div>
    
      <h1 className="text-4xl mt-30  text-start ml-9 max-[550px]:mt-20 max-[1000px]:mt-40">Trend</h1>
      
      <div className="flex  gap-5 ml-9 mt-5">
        <Select options={[{value:'Days',label:'Last 7 days'},{value:'Weeks',label:'Last 4 weeks'}]} onClick={(value)=>changeTimeBar(value) } value={timeBar} className="w-43"/>
        <Select options={[{value:'productivity',label:'Productivity'},{value:'points',label:'Points'}]} onClick={(value)=>changeTypeBar(value) } className="w-37" value={typeBar}/>
      </div>

      <BarChart key={JSON.stringify(DailyLogs)} logs={DailyLogs} time={timeBar} prop={typeBar}/>    
  
      {DataStats.map((data,index)=><DashboardStatsList {...data} key={index}/>)}

    </div>
  )
}