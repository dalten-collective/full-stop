// @ts-nocheck
import React from "react"

export default function CalendarItem({day, highlight}) {
    return (
        <div key={day} className="h-20 w-20 hover:bg-gray-200 border-2 px-1">
            {/* <div className="flex"> */}
                <p className="text-lg">{day}</p>
            {/* </div> */}
            
        </div>
    )
}