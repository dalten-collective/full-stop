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
      return thisDate >= start && thisDate <= end;
    }

    function parseCellData(cPeriodData, cSpotData, prevCells) {
      let newCells = [];
      let periodLen = 0;
      let start = cPeriodData.periodStart;
      let end = cPeriodData.periodStop;

      for (let i = 0; i < prevCells.length; i++) {
        let newCell = { ...prevCells[i] };

        if(cPeriodData != 'none') {
          if (isWithinPeriod(i + 1, start.date(), end.date())) {
            periodLen++;
            if (periodLen < 12) { //stop setting period days after this many
              newCell.inPeriod = true;
            }
          } else if (end.isSame(dayjs.unix(0)) && i + 1 >= start.date()) {
            periodLen++;
            newCell.inPeriod = true;
          }

          if (start.date() === i + 1) {
            newCell.periodStart = true;
          }

          if (end != 0) {
            if (i + 1 > end.date()) {
              newCell.inPeriod = false;
            }

            if (end.date() === i + 1 && newCell.inPeriod) {
              newCell.periodEnd = true;
            }
          }
          
          if (cPeriodData.ratings.length > 0) {
            for (let j = 0; j < cPeriodData.ratings.length; j++) {
              let date = cPeriodData.ratings[j].ratingDate.date();
              let val = cPeriodData.ratings[j].rating;
              newCell.rating = (i + 1 === date) ? val : newCell.rating;
            }
          }
        }
        
        if (cSpotData.some((e) => {
          let date = e.date();
          return (date === i + 1) ? true : false
        })) {
          newCell.spot = true;
        } else {
          newCell.spot = false;
        }

        if (!newCell.inPeriod) { //cleanup
          if (newCell.periodStart) { newCell.periodStart = false;}
          if (newCell.periodEnd  ) { newCell.periodEnd   = false;}
          if (newCell.rating > 0 ) { newCell.rating      = 0;    }
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
