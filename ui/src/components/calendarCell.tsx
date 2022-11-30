// @ts-nocheck
import React, {useState, useEffect} from "react"

export default function CalendarCell({ cellState, day, onDateClicked}) {
    let highlightStr = ( cellState.selected ? 'border-blue-300 ' : '');
    let inPeriodStr = (cellState.inPeriod ? 'bg-red-200' : '')
    let styleStr = "h-12 w-12 md:w-20 md:h-20 hover:bg-gray-100 active:bg-gray-500 border-2 px-1 " + highlightStr + inPeriodStr;

    return (
        <div key={day} className={styleStr} onClick={(e) => onDateClicked(day)}>
            <div className="grid">
                <p className="text-xs md:text-lg select-none">{day + 1}</p>
                {cellState.spot == true ? 
                    <div className="rounded-full bg-black w-3 h-3 md:w-5 md:h-5 justify-self-center"/> 
                    : <div/>
                }
                {cellState.periodStart == true ?
                    <div className="rounded-full bg-red-700 w-3 h-3 md:w-5 md:h-5 justify-self-center"/>
                    : <div/>
                }
                {cellState.periodEnd == true ?
                    <div className="border-4 border-red-700 w-3 h-3 md:w-5 md:h-5 justify-self-center"/>
                    : <div/>
                }
            </div>
        </div>
    )
}