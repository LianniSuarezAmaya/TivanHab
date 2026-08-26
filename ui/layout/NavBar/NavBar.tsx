import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserIcon,ChartBarIcon ,PencilIcon,PencilSquareIcon,ArrowPathIcon,Bars3BottomLeftIcon,Bars4Icon} from '@heroicons/react/24/solid'

import { userService } from '@/app/api/client/user.client'
import { useUser } from '@/hooks/useUser'
import EventStore from '@/store/stores/events.store'

import UserNameForm from './UserNameForm'
import { messageMood } from './messageNavbar'

interface NavBarProps{
open:boolean,
setOpen:(value:boolean)=>void
}

export function NavBar({open,setOpen}:NavBarProps){
  const {register,watch,formState:{errors}}=useForm()

  const{user,updateName}=useUser()
  const[form,setForm]=useState<boolean>(false)
  const {getDailyMood}=EventStore.getState()
  const router=useRouter()
  const NavBarRef=useRef<HTMLDivElement>(null)
  const id=userService.getLocalUser()?.id

  const handleEvent=(e:React.MouseEvent<HTMLDivElement>)=>{
    if(e.target==e.currentTarget){
      setOpen(!open)
    }
  }


  useEffect(()=>{
   
    const handleEventMouse=(event:MouseEvent)=>{
     if(NavBarRef.current&&!NavBarRef.current.contains(event.target as Node)){
      setOpen(false)
     }
    }

    document.addEventListener('click',handleEventMouse)
    
    return ()=>document.removeEventListener('click',handleEventMouse)
  },[])
  
  const iconMobileClassName='size-9 max-[900px]:size-7 hover:cursor-pointer'
  const navigationDesktopElement='flex w-[75%] justify-start pl-3 gap-2 items-center hover:cursor-pointer'
  

  return (
    <div  ref={NavBarRef} >

      <nav onClick={handleEvent} className={`${open ? 'opacity-0 translate-y-3 scale-95 pointer-events-none ' : 'opacity-80 -translate-x-5 mt-0 scale-100 '}  fixed flex flex-col  justify-center   items-center h-min w-20 py-3 px-5 ml-4 mt-[4vh] rounded-[30px] z-999  backdrop-blur-2xl   bg-[#050412]/65 border border-primary/40 min-[600px]:opacity-0 min-[600px]:translate-y-3 min-[600px]:scale-95 min-[600px]:pointer-events-none max-[900px]:w-[8%] max-[700px]:w-[10%] max-[900px]:ml-[2%]`}>
      
      <Bars4Icon className={`${iconMobileClassName} text-white/80`} onClick={()=>setOpen(!open)} />

      </nav>

      <nav onClick={handleEvent} className={`${open ? 'opacity-0 translate-y-3 scale-95 pointer-events-none ' : 'opacity-100 translate-y-0 scale-100 '}  fixed flex flex-col  justify-between pt-10 pb-15  items-center h-[87vh] w-[5%] py-10 ml-2 mt-[5vh] rounded-[60px] z-999   backdrop-blur-2xl   bg-[#050412]/65 border border-primary/40 max-[900px]:w-[8%] max-[700px]:w-[10%] max-[900px]:ml-[1.5%] max-[600px]:opacity-0 max-[600px]:translate-y-3 max-[600px]:scale-95 max-[600px]:pointer-events-none`}>    
        <Bars4Icon className={`${iconMobileClassName}  flex items-start`} onClick={()=>setOpen(!open)} />

        <div onClick={handleEvent} className=' flex flex-col max-[800px]:text-md  max-[600px]:gap-y-5 max-[1100px]:gap-y-9 text-2xl gap-y-10   w-full h-[60%] items-center  justify-between max-[600px]:text-sm '>
          <ChartBarIcon className={iconMobileClassName}  onClick={()=>router.push('/')} />
          <PencilSquareIcon className={iconMobileClassName}  onClick={()=>router.push('/tasks')}/>
          <ArrowPathIcon  className={iconMobileClassName}  onClick={()=>router.push('/habits')}/>
          <Bars3BottomLeftIcon className={iconMobileClassName} onClick={()=>router.push('/nothes')}/>
        </div>
      </nav>
      
      <nav onClick={handleEvent} className={`${open ? 'opacity-100 translate-y-0 scale-100  ' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}  fixed flex flex-col justify-between  gap-7  items-start  h-[87vh] w-[28%]   pt-10 pb-15   pl-7 ml-2 mt-[5vh] rounded-[60px]  backdrop-blur-2xl  bg-[#050412]/65 border border-primary/40 z-999 max-[500px]:w-[65%] max-[800px]:w-[45%]  max-[1000px]:w-[35%] transition-all duration-300 ease-in-out`}>

        <div onClick={handleEvent} className='h-[30%] flex justify-start  flex-col w-full '>
          <div className="flex bg w-[85%] h-auto justify-start pl-3 gap-7 items-center" onClick={()=>router.push('/')} >
            <UserIcon className='size-15 bg-transparent text-amber-50/20 max-[600px]:size-10 hover:cursor-pointer  '/>
            <p className='text-3xl  max-[1100px]:text-2xl max-[600px]:text-xl  whitespace-pre-line  ' >{`Welcome \n${user?.name}`}</p>


          <PencilIcon  className=" size-9   max-[530px]:size-6" onClick={()=>{if(form&&id) updateName.mutate(watch('name')) ,setForm(false)
            else{setForm(true)}
          }}/>
          </div>
          {form&&<UserNameForm onAbort={()=>{setForm(false)}}/>} 
          <p className='text-start pl-3.5 mt-5 text-lg font-light max-[600px]:text-sm  max-[1100px]:mt-3'>YOU FEEL TODAY</p>
          <p className='text- start font-normal text-xl pl-3.5 max-[600px]:text-[0.9rem]  max-[1100px]:text-lg '>{messageMood(getDailyMood())}</p>
        </div>        

        <div onClick={handleEvent}  className=' flex flex-col max-[800px]:text-md  max-[600px]:gap-5 font-light max-[1100px]:gap-5 max-[1100px]:mt-8  text-xl gap-7 w-full h-[45%]   justify-between max-[600px]:text-sm '>
          

          <div className={navigationDesktopElement}  onClick={()=>router.push('/')} >
            <ChartBarIcon className=' size-8 ' />
            <p >Stadistics</p>
          </div>

          <div className={navigationDesktopElement} onClick={()=>router.push('/tasks')}>
            <PencilSquareIcon className='size-7.5'  />
            <p >Tasks</p>
          </div>


          <div className={navigationDesktopElement} onClick={()=>router.push('/habits')}>
            <ArrowPathIcon className='size-8'  />
            <p >Habits</p>
          </div>

          <div className={navigationDesktopElement} onClick={()=>router.push('/nothes')}>
            <Bars3BottomLeftIcon className='size-8' />
            <p>Nothes</p>
          </div>
        </div>

      </nav>
    </div>
  )
}