 import InputForm from "@/ui/forms/components/InputForm";
 import { useForm } from 'react-hook-form'
 import { useUser } from "@/hooks/useUser";
 

 interface PROPS{
  setForm:(con:boolean)=>void
 }
 export default function UserNameForm({setForm}:PROPS) {
    
    
    const {register,watch,formState:{errors}}=useForm()
 const {updateName}=useUser()
 const onSubmitName = (data: { name: string }) => {
  if (data.name && data.name.trim().length >= 1 ) {
    updateName.mutate(data.name);
    setForm(false);
  }
};
    return (<>
    <InputForm maxLength={8} id="user" type='text' placeHolder="userName"   {...register('name', { 
          maxLength: {
            value: 8,
            message: "At most 8 characteres "
          }
        })}
   onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir submit del formulario
      const nameValue = watch('name');
     onSubmitName(nameValue)
    }
  }}></InputForm>
        {errors.name&&errors.name?.message}
        {updateName.isError&&(<p>An error ocurred. Please try agaain</p>)}
        {updateName.isPending&&(<p>Loading</p>)}
   </>)
} 