
import  Circle  from './CircleForm';
import { Label } from '../../components/components/Label';
import InputForm from './InputForm';
import type { UseFormRegister } from 'react-hook-form';

interface TimeRangeSelectorFormProps {
  register: UseFormRegister<any>;
  startName: string;       // nombre del campo 'start'
  endName: string;         // nombre del campo 'end'
  startError?: string;
  endError?: string;
  className?: string;
}

export default function TimeRangeSelectorForm({
  register,
  startName,
  endName,
  startError,
  endError,
  className = '',
}: TimeRangeSelectorFormProps) {
  return (
    <div className={`flex pb-9 items-center justify-start gap-4 ${className}`}>
      <Circle />

      <Label className="ml-1" htmlFor={startName}>From</Label>
      <InputForm
        id={startName}
        type="time"
        placeHolder="date"
        className="text-white w-min"
        {...register(startName)}
      />
      {startError && <p className="text-red-400 text-xs ml-7">{startError}</p>}

      <Label htmlFor={endName} className="ml-2">To</Label>
      <InputForm
        id={endName}
        type="time"
        placeHolder="date"
        className="w-min"
        {...register(endName)}
      />
      
      {endError && <p className="text-red-400 text-xs ml-7">{endError}</p>}
    </div>
  );
}