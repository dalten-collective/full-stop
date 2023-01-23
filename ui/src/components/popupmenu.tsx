//@ts-nocheck
import React, {useState} from "react";
import {Menu, MenuItem, MenuButton, SubMenu, MenuRadioGroup} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import './radiostyle.css'

export default function PopupMenu({handleSpot, handleRating, handleFlowStart, handleFlowStop}) {
    let buttonStyle = 'text-4xl pb-1 font-bold w-20 h-20 border-2 hover:bg-gray-100 active:bg-gray-500'
    return (
        <div className="float-right mt-3">
            <Menu menuButton={<MenuButton className={buttonStyle}>+</MenuButton>} arrow  direction='top' transition>
                <MenuItem onClick={(e) => handleSpot()}>Spot</MenuItem>
                <SubMenu label="Flow">
                    <MenuItem onClick={(e) => handleFlowStart()}>Start</MenuItem>
                    <MenuItem onClick={(e) => handleFlowStop()}>Stop</MenuItem>
                </SubMenu>
                <SubMenu label="Intensity Rating">
                    <MenuRadioGroup onRadioChange={(e) => handleRating(e.value)}>
                        <MenuItem type="radio" value={0}>Remove Rating</MenuItem>
                        <MenuItem type="radio" value={1}>1</MenuItem>
                        <MenuItem type="radio" value={2}>2</MenuItem>
                        <MenuItem type="radio" value={3}>3</MenuItem>
                        <MenuItem type="radio" value={4}>4</MenuItem>
                        <MenuItem type="radio" value={5}>5</MenuItem>
                    </MenuRadioGroup>
                </SubMenu>
            </Menu>
        </div>
    )
}