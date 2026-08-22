'use client'

import  { useState , useEffect , useRef } from "react";

import type { HeroChartProps } from "../types/heroChart.types";

import { AgCharts } from "ag-charts-react";
import { Paramers } from "../hooks/heroChart.utils";

import {
  LegendModule,
  DonutSeriesModule,
  ModuleRegistry,
} from "ag-charts-community";

ModuleRegistry.registerModules([DonutSeriesModule, LegendModule]);

export const HeroChart = ({type}:HeroChartProps) => {
  
  const {isLoading,doneCount,todoCount}=Paramers({type})

  const [screen, setScreen] = useState({
    width: 0,
    height: 0,
  });


  const isMobile = screen.width < 900;
  const isiPad = (screen.height>screen.width+50)&&(screen.width>100);
  const isMedium=screen.width<750 && screen.width>500&&screen.height<750 && screen.height>500

  const colors = [
    "#FFFFFF", 
    "#4ECDC4", 
  ]
  const data = [
    { asset: "Done", amount: doneCount},
    { asset: "To Do", amount: todoCount},
  ]

     useEffect(() => {
        const handleResize = () => {
          setScreen({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
      handleResize()
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
      

  const [options, setOptions] = useState<any>({
    data: data,
    background: {
      fill: 'transparent', 
    },
    title: {  
      text: "",
    },
    legend: {
     enabled:false
    },
    series: [
      {
        calloutLabel: {
          enabled: true,
          fontWeight: "lighter",
          color: "white",
        },
        tooltip:{
          enabled:true
        },
        type: "donut" as const,
        angleKey: "amount",
        innerRadiusRatio: 0.9,
        calloutLabelKey: 'asset',
        innerLabels: [
          {
            text: 'Done ',
            fontWeight: 'lighter',
            color:'white',
             fontSize: isMobile ? 10 : isMedium ? 23 : 34,

          },
          {
            
            text: `${Number.isInteger((doneCount*100/Math.max(doneCount+todoCount,1))) ?(doneCount*100/Math.max(doneCount+todoCount,1)) :(doneCount*100/Math.max(doneCount+todoCount,1)).toFixed(2).toString()}%`,
            spacing: 4,
            fontSize: isMobile ? 20 : isMedium ? 33 : 44,
            color: 'white',
          },
        ],
        fills: colors,
        strokes: colors,
        strokeWidth: 2,
        innerCircle: {
          fill: "transparent",
        },
      },
    ],
  });
  
  const a=8
  
  const prevDoneCount = useRef(doneCount);
  const prevTodoCount = useRef(todoCount);

  useEffect(() => {

    if (prevDoneCount.current !== doneCount || prevTodoCount.current !== todoCount) {
      setOptions((prevOptions:any) => ({
        ...options,
        data: [
          { asset: "Done", amount: doneCount },
          { asset: "To Do", amount: todoCount },
        ],
          series: prevOptions.series.map((s: any) => ({
        ...s,
        innerLabels: [
          { text: 'Done', fontWeight: 'lighter', color: 'white', fontSize: isMobile ? 10 : isMedium ? 13 : 20 },
          { text:`${Number.isInteger((doneCount*100/Math.max(doneCount+todoCount,1))) ?(doneCount*100/Math.max(doneCount+todoCount,1)) :(doneCount*100/Math.max(doneCount+todoCount,1)).toFixed(2).toString()}%` , spacing: 4, fontSize: isMobile ? 17 : isMedium ? 33 : 44 , color: 'white' },
        ],
      })),
      }));

      
      prevDoneCount.current = doneCount;
      prevTodoCount.current = todoCount;
    }
  }, [doneCount, todoCount]);
 
  useEffect(() => {
    const handleResize = () => {
      setScreen({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if(isLoading){return <h1>Loading</h1>}

  return <AgCharts style={{ 
      width: isMobile ? '100%' : isiPad ? '100%' : isMedium ? '80%': '40vw' , 
      height:  isMobile ? '100%' : isiPad ? '30vh' : isMedium ? '10vh': '70vh' ,
      display:'block',
      marginTop: isMobile?-40 : isiPad ? -50 : isMedium ? '-70vh': -20,
       marginLeft:isMobile ?'0%' : isiPad ? '-1%'   : isMedium ? '-70%' : '-3%',
      position:'relative',  
      backgroundColor: isiPad ? 'transparent' : 'transparent',
      pointerEvents:'auto', 
    }}    
    options={options} />;
};
