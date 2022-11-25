// @ts-nocheck
import React, {useState, useEffect} from "react"

export default function CalendarItem({state, day, onDateClicked}) {
    let cSel = state.currentSelection;
    let spotState = state.spotOnCur;

    const [localSpotState, setLocalSpotState] = useState(false)
    const [highlight, setHighlight] = useState(false)

    useEffect(() => {
        if(cSel == day) {
            setLocalSpotState(spotState)
        }
    }, [spotState])

    useEffect(() => {
        let v = (cSel == day ? true : false)
        setHighlight(v);
    }, [cSel])

    let highlightStr = ( highlight ? 'border-blue-300 ' : '');
    let styleStr = "h-12 w-12 md:w-20 md:h-20 hover:bg-gray-200 border-2 px-1 " + highlightStr;

    return (
        <div key={day} className={styleStr} onClick={(e) => onDateClicked(day)}>
            <div className="grid">
                <p className="text-xs md:text-lg select-none">{day}</p>
                {localSpotState == true ? 
                    <div className="rounded-full bg-black w-3 h-3 md:w-5 md:h-5 justify-self-center"/> 
                    : <div/>
                }
            </div>
        </div>
    )
}