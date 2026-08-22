import { useTimer } from "@/hooks/useTimer"

import { CheckIcon,PlayIcon,PauseIcon ,StopIcon} from "@heroicons/react/24/solid"
export function Timer(){
 
  const {
    time,
    isRunning,
    error,
    startTimer,
    pauseTimer,
    completeTimer,
    resetTimer
  }=useTimer()

  return (
    <div className="w-[20%]  fixed backdrop-blur-3xl  top-[2%]  gap-3 left-[78%] h-min  flex justify-start border rounded-4xl border-white/30 max-[500px]:w-[43%] max-[500px]:gap-3 max-[500px]:px-auto max-[500px]:left-[55%] max-[500px]:top-[2%]   max-[720px]:left-[62%] max-[720px]:top-[2%]  max-[720px]:gap-3 max-[720px]:px-auto  max-[1100px]:w-[35%] max-[1100px]:gap-3 max-[1100px]:left-[62%] p-5">
     
      <div className="w-min my-auto "> 
        <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-13 max-[500px]:size-8   max-[850px]:size-12  ">
          <path
            d="M5 3L2 6M22 6L19 3M6 19L4 21M18 19L20 21M12 9V13L14 15M12 21C14.1217 21 16.1566 20.1571 17.6569 18.6569C19.1571 17.1566 20 15.1217 20 13C20 10.8783 19.1571 8.84344 17.6569 7.34315C16.1566 5.84285 14.1217 5 12 5C9.87827 5 7.84344 5.84285 6.34315 7.34315C4.84285 8.84344 4 10.8783 4 13C4 15.1217 4.84285 17.1566 6.34315 18.6569C7.84344 20.1571 9.87827 21 12 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    <div className="flex flex-col">
      <h1 className="text-4xl max-[500px]:text-xl max-[720px]:text-2xl ">{time} </h1>

 <div className="flex justify-center">
  {isRunning&&(<PauseIcon className="size-7 text-white/30 max-[500px]:size-5 max-[720px]:size-6" onClick={pauseTimer}/>)}
      {!isRunning&&(<PlayIcon className="size-7 text-white/30 max-[500px]:size-5 max-[720px]:size-6" onClick={startTimer}/>)}
      <StopIcon className='size-7 text-white/30 max-[500px]:size-5 max-[720px]:size-6' onClick={resetTimer}/>
      <CheckIcon  className='size-7 text-white/30 max-[500px]:size-5 max-[720px]:size-6' onClick={completeTimer}/>

 </div>
        </div>

      <p className='error'>{error}</p>
    
    </div>
  )

}