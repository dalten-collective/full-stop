//@ts-nocheck
import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    let inactiveClassName = "text-3xl font-semibold underline text-red-500 hover:text-red-700";
    let activeClassName = "text-3xl font-semibold hover:no-underline cursor-default";
    
    return (
        <div className="flex bg-gray-100 h-16 mb-6 border-b-2 items-center">
            <ul className="flex flex-row pl-6">
                <li className="px-6">
                    <NavLink to="/" className={
                        ({isActive}) => isActive ? activeClassName : inactiveClassName
                    }>
                    Overview
                    </NavLink>
                </li>
                <li className="px-6">
                    <NavLink to="/details" className={
                        ({isActive})=> isActive ? activeClassName : inactiveClassName
                    }>
                    Details
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}