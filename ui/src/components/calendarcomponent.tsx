// @ts-nocheck
import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import CalendarCell from "./calendarCell"
import PopupMenu from "./popupmenu";

function CalendarComponent({data, dispatch}) {
    let todaysDate = dayjs();
    let monthDays = todaysDate.daysInMonth();
    let [cells, setCells] = useState([]);
    let [currentSelection, setSelection] = useState(todaysDate.date() - 1)

    let pad = [];
    let startofMonth = todaysDate.startOf('month').day();
    if (startofMonth === 0) { startofMonth = 6 }
    for (let i = 0; i != startofMonth; i++) {
        pad.push(<div key={"pad-" + i}/>);
    }

    //init the calendar and select the date
    useEffect(() => {
        function init() {
            let month = []
            let initial = {spot: false, selected: false, future: false, periodStart: false, inPeriod: false, periodEnd: false, rating: 0}

            for (let i = 0; i < monthDays; i++) {
                month.push(initial)
            }
    
            month = month.map((cell, i) => { //select today
                return (i + 1) === todaysDate.date() ? { ...cell, selected: true } : cell; 
            });

            month = month.map((cell, i) => { //grey out days after today
                return (i + 1) > todaysDate.date() ? { ...cell, future: true } : cell;
            })

            setCells(month);
        }

        init();
    }, [])

    //only if we have data do we further manipulate the calendar
    useEffect(() => {
        function isWithinPeriod(thisDate, start, end) {
            return (thisDate >= start.date() && thisDate <= end.date())
        }

        function parseCellData(cPeriodData, cSpotData, prevCells) {
            let newCells = [];
            let periodLen = 0;

            for (let i = 0; i < prevCells.length; i++) {
                let newCell = {...prevCells[i]};
                if (isWithinPeriod(i + 1, cPeriodData.periodStart, cPeriodData.periodStop)) {
                    if (periodLen < 12) { //stop setting period days after this many
                        newCell.inPeriod = true;
                        periodLen++;
                    }
                }

                if (cPeriodData.periodStart.date() === i + 1) {
                    newCell.periodStart = true;
                } else if (cPeriodData.periodStop.date() === i + 1 && cPeriodData.periodStop != 0) {
                    newCell.periodEnd = true;
                }

                for (let j = 0; j < cPeriodData.ratings.length; j++) {
                    if(i + 1 === cPeriodData.ratings[j].ratingDate.date()) {
                        newCell.rating = cPeriodData.ratings[j].rating
                    }
                }

                for (let j = 0; j < cSpotData.length; j++) {
                    let date = dayjs.unix(cSpotData[j]).date()
                    if (date === i + 1) {
                        newCell.spot = true;
                    }
                }
                newCells.push(newCell)
            }

            return newCells;
        }

        // do we have data, a month representation to alter and is the last recorded piece of data in this month?
        if (typeof(data) != 'undefined' && cells.length != 0 && data.length != 0) {
            let cellState;
            let prevState = [...cells];
            for (let period of data.periodData) {
                cellState = parseCellData(period, data.spotData, prevState)
                prevState = [...cellState];
            }
            setCells(cellState);
        }
    }, [data])

    function handleNewSelection(i) {
        let selectDeselect = cells.map((cell, ind) => {
            if (ind === i && cell.selected !== true && cell.future !== true) {
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

        let currentDateUnix = dayjs().date(currentSelection + 1).unix();
        dispatch({type: 'spot', payload: { date: currentDateUnix }});
        setCells(spotUnspot);
    }

    function handleRatingClick(value) {
        let changeRating = cells.map((cell, ind) => {
            if (ind == currentSelection) {
                return {
                    ...cell,
                    rating: value
                }
            } else {
                return cell;
            }
        })

        let currentDateUnix = dayjs().date(currentSelection + 1).unix();
        if (cells[currentSelection].inPeriod) {
            dispatch({type: 'rate', payload: { date: currentDateUnix, rating: value}})
            setCells(changeRating);
        } else { // add some sort of feedback?
            ;
        }
    }

    function handleFlowStart() {
        let currentDateUnix = dayjs().date(currentSelection + 1).unix()
        if (cells[currentSelection].inPeriod != true) {
            dispatch({type: 'flowstart', payload: {date: currentDateUnix}});
        } else if (cells[currentSelection].periodStart == true) {
            dispatch({type: 'flowstart', payload: {date: currentDateUnix}});
        } else {
            ;
        }
    }

    function handleFlowStop() {
        let currentDateUnix = dayjs().date(currentSelection + 1).unix()
        if (cells[currentSelection].inPeriod != true) {
            dispatch({type: 'flowstop', payload: {date: currentDateUnix}});
        } else if (cells[currentSelection].periodStop == true) {
            dispatch({type: 'flowstop', payload: {date: currentDateUnix}});
        } else {
            ;
        }
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
            <PopupMenu handleSpot={handleSpotClick} handleRating={handleRatingClick} handleFlowStart={handleFlowStart} handleFlowStop={handleFlowStop}/>
        </>
    )
}

export default CalendarComponent;