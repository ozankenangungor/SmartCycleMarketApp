import { DateTime } from "luxon"
import { relative } from "path"


const customizeRelativeDate = (relativeDate: string | null) => {
    if(relativeDate) {
       return relativeDate.replace("hours", "hrs").replace("hour", "hr").replace("minutes", "mins").replace("minute", "min").replace("days", "d").replace("day", "d").replace("weeks", "w").replace("week", "w").replace("months", "m").replace("month", "m").replace("years", "y").replace("year", "y")
}
}

export const formatDate = (dateString: string, format = "") => {
    const date = DateTime.fromISO(dateString)
    if(format) return date.toFormat(format)
    


    // if the date is within the last 7 days return the day name

    const now  = DateTime.now()
    
    if(date.hasSame(now, 'day')) {
        return customizeRelativeDate(date.toRelative())
        // checking if it is yesterday
    }else if(date.hasSame(now.minus({day: 1}), 'day')) {
        return "Yesterday"
        // if it is same week
    }else if(date > now.minus({days: 6})) {
        return date.toFormat('EEE')
        // Older than a week, show original date
    }else {
        return date.toFormat('dd/MM/yyyy')
    }
}