export type Repeat = 'daily' | 'weekly' | 'monthly'

import { SelectablePillForm } from "./SelectablePillForm";

const options: { value: Repeat; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

type Props = {
  value: Repeat
  onChange: (value: Repeat) => void
}

export function FrequencySelector({ value, onChange }: Props) {
  return (
    <div className="flex ml-5 gap-3">
      {options.map((opt) => (
        <SelectablePillForm
          key={opt.value}
          label={opt.label}
          active={value==opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            cursor-pointer text-lg max-[700px]:text-xs py-1 px-3 rounded-3xl
            bg-primary/5 text-white/70 font-light
            transition-all duration-200
            hover:scale-105 hover:border hover:border-primary
            ${value === opt.value ? 'border border-primary text-white' : ''}
          `}
     />
      ))}
    </div>
  )
}
