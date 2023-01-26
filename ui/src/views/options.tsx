//@ts-nocheck
import React, { useEffect, useState } from "react"
import NavBar from "../components/navbar"

export function Options({data, dispatch}) {
    const [optionsState, setOptionsState] = useState({});

    useEffect(() => {
        function init() {
            let notistate = data.noti;
            let fertstate = data.fert;
            setOptionsState({notifs: notistate, fertility: fertstate});
        }
        
        if(data != undefined) {
            init()
        }
    }, [])

    return (
        <main>
            <NavBar/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Configure</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
            </div>
        </main>
    )
}