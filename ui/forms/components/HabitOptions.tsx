import { SelectablePillForm } from "./SelectablePillForm";

import { useItems } from "@/hooks/useItems";
import type { HabitOptionsProps } from "../../items/types/items.types";

export function HabitOptions({ value, onChange }: HabitOptionsProps) {
  const {Habits}=useItems()
  const options: { value: number; label: string }[] = [...Habits].map((h)=>(
  {
    value:h.key,
    label:h.name
  }
  ))
  if(Habits.length===0) return <></>
 
  return (
    <div className="flex flex-wrap w-[80%] ml-5 gap-3">
      {options.map((opt) => (
        <SelectablePillForm
          key={opt.value}
          label={opt.label}
          active={value==opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            cursor-pointer text-sm py-1 px-3 rounded-3xl
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
