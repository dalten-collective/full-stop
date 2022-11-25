//@ts-nocheck
import React, {useState} from "react";
import {Menu, MenuItem, MenuButton} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

export default function PopupMenu({handleSpot}) {
    let buttonStyle = 'text-4xl pb-1 font-bold w-20 h-20 border-2 hover:bg-gray-100 active:bg-gray-500'
    return (
        <div className="float-right mt-3">
            <Menu menuButton={<MenuButton className={buttonStyle}>+</MenuButton>} arrow  direction='top' transition>
                <MenuItem onClick={(e) => handleSpot()}>Spot</MenuItem>
                <MenuItem>Dummy</MenuItem>
                <MenuItem>Dummy</MenuItem>
            </Menu>
        </div>
    )
}