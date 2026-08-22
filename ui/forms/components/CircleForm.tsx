interface CircleProps{
  className?:string
}

export default function CircleForm ({className}:CircleProps){
  return  <div className={`w-2.5 h-2.5 -ml-1.5  rounded-full bg-white ${className}`}/>
}