'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { NotheFormType } from '@/ui/nothes/types/nothes.types'

import { useNothes } from '@/hooks/useNothes'
import { NothesForm } from '@/ui/forms/components/NothesForm'

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

  return <NothesForm onAbort={()=> router.push('/nothes')} onSubmit={onSubmit} />
  
}