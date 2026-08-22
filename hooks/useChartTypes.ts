'use client'

import { useState } from "react"

export function useChartTypes(){

  const [typeBar,setTypeBar]=useState<'points'|'productivity'>('points')
  const [typeChart,setTypeChart]=useState<"Task" | "Habit" | "General" | "Today" | "Week">('Today')
  const [timeBar,setTimeBar]=useState<"Days" | "Weeks">('Days')

  const changeTimeBar=(type:'Days'|'Weeks')=>{
   setTimeBar(type)
  }

  const changeTypeBar=(prop:'points'|'productivity')=>{
   setTypeBar(prop)
  }

  const changeTypeChart=(val:"Task" | "Habit" | "General" | "Today" | "Week")=>{
    setTypeChart(val)
  }

  return {
    typeChart,
    timeBar,
    typeBar,
    changeTypeChart,
    changeTimeBar,
    changeTypeBar,
  }

}