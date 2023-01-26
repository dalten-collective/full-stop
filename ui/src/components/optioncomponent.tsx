//@ts-nocheck
import React, { useEffect, useState } from "react"
import ReactSwitch from "react-switch";

function OptionComponent({data, dispatch}) {
    const [notifState, setNotifState] = useState(false);
    const [fertiState, setFertiState] = useState(false);

    useEffect(() => {
        function init() {
            setNotifState(data.notifs);
            setFertiState(data.fertis);
        }

        if(Object.keys(data).length != 0) {
            init()
        }
    }, [data])

    let handleNotifSwitch = next => {
        setNotifState(next);
    };
    let handleFertiSwitch = next => {
        setFertiState(next);
    };

    let switchstyle = 'align-middle ml-3'

    return (
        <>
            <div className="space-y-3">
                <div className="font-bold text-lg text-gray-400">
                    Notifications?
                    <ReactSwitch onChange={handleNotifSwitch} checked={notifState} className={switchstyle} disabled/>
                </div>
                <div className="font-bold text-lg text-gray-400">
                    Fertility Predictions?
                    <ReactSwitch onChange={handleFertiSwitch} checked={fertiState} className={switchstyle} disabled/>
                </div>
            </div>
        </>
    )
}

export default OptionComponent;