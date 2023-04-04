import React from "react";
import { View, Alert, ImageBackground, TouchableOpacity, StatusBar, Dimensions, TextInput } from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper/index";
import { types, userActions } from "actions/index";
import { Container, Button, AppImage, Input, AppText, AppImageCircle } from "components/index";
import styles from "./styles";
import I18n from "helper/locales";
import { Images } from "assets";
import LinearGradient from "react-native-linear-gradient";
import { DIMENSION } from "helper/Consts";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const H1 = DIMENSION.H1;
const H2 = DIMENSION.H2;
const H3 = DIMENSION.H3;

class NoteScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps) {}

    render() {
        const {
            navigation,
            clear,
            onPress,
            onEndCall,
            source,
            onSave,
            onSpeaker,
            onMute,
            isMute,
            isSpeaker,
            onChangeNote
        } = this.props;

        return (
            <Container scrollEnabled={false}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
                <ImageBackground style={{ width: "100%", height: "100%", alignItems: "center" }} source={source}>
                    <LinearGradient colors={Colors.GRADIENTBLACK} style={styles.gradient} />
                    <View
                        style={{
                            flexDirection: "row",
                            width: "90%",
                            marginTop: 30,
                            justifyContent: "space-between"
                        }}
                    >
                        <AppImageCircle
                            image
                            outterCStyle={{ width: 100, height: 100 }}
                            middleCStyle={{ width: 90, height: 90 }}
                            innerCStyle={{ width: 80, height: 80 }}
                            styleImage={{ width: 80, height: 80 }}
                            square
                            resizeMode="cover"
                            source={source}
                        />
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Button
                                onPress={() => {}}
                                title={I18n.t("CallScreen.note")}
                                tStyle={{ fontSize: 14, fontWeight: "normal" }}
                                leftIcon={require("../../assets/icon/ic-note-active.png")}
                                lIconStyle={{ width: 15, height: 15 }}
                                style={{ width: "90%", height: 30 }}
                            />
                            <Button
                                onPress={onMute}
                                title={I18n.t("CallScreen.mute")}
                                transparent={!isMute}
                                tStyle={{ fontSize: 14, fontWeight: "normal" }}
                                leftIcon={require("../../assets/icon/ic-mute-active.png")}
                                lIconStyle={{ width: 15, height: 15 }}
                                style={{ width: "90%", height: 30, marginTop: 5 }}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Button
                                onPress={onSpeaker}
                                title={I18n.t("CallScreen.externalSpeaker")}
                                transparent={!isSpeaker}
                                tStyle={{ fontSize: 14, fontWeight: "normal" }}
                                leftIcon={require("../../assets/icon/ic-externalSpeaker-active.png")}
                                lIconStyle={{ width: 15, height: 15 }}
                                style={{ width: "90%", height: 30 }}
                            />
                            <Button
                                onPress={onEndCall}
                                style={{
                                    width: "90%",
                                    height: 30,
                                    backgroundColor: "#FF4B56",
                                    marginTop: 5
                                }}
                                centerContent={
                                    <AppImage
                                        source={require("../../assets/icon/ic-horizontalCall.png")}
                                        style={{ width: 17, height: 7 }}
                                    />
                                }
                            />
                        </View>
                    </View>

                    <TextInput
                        placeholder={I18n.t("CallScreen.inputNote")}
                        ref={input => this.props.inputRef(input)}
                        style={styles.inputNote}
                        onChangeText={text => {
                            this.setState({ text }), onChangeNote(text);
                        }}
                        value={this.state.text}
                        multiline={true}
                        textAlignVertical="top"
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            width: "90%",
                            justifyContent: "space-between",
                            marginTop: 20
                        }}
                    >
                        <Button
                            onPress={() => onSave(this.state.text)}
                            title={I18n.t("CallScreen.save")}
                            tStyle={{ fontSize: 16 }}
                            leftIcon={require("../../assets/icon/ic-save.png")}
                            lIconStyle={{ width: 20, height: 20 }}
                            style={{ width: "46%", height: 45 }}
                        />
                        <Button
                            onPress={onPress}
                            title={I18n.t("CallScreen.cancel")}
                            transparent
                            tStyle={{ fontSize: 16 }}
                            leftIcon={require("../../assets/icon/ic-clear.png")}
                            lIconStyle={{ width: 20, height: 20 }}
                            style={{ width: "46%", height: 45 }}
                        />
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
NoteScreen = connect(mapStateToProps)(NoteScreen);

export default NoteScreen;
