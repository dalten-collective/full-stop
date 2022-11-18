// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocalStorage, useWindowFocus } from './lib';
import Urbit from '@urbit/http-api';
import { Overview } from './overview';
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

export function App() {
  const [periods, setPeriods] = useState();
  const [lastEdit, setLastEdit] = useState();
  const [flowcells, setFlowCells] = useLocalStorage("flowcells");
  const focused = useWindowFocus();

  // useEffect(() => {
  //   async function init() {
  //     const getPeriods = await api.scry({
  //       app: "full-stop",
  //       path: "/moon/each",
  //     })
  //     const getLastEdit = await api.scry({
  //       app: "full-stop",
  //       path: "/last"
  //     })
  //     setLastEdit(getLastEdit);
  //     setPeriods(getPeriods);
  //   }
  //   init();
  // }, [])

  // useEffect(async () => {
  //   const shouldUpdate = await shouldUpdatePeriods(lastEdit)
  //   if(focused && shouldUpdate) {
  //     async function update() {
  //       let getPeriods = await api.scry({
  //         app: "full-stop",
  //         path: "/moon/each",
  //       })

  //       setPeriods(getPeriods);
  //     }
  //     update();
  //   }
  // }, [focused, periods])
  
  // useEffect(() => {
  //   if(periods !== undefined) {
  //     let newCells = buildFlowCells(periods)
  //     setFlowCells(newCells)
  //   }
  // }, [periods])

  return (
    <BrowserRouter basename='/apps/full-stop'>
      <Routes>
        <Route path="/" element={<Overview/>} />
      </Routes>
    </BrowserRouter>
  );
}