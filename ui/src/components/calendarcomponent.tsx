// @ts-nocheck
import React, { useReducer } from "react"
import dayjs from "dayjs"
import CalendarItem from "./calendarItem"
import PopupMenu from "./popupmenu";

function reduceSelectionAction(state, action) {
    let newState;
    switch (action.type) {
        case 'spot': {
            newState = {
                ...state,
                spotOnCur: action.payload.spotCurrent
            }
            break;
        }
        case 'switch': {
            newState = {
                ...state,
                currentSelection: action.payload.newDate
            }
            break;
        }
    }

    return newState;
}

export default function CalendarComponent() {
    let todaysDate = dayjs();
    let monthDays = todaysDate.daysInMonth();
    let startOfMonth = todaysDate.startOf('month').day();

    const initState = {currentSelection: todaysDate.date(), spotOnCur: false}
    const [selectionObject, dispatch] = useReducer(reduceSelectionAction, initState)

    let squares = [];

    function handleNewSelection(v) {
        dispatch({type: 'switch', payload: { newDate: v }})
    }

    function handleSpotClick() {
        let flipv = selectionObject.spotOnCur;
        dispatch({type: 'spot', payload: { spotCurrent: flipv => !flipv }})
    }

    squares.push(<CalendarItem key={1} day={1} offset={startOfMonth} state={selectionObject} onDateClicked={handleNewSelection}/>)

    for (let i = 2; i <= monthDays; i++) {
        squares.push(<CalendarItem key={i} day={i} state={selectionObject} onDateClicked={handleNewSelection}/>)
    }

    return (
        <>
            <div className={`grid gap-3 grid-cols-7 justify-items-center`}>
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((head) => {
                    return <div key={"head-" + head} className="sm:text-lg text-m font-bold">{head}</div>
                })}
                {squares}
            </div>
            <PopupMenu handleSpot={handleSpotClick}/>
        </>
    )

}