import type { CommentInterface } from "../types/comments.types";

export default function CommentCard(comment:CommentInterface){
  return(
    <div className="
    w-auto h-auto border text-start py-2 px-10 border-primary/30 rounded-3xl
    cursor-pointer
    transition-all
    duration-200 ease-in-out
    hover:bg-primary/1
    hover:backdrop-blur-sm
    hover:scale-[1.02]
    active:scale-[0.98]
    grow" >
     <h1 className="text-xl">{comment.username}</h1>
     <h1 className="text-white/80"> {comment.message}</h1>
    </div>
  )
}