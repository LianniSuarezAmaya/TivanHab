import type { UseFormRegister } from 'react-hook-form';

import Circle from './CircleForm';
import { Label } from '../../components/components/Label';
import InputForm from './InputForm';

interface DateSelectorFormProps {
  register: UseFormRegister<any>;   // o con tu tipo de formulario: UseFormRegister<FormData>
  name: string;                     // nombre del campo en el formulario (ej: 'date')
  value?: string;                  // opcional: para control externo (como dateString)
  errorMessage?: string;
  className?: string;
}

export default function DateSelectorForm({
  register,
  name,value,
  errorMessage,
  className = '',
}: DateSelectorFormProps) {
  return (
    <div className={`flex flex-start items-center gap-3 -mt-2.5 ${className}`}>
      <Circle />
      <Label htmlFor={name} className="ml-2">StartDate</Label>
      <InputForm
        id={name}
        type="date"
        placeHolder="date"
        className="w-min"
        value={value}
        {...register(name)}         // ← onBlur, onChange, ref, name
      />
      {errorMessage && (
        <p className="text-xs text-start ml-7 font-light mt-2 text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}