// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

// window.api.poke({app: "full-stop", mark: "dot-point", json: [{wen: 1661527629, flow: {wen: 1661527629}}]})
// window.api.poke({app: "full-stop", mark: "dot-point", json: [{wen: 1661795929, flow: {wen: 1651406329}}, {wen: 1661795930, stop: {wen: 1651751929}}]})
function PeriodForm() {
  return (
    <form>
      <p>period start:</p>
      <input type="date" className='border mb-3'/>
      <p>period end:</p>
      <input type="date" className='border mb-3'/>
      <br/>
      <input type="submit" value="record"/>
    </form>
  )
}

export function App() {
  // const [subscription, setSub] = useState();
  const [periods, setPeriods] = useState();
  const [flowdate, setFlowdate] = useState("");
  const [stopdater, setStopdate] = useState("");

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

  const inputPeriod = (curDate, flowDate, stopDate) => {
    window.api.poke({
        app: "full-stop",
        mark: "dot-point",
        json: [
          { wen: curDate, flow: {wen: flowDate}},
          { wen: curDate +1, stop: {wen: stopDate}}
        ]
      })
  }

  console.log(periods)

  return (
    <main>
      <table className='table-auto text-left border ml-6 my-3'>
        <thead>
          <tr>
            <th className='border pr-6'>period entry last edited</th>
            <th className='border pr-6'>start date</th>
            <th className='border pr-6'>end date</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(periods || {})
          .map((each) => {
            return(
            <tr>
              <td className='border pr-6'>{new Date(each?.flow?.edit * 1000).toLocaleString()}</td>
              <td className='border pr-6'>{new Date(each?.start * 1000).toLocaleString()}</td>
              <td className='border pr-6'>{new Date(each?.flow?.stop * 1000).toLocaleString()}</td>
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