'use client'
import {useForm} from 'react-hook-form'
import { useEffect } from 'react';
import { userService } from '../api/client/user.client';
import type { UnsavedEvent } from '@/store/types/events.types.ts';
import type { Mood } from '@/ui/forms/types/forms.type';

import { AddEvent } from '@/store/utils/itemsStore.utils';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    const initializeUser = async () => {
      try {

        let currentUser = await userService.initUser()
        console.log('✅ Usuario inicializado:', currentUser)

        // 2. Ya se actualizó la conexión dentro de initUser
        console.log('✅ Conexión actualizada correctamente')

      } catch (error) {
        console.error('❌ Error al inicializar usuario:', error)
      } finally {
      }
    }

    initializeUser()
  }, [])

  return (<MoodForm onSubmit={onSubmit}  currentFeeling={watch('feeling')} />

  )
}