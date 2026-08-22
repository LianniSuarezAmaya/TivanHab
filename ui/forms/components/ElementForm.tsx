     import InputForm from './InputForm'
      import Circle from "./CircleForm"
      import { Label } from "../../components/components/Label"

      interface ElementFormProps{
        inputId:string,
        label:string,
        inputType:'date'|'time'|'text',
        inputPlaceholder:string,
        error?:string,
        children?:React.ReactNode
      }

      export default function ElementForm({inputId,inputType,inputPlaceholder,error,label,children,...rest}:ElementFormProps){
      return (
      <div className='flex flex-col'>
        <div className='flex items-center'>
          <Circle />
          <Label htmlFor={inputId} className='ml-5'>{label}</Label>
        </div>

        <InputForm id={inputId} type={inputType}   placeHolder={inputPlaceholder}   {...rest}/>
        {error && (<p className='text-xs text-start ml-7 font-light mt-2 '>{error}</p>)}
        {children}
      </div>
      )
  }