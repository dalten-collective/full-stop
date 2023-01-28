//@ts-nocheck
import React from 'react';
import dayjs from 'dayjs';

function retDate(v) {
  let rv = 'not recorded';
  if (v !== null) {
    rv = dayjs.unix(v).format('DD/MM/YYYY');
  }

  return rv;
}

function retRateString(tuples) {
  let RateString = 'not recorded';
  if (tuples.length > 0) {
    RateString = '';
    for (let pair of tuples) {
      RateString += `${retDate(pair[0])} : ${pair[1]} ; `;
    }
  }

  return RateString;
}

function TableBody({ data, type }) {
  if (type == 'periods') {
    return <PeriodTable periodData={data.periods} />;
  } else if (type == 'ratings') {
    return <RatingTable periodData={data.periods} />;
  } else if (type == 'spotting') {
    return <SpottingTable spotData={data.spots} />;
  } else if (type == 'sex') {
    return (
      <tr key={'tablerow' + 1}>
        <td className="border pr-6"> placeholder </td>
        <td className="border pr-6"> 01/01/1970 </td>
      </tr>
    );
  }
}

function SpottingTable({ spotData }) {
  let table = Object.values(spotData || {}).map((each, index) => {
    let date = retDate(each);
    return (
      <tr key={'tablerow' + index}>
        <td className="border pr-6">{date}</td>
      </tr>
    );
  });

  return table;
}

function PeriodTable({ periodData }) {
  let table = Object.values(periodData || {}).map((each, index) => {
    let editDate = retDate(each?.flow?.edit);
    let startDate = retDate(each?.start);
    let endDate = retDate(each?.flow?.stop);
    return (
      <tr key={'tablerow' + index}>
        <td className="border pr-6">{editDate}</td>
        <td className="border pr-6">{startDate}</td>
        <td className="border pr-6">{endDate}</td>
      </tr>
    );
  });

  return table;
}

function RatingTable({ periodData }) {
  let table = Object.values(periodData || {}).map((each, index) => {
    let rateString = retRateString(each.flow.rate);
    let editDate = retDate(each?.flow?.edit);
    let startDate = retDate(each?.start);
    let endDate = retDate(each?.flow?.stop);
    return (
      <tr key={'tablerow' + index}>
        <td className="border pr-6">{editDate}</td>
        <td className="border pr-6">
          {startDate} to {endDate}
        </td>
        <td className="border pr-6">{rateString}</td>
      </tr>
    );
  });

  return table;
}

export function DetailTable({ currentTable, data }) {
  let detailTemplates = {
    periods: {
      headers: ['recorded', 'flow started', 'flow ended'],
    },
    ratings: {
      headers: ['recorded', 'flow between', 'ratings'],
    },
    spotting: {
      headers: ['recorded'],
    },
    sex: {
      headers: ['recorded', 'date'],
    },
  };

  return (
    <table className="table-auto text-left ">
      <thead>
        <tr>
          {detailTemplates[currentTable].headers.map((each, i) => {
            return (
              <th
                key={'head-' + i}
                className="pr-6 sm:text-lg text-m font-bold"
              >
                {each}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        <TableBody data={data} type={currentTable} />
      </tbody>
    </table>
  );
}
