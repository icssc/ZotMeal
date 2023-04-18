import React, {useEffect, useState} from "react";
import {View, Text, Pressable, StyleSheet} from "react-native";
import "./Station.css"
import Menu from "./Menu";
import './StationDetails.css'

function Station(props: any){

    const stationName = props.info.station
    const menuItems = props.info.menu

    const [detailsOpen, setDetailsOpen] = useState(false)

    useEffect(() => {})

    return (
        <View style={styles.station}>
            <View style={styles.stationHeader}>
                <Text style={styles.stationName}>{stationName}</Text>
                <Pressable style={styles.detailsButton} onPress={() => setDetailsOpen(true)}>
                    <Text style={styles.detailsText}>More Details</Text>
                </Pressable>
            </View>
            <View style={styles.menuList}>
                {menuItems.map((menu: Object) =>
                    <Menu key={menu.category} info={menu}/>
                )}
            </View>

            {/*
            <View className={detailsOpen? undefined : 'hidden'}>
                <View className='modal'>
                    <View className='modal-content'>
                        <span onClick={() => setDetailsOpen(false)} className='close'>
                            X
                        </span>
                        <View className='menu-list-modal'>
                            {menuItems.map((menu: Object) =>
                                <Menu key={menu.category} info={menu}/>
                            )}
                        </View>
                    </View>
                </View>
            </View>
            */}
        </View>
    )
}

const styles = StyleSheet.create({
    station: {
        paddingTop: "5%",
    },

    stationHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: "1%",
        marginRight: "2%",
    },

    stationName: {
        fontSize: 20,
    },

    menuList: {
        paddingTop: "3%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },

    detailsButton: {
        backgroundColor: "gold",
        paddingTop: "1%",
        paddingRight: "2%",
        paddingBottom: "1%",
        paddingLeft: "2%",
        borderRadius: 5,
    },

    detailsText: {
        color: "black",
    }
})

export default Station
