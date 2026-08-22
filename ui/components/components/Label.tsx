import type{ LabelProps } from "../../forms/types/forms.type"

export function Label({ htmlFor, className = '', children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={` max-[700px]:text-xl text-2xl  text-white font-light ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}