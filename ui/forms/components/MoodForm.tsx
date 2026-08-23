'use client'
import { useState } from 'react';
import type { Mood } from '../types/forms.type';

import { SelectablePillForm } from './SelectablePillForm';
import { Button } from '../../components/components/Button';

interface FormProps{
onSubmit:(data:Mood)=>void
currentFeeling:Mood,
}

export function MoodForm({onSubmit,currentFeeling}:FormProps){

  const options = [
    { label: 'Elite', value: 5 as Mood },
    { label: 'High', value: 4 as Mood},
    { label: 'Mid', value: 3 as Mood },
    { label: 'Low', value: 2 as Mood},
    { label: 'Fail', value: 1  as Mood}
  ];


  const [value,setValue]=useState<Mood>(currentFeeling)
  
  return (
    <form className='flex  justify-center min-h-screen h-screen overflow-auto  py-5  bg-[#050412]/70 w-full left-0 backdrop-blur-2xl  ' onSubmit={()=>onSubmit(value)}>
      <div className='w-[50%] px-auto h-min mt-40 pl-9 mx-auto  flex flex-col justify-between gap-6 max-[500px]:w-full max-[500px]:gap-3 max-[1100px]:w-[80%] '>
        <h1 className='text-5xl max-[700px]:text-2xl font-extralight text-start'>Hi,how do you feel today ?</h1>
        <h1 className='text-3xl max-[700px]:text-xl font-extralight text-start'>I feel ...</h1>

        <div className='flex flex-wrap   w-full ml-0 gap-4 items-center font-ligth max-[500px]:w-[90%] '>
          {options.map(o=>
            <SelectablePillForm key={o.value} label={o.label} active={value===o.value} className=' text-2xl text-white/85  max-[700px]:text-xl max-[700px]:px-9  w-min px-15'  onClick={()=>setValue(o.value)}/>
          )}
        </div>

        <Button type='submit' variant='primary'  className='w-[20%] ml-[85%] mt-10 py-1 font-extralight text-2xl rounded-[30px]  max-[700px]:text-xl max-[700px]:ml-[65%] max-[700px]:w-[25%]   max-[700px]:mt-2 max-[500px]:px-1' >Ok</Button>
      </div>
    </form>

  )
}