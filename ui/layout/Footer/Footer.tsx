import { LinkIcon ,EnvelopeIcon,UserGroupIcon} from "@heroicons/react/24/solid"
import Comments from "@/ui/comments/Comments"

export function Footer(){

  return(
    <footer className=" max-[600px]:mx-[5%] max-[900px]:ml-[11.5%] mr-[2%] ml-[7%] flex flex-col gap-3.5">
      
      <div className="flex py-8 mt-15 flex-col h-auto   w-auto  rounded-[50px]  backdrop-blur-2xl  bg-[#050412]/65 border border-x border-primary/30  ">
        
        <h1 className="text-3xl text-center  max-[600px]:text-xl">TivanHab</h1>
        <h2 className="text-2xl text-center whitespace-break-spaces font-light max-[600px]:text-lg ">Perfection is when you are doing better than yesterday</h2>
        <span className="flex w-[70%] mt-5 mx-auto  items-center flex-wrap text-sm font-light justify-around max-[530px]:text-s max-[530px]:gap-1">
          <h3 className="">@ liadev 2026 All Right Reserved</h3>

          <div className='flex w-auto'>
          <EnvelopeIcon className="size-5 "/>
          <a href='mailto:liadev2006@gmail.com' >Email</a>
          </div>

          <div className='flex  flex-nowrap'>
          <LinkIcon className="size-5 "/>
          <a href='https://github.com/LianniSuarezAmaya'>Github</a>
          </div>

          <div className='flex  flex-nowrap'>
          <UserGroupIcon className="size-5 "/>
          <a href='https://linkedin.com/in/lianni-suarez-2773063a8' className='text-short'>LinkedIn</a>
          </div>
        </span>
      </div>

      <Comments/>

    </footer>
  )
}