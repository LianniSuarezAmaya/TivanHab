import type { Repeat } from '../types/forms.type';

import { FrequencyOptions } from './FrequencyOptions';
import { WeekDaysSelectorForm } from './WeekDaysSelectorForm';
import Circle  from './CircleForm';

interface FrequencySelectorFormProps {
  value:Repeat;                    // valor actual de 'repeat' ('once' | 'daily' | 'weekly' ...)
  onFrequencyChange: (val: Repeat) => void;
  daysOfWeek: number[];            // array de días seleccionados
  onDaysChange: (val: number[]) => void;
  className?: string;
}

export default function FrequencySelectorForm({
  value,
  onFrequencyChange,
  daysOfWeek,
  onDaysChange,
  className = '',
}: FrequencySelectorFormProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <Circle />
        <p
          className="text-2xl text-white font-light ml-5 mb-2 max-[700px]:text-xl"
          onClick={() => onFrequencyChange(value)} // si quieres mantener ese comportamiento (no hace nada)
        >
          Frequency
        </p>
      </div>

      <FrequencyOptions
        value={value}
        onChange={onFrequencyChange}
      />

      {value === 'weekly' && (
        <WeekDaysSelectorForm
          value={daysOfWeek}
          onChange={onDaysChange}
        />
      )}
    </div>
  );
}