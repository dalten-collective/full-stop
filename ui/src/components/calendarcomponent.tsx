// @ts-nocheck
import React, { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';
import CalendarCell from './calendarCell';
import { DispatchContext } from '../app';
import PopupMenu from './popupmenu';

function CalendarComponent({ data }) {
  let todaysDate = dayjs();
  let monthDays = todaysDate.daysInMonth();
  let [cells, setCells] = useState([]);
  let [currentSelection, setSelection] = useState(todaysDate.date() - 1);
  let [popupMenuState, setPMenuState] = useState({});
  let dispatch = useContext(DispatchContext);

  let pad = [];
  let startOfMonth = todaysDate.startOf('M').day()
  for (let i = 0; i < startOfMonth; i++) {
    pad.push(<div key={'pad-' + i} />);
  }

  useEffect(() => {
    if (Object.keys(cells).length != 0) {
      setPMenuState(cells[currentSelection]);
    }
  }, [cells])

  //init the calendar and select the date
  useEffect(() => {
    function init() {
      let month = [];
      let initial = {
        spot: false,
        selected: false,
        future: false,
        periodStart: false,
        inPeriod: false,
        periodEnd: false,
        rating: 0,
      };

      for (let i = 0; i < monthDays; i++) {
        month.push(initial);
      }

      month = month.map((cell, i) => {
        //select today
        return i + 1 === todaysDate.date() ? { ...cell, selected: true } : cell;
      });

      month = month.map((cell, i) => {
        //grey out days after today
        return i + 1 > todaysDate.date() ? { ...cell, future: true } : cell;
      });

      setCells(month);
    }

    init();
  }, []);

  //only if we have data do we further manipulate the calendar
  useEffect(() => {
    function isWithinPeriod(thisDate, start, end) {
      if(end.isSame(dayjs.unix(0))) {
        //we use 01/01/1970 as our 'we dont have a stop date' date
        return true;
      }
      return thisDate >= start.date() && thisDate <= end.date();
    }

    function parseCellData(cPeriodData, cSpotData, prevCells) {
      let newCells = [];
      let periodLen = 0;

      for (let i = 0; i < prevCells.length; i++) {
        let newCell = { ...prevCells[i] };

        if(cPeriodData != 'none') {
          if (isWithinPeriod(i + 1, cPeriodData.periodStart, cPeriodData.periodStop)) {
            periodLen++;
            if (periodLen < 12) { //stop setting period days after this many
              newCell.inPeriod = true;
            }
          } else if (cPeriodData.periodStop != 0) {
            newCell.inPeriod = false;
          }
  
          if (cPeriodData.periodStart.date() === i + 1) {
            newCell.periodStart = true;
          } else if (
            cPeriodData.periodStop.date() === i + 1 &&
            cPeriodData.periodStop != 0
          ) {
            newCell.periodEnd = true;
          }
  
          for (let j = 0; j < cPeriodData.ratings.length; j++) {
            if (i + 1 === cPeriodData.ratings[j].ratingDate.date()) {
              newCell.rating = cPeriodData.ratings[j].rating;
            }
          }
        }

        for (let j = 0; j < cSpotData.length; j++) {
          let date = dayjs.unix(cSpotData[j]).date();
          if (date === i + 1) {
            newCell.spot = true;
          }
        }

        newCells.push(newCell);
      }

      return newCells;
    }

    // do we have data, a month representation to alter and is the last recorded piece of data in this month?
    if (Object.keys(data).length != 0 && cells.length != 0) {
      let cellState;
      let prevState = [...cells];
      if (data.periodData.length > 0) {
        for (let period of data.periodData) {
          cellState = parseCellData(period, data.spotData, prevState);
          prevState = [...cellState];
        }
        setCells(cellState);
      } else if (data.spotData.length > 0) {  //any spots just in case?
        cellState = parseCellData('none', data.spotData, prevState);
        prevState = [...cellState];
        setCells(cellState);
      }
    }
  }, [data]);

  function handleNewSelection(i) {
    let selectDeselect = cells.map((cell, ind) => {
      if (ind === i && cell.selected !== true && cell.future !== true) {
        setSelection(i);
        return {
          ...cell,
          selected: !cell.selected,
        };
      } else if (ind !== i && cell.selected === true) {
        return {
          ...cell,
          selected: false,
        };
      } else {
        return cell;
      }
    });
    setCells(selectDeselect);
  }

  function handleSpotClick() {
    let spotUnspot = cells.map((cell, ind) => {
      if (ind === currentSelection && cell.inPeriod !== true) {
        return {
          ...cell,
          spot: !cell.spot,
        };
      } else {
        return cell;
      }
    });

    let currentDateUnix = dayjs()
      .date(currentSelection + 1)
      .unix();
    dispatch({ type: 'spot', payload: { date: currentDateUnix } });
    setCells(spotUnspot);
  }

  function handleRatingClick(value) {
    let changeRating = cells.map((cell, ind) => {
      if (ind == currentSelection) {
        return {
          ...cell,
          rating: value,
        };
      } else {
        return cell;
      }
    });

    let currentDateUnix = dayjs()
      .date(currentSelection + 1)
      .unix();
    if (cells[currentSelection].inPeriod) {
      dispatch({
        type: 'rate',
        payload: { date: currentDateUnix, rating: value },
      });
      setCells(changeRating);
    } else {
      // add some sort of feedback?
    }
  }

  function handleFlowStart() {
    let startFlow = cells.map((cell, ind) => {
      if (ind === currentSelection) {
        return {
          ...cell,
          periodStart: !cell.periodStart,
        };
      } else {
        return cell;
      }
    });

    let currentDateUnix = dayjs()
      .date(currentSelection + 1)
      .unix();

    dispatch({ type: 'flowstart', payload: { date: currentDateUnix } });
    setCells(startFlow);
  }

  function handleFlowStop() {
    let endFlow = cells.map((cell, ind) => {
      if (ind === currentSelection && cell.periodEnd !== true) {
        return {
          ...cell,
          periodEnd: !cell.periodEnd,
        };
      } else {
        return cell;
      }
    });
    let currentDateUnix = dayjs()
      .date(currentSelection + 1)
      .unix();
    dispatch({ type: 'flowstop', payload: { date: currentDateUnix } });
    setCells(endFlow);
  }

  return (
    <>
      <div className={`grid gap-3 grid-cols-7 justify-items-center`}>
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((head) => {
          return (
            <div key={'head-' + head} className="sm:text-lg text-m font-bold">
              {head}
            </div>
          );
        })}
        {pad}
        {cells.map((cell, i) => {
          return (
            <CalendarCell
              key={'cell-' + i}
              cellState={cell}
              day={i}
              onDateClicked={handleNewSelection}
            />
          );
        })}
      </div>
      <PopupMenu
        handleSpot={handleSpotClick}
        handleRating={handleRatingClick}
        handleFlowStart={handleFlowStart}
        handleFlowStop={handleFlowStop}
        selectionState={popupMenuState}
      />
    </>
  );
}

export default CalendarComponent;
