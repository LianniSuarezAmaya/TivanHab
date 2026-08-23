'use client'

import { useMemo ,useState,useEffect} from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
//import { RechartsDevtools } from '@recharts/devtools';

import type { ChartProps} from '../types/stadistics.types';
import { generateDataBarChart } from '../utils/stadistics.components.utils';
import './Charts.css'

const BarChart = ({logs,time,prop}:ChartProps) => {

  const [screen, setScreen] = useState({
    width: 0,
    height:0,
  });

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
  
  const isMobile = screen.width < 600;


  return (
    <ComposedChart 
      style={{ width: '100%', maxWidth: '1300px', maxHeight: '70vh', aspectRatio: 1.618 ,outline:'none' }}
      responsive
      
      data={useMemo(() => {
          return generateDataBarChart({ logs, time, prop });
        }, [logs, time, prop])}
      margin={{
        top: 20,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      
    >
      <CartesianGrid pointerEvents='auto' stroke="#FFFFFF" strokeOpacity={0.1} />
      <XAxis dataKey="name" scale="band" stroke="#ffffff" strokeOpacity={0.1}  
        tick={{ fill: "rgba(255,255,255,0.6)" }}
        axisLine={{ stroke: "rgba(255,255,255,0.9)" }}
        tickLine={{ stroke: "rgba(255,255,255,0.9)" }} />
      <YAxis width="auto" stroke="#ffffff" strokeOpacity={0.4}
        tick={{ fill: "rgba(255,255,255,0.7)" }}
        axisLine={{ stroke: "rgba(255,255,255,0.9)" }}
        tickLine={{ stroke: "rgba(255,255,255,0.9)" }}   />
      <Tooltip  contentStyle={{
        backgroundColor: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "20px",
        padding: "2px",
        paddingTop:'0px',
            paddingBottom:'0px',

        fontSize: "14px",
      }}/>


      <Bar dataKey="Accumulated" barSize={isMobile ? 25 : 50} fill="#2D8787" />
      <Line type="monotone" dataKey="Accumulated" stroke="#ffffff" />
    {/**<RechartsDevtools /> */} 
    </ComposedChart>
  )
}

export default BarChart;