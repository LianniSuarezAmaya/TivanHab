export default function  HeroForm({title}:{title:'habit'|'task'|'nothe'}){

  return <h1 className='text-4xl  max-[700px]:text-3xl text-start font-light'>{`Let's create a ${title}`}</h1>

}