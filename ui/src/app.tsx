// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

function PeriodForm() {
  const [flowDate, setFlowdate] = useState();
  const [stopDate, setStopdate] = useState();

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

  let maxDate = new Date()
  let temp = new Date(); // one month before today
  let minDate = new Date(temp.setMonth(temp.getMonth() - 1, 1))

  const validateSubmission = (event) => {
    event.preventDefault();

    let start = true, end = true;
    let timeNow = Math.floor(Date.now() / 1000);

    if (typeof flowDate == 'undefined') { start = false; }
    if (typeof stopDate == 'undefined') { end = false; }

    if (!start && !end) {
      return window.alert("you must submit a valid start or end date")
    }

    return submitPeriod(timeNow, start, end);
  }

  let formMax = maxDate.toLocaleDateString('en-CA')
  let formMin = minDate.toLocaleDateString('en-CA')

  return (
    <form onSubmit={event => validateSubmission(event)}>
      <label>period start:<br/>
        <input type="date" className='border mb-3' min={formMin} max={formMax} onChange={e => setFlowdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <label>period end:<br/>
        <input type="date" className='border mb-3' min={formMin} max={formMax} onChange={e => setStopdate(e.target.valueAsNumber / 1000)}/>
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
    rv = new Date(v * 1000)
    .toLocaleString(undefined, { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
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