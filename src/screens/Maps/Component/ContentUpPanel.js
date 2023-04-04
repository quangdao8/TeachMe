import React from "react";
import { View, FlatList, Platform, TouchableOpacity } from "react-native";
import { Colors } from "helper";
import { DEVICE, PD } from "helper/Consts";
import { CardTeacher, AppText } from "components";
import { FlatList as AndFlatList } from "react-native-gesture-handler";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import I18n from "helper/locales";
import { Icon } from "native-base";

const _ = require("lodash");
const hitSlop = {
    top: 16,
    bottom: 16,
    left: 16,
    right: 16
};
const ContentUpPanel = props => {
    let {
        data = [],
        selectId = -1,
        onPress = () => {},
        onListTeacher = () => {},
        refFlatlist = () => {},
        closeList = () => {},
        pressHand = () => {},
        onlineStatus = []
    } = props;
    renderEmptyList = () => {
        return (
            <View style={styles.containerEmpty}>
                <AppText text={I18n.t("map.emptyList")} style={styles.emptyText} />
            </View>
        );
    };
    renderTopFunction = () => {
        return (
            <View
                style={{
                    justifyContent: "space-between",
                    width: "100%",
                    flexDirection: "row",
                    paddingHorizontal: PD.PADDING_4
                }}
            >
                <TouchableOpacity disabled={true} style={{}}>
                    <Icon name="close" style={{ fontSize: 35, color: "transparent" }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.BtnpullBar} onPress={() => onListTeacher()}>
                    <View style={styles.pullBar} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={hitSlop} style={{}} onPress={() => closeList()}>
                    <Icon name="close" style={{ fontSize: 35, color: Colors.BLACK_TEXT_COLOR }} />
                </TouchableOpacity>
            </View>
        );
    };
    renderItem = item => {
        let online = true;
        let status = onlineStatus.find(el => {
            return el.id == item.item.id;
        });
        if (!_.isEmpty(status)) {
            online = status.status;
        }

        return (
            <CardTeacher
                data={item.item}
                selected={selectId == item.item.id}
                key={item.index}
                onPress={data => onPress(data)}
                pressHand={data => pressHand(data)}
                online={online}
            />
        );
    };
    return (
        <View style={styles.container}>
            {this.renderTopFunction()}

            {Platform.OS == "ios" ? (
                <FlatList
                    {...props}
                    ref={ref => refFlatlist(ref)}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={selectId}
                    renderItem={item => {
                        return this.renderItem(item);
                    }}
                    ListEmptyComponent={() => this.renderEmptyList()}
                />
            ) : (
                <AndFlatList
                    {...props}
                    ref={ref => refFlatlist(ref)}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={selectId}
                    renderItem={item => {
                        return this.renderItem(item);
                    }}
                    ListEmptyComponent={() => this.renderEmptyList()}
                />
            )}
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: Colors.WHITE_COLOR,
        flex: 1
    },
    pullBar: {
        backgroundColor: "#e7e7e7",
        height: 5,
        width: DEVICE.DEVICE_WIDTH / 7,
        alignSelf: "center",
        borderRadius: 5
    },
    BtnpullBar: {
        backgroundColor: Colors.WHITE_COLOR,
        height: 20,
        // width: "100%",
        // alignItems: "center"
        justifyContent: "center"
    },
    emptyText: {
        fontSize: responsiveFontSize(2.5),
        color: Colors.MAIN_COLOR,
        textAlign: "center"
    },
    containerEmpty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: PD.PADDING_4
    }
};

export default ContentUpPanel;
