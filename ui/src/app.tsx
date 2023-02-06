// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocalStorage, useWindowFocus } from './lib';
import Urbit from '@urbit/http-api';
import dayjs from 'dayjs';
import dayjs_utc from "dayjs/plugin/utc"
dayjs.extend(dayjs_utc);
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
  const [optiondata, setOptiondata] = useLocalStorage('optiondata')
  const [lastEdit, setLastEdit] = useState();
  const [updateSpots, setUpdateSpots] = useState(false);
  const [updateRatings, setUpdateRatings] = useState(false);
  const focused = useWindowFocus();

    //ok, try, err, null
    const [conStatus, setStatus] = useState(null);
    window.api.onOpen = () => setStatus('ok');
    window.api.onRetry = () => setStatus('try');
    window.api.onError = () => setStatus('err');
  
  function dbDispatch(action) {
    let poke;
    let wasSpot = false;
    let wasRating = false;
    let timestamp = dayjs().utc().unix()
  
    switch(action.type) {
      case 'spot': {
        poke = [{ wen: timestamp, spot: { wen: action.payload.date } }];
        wasSpot = true;
        break;
      }
      case 'rate': {
        poke = [{ wen: timestamp, rate: { wen: action.payload.date, how: action.payload.rating }}]
        wasRating = true;
        break;
      }
      case 'flowstart': {
        poke = [{wen: timestamp, flow: { wen: action.payload.date }}]
        break;
      }
      case 'flowstop': {
        poke = [{wen: timestamp, stop: { wen: action.payload.date }}]
        break;
      }
      // case 'noti': {
      //   poke = [{wen: timestamp, noti: { }}]
      //   break;
      // }
    }
  
    return window.api.poke({
      app: "full-stop",
      mark: "dot-point",
      json: poke,
    }).then(() => {
      if(wasSpot) { 
        wasSpot = false; 
        setUpdateSpots(true);
      } else if (wasRating) {
        wasRating = false;
        setUpdateRatings(true);
      }
    });
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
      const getOptions = await api.scry({
        app: "full-stop",
        path: "/opts"
      })
      setSpots(getSpots);
      setPeriods(getPeriods);
      setLastEdit(getLastEdit);
      setOptiondata(getOptions)
    }
    init();
  }, [])

  useEffect(async () => {
    const updatePeriods = await shouldUpdatePeriods(lastEdit);

    if (focused && updateSpots) {
      async function updateSpots() {
        let getSpots = await api.scry({
          app: "full-stop",
          path: "/spot"
        });

        setSpots(getSpots);
        setUpdateSpots(false);
      }

      updateSpots();
    }

    if ((focused && updatePeriods) || updateRatings) {
      async function updatePeriods() {
        let getPeriods = await api.scry({
          app: "full-stop",
          path: "/moon/each"
        });

        setPeriods(getPeriods);
      }

      updatePeriods();
    }
  }, [focused, updateSpots, updateRatings])

  return (
    <BrowserRouter basename='/apps/full-stop/'>
      <Routes>
        <Route path="/" element={<Overview data={{periods: periods, spots: spots}} conStatus={conStatus} dispatch={dbDispatch}/>} />
        <Route path="/details" element={<Details data={{periods: periods, spots: spots}} conStatus={conStatus}/>} />
        <Route path="/options" element={<Options data={optiondata} dispatch={dbDispatch} conStatus={conStatus}/>} />
      </Routes>
    </BrowserRouter>
  );
}