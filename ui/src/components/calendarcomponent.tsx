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
        return i + 1 === todaysDate.date() ? { ...cell, selected: true } : cell;
      });

      month = month.map((cell, i) => {
        return i + 1 > todaysDate.date() ? { ...cell, future: true } : cell;
      });

      setCells(month);
    }

    init();
  }, []);

  //only if we have data do we further manipulate the calendar
  useEffect(() => {
    function isWithinPeriod(thisDate, start, end) {
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
          } else if (cPeriodData.periodStop.isSame(dayjs.unix(0))) {
            periodLen++;
            newCell.inPeriod = true;
          }

          if (cPeriodData.periodStop != 0 && i + 1 > cPeriodData.periodStop.date()) {
            newCell.inPeriod = false;
          }
  
          if (cPeriodData.periodStart.date() === i + 1) {
            newCell.periodStart = true;
          } else {
            newCell.periodStart = false;
          }
          
          if ( cPeriodData.periodStop.date() === i + 1 && cPeriodData.periodStop != 0 ) {
            newCell.periodEnd = true;
          } else {
            newCell.periodEnd = false;
          }
  
          for (let j = 0; j < cPeriodData.ratings.length; j++) {
            if (i + 1 === cPeriodData.ratings[j].ratingDate.date()) {
              newCell.rating = cPeriodData.ratings[j].rating;
            }
          }
        } else {
          newCell.periodEnd = false;
          newCell.periodStart = false;
          newCell.inPeriod = false;
        }
        
        if (cSpotData.some((e) => {
          let date = e.date();
          return (date === i + 1) ? true : false
        })) {
          newCell.spot = true;
        } else {
          newCell.spot = false;
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
      } else { //remove the period otherwise
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

  function handleAction(action) {
    let currentDate = dayjs()
      .date(currentSelection + 1)
      .unix();

    switch(action.type) {
      case 'spot': {
        dispatch({ type: 'spot', payload: { date: currentDate } });
        break;
      }
      case 'rate': {
        dispatch({ type: 'rate', payload: { date: currentDate, rating: action.payload } });
        break;
      }
      case 'flowstart': {
        dispatch({ type: 'flowstart', payload: { date: currentDate } });
        break;
      }
      case 'flowstop': {
        dispatch({ type: 'flowstop', payload: { date: currentDate } });
        break;
      }
    }
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
            <CalendarCell key={'cell-' + i} cellState={cell} day={i} onDateClicked={handleNewSelection}/>
          );
        })}
      </div>
      <PopupMenu handleAction={handleAction} selectionState={popupMenuState}/>
    </>
  );
}

export default CalendarComponent;
