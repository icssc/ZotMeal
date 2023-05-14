// List all the items at a station in a row
// Looks like
// Station Name
// Menu 1    Menu 2    Menu 3   ...

import React, {useEffect, useState} from "react";
import {View, Text, Pressable, StyleSheet} from "react-native";
import Menu from "./Menu";
import {StationInfo, MenuInfo} from "../typedef";
import ColorPalette from "../ColorPalette";

function Station(props: {info: StationInfo}){

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
                {menuItems.map((menu: MenuInfo) =>
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
        color: ColorPalette.textColor,
        fontWeight: "bold"
    },

    menuList: {
        paddingTop: "3%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },

    detailsButton: {
        backgroundColor: ColorPalette.bgColorYellow,
        paddingTop: "1%",
        paddingRight: "2%",
        paddingBottom: "1%",
        paddingLeft: "2%",
        borderRadius: 5,
    },

    detailsText: {
        color: ColorPalette.textColor,
        fontWeight: "500",
    }
})

export default Station
