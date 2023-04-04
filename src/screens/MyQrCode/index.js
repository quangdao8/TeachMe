import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import QRCode from "react-native-qrcode-rn0.6x";

import I18n from "helper/locales";
import { HeaderApp, AppText } from "components";
import styles from "./styles";
import { Colors } from "helper";
import { DEVICE, USER_TYPE } from "helper/Consts";

class MyQrCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            qrCode: ""
        };
    }

    componentDidMount() {
        const { userReducer } = this.props;
        const { qrCode } = userReducer;
        setTimeout(() => {
            this.setState({ qrCode });
        }, 500);
    }

    navigationBack() {
        const type = this.props.user.data.type;
        const { navigation } = this.props;
        if (type == USER_TYPE.STUDENT) {
            navigation.navigate("MainTabContainer");
        } else {
            navigation.navigate("MainTabContainerTeacher");
        }
    }

    render() {
        const { userReducer, navigation } = this.props;
        const { qrCode } = this.state;
        return (
            <View>
                <View style={styles.container}>
                    <QRCode
                        value={qrCode}
                        size={DEVICE.DEVICE_WIDTH * 0.7}
                        bgColor={Colors.BLACK_TEXT_COLOR}
                        fgColor={Colors.SKY_BLUE}
                    />
                </View>
                <View style={styles.background}>
                    <View style={styles.vertical} />
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={styles.horizontal} />
                        <View style={styles.horizontal} />
                    </View>
                    <View style={styles.vertical}>
                        <View style={styles.desWrap}>
                            <AppText text={I18n.t("qrcode.description")} style={styles.desText} />
                        </View>
                    </View>
                </View>
                <HeaderApp
                    title={I18n.t("qrcode.title")}
                    navigation={navigation}
                    leftOnPress={() => this.navigationBack()}
                    isBack
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer.data,
        user: state.userReducer
    };
}

MyQrCode = connect(mapStateToProps)(MyQrCode);
export default MyQrCode;
