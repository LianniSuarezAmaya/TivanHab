import dayjs from "dayjs"

export function createTimeData(
  date:string,
  from:string,
  to:string
) {

  const start = dayjs(
    `${date} ${from}`,
    "YYYY-MM-DD HH:mm"
  )

  let end = dayjs(
   ` ${date} ${to}`,
    "YYYY-MM-DD HH:mm"
  )

  // Cross midnight
  if (end.isBefore(start)) {
    end = end.add(1, "day")
  }

  return {
    startDate: start.valueOf(),
    duration: end.diff(start, 'minutes')
  }
}

