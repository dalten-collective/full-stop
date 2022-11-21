// @ts-nocheck
import React, {useState, useEffect} from "react"

export default function CalendarItem({day, highlight, offset, onDateClicked, spotState}) {
    let offsetStr = (offset != undefined ? `col-start-${offset}` : '')
    let highlightStr = ( highlight == day ? 'border-blue-300' : '')

    const [localSpotState, setLocalSpotState] = useState(false)

    useEffect(() => {
        if(highlight == day) {
            setLocalSpotState(spotState)
        }
    }, [spotState])

    return (
        <div key={day} className={`h-12 w-12 sm:w-20 sm:h-20 hover:bg-gray-200 border-2 px-1 ${offsetStr} ${highlightStr}`} onClick={(e) => onDateClicked(day)}>
            <div className="grid">
                <p className="text-xs sm:text-lg select-none">{day}</p>
                {localSpotState == true ? 
                    <div className="rounded-full bg-black w-2 h-2 sm:w-5 sm:h-5 justify-self-center"/> 
                    : <div/>
                }
            </div>
        </div>
    )
}