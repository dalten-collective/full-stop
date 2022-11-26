// @ts-nocheck
import React, {useState, useEffect} from "react"

export default function CalendarCell({highlight, spot, day, onDateClicked}) {
    let highlightStr = ( highlight ? 'border-blue-300 ' : '');
    let styleStr = "h-12 w-12 md:w-20 md:h-20 hover:bg-gray-200 border-2 px-1 " + highlightStr;

    return (
        <div key={day} className={styleStr} onClick={(e) => onDateClicked(day)}>
            <div className="grid">
                <p className="text-xs md:text-lg select-none">{day + 1}</p>
                {spot == true ? 
                    <div className="rounded-full bg-black w-3 h-3 md:w-5 md:h-5 justify-self-center"/> 
                    : <div/>
                }
            </div>
        </div>
    )
}