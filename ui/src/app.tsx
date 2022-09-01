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

    window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: [
          {wen: timeNow,   flow: {wen: flowDate}}, 
          {wen: timeNowpp, stop: {wen: stopDate}}]
      }).then(() => location.reload());
  };

  return (
    <form onSubmit={event => inputPeriod(event)}>
      <label>
        period start:<br/>
        <input type="date" className='border mb-3' onChange={e => setFlowdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <label>
        period end:<br/>
        <input type="date" className='border mb-3' onChange={e => setStopdate(e.target.valueAsNumber / 1000)}/>
      </label>
      <br/>
      <input type="submit" value="record"/>
    </form>
  )
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
              <td className='border pr-6'>{new Date(each?.flow?.edit * 1000).toLocaleString(undefined, dateOptions)}</td>
              <td className='border pr-6'>{new Date(each?.start * 1000).toLocaleString(undefined, dateOptions)}</td>
              <td className='border pr-6'>{new Date(each?.flow?.stop * 1000).toLocaleString(undefined, dateOptions)}</td>
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