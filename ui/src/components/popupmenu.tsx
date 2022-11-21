//@ts-nocheck
import React, {useState} from "react";
import ClickAwayListener from "react-click-away-listener";

export default function PopupMenu({handleSpot}) {
    const [popup, setPopup] = useState(false);
    let buttonStyle = "w-20 px-2 h-auto bg-gray-100 hover:bg-gray-300 active:bg-gray-500"
    return (
        <div className="float-right mt-3">
            {popup && (
                <ClickAwayListener onClickAway={() => {setPopup(false)}}>
                    <div className="grid">
                        <button className={buttonStyle} onClick={(e) => handleSpot()}>Spot</button>
                        <button className={buttonStyle}>Dummy</button>
                        <button className={buttonStyle}>Dummy</button>
                    </div>
                </ClickAwayListener>
            )}
            <button className="font-bold text-4xl border-2 w-20 h-20" onClick={() => {setPopup(true)}}>+</button>
        </div>
    )
}