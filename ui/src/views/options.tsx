//@ts-nocheck
import React, { useEffect, useState } from "react"
import NavBar from "../components/navbar"
import OptionComponent from "../components/optioncomponent";

export function Options({data, dispatch, conStatus}) {
    const [optionsState, setOptionsState] = useState({});

    useEffect(() => {
        function init() {
            let notistate = data.noti;
            let fertstate = data.fert;
            setOptionsState({notifs: notistate, fertis: fertstate});
        }
        
        if(Object.keys(data).length != 0) {
            init()
        }
    }, [])

    return (
        <main>
            <NavBar conStatus={conStatus}/>
            <div className="justify-center max-w-2xl m-auto">
                <h1 className="text-4xl font-bold">Configure</h1>
                <hr className="mb-2 h-2 bg-gray-900 border-0"/>
                <OptionComponent data={optionsState} dispatch={dispatch}/>
            </div>
        </main>
    )
}