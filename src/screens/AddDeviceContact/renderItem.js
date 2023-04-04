import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { AppText, Button, AppImage } from "components";
import styles from "./styles";
import _ from "lodash";
import { Colors } from "helper";
import { PD } from "helper/Consts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import I18n from "helper/locales";
import { ICON } from "assets";

class RenderItem extends React.PureComponent {
    // shouldComponentUpdate() {
    //     return false;
    // }

    onPressNumber(number) {
        this.props.onPressNumber(number);
    }

    render() {
        const { allContactAppReducer, item, key } = this.props;
        const phoneNumbers = item.phoneNumbers;
        return (
            <View style={styles.itemContainer}>
                <View>
                    <AppText text={item.fullName} style={styles.txtName} />
                </View>
                {!_.isEmpty(phoneNumbers) &&
                    phoneNumbers.map((item, index) => {
                        let phoneDevice = "";
                        if (item.number.includes("+84")) {
                            phoneDevice = item.number.replace("+84", "0");
                        } else {
                            phoneDevice = item.number.replace(/[-_()\s\\]/g, "");
                        }

                        return (
                            <View
                                key={`${index}`}
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            >
                                <View key={index} style={{ paddingHorizontal: PD.PADDING_2 }}>
                                    <AppText text={item.label} style={styles.txtLabel} />
                                    <TouchableOpacity onPress={() => this.onPressNumber(item.number)}>
                                        <AppText text={item.number} style={styles.txtNumber} />
                                    </TouchableOpacity>
                                </View>
                                {_.includes(allContactAppReducer.data.response, phoneDevice) && (
                                    <AppImage local source={ICON.YOLEARN} style={{ width: 30, height: 30 }} />
                                )}
                                <Button
                                    tStyle={{ fontSize: responsiveFontSize(1.7), color: Colors.WHITE_COLOR }}
                                    onPress={() => this.onPressNumber(item.number)}
                                    style={{ height: 40, backgroundColor: Colors.MAIN_COLOR }}
                                    title={I18n.t("FindContact.choice")}
                                />
                            </View>
                        );
                    })}
            </View>
        );
    }
}

export default RenderItem;
