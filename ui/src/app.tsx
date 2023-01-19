// @ts-nocheck
import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocalStorage, useWindowFocus } from './lib';
import Urbit from '@urbit/http-api';
import dayjs from 'dayjs';
import { Overview } from './views/overview';
import { Details } from './views/details';
import { Options } from './views/options';

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
  const [periods, setPeriods] = useLocalStorage('perioddata');
  const [spots, setSpots] = useLocalStorage('spotdata');
  const [lastEdit, setLastEdit] = useState();
  const focused = useWindowFocus();

  function dbDispatch(action) {
    let poke;
    let timestamp = dayjs().unix()
  
    switch(action.type) {
      case 'spot': {
        poke = [{ wen: timestamp, spot: { wen: action.payload.date } }];
        break;
      }
    }
  
    return window.api.poke({
      app: "full-stop",
      mark: "dot-point",
      json: poke,
    }).then(() => location.reload());
  }

  useEffect(() => {
    async function init() {
      const getPeriods = await api.scry({
        app: "full-stop",
        path: "/moon/each",
      })
      const getSpots = await api.scry({
        app: "full-stop",
        path: "/spot"
      })
      const getLastEdit = await api.scry({
        app: "full-stop",
        path: "/last"
      })
      setSpots(getSpots);
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
        let getSpots = await api.scry({
          app: "full-stop",
          path: "/spot"
        })

        setPeriods(getPeriods);
        setSpots(getSpots);
      }
      update();
    }
  }, [focused, periods, spots])

  return (
    <BrowserRouter basename='/apps/full-stop/'>
      <Routes>
        <Route path="/" element={<Overview data={{periods: periods, spots: spots}} dispatch={dbDispatch}/>} />
        <Route path="/details" element={<Details data={{periods: periods, spots: spots}}/>} />
        <Route path="/options" element={<Options/>} />
      </Routes>
    </BrowserRouter>
  );
}