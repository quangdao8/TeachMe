import React from "react";
import { View, StatusBar } from "react-native";
import { Button, AppText, Container, AppImageCircle, Input } from "components";
import { Colors, GlobalStyles, Const, Helper } from "helper";
import I18n from "helper/locales";
import styles from "./styles";
import { ICON, Images } from "assets";
import HeaderApp from "components/Header";
import { DIMENSION } from "helper/Consts";
import { connect } from "react-redux";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class ConfirmationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            avatarSource: props.checkPhoneReducer.data.response.avatar
        };
    }

    render() {
        const { navigation } = this.props;
        const { phoneNumber, avatarSource } = this.state;
        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }}>
                <StatusBar backgroundColor={Colors.STATUSBAR} barStyle="light-content" translucent={true} />
                <HeaderApp title={I18n.t("ConfirmationSuccess.success")} isBack navigation={navigation} />
                <AppImageCircle
                    local
                    checked
                    resizeMode="cover"
                    image
                    source={avatarSource ? avatarSource : ICON.USER}
                    outterCStyle={{ marginTop: 0.1 * height }}
                    styleImage={{ height: DIMENSION.H3, width: DIMENSION.H3, borderRadius: DIMENSION.H3 / 2 }}
                    checkedContainer={{ height: DIMENSION.H3, width: DIMENSION.H3, borderRadius: DIMENSION.H3 / 2 }}
                />

                <AppText
                    text={I18n.t("ConfirmationSuccess.congratulation")}
                    style={{ fontSize: 18, marginTop: 0.02 * height, fontWeight: "bold" }}
                />
                <AppText
                    text={I18n.t("ConfirmationSuccess.accountSuccess")}
                    style={{ fontSize: 18, marginHorizontal: 40, textAlign: "center", marginTop: 0.01 * height }}
                />
                <View style={styles.inputsWrap}>
                    <Button
                        tStyle={{ fontSize: 18 }}
                        onPress={() => navigation.navigate("NewPassword")}
                        style={{ width: "50%", marginTop: 0.05 * height }}
                        isShadow
                        title={I18n.t("AccountVerifyScreen.continue")}
                    />
                </View>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        checkPhoneReducer: state.checkPhoneReducer
    };
}
ConfirmationCode = connect(mapStateToProps)(ConfirmationCode);
export default ConfirmationCode;
