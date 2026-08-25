'use client'

import { useEffect } from "react";
import { useForm } from 'react-hook-form'
import { useUser } from "@/hooks/useUser";
import InputForm from "@/ui/forms/components/InputForm";

interface UserNameFormProps{
onAbort:()=>void
}

export default function UserNameForm({onAbort}:UserNameFormProps) {
    
  const {register,watch,formState:{errors}}=useForm()
  const {updateName}=useUser()
 
  const onSubmitName = (data: { name: string }) => {
    if (data.name && data.name.trim().length >= 1 ) {
            onAbort();

      updateName.mutate(data.name);
    }
  }

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key === 'Enter' && target.tagName === 'INPUT') {
        e.preventDefault()
        const nameValue = watch('name')
        onSubmitName({ name: nameValue })
      }
    }

    document.body.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown)
    }
  }, [watch, onSubmitName]) 

    return (<>
    <InputForm maxLength={8} id="user" type='text' placeHolder="userName"   {...register('name', { 
          maxLength: {
            value: 8,
            message: "At most 8 characteres "
          }
    })}>

    </InputForm>
        {errors.name&&errors.name?.message}
        {updateName.isError&&(<p>An error ocurred. Please try agaain</p>)}
        {updateName.isPending&&(<p>Loading</p>)}
   </>)
} 