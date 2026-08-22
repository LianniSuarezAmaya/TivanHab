'use client'
import { useForm } from 'react-hook-form';
import type { HabitFormType } from '@/ui/items/types/items.types';
import { HabitForm } from '@/ui/forms/components/HabitForm';
import { createTimeData } from '@/ui/forms/utils/form.utils';
import { useItems } from '@/hooks/useItems';
import { useRouter } from 'next/navigation';

export default function HabitFormPage(){
  const {reset}=useForm()
   const{addItem,editItem,selectedHabit,setHabit}=useItems()

   const router=useRouter()

  const onSubmit=(data:HabitFormType )=>{

    const {duration , startDate}=createTimeData(data.date,data.start,data.end)
    const newHabit={
      ...data,
      name:data.name,
      description:data.description,
      duration:duration,
      key:selectedHabit?.key,
      date:startDate,
      daysOfWeek:data.daysOfWeek?.map(Number) ,
    }

    if(selectedHabit) editItem(newHabit)
    else {addItem(newHabit)}

    reset()
    setHabit(null)
    router.push('/habits')
  }

  return (
    <HabitForm onAbort={()=>router.push('/habits')} onSubmit={onSubmit} />
  ) 
}

