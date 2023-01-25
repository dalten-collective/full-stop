// @ts-nocheck
import React, {useState, useEffect} from "react"

export default function CalendarCell({ cellState, day, onDateClicked}) {
    let highlightStr = ( cellState.selected ? 'border-blue-300 ' : '');
    let inPeriodStr = (cellState.inPeriod ? 'bg-red-200' : '')
    let styleStr = "h-12 w-12 md:w-20 md:h-20 hover:bg-gray-100 active:bg-gray-500 border-2 px-1 " + highlightStr + inPeriodStr;

    return (
        <div key={day} className={styleStr} onClick={(e) => onDateClicked(day)}>
            <div className="select-none">
                <p className="text-xs md:text-lg">{day + 1}</p>
                <div className="flex">
                    {cellState.periodStart == true ?
                        <div className="text-xs md:text-lg text-red-700 ">●</div>
                        : <div/>
                    }
                    {cellState.periodEnd == true ?
                        <div className="text-xs md:text-lg text-red-700">◯</div>
                        : <div/>
                    }
                    {cellState.spot == true ? 
                        <div className="font-extrabold font-serif text-lg md:text-xl text-red-700">,</div> 
                        : <div/>
                    }
                    {cellState.rating > 0 ? 
                        <p className="font-extrabold text-xs md:text-lg">{cellState.rating}</p> 
                        : <div/>
                    }
                </div>
            </div>
        </div>
    )
}