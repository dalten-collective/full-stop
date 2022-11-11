// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useLocalStorage, useWindowFocus } from './lib';
import Urbit from '@urbit/http-api';
import { PeriodForm } from './components/periodform';
import dayjs from 'dayjs';
import "./css/calendar.css"

const api = new Urbit('', '', window.desk);
api.ship = window.ship;
window.api = api;

async function shouldUpdatePeriods(prevLast) {
  if (prevLast === undefined) {
    return false
  }

  let shouldUpdate = false

  await api.scry({
    app: "full-stop",
    path: "/last",
  }).then((latest) => {
    let latestInt = latest["last-edit"]
    let prevLastInt = prevLast["last-edit"]
    if (latestInt === prevLastInt) {
      ;
    } else {
      shouldUpdate = true
    }
  }).catch((reason) => {
    console.log("promise rejected; reason: " + reason);
  });

  return shouldUpdate;
}

function buildFlowCells(periods) {
  if (periods === undefined) {
    return
  }

  let flowCells = []

  Object.values(periods || {})
        .map((each) => {
          let rateString = retRateString(each.flow.rate)
          let editDate = retDate(each?.flow?.edit)
          let startDate = retDate(each?.start)
          let endDate = retDate(each?.flow?.stop)
          flowCells.push({start: startDate, end: endDate, edit: editDate, rate: rateString})
        })

  return flowCells;
}

function retDate(v) {
  let rv = 'not recorded';
  if (v !== null) {
    rv = dayjs.unix(v).format('DD/MM/YYYY')
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
  const [lastEdit, setLastEdit] = useState();
  const [flowcells, setFlowCells] = useLocalStorage("flowcells");
  const focused = useWindowFocus();

  useEffect(() => {
    async function init() {
      const getPeriods = await api.scry({
        app: "full-stop",
        path: "/moon/each",
      })
      const getLastEdit = await api.scry({
        app: "full-stop",
        path: "/last"
      })
      setLastEdit(getLastEdit);
      setPeriods(getPeriods);
    }
    init();
  }, [])

  useEffect(async () => {
    const shouldUpdate = await shouldUpdatePeriods(lastEdit)
    if(focused && shouldUpdate) {
      async function update() {
        let getPeriods = await api.scry({
          app: "full-stop",
          path: "/moon/each",
        })

        setPeriods(getPeriods);
      }
      update();
    }
  }, [focused, periods])
  
  useEffect(() => {
    if(periods !== undefined) {
      let newCells = buildFlowCells(periods)
      setFlowCells(newCells)
    }
  }, [periods])

  return (
    <main>
      <div className='justify-center flex'>
        <PeriodForm/>
      </div>
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
          {Object.values(flowcells || {})
          .map((each, index) => {
            return (
              <tr key={"tablerow" + index}>
                <td className='border pr-6'>{ each?.edit }</td>
                <td className='border pr-6'>{ each?.start }</td>
                <td className='border pr-6'>{ each?.end }</td>
                <td className='border pr-6'>{ each?.rate }</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className='ml-6 my-3'>flow key: <br/> [date] : [rating] ; <br/> '1' is light, '5' is heavy </p>
      <hr/>
    </main>
  )
}