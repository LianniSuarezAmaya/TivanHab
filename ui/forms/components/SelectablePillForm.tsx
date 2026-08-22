

import type { SelectablePillProps } from "../../items/types/items.types"
export function SelectablePillForm({
  label,
  active,
  onClick,
  className = '',
}: SelectablePillProps) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer text-lg max-[700px]:text-xs  py-1.5 px-3 rounded-3xl
        bg-primary/5 text-white/70 font-light
        transition-all duration-200
        hover:sc ale-105 hover:border hover:border-primary
        ${active ? 'border border-primary text-white' : ''}
        ${className}
      `}
    >
      {label}
    </div>
  )
}