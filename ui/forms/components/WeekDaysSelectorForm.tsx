import { SelectablePillForm } from "./SelectablePillForm"

const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

type WeekDaysSelectorFormProps = {
  value: number[]
  onChange: (days: number[]) => void
}

export function WeekDaysSelectorForm({ value, onChange }: WeekDaysSelectorFormProps) {
  const toggleDay = (idx: number) => {
    const exists = value.includes(idx)

    const newValue = exists
      ? value.filter(d => d !== idx)
      : [...value, idx]

    onChange(newValue)
  }
  return (
    <div className="flex mt-2 flex-wrap justify-start w-[90%] gap-2 ml-5">
      {weekDays.map((day, idx) => (
        <SelectablePillForm
          key={idx}
          label={day}
          active={value.includes(idx)}
          onClick={() => toggleDay(idx)}
        />
      ))}
    </div>
  )
}