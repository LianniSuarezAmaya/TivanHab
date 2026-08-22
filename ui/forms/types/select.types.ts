
import type { SelectHTMLAttributes } from "react";

export interface OptionType<T extends string = string> {
  value: T;
  label: string;
}


 export interface SelectablePillProps {
  label: string
  active?: boolean
  onClick: () => void
  className?: string
}

export interface SelectProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>,'onClick'> {
  options: OptionType[];
  value:T;
  onClick: (value:T) => void;
}