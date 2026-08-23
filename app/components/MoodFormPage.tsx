'use client'

import { useEffect } from 'react';
import {useForm} from 'react-hook-form'
import { useRouter } from 'next/navigation';

import type { UnsavedEvent } from '@/store/types/events.types.ts';
import type { Mood } from '@/ui/forms/types/forms.type';

import { useUser } from '@/hooks/useUser';
import { AddEvent } from '@/store/utils/itemsStore.utils';
import { MoodForm } from '@/ui/forms/components/MoodForm';

export default function MoodFormPage(){
 
  const router=useRouter()

  const {setValue,watch}=useForm()

  const onSubmit=(mood:Mood)=>{

    localStorage.setItem('formSend' , new Date().toDateString())

    const newEvent:UnsavedEvent={
      type:'Mood',
      eventKey:Date.now(),
      action:'added',
      date:Date.now(),
      newData:{mood:mood}
     }

    AddEvent(newEvent)

    setValue('feeling' , mood as 1 | 2 | 5 | 4 | 3)
    router.push('/')
  }

  const {error,isLoading,data}=useUser().initUser

  useEffect(() => {
    const initializeUser = async () => {
      if(error){throw new Error('Error inizializating user')}
    }

    initializeUser()
  }, [])

  return <MoodForm onSubmit={onSubmit}  currentFeeling={watch('feeling')} />

}