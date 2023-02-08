// @ts-nocheck
import React, { useEffect, useState, createContext } from 'react';
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

export const DispatchContext = createContext();

export function App() {
  const [periods, setPeriods] = useLocalStorage('perioddata');
  const [spots, setSpots] = useLocalStorage('spotdata');
  const [optiondata, setOptiondata] = useLocalStorage('optiondata')
  const [lastEdit, setLastEdit] = useState();
  const [updateSpots, setUpdateSpots] = useState(false);
  const [updateRatings, setUpdateRatings] = useState(false);
  const [doUpdate, setDoUpdate] = useState(false);
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
    let timestamp = dayjs().unix();
  
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
      if (wasSpot) { setUpdateSpots(true); }
      if (wasRating) { setUpdateRatings(true); }
      setDoUpdate(true);
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
      setLastEdit(getLastEdit["last-edit"]);
      setOptiondata(getOptions)
    }
    init();
  }, [])

  useEffect(async () => {
    let updatePeriods = false;

    if (lastEdit != undefined) {
      await api.scry({
        app: "full-stop",
        path: "/last"
      }).then((latest) => {
        if (latest["last-edit"] === lastEdit) {
          ;
        } else {
          updatePeriods = true;
        }
      });
    }

    if (updatePeriods || updateRatings) {
      async function updatePeriods() {
        let getPeriods = await api.scry({
          app: "full-stop",
          path: "/moon/each"
        });
        setPeriods(getPeriods);
        setUpdateRatings(false);
      }
      updatePeriods();
    }

    if (updateSpots) {
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
    setDoUpdate(false);
  }, [focused, doUpdate])

  return (
    <DispatchContext.Provider value={dbDispatch}>
      <BrowserRouter basename='/apps/full-stop/'>
        <Routes>
          <Route path="/" element={<Overview data={{periods: periods, spots: spots}} conStatus={conStatus}/>} />
          <Route path="/options" element={<Options data={optiondata} conStatus={conStatus}/>} />
          <Route path="/details" element={<Details data={{periods: periods, spots: spots}} conStatus={conStatus}/>} />
        </Routes>
      </BrowserRouter>
    </DispatchContext.Provider>
  );
}