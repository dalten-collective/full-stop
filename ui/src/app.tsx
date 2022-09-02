// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

// window.api.poke({app: "full-stop", mark: "dot-point", json: [{wen: 1661527629, flow: {wen: 1661527629}}]})
// window.api.poke({app: "full-stop", mark: "dot-point", json: [{wen: 1661795929, flow: {wen: 1651406329}}, {wen: 1661795930, stop: {wen: 1651751929}}]})

const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }

function PeriodForm() {
  const [flowDate, setFlowdate] = useState();
  const [stopDate, setStopdate] = useState();

  const inputPeriod = (event) => {
    event.preventDefault();

    let timeNow = Math.floor(Date.now() / 1000);
    let timeNowpp = timeNow + 1

    if(typeof flowDate == 'undefined' || typeof stopDate == 'undefined') {
      return window.alert("submit a period start or end date");
    }

    if(flowDate > timeNow || stopDate > timeNow) {
      return window.alert("your period start or end cannot be in the future");
    }

    window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: [
          {wen: timeNow,   flow: {wen: flowDate}}, 
          {wen: timeNowpp, stop: {wen: stopDate}}]
      }).then(() => location.reload());
  };

  let maxDate = new Date().toLocaleDateString('en-CA')
  let today = new Date(); // one month before today
  let minDate = new Date(today.setMonth(today.getMonth() - 1, 1)).toLocaleDateString('en-ca')

  return (
    <form onSubmit={event => inputPeriod(event)}>
      <label>period start:<br/>
        <input type="date" className='border mb-3' min={minDate} max={maxDate} onChange={e => setFlowdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <label>period end:<br/>
        <input type="date" className='border mb-3' min={minDate} max={maxDate} onChange={e => setStopdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <input type="submit" value="record"/>
    </form>
  )
}

function retDate(v) {
  let rv;
  if (v == null){
    rv = 'Not recorded'
  } else {
    rv = new Date(v * 1000).toLocaleString(undefined, dateOptions)
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