// @ts-nocheck
import React, {useEffect, useState} from "react"
import CalendarComponent from "../components/calendarcomponent";
import NavBar from "../components/navbar";
import dayjs from "dayjs";
import { useEffect } from "react";

export function Overview({data, dispatch, conStatus}) {
    const [calendarState, setCalendarState] = useState({})

    useEffect(() => {
        function init() {
            let todaysDate = dayjs();
            let monthSpotData = data && data.spots && data.spots.filter((e) => {
                let spotDate = dayjs.unix(e);
                if (spotDate.isSame(todaysDate, 'year') && spotDate.isSame(todaysDate, 'month')) {
                    return spotDate;
                }
            }) || [];

            let periodData = data && data.periods && data.periods.map((e) => {
                let start = dayjs.unix(e.start);
                let stop = dayjs.unix(e.flow.stop);

                let rates = e.flow.rate.map((e) => {
                    let date = dayjs.unix(e[0])
                    let rate = e[1]
                    return {ratingDate: date, rating: rate}
                })
                return { periodStart: start, periodStop: stop, ratings: rates}
            }) || null;
            
            let monthPeriodData = []
            if (periodData) {
              for (let i = 0; i < periodData.length; i++) {
                  if(periodData[i].periodStart.isSame(todaysDate, 'month')) {
                      monthPeriodData.push(periodData[i]);
                  }
              }
            }

            setCalendarState({periodData: monthPeriodData, spotData: monthSpotData});
        }
        
        if(Object.keys(data).length != 0) {
            init()
        }
    }, [])

    return (
        <main>
            <NavBar conStatus={conStatus}/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Your Overview</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
                <CalendarComponent data={calendarState} dispatch={dispatch}/>
            </div>
            <div className="my-12 justify-center max-w-2xl m-auto invisible">.</div>
        </main>
    )
}