import { useUser } from "@/hooks/useUser";

export function WeeklyUsers() {
  const {data,isError,isLoading,error} =  useUser().useWeeklyUsers;
  if (isLoading) {
  return <h1 className="text-xs font-extralight text-white/80 ">Loading...</h1>
  }

  if (isError) {
  return <h1 className="text-xs font-extralight text-red/80 ">{error.message}</h1>
  }

  return (
    <div className="flex items-center">
      <span className=" text-sm  text-white/80" title="User connected this week">
        Users  : {data?.activeThisWeek || 0}
      </span>
    </div>
  );
}