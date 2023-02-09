//@ts-nocheck
import React from "react";
import {Menu, MenuItem, MenuButton, SubMenu, MenuRadioGroup} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import './radiostyle.css'

export default function PopupMenu({handleAction, selectionState}) {
    let buttonStyle = 'text-4xl pb-1 font-bold w-20 h-20 border-2 hover:bg-gray-100 active:bg-gray-500'
    return (
    <div className="float-right mt-3">
        <Menu menuButton={<MenuButton className={buttonStyle}>+</MenuButton>} arrow  direction='top' transition>
            { !selectionState.inPeriod && 
              <MenuItem onClick={(e) => handleAction({type: 'flowstart'})}>Flow Start</MenuItem> }
            { (selectionState.inPeriod && !selectionState.periodStart) && 
              <MenuItem onClick={(e) => handleAction({type: 'flowstop'})}>Flow Stop</MenuItem> }
            { !selectionState.inPeriod && 
              <MenuItem onClick={(e) => handleAction({type: 'spot'})}>Spot</MenuItem> }
            { selectionState.periodStart && 
              <MenuItem onClick={(e) => {handleAction({type: 'flowstart'})}}>Remove Period</MenuItem>}
            { selectionState.inPeriod == true && 
            ( //we have to wrap it in this
                <SubMenu label="Intensity Rating">
                    <MenuRadioGroup onRadioChange={(e) => handleAction({type: 'rate', payload: e.value})}>
                        {   //if there's a rating, you can remove it
                            selectionState.rating > 0 && <MenuItem type="radio" value={0}>Remove Rating</MenuItem> 
                        }
                        <MenuItem type="radio" value={1}>1</MenuItem>
                        <MenuItem type="radio" value={2}>2</MenuItem>
                        <MenuItem type="radio" value={3}>3</MenuItem>
                        <MenuItem type="radio" value={4}>4</MenuItem>
                        <MenuItem type="radio" value={5}>5</MenuItem>
                    </MenuRadioGroup>
                </SubMenu>
            )}
        </Menu>
    </div>
    )
}