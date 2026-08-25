
import { useForm } from 'react-hook-form';
import { useEffect,useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs'
import { habitsSchema } from '../schemas/habits.shema';

import type { HabitFormType } from '../../items/types/items.types';
import HeroForm from './HeroForm';
import BodyFormContainer from './BodyFormContainer';
import ElementForm from './ElementForm';
import FrequencyElement from './FrequencySelectorForm';
import DateSelector from './DateSelectorForm';
import TimeRangeSelector from './TimeRangeSelectorForm';
import FormActions from './FormActions';
import { useItems } from '@/hooks/useItems';
import { getStartHour,getEndHour } from '../../items/utils/items.utils';


export interface HabitFormProps{
onAbort:()=>void,
onSubmit:(data:HabitFormType)=>void
}


export function HabitForm({onAbort,onSubmit}:HabitFormProps){
 
    const {register,handleSubmit,reset,setValue,watch, formState:{errors}}=useForm<HabitFormType>({
    resolver:zodResolver(habitsSchema),
    defaultValues:{date:dayjs(Date.now()).format('YYYY-MM-DD'), repeat: 'daily',name:'',description:'', daysOfWeek: [] as number[]}
  })
     const{isSubmitting,selectedHabit,setHabit}=useItems()
     const[loading,isLoading]=useState<boolean>(false)

    useEffect(()=>{

     if(selectedHabit!==null){
      
      reset({
        key:selectedHabit.key,
        name:selectedHabit.name,
        description:selectedHabit.description,
        date:dayjs(selectedHabit.date).format('YYYY-MM-DD'),
        start:getStartHour(selectedHabit.date),
        end:getEndHour(selectedHabit.date,selectedHabit.duration),
        repeat: selectedHabit.repeat||'daily',
        daysOfWeek:selectedHabit.daysOfWeek||[],
      })

     }else{
      
      reset({
        name:'',
        description:'',
        start:'14:30',
        end:'16:00',
        date:dayjs(Date.now()).format('YYYY-MM-DD'),
        repeat: 'daily',
        daysOfWeek:[],
      })

     }

   },[selectedHabit,reset])

  const dateString = watch('date') ? dayjs(watch('date')).format('YYYY-MM-DD') : ''



  return (
    <div className='flex z-998 justify-center min-h-screen mb-0 h-auto overflow-auto  py-5  bg-[#050412]/70 w-full left-0 backdrop-blur-2xl  items-center absolute top-0 '>
        <form className='flex flex-col w-auto mx-auto  h-auto mt-2  ' onSubmit={handleSubmit(onSubmit)}>
            <HeroForm title='habit'/>
             
              <BodyFormContainer>          
                <ElementForm
                  inputId="name"
                  label='Name'
                  inputType="text"
                  inputPlaceholder="Name"
                  error={errors.name?.message} // <- string | undefined
                  {...register('name')}
                />
                   <ElementForm
                  inputId="description"
                  label='Description'
                  inputType="text"
                  inputPlaceholder="Description"
                  error={errors.description?.message} // <- string | undefined
                  {...register('description')}
                />

               <FrequencyElement
                value={watch('repeat')}
                onFrequencyChange={(val) => setValue('repeat', val)}
                daysOfWeek={watch('daysOfWeek') || []}
                onDaysChange={(val) => setValue('daysOfWeek', val)}
              />

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
        endError={errors.end?.message}/>


            </BodyFormContainer>
     
          <FormActions
              selectedElement={selectedHabit}
              isSubmitting={isSubmitting}
              onCancel={() => {
                isLoading(true)
                setTimeout(()=>{
                  isLoading(false)
                },3000)
                setHabit(null);
                onAbort()
                reset();
              }}

              className="mt-2"
              cancelClassName="bg-primary/2"
              submitClassName="bg-primary"
            /> 

        </form>
    </div>
  ) 
}

