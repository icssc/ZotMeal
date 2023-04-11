import React, {useEffect, useState} from "react";
import "./Station.css"
import Menu from "./Menu";
import './StationDetails.css'

function Station(props: any){

    const stationName = props.info.station
    const menuItems = props.info.menu

    const [detailsOpen, setDetailsOpen] = useState(false)

    useEffect(() => {})

    return (
        <div className="station">
            <div className="station-header">
                {stationName}
                <button onClick={() => setDetailsOpen(true)} className="details">
                    More Details
                </button>
            </div>
            <div className="menu-list">
                {menuItems.map((menu: Object) =>
                    <Menu key={menu.category} info={menu}/>
                )}
            </div>

            <div className={detailsOpen? undefined : 'hidden'}>
                <div className='modal'>
                    <div className='modal-content'>
                        <span onClick={() => setDetailsOpen(false)} className='close'>
                            X
                        </span>
                        <div className='menu-list-modal'>
                            {menuItems.map((menu: Object) =>
                                <Menu key={menu.category} info={menu}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Station
