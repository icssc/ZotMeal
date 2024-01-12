// List all the items at a station in a row
// Looks like
// Station Name
// Menu 1    Menu 2    Menu 3   ...

import React, { useEffect, useState } from "react";
import {
    View, Text, Pressable, StyleSheet, Modal,
    ScrollView, TouchableWithoutFeedback, Image
} from "react-native";
import Menu from "./Menu";
import { StationInfo, MenuInfo, ItemInfo } from "../../../lib/zotmeal";
import ColorPalette from "../ColorPalette";
import { ItemDetails } from "./Item";

// Takes in one parameter "info" that is all the information
// about a given Station
// Displays the Station name each Menu in a Station in a row
function Station(props: { info: StationInfo }) {

    const stationName = props.info.station
    const menuItems = props.info.menu

    const [detailsOpen, setDetailsOpen] = useState(false)

    useEffect(() => { })

    return (
        <View style={styles.station}>
            {/* Displays Menus */}
            <View style={styles.stationHeader}>
                <Text style={styles.stationName}>{stationName}</Text>

                <View style={{ flexDirection: "row", gap: "30px" }}>
                    <VoteButtons />
                    <Pressable style={styles.detailsButton} onPress={() => setDetailsOpen(true)}>
                        <Text style={styles.detailsText}>More Details</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.menuList}>
                {menuItems.map((menu: MenuInfo) =>
                    <Menu key={menu.category} info={menu} />
                )}
            </View>

            {/* Details button and Modal */}
            <Modal visible={detailsOpen} transparent={true} animationType={"fade"}>
                <Pressable style={modalStyles.backgroundFilter} onPress={() => setDetailsOpen(false)}>
                    <View style={modalStyles.modalView}>

                        {/* Inside the modal */}
                        <View style={modalStyles.modalHeader}>
                            <Pressable onPress={() => setDetailsOpen(false)} style={{ width: "5%" }}>
                                <Text style={modalStyles.exitButton}>X</Text>
                            </Pressable>
                            <Text style={modalStyles.stationTitle}>{props.info.station}</Text>
                            <View style={{ width: "10%" }}></View>
                        </View>
                        <TouchableWithoutFeedback>
                            <ScrollView>
                                <StationDetails info={props.info} />
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </Pressable>
            </Modal>

        </View>
    )
}

// Displays all the nutrition information about all the Items in a
// given Station in a modal
function StationDetails(props: { info: StationInfo }) {
    const menus = props.info.menu
    return (
        <View style={{ alignItems: "center" }}>
            {menus.map((menu: MenuInfo) => {
                const itemList = menu.items
                return (
                    <View style={detailsStyles.menu}>
                        <Text style={detailsStyles.itemCategory}>
                            {menu.category} ({itemList.length})
                        </Text>
                        {itemList.map((item: ItemInfo, index: number) => {
                            return (
                                <View>
                                    <View style={detailsStyles.itemList}>
                                        <ItemDetails itemInfo={item} nutritionOpen={false} />
                                    </View>
                                    {index < itemList.length - 1 && itemList.length > 1 ?
                                        <View style={detailsStyles.itemRowDivider}></View> : null}
                                </View>
                            )
                        })}
                    </View>
                )
            })}
        </View>
    )
}

function VoteButtons(props: any) {
    const [currVote, setCurrVote] = useState(0)

    function Upvote() {
        setCurrVote(currVote == 1 ? 0 : 1)
    }

    function Downvote() {
        setCurrVote(currVote == -1 ? 0 : -1)
    }

    let upVotedArrow = currVote > 0 ? "filled" : "gray"
    let downVotedArrow = currVote < 0 ? "filled" : "gray"

    return (
        <View style={{ flexDirection: "row", gap: "15px", alignItems: "center" }}>
            <Pressable style={voteStyles.voteButton} onPress={Upvote}>
                <Image source={"imageAssets/Icons/arrow_up_" + upVotedArrow + ".png"}
                    style={voteStyles.voteArrow} />
            </Pressable>

            <View style={{ minWidth: "15px", alignItems: "center" }}>
                <Text style={voteStyles.voteCount}>{currVote}</Text>
            </View>

            <Pressable style={voteStyles.voteButton} onPress={Downvote}>
                <Image source={"imageAssets/Icons/arrow_down_" + downVotedArrow + ".png"}
                    style={voteStyles.voteArrow} />
            </Pressable>
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
        paddingTop: "1%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },

    detailsButton: {
        backgroundColor: ColorPalette.bgColorYellow,
        paddingTop: "1%",
        paddingRight: "5%",
        paddingBottom: "1%",
        paddingLeft: "5%",
        borderRadius: 5,
        justifyContent: "center"
    },

    detailsText: {
        color: ColorPalette.textColor,
        fontWeight: "500",
    },
})

const modalStyles = StyleSheet.create({
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    modalView: {
        margin: 20,
        backgroundColor: ColorPalette.bgColor,
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: "90%",
        minWidth: "50%",
    },

    backgroundFilter: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: "center",
    },

    exitButton: {
        color: ColorPalette.textColor,
        fontWeight: "bold",
    },

    centerView: {
        alignItems: 'center',
    },

    stationTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
})

const detailsStyles = StyleSheet.create({
    menu: {
        margin: "2%",
        borderWidth: 2,
        borderColor: ColorPalette.rowDivider,
        borderStyle: "solid",
        borderRadius: 10,
        backgroundColor: ColorPalette.bgColor,
        width: "95%",
    },

    itemCategory: {
        display: "flex",
        paddingTop: "1%",
        paddingRight: "1%",
        paddingBottom: "1%",
        paddingLeft: "3%",
        justifyContent: "flex-start",
        backgroundColor: ColorPalette.bgColorBlue,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        color: ColorPalette.textColor,
        fontWeight: "bold",
        fontSize: 16,
    },

    itemList: {
        padding: "3%",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },

    itemRowDivider: {
        height: 3,
        backgroundColor: ColorPalette.rowDivider,
    },
})

const voteStyles = StyleSheet.create({
    voteButton: {
        width: "25px",
        height: "25px",
    },

    voteArrow: {
        width: "100%",
        height: "100%",
    },

    voteArrowPressed: {
        width: "100%",
        height: "100%",
        backgroundColor: ColorPalette.bgColorYellow
    },

    voteCount: {
        color: ColorPalette.textColor,
        fontWeight: "bold",
        fontSize: "16",
    }
})

export default Station
