import type { LabelHTMLAttributes } from "react"

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
  children: React.ReactNode
}

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