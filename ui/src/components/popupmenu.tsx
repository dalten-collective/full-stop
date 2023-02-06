//@ts-nocheck
import React from "react";
import {Menu, MenuItem, MenuButton, SubMenu, MenuRadioGroup} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import './radiostyle.css'

export default function PopupMenu({handleSpot, handleRating, handleFlowStart, handleFlowStop, selectionState}) {
    let buttonStyle = 'text-4xl pb-1 font-bold w-20 h-20 border-2 hover:bg-gray-100 active:bg-gray-500'
    return (
    <div className="float-right mt-3">
        <Menu menuButton={<MenuButton className={buttonStyle}>+</MenuButton>} arrow  direction='top' transition>
            { !selectionState.inPeriod && 
            ( //we can start a flow outside a period only
            <SubMenu label="Flow">
                    { !selectionState.inPeriod && <MenuItem onClick={(e) => handleFlowStart()}>Start</MenuItem> }
                </SubMenu>
            )}
            { selectionState.inPeriod && 
            ( //we can stop a flow inside a period only
            <SubMenu label="Flow">
                    { selectionState.inPeriod && <MenuItem onClick={(e) => handleFlowStop()}>Stop</MenuItem> }
                </SubMenu>
            )}
            { !selectionState.inPeriod && <MenuItem onClick={(e) => handleSpot()}>Spot</MenuItem> }
            { selectionState.periodStart && <MenuItem onClick={(e) => {handleFlowStart()}}>Remove Period</MenuItem>}
            { selectionState.inPeriod == true && 
            ( //we have to wrap it in this
                <SubMenu label="Intensity Rating">
                    <MenuRadioGroup onRadioChange={(e) => handleRating(e.value)}>
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