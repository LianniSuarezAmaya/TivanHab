'use client'
import { useForm } from 'react-hook-form'

import { useNothes } from '@/hooks/useNothes'
import { useRouter } from 'next/navigation'

import { NothesForm } from '@/ui/forms/components/NothesForm'
import { NotheFormType } from '@/ui/nothes/types/nothes.types'


export default function NothesFormPage(){

  const {reset}=useForm()
  const router=useRouter()
  const { addNothe,editNothe,setSelectedNothe,selectedNothe}=useNothes()



  const onSubmit=(data:NotheFormType)=>{

    const newNothe={
      ...data,
     key:selectedNothe?.key,
    }

    if(selectedNothe) editNothe(newNothe)
    else addNothe(newNothe)
 
    setSelectedNothe(null)
    reset()
    router.push('/nothes')
  }

  return(
   <NothesForm onAbort={()=> router.push('/nothes')} onSubmit={onSubmit} />
  )
}