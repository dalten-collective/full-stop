// @ts-nocheck
import React from 'react';

export default function CalendarCell({ cellState, day, onDateClicked }) {
  let highlightStr = cellState.selected ? 'border-blue-300 ' : '';
  let flowFillStr;
  switch (true) {
    case cellState.inPeriod && cellState.rating > 0 && cellState.rating <= 1:
      flowFillStr = !cellState.future ? 'bg-red-100' : '';
      break;
    case cellState.inPeriod && cellState.rating > 1 && cellState.rating <= 3:
      flowFillStr = !cellState.future ? 'bg-red-300' : '';
      break;
    case cellState.inPeriod && cellState.rating > 3 && cellState.rating <= 5:
      flowFillStr = !cellState.future ? 'bg-red-500' : '';
      break;
    default:
      flowFillStr = cellState.inPeriod && !cellState.future ? 'bg-red-200' : '';
  }

  let isFutureStr = cellState.future ? 'bg-gray-200 hover:bg-gray-200' : '';
  let styleStr =
    'h-12 w-12 md:w-20 md:h-20 hover:bg-gray-100 active:bg-gray-500 border-2 px-1 ' +
    highlightStr +
    flowFillStr +
    isFutureStr;

  return (
    <div key={day} className={styleStr} onClick={(e) => onDateClicked(day)}>
      <div className="select-none">
        <p className="text-xs md:text-lg">{day + 1}</p>
        <div className="flex">
          {cellState.periodStart == true ? (
            <div className="text-xs md:text-lg text-red-700 ">●</div>
          ) : (
            <div />
          )}
          {cellState.periodEnd == true ? (
            <div className="text-xs md:text-lg text-red-700">◯</div>
          ) : (
            <div />
          )}
          {cellState.spot == true ? (
            <div className="font-extrabold font-serif text-lg md:text-xl text-red-700">
              ,
            </div>
          ) : (
            <div />
          )}
          {cellState.rating > 0 ? (
            <p className="font-extrabold text-xs md:text-lg">
              {cellState.rating}
            </p>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
