export type Comment ={
  id: string;
  username: string;
  message: string;
  createdAt: string;
}

export type CommentInterface ={
  username: string;
  message: string;
}

export interface CommentsProps{
  Comments:CommentInterface[]
}