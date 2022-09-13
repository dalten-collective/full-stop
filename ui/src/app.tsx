// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import { RateForm } from './components/rateform';
import { PeriodForm } from './components/periodform';
import dayjs from 'dayjs';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

function retActions(scryArray) {
  let actions = []
  let actionTemplate = (timestamp, type, obj) => { 
    return {
      wen: timestamp,
      [type]: obj
    }
  }
  let timeNow = Math.floor(Date.now() / 1000);

  for (let period of scryArray) {
    let { flow: { edit, rate, stop}, start } = period;

    actions.push(actionTemplate(timeNow++, 'flow', {wen: start}))
    actions.push(actionTemplate(timeNow++, 'stop', {wen: stop}))
    if (rate.length > 0) {
      for (let tuples of rate) {
        let [recordDate, rating] = tuples;
        actions.push(actionTemplate(timeNow++, 'rate', {wen: recordDate, how: rating}))
      }
    }
  }

  return actions
}

function retDate(v) {
  let rv = 'not recorded';
  if (v !== null) {
    rv = dayjs(v * 1000).format('DD/MM/YYYY').toString()
  }
  
  return rv;
}

function retRateString(tuples) {
  let RateString = 'not recorded'
  if (tuples.length > 0) {
    RateString = ''
    for (let pair of tuples) {
      RateString += `${retDate(pair[0])} : ${pair[1]} ; `
    }
  }

  return RateString
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

  if (periods != undefined) { console.log(retActions(periods)); }

  return (
    <main>
      <table className='table-auto text-left border ml-6 my-3'>
        <thead>
          <tr>
            <th className='border pr-6'>date entered</th>
            <th className='border pr-6'>period started</th>
            <th className='border pr-6'>period ended</th>
            <th className='border pr-6'>flow rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(periods || {})
          .map((each) => {
            let rateString = retRateString(each.flow.rate)

            return(
            <tr>
              <td className='border pr-6'>{ retDate(each?.flow?.edit) }</td>
              <td className='border pr-6'>{ retDate(each?.start) }</td>
              <td className='border pr-6'>{ retDate(each?.flow?.stop) }</td>
              <td className='border pr-6'>{ rateString }</td>
            </tr>)
          })}
        </tbody>
      </table>
      <p className='ml-6 my-3'>flow key: <br/> [date] : [rating] ; <br/> '1' is light, '5' is heavy </p>
      <hr/>
      <div className='ml-6 my-3 inline-flex'>
          <PeriodForm/>
          <RateForm/>
      </div>
    </main>
  )
}