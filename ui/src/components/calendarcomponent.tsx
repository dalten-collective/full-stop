// @ts-nocheck
import React, {useState, useEffect, useReducer} from "react"
import dayjs from "dayjs"
import CalendarItem from "./calendarItem"

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

    let [selectedDate, setSelectedDate] = useState(todaysDate.date());
    let [spotButtonClicked, setSpotButtonClicked] = useState(false);
    let squares = [];

    function handleNewSelection(v) {
        dispatch({type: 'switch', payload: { newDate: v }})
    }

    function handleSpotClick() {
        let flipv = selectionObject.spotOnCur;
        dispatch({type: 'spot', payload: { spotCurrent: flipv => !flipv }})
    }

    // squares.push(<CalendarItem key={1} day={1} offset={startOfMonth} highlight={selectedDate} onDateClicked={setSelectedDate} spotState={spotButtonClicked}/>)
    squares.push(<CalendarItem key={1} day={1} offset={startOfMonth} state={selectionObject} onDateClicked={handleNewSelection}/>)

    for (let i = 2; i <= monthDays; i++) {
        // squares.push(<CalendarItem key={i} day={i} highlight={selectedDate} onDateClicked={setSelectedDate} spotState={spotButtonClicked}/>)
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
            <div className="float-right mt-3">
                <div className="p-3 w-12 h-12 sm:w-20 sm:h-20 bg-gray-100 hover:bg-gray-300 active:bg-gray-500" onClick={(e) => handleSpotClick()}/>
            </div>
        </>
    )

}