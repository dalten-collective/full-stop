// @ts-nocheck
import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import CalendarCell from "./calendarCell"
import PopupMenu from "./popupmenu";

function CalendarComponent({periodData}) {
    let todaysDate = dayjs();
    let monthDays = todaysDate.daysInMonth();
    let [cells, setCells] = useState([]);
    let [currentSelection, setSelection] = useState(todaysDate.date() - 1)

    let pad = [];
    for (let i = todaysDate.startOf('month').day(); i != 1; i--) {
        pad.push(<div key={"pad-" + i}/>);
    }

    //init the calendar and select the date
    useEffect(() => {
        function init() {
            let month = []
            let initial = {spot: false, selected: false, periodStart: false, inPeriod: false, periodEnd: false}

            for (let i = 0; i < monthDays; i++) {
                month.push(initial)
            }
    
            let selectToday = month.map((cell, i) => {
                if ((i + 1) === todaysDate.date()) {
                    return {
                        ...cell,
                        selected: true
                    }
                } else {
                    return cell
                }
            });

            setCells(selectToday);
        }

        init();
    }, [])

    //only if we have data do we further manipulate the calendar
    useEffect(() => {
        function isWithinPeriod(thisDate) {
            let p = false
            if(thisDate >= periodData[0].periodStart.date() && thisDate <= periodData[0].periodStop.date()) {
                p = true
            }

            return p
        }

        function setCellState() {
            let markFlowDays = cells.map((cell, i) => {
                if (isWithinPeriod(i + 1)) {
                    return {
                        ...cell,
                        inPeriod: true
                    }
                } else {
                    return cell;
                }
            });

            let markStartEnd = markFlowDays.map((cell, i) => {
                if(periodData[0].periodStart.date() === i + 1) {
                    return {
                        ...cell,
                        periodStart: true
                    }
                } else if (periodData[0].periodStop.date() === i + 1) {
                    return {
                        ...cell,
                        periodEnd: true
                    }
                } else {
                    return cell
                }
            });

            return markStartEnd;
        }

        if (cells.length != 0 && periodData.length != 0) {
            let cellState = setCellState()
            setCells(cellState);
        }
    }, [periodData])

    function handleNewSelection(i) {
        let selectDeselect = cells.map((cell, ind) => {
            if (ind === i && cell.selected !== true) {
                setSelection(i);
                return {
                    ...cell,
                    selected: true
                }
            } else if (ind !== i && cell.selected === true) {
                return {
                    ...cell,
                    selected: false
                }
            } else {
                return cell;
            }
        })
        setCells(selectDeselect);
    }

    function handleSpotClick() {
        let spotUnspot = cells.map((cell, ind) => {
            if (ind === currentSelection && cell.spot !== true) {
                return {
                    ...cell,
                    spot: true
                }
            } else if (ind === currentSelection && cell.spot === true) {
                return {
                    ...cell,
                    spot: false
                }
            } else {
                return cell;
            }
        })
        setCells(spotUnspot);
    }

    return (
        <>
            <div className={`grid gap-3 grid-cols-7 justify-items-center`}>
                {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((head) => {
                    return <div key={"head-" + head} className="sm:text-lg text-m font-bold">{head}</div>
                })}
                {pad}
                {cells.map((cell, i)=>{
                    return <CalendarCell key={"cell-" + i} cellState={cell} day={i} onDateClicked={handleNewSelection}/>
                })}
            </div>
            <PopupMenu handleSpot={handleSpotClick}/>
        </>
    )
}

export default CalendarComponent;