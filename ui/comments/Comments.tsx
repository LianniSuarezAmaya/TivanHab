
import { useEffect, useState } from "react";
import { Button } from "../components/components/Button";
import CommentCard from "./components/CommentCard";
import type{ CommentInterface, CommentsProps } from "./types/comments.types";
import CommentForm from "./components/CommentForm";
import { CommentFrontend,useComments } from "@/hooks/useComments";

export default function Comments(){
  
  const [more,setMore]=useState<boolean>(false)
    const [form,setForm]=useState<boolean>(false)

    const { 
    data ,
    isLoading, 
    isError, 
    error 
  } = useComments()
        const [comments,setComments]=useState<CommentFrontend[]| undefined>(undefined)
  useEffect(()=>{
 
    if(!more&&data){
      setComments([...data].slice(0,2))
    }
    else {
      setComments(data)
    }
  },[more,data])

  if (isLoading) {
    return <p>Loading</p>;
  }
   if (data===undefined) {
    return <p>There is not comments</p>;
  }

  if (isError) {
    return <p>Error loading comments.</p>;
  }


 return (<div className="pb-[2%]">
  <h1 className="ml-[1%] text-lg font-light ">Comments:</h1>
  <div className="grid grid-cols-2  gap-x-10 gap-y-3  mx-auto">
   {comments&&comments.map((comment,index)=><CommentCard username={comment.username} message={comment.message} key={index}/>)}

 </div>
 <div className="flex justify-start w-full ">
  
  {!form&&(<div className="w-full flex gap-3 justify-end ">
  <Button type='button' variant='secondary' className="py-1 px-4 rounded-3xl  mt-7" onClick={()=>setForm(true)}>Add a comment</Button>
  <Button type='button' variant='secondary' className="py-1 px-4 rounded-3xl  mt-7" onClick={()=>setMore(!more)}>{more ? 'View Less'  :'View More'} </Button>
  </div>)}
  


 {form&&(<CommentForm onAbort={()=>setForm(false)} />)}
 </div>
 </div>)


}