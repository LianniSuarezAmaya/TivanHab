'use client'

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import type { TaskFormType } from '@/ui/items/types/items.types';

import { useItems } from '@/hooks/useItems';
import { createTimeData } from '@/ui/forms/utils/form.utils';
import { TaskForm } from '@/ui/forms/components/TaskForm';

export default function TaskFormPage(){
 
  const {reset}=useForm()
  const router=useRouter()
  const { addItem,editItem,selectedTask,setTask}=useItems()

   
  const onSubmit=(data:TaskFormType)=>{

    const {duration , startDate}=createTimeData(data.date,data.start,data.end)
    const newTask={
      ...data,
      name:data.name,
      description:data.description,
      duration:duration,
      key:selectedTask?.key,
      date:startDate,
      habit: data.habit,
    }
    
    if(selectedTask) editItem(newTask)
    else addItem(newTask)

    reset()
    setTask(null)
    router.push('/tasks')
  }

  return <TaskForm onAbort={()=>router.push('/tasks')}  onSubmit={onSubmit} />
  
}

