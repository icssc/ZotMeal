import React, {ReactElement, useEffect, useState} from "react";
import Item from "./Item";
import "./Menu.css"
import item from "./Item";


function Menu(props: any){

    const itemCategory = props.info.category
    const itemList = props.info.items

    let truncatedList: ReactElement[] = []
    let expandableSection: Object[] = []
    let expandButton = null
    let hiddenList: ReactElement[] = []

    const [expanded, setExpanded] = useState(false)

    useEffect(() => {})


    //If the list is larger than 4 make rows expandable
    if (itemList.length > 4){
        truncatedList = itemList.slice(0, 4)
        hiddenList = itemList.slice(4, )

        expandButton = <button onClick={() => setExpanded(!expanded)} className="expand">
            {expanded? 'Show Less ^' : 'Show More ˅'}
        </button>

        hiddenList.forEach((item: Object) => {
            expandableSection.push(item)
        })
    }
    //Otherwise make the rows normal
    else{
        truncatedList = itemList
    }

    //Display HTML
    return (
        <div className="menu">
            <div className="item-category">
                {itemCategory} ({itemList.length})
            </div>
            <div className="item-list">
                <div className="item-labels">
                    <p className="label">Dish</p>
                    <p className="label">Calories</p>
                </div>

                {truncatedList.map((item: Object) =>
                    <Item key={item.name} info={item}/>
                )}
                {expandableSection.map((item: Object) =>
                    <div className= {expanded? undefined : 'hidden'}>
                        <Item key={item.name} info={item}/>
                    </div>
                )}
                {expandButton}
            </div>
        </div>
    )
}

export default Menu;