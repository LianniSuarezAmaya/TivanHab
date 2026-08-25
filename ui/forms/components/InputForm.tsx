import type { InputFormProps } from "../types/forms.type" 

export default function InputForm({id,type,placeHolder,className,registerName,...rest}:InputFormProps){
  const baseClassname='max-[700px]:text-sm text-lg py-2 text-white/70 px-3 w-[90%]   font-light bg-primary/5 rounded-3xl transition-all duration-200 focus:ring-1 focus:ring-primary focus:scale-[1.01]'

  return (
    <input id={id} type={type} placeholder={placeHolder} className={`${baseClassname} ${className}`} {...rest} />
  )

}