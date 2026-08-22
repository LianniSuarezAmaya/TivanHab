import { LinkIcon ,EnvelopeIcon,UserGroupIcon} from "@heroicons/react/24/solid"
import Comments from "@/ui/comments/Comments"

export function Footer(){
const comments=[
    {
      id: "1",
      username: "Carlos",
      message: "Great app!",
      createdAt: "2026-08-24",
    },
    {
      id: "2",
      username: "Laura",
      message: "I use it every day.",
      createdAt: "2026-08-04",
    },
       {
      id: "3",
      username: "Camila",
      message: "I love it.",
      createdAt: "2026-03-04",
    },
  ]
  return(
    <footer className=" max-[600px]:mx-[5%] max-[900px]:ml-[11.5%] mr-[2%] ml-[7%] flex flex-col gap-3.5">
    <div className="flex py-8 mt-15 flex-col h-auto   w-auto  rounded-[50px]  backdrop-blur-2xl  bg-[#050412]/65 border border-primary/40 [border-image:linear-gradient(to_bottom),var(--color-primary),1]  ">
      
      <h1 className="text-3xl text-center  max-[600px]:text-2xl">TivanHab</h1>
      <h2 className="text-2xl text-center font-light max-[600px]:text-xl ">Perfection is when you are doing better than yesterday</h2>
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
      <Comments Comments={comments}/>

    </footer>
  )
}