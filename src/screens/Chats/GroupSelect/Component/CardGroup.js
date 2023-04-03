import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { PD, DEVICE } from "helper/Consts";
import { CheckBox } from "native-base";
import _ from "lodash";

import CardContact from "../../../Contacts/ListUser/CardContact";
import { Colors } from "helper";

const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.13;
const WIDTH = DEVICE.DEVICE_WIDTH;

const CardGroup = (props = { item }) => {
    let { item = {}, onPress = () => {}, idArray = [] } = props;
    useEffect(() => {}, []);

    const [checkbox, setCheckbox] = useState(false);

    const pressUser = () => {
        setCheckbox(!checkbox);
        onPress(item.about_user.id);
    };
    const index = _.findIndex(idArray, o => {
        return o == item.about_user.id;
    });

    return (
        <TouchableOpacity onPress={() => pressUser()} style={styles.container}>
            <View style={{ width: 20 }}>
                <CheckBox
                    onPress={() => pressUser()}
                    checked={index > -1 ? true : false}
                    color={Colors.MAIN_COLOR}
                    style={{ left: 0 }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <CardContact item={item} disabled={true} />
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    container: {
        flexDirection: "row",
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        backgroundColor: Colors.CONTENT_COLOR,
        flex: 1,
        alignItems: "center",
        paddingHorizontal: PD.PADDING_3
    }
};

export default CardGroup;
