
import dayjs from "dayjs"
import { useItems } from "@/hooks/useItems"
import { calculateNextDue } from "@/store/utils/items.utils"
import EventStore from "@/store/stores/events.store"

interface HeroChartProps{
    type: "Habit" | "Task" | "General" | "Today" | "Week"
}

  
export function Params({type}:HeroChartProps){
  const {HabitsDone,HabitsLater,HabitsToDo,loading,tasksDone,tasksToDo}=useItems()

  const startWeek=dayjs().day(1).startOf('day').valueOf()
  const endWeek=dayjs().day(7).endOf('day').valueOf()
  const startDay=dayjs().startOf('day').valueOf()
    
  const{getLastCompleted}=EventStore.getState()

  let doneCount:number=0
  let todoCount:number=0
  let isLoading:boolean=false

  if(type==='Habit'){
    doneCount = HabitsDone?.length || 0 
    todoCount = HabitsToDo?.length || 0;
    isLoading=loading
    doneCount=HabitsDone.length
    todoCount=HabitsToDo.length
  }
  else if(type==='Task'){
    doneCount = tasksDone?.length || 0 
    todoCount = tasksToDo?.length || 0;
    isLoading=loading
  }else if( type==='General'){ 
    doneCount = tasksDone?.length +HabitsDone.length || 0 
    todoCount = tasksToDo?.length +HabitsToDo.length+HabitsLater.length|| 0;
    isLoading=loading
  }else if(type==='Today'){
    isLoading=loading
    doneCount=HabitsDone.filter(h=>dayjs(getLastCompleted(h).at(-1)).isAfter(startDay)).length+tasksDone.filter(t=>dayjs(t.date).isSame(dayjs(Date.now()))).length
    todoCount=HabitsToDo.length+tasksToDo.length
  }else if(type==='Week'){
    isLoading=loading
    doneCount=HabitsDone.filter(h=>dayjs(getLastCompleted(h).at(-1)).isAfter(startWeek)).length+tasksDone.length
    todoCount=HabitsToDo.concat(HabitsLater).filter(h=>dayjs(calculateNextDue(h,startWeek)).isBefore(endWeek)&&dayjs(calculateNextDue(h,startWeek)).isAfter(startWeek)).length+tasksToDo.length
  }
  return {isLoading,doneCount,todoCount}
}