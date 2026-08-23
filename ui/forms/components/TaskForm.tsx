import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs'

import type { TaskFormType } from '../../items/types/items.types';
import { useItems } from '@/hooks/useItems';
import { tasksSchema } from '../schemas/tasks.shema';
import { getStartHour,getEndHour } from '../../items/utils/items.utils';


import BodyFormContainer from './BodyFormContainer';
import HeroForm from './HeroForm';
import ElementForm from './ElementForm';
import DateSelector from './DateSelectorForm';
import TimeRangeSelector from './TimeRangeSelectorForm';
import FormActions from './FormActions';
import HabitSelectorForm from './HabitSelectorForm';


export interface TaskFormProps{
onAbort:()=>void,
onSubmit:(data:TaskFormType)=>void
}

export function TaskForm({onAbort,onSubmit}:TaskFormProps){
   
  const {register,handleSubmit,reset,setValue,watch, formState:{errors}}=useForm<TaskFormType>({
    resolver:zodResolver(tasksSchema),
    defaultValues:{date:dayjs(Date.now()).format('YYYY-MM-DD'),name:'',description:''}
  })

  const dateString = watch('date') ? dayjs(watch('date')).format('YYYY-MM-DD') : ''
  const {Habits,selectedTask,setTask}=useItems()

    useEffect(()=>{
  
       if(selectedTask!==null){
        
        reset({
          key:selectedTask.key,
          name:selectedTask.name,
          description:selectedTask.description,
          date:dayjs(selectedTask.date).format('YYYY-MM-DD'),
          start:getStartHour(selectedTask.date),
          end:getEndHour(selectedTask.date,selectedTask.duration),
  
        })
  
       }else{
        
        reset({
          name:'',
          description:'',
          start:'14:30',
          end:'16:00',
          date:dayjs(Date.now()).format('YYYY-MM-DD'),
        })
  
       }
     },[selectedTask,reset])
  

  return (
    <div className='flex z-998 justify-center min-h-screen  items-center h-auto py-5 overflow-auto    bg-[#050412]/70 w-full left-0 backdrop-blur-2xl  absolute top-0 '>
      <form className='flex flex-col w-min  mx-auto h-auto  pl-2' onSubmit={handleSubmit(onSubmit)} >
      
        <HeroForm title={'task'}/>

        <BodyFormContainer>            
          <ElementForm
            inputId="name"
            inputType="text"
            inputPlaceholder="Name"
            label='Name'
            error={errors.name?.message} // <- string | undefined
            {...register('name')}
          />
            <ElementForm
            inputId="description"
            inputType="text"
            label='Description'
            inputPlaceholder="Description"
            error={errors.description?.message} // <- string | undefined
            {...register('description')}
          />
        
          {Habits.length!==0&&(
          <HabitSelectorForm value={watch('habit')} setValue={(val:number)=>setValue('habit',val)}/>)}

          <DateSelector
            register={register}
            name="date"
            value={dateString}               // si necesitas formatear la fecha externamente
            errorMessage={errors.date?.message}
          />

          <TimeRangeSelector   
            register={register}
            startName="start"
            endName="end"
            startError={errors.start?.message}
            endError={errors.end?.message}
          />
        </BodyFormContainer>

        <FormActions
          selectedElement={selectedTask}
          onCancel={() => {
            setTask(null);
            reset();
            onAbort();
          }}
          className="mt-2"
          cancelClassName="bg-primary/2"
          submitClassName="bg-primary"
        /> 
        
      </form>
    </div>
  ) 
}

