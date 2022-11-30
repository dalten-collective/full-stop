//@ts-nocheck
import React from "react";

export function DetailPicker({handleNewSelection, currentSelection}) {
    let activeStyle = "mr-3 font-semibold hover:no-underline text-lg cursor-default";
    let linkStyle = "mr-3 font-semibold text-red-500 text-lg hover:text-red-700";
    return (
        <div className="inline-block mb-3">
            {["periods", "ratings", "spotting", "sex"].map((title, i) => {
                return <button key={"button-" + i} className={currentSelection == title ? activeStyle : linkStyle} onClick={(e) => handleNewSelection(title)}>{title}</button>
            })}
        </div>
    )
}