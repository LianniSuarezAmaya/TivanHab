'use client'

import { useState } from "react";
import { ChevronDownIcon , ChevronUpIcon} from "@heroicons/react/24/solid";
import { OptionType } from "../types/select.types";
import { SelectHTMLAttributes } from "react";

interface SelectProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>,'onClick'> {
  options: OptionType[];
  value:T;
  onClick: (value:T) => void;
}

export default function Select<T extends string>({
  options,
  onClick,
  value,
  className,
  ...props
}: SelectProps<T>) {
  
  const [open,setOpen]=useState<boolean>(false)

  const selectedLabel=[...options].find(o=>o.value===value)?.label
  return (
    <div className={`relative  ${className || 'w-auto'}`}>
      <button
        onClick={() => setOpen(!open)}

        className={` w-full flex justify-center items-center  px-3 py-0.5 
        ${open ? 'rounded-t-3xl' : 'rounded-3xl'}
      bg-white/15   text-white hover:bg-white/30
      cursor-pointer transition-all text-md  duration-300 ease-in-out 
      max-[530px]:text-sm 
        `}
      >
       {selectedLabel} 
       {open ? <ChevronUpIcon className="size-7 mt-1"/> :<ChevronDownIcon className="size-7 mt-1"/>}
      </button>    

      {/* Lista de opciones */}
      {open && (
        <ul
          className={`absolute left-0  py-0 mt-0 w-full  shadow-md z-10 
           rounded-b-xl  text-white bg-white/15 backdrop-blur-2xl
          `}
        >
          
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {onClick(opt.value as T),setOpen(false)}}
              className='cursor-pointer px-3 hover:bg-white/15 rounded-xl text-center  w-full
                text-white   py-1   hover:text-white '
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}