import { useForm } from "react-hook-form";
import InputForm from "../../forms/components/InputForm";
import { Button } from "../../components/components/Button";
import { useCreateComment } from "@/hooks/useComments";
import { userService } from "@/app/api/client/user.client";
interface CommentFormType {
  comment: string
}

interface CommentFormProps {
  onAbort: () => void
  userId?: number
  onSuccess?: () => void
}

export default function CommentForm({ 
  onAbort,  
  onSuccess 
}: CommentFormProps) {
  const id=userService.getLocalUser()?.id
  if(!id){
    return
    
  }

  const { 
    register, 
    formState: { errors }, 
    reset, 
    handleSubmit 
  } = useForm<CommentFormType>()
  
  const createComment = useCreateComment()

  const onSubmit = async ({ comment }: CommentFormType) => {
    if (!comment.trim()) return

    try {
      await createComment.mutateAsync({
        content: comment,
        userId: id
      })
      
      reset()
      onAbort()
      if (onSuccess) onSuccess()
      
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form 
      className="w-full mt-8 flex-col items-start *:border-primary/30" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputForm 
        id="comment" 
        type="text" 
        className={`h-[10vh] w-full mr-0  ${createComment.isPending ? 'opacity-50' : ''}`}
        placeHolder="Comment" 
        {...register('comment', { 
          minLength: {
            value: 1,
            message: "Please write something"
          }
        })}
      />
      
      {errors.comment && (
        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {errors.comment.message}
        </p>
      )}
      
      <div className="w-full flex justify-end gap-3 pr-[4%]">
        <Button 
          variant='primary' 
          type='submit' 
          className="px-3 py-2 rounded-3xl justify-self-end mt-3"
          disabled={createComment.isPending}
        >
          {createComment.isPending ? (
            <span>⏳ Enviando...</span>
          ) : (
            'Send'
          )}
        </Button>
        
        <Button 
          variant='secondary' 
          type='reset' 
          className="px-3 py-2 rounded-3xl justify-self-end mt-3" 
          onClick={() => {
            reset()
            onAbort()
          }}
          disabled={createComment.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}