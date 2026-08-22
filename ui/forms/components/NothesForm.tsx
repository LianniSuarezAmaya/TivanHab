'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { nothesSchema } from '../schemas/nothes.schema'
import type { NotheFormType } from '../../nothes/types/nothes.types'


import { useNothes } from '@/hooks/useNothes'
import HeroForm from './HeroForm'
import ElementForm from './ElementForm'
import BodyFormContainer from './BodyFormContainer'
import FormActions from './FormActions'
import { useEffect } from 'react'

interface FormProps{
  onAbort:()=>void,
  onSubmit:(data:NotheFormType)=>void
}

export function NothesForm({onAbort,onSubmit}:FormProps){

  const {register,handleSubmit,reset,formState:{errors}}=useForm<NotheFormType>({
    resolver:zodResolver(nothesSchema),
  })

  const { setSelectedNothe,selectedNothe}=useNothes()


  useEffect(()=>{
  
       if(selectedNothe!==null){
        reset({
          key:selectedNothe.key,
          title:selectedNothe.title,
          content:selectedNothe.content,
        })
       }
       else{
        reset({
          title:'',
          content:'',
        })
       }
     },[selectedNothe,reset])

  return(
    <div className='flex z-998 justify-center min-h-screen mb-0 h-auto overflow-auto  py-5  bg-[#050412]/70 w-full left-0 backdrop-blur-2xl  items-center absolute top-0 '>
      <form onSubmit={handleSubmit(onSubmit)}>

        <HeroForm title={'nothe'}/>
        
        <BodyFormContainer>
          <ElementForm
            inputId="title"
            inputType="text"
            inputPlaceholder="Title"
            label='Title'
            error={errors.title?.message} // <- string | undefined
            {...register('title')}
          />

          <ElementForm
            inputId="content"
            inputType="text"
            inputPlaceholder="Content"
            label='Content'
            error={errors.content?.message} // <- string | undefined
            {...register('content')}
          />

        </BodyFormContainer>

        <FormActions
          selectedElement={selectedNothe}
          onCancel={() => {
            setSelectedNothe(null);
            reset();
            onAbort();
          }}
          className="mt-20"
          cancelClassName="bg-primary/2"
          submitClassName="bg-primary"
        /> 

      </form>
    </div>
  )
}