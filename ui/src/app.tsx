// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import dayjs from 'dayjs';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

function PeriodForm() {
  const [flowDate, setFlowdate] = useState();
  const [stopDate, setStopdate] = useState();

  let maxdate = dayjs()
  let mindate = dayjs().subtract(40, "days");

  const submitPeriod = (timestamp, pstart, pstop) => {
    let actions = []

    if (pstart) { 
      actions.push({ wen: timestamp, flow: { wen: flowDate } }); 
      timestamp++ 
    }
    
    if (pstop)  { 
      actions.push({ wen: timestamp, stop: { wen: stopDate } })
    }

    return window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: actions,
      }).then(() => location.reload());
  };

  const validateSubmission = (event) => {
    event.preventDefault();

    let start = true, end = true;
    let maxdateUnix = maxdate.add(1, "day").unix();
    let mindateUnix = mindate.unix();
    let timeNow = Math.floor(Date.now() / 1000);

    if (typeof flowDate == 'undefined') { start = false; }
    if (typeof stopDate == 'undefined') { end = false; }
    if (flowDate > maxdateUnix || flowDate < mindateUnix) { start = false; }
    if (stopDate > maxdateUnix || stopDate < mindateUnix) { end = false; }
    if (flowDate === stopDate) { start = end = false;}

    if (!start && !end) {
      return window.alert("you must submit a valid start or end date within the last fourty days")
    }

    return submitPeriod(timeNow, start, end);
  }

  return (
    <form onSubmit={event => validateSubmission(event)}>
      <label>period start:<br/>
        <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setFlowdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <label>period end:<br/>
        <input type="date" className='border mb-3' min={mindate.format('YYYY-MM-DD')} max={maxdate.format('YYYY-MM-DD')} onChange={e => setStopdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <input type="submit" value="record"/>
    </form>
  )
}

function retDate(v) {
  let rv;
  if (v == null){
    rv = 'Not recorded';
  } else {
    rv = dayjs(v * 1000).format('DD/MM/YYYY').toString()
  }
  
  return rv;
}

export function App() {
  const [periods, setPeriods] = useState();

  useEffect(() => {
    async function init() {
      const getPeriods = await api.scry({
        app: "full-stop",
        path: "/moon/each",
      })
      setPeriods(getPeriods);
    }
    init();
  }, [])

  console.log(periods)

  return (
    <main>
      <table className='table-auto text-left border ml-6 my-3'>
        <thead>
          <tr>
            <th className='border pr-6'>date entered</th>
            <th className='border pr-6'>period started</th>
            <th className='border pr-6'>period ended</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(periods || {})
          .map((each) => {
            return(
            <tr>
              <td className='border pr-6'>{ retDate(each?.flow?.edit) }</td>
              <td className='border pr-6'>{ retDate(each?.start) }</td>
              <td className='border pr-6'>{ retDate(each?.flow?.stop) }</td>
            </tr>)
          })}
        </tbody>
      </table>
      <hr/>
      <div className='ml-6 my-3'>
          <PeriodForm/>
      </div>
    </main>
  )
}