// @ts-nocheck
import React, {useEffect, useState} from "react"
import CalendarComponent from "../components/calendarcomponent";
import NavBar from "../components/navbar";
import dayjs from "dayjs";
import { useEffect } from "react";

export function Overview({data}) {
    const [calendarState, setCalendarState] = useState({})

    useEffect(() => {
        function init() {
            let todaysDate = dayjs();
            let monthSpotData = data.spots.filter((e) => {
                let spotDate = dayjs.unix(e);
                if (spotDate.isSame(todaysDate, 'year') && spotDate.isSame(todaysDate, 'month')) {
                    return spotDate;
                }
            })

            let periodData = data.periods.map((e) => {
                let start = dayjs.unix(e.start);
                let stop = dayjs.unix(e.flow.stop);

                let rates = e.flow.rate.map((e) => {
                    let date = dayjs.unix(e[0])
                    let rate = e[1]
                    return {ratingDate: date, rating: rate}
                })
                return { periodStart: start, periodStop: stop, ratings: rates}
            })
            
            let monthPeriodData = {}
            let lastPeriod = periodData[periodData.length - 1]
            if(lastPeriod.periodStart.isSame(todaysDate, 'month')) {
                monthPeriodData = lastPeriod;
            }

            setCalendarState({periodData: monthPeriodData, spotData: monthSpotData});
        }
        
        if(data != undefined) {
            init()
        }
    }, [])

    return (
        <main>
            <NavBar/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Your Overview</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
                <CalendarComponent data={calendarState}/>
            </div>
        </main>
    )
}