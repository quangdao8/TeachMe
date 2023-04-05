import React from 'react';
import {
  View,
  Alert,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  BackHandler,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';

import {
  Container,
  Button,
  AppImage,
  Input,
  AppText,
  AppImageCircle,
} from 'components/index';
// import styles from "./styles";



class ReceiveCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      call: false,
      active: false,
      isSpeaker: false,
      mute: false,
    };
    this.isBusy = false;
    this.isToVideoCall = false;
    this.isAddCallLog = false;
    this.isHeadPhone = false;
    this.friendPlatForm = 'ios';
    this.note = '';
  }

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    // this.backHandler.remove();
    // this.friendId = null;
    // this.myId = null;
    // this.myDb = null;
    // if (this.callTimeOut) {
    //     clearTimeout(this.callTimeOut);
    // }
  }

  render() {
    const {navigation} = this.props;
    const {call, active, avatar, name, note} = this.state;
    const user = this.user;
    return (
      <Container scrollEnabled={false}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
        <Button
          style={{
            width: '40%',
            backgroundColor: '#FF4B56',
            marginTop: 30,
          }}
          centerContent={
            <AppImage
              local
              source={require('../../assets/icon/ic-horizontalCall.png')}
              style={{width: 25, height: 10}}
            />
          }
          onPress={() => this.toggleModal()}
        />
        {/* {call ? (
                    <NoteScreen
                        onEndCall={() => {
                            this.toggleModal(), this.setState({ call: false });
                        }}
                        onSave={value => {
                            this.setState({ note: value, call: false });
                        }}
                        onChangeNote={text => (this.note = text)}
                        isMute={this.state.mute}
                        isSpeaker={this.state.isSpeaker}
                        onMute={this.mute}
                        onSpeaker={this.changeSpeaker}
                        onPress={() => {
                            this.setState({ call: false });
                            this.note = this.state.note;
                        }}
                        inputRef={input => (this.inputNote = input)}
                        source={{ uri: user.avatar }}
                        text={note}
                    />
                ) : (
                    <ImageBackground
                        style={{ width: "100%", height: "100%", alignItems: "center" }}
                        source={{ uri: user.avatar }}
                    >
                        <LinearGradient colors={Colors.GRADIENTBLACK} style={styles.gradient} />
                        <AppImage source={{ uri: user.avatar }} style={styles.avatar} resizeMode="cover" />
                        <AppText text={user.nickname} style={styles.txtCallName} />
                        <AppText text={I18n.t("CallScreen.calling")} style={styles.txtCalling} />
                        <View style={styles.viewBtn}>
                            {this.renderButton(
                                require("../../assets/icon/ic-note.png"),
                                I18n.t("CallScreen.note"),
                                () => {
                                    this.setState({ call: true }, () => {
                                        this.inputNote.focus();
                                    });
                                }
                            )}
                            {this.renderButton(
                                !this.state.isSpeaker
                                    ? require("../../assets/icon/ic-externalSpeaker.png")
                                    : require("../../assets/icon/ic-externalSpeaker-active.png"),
                                I18n.t("CallScreen.externalSpeaker"),
                                this.changeSpeaker
                            )}
                            {this.renderButton(
                                !this.state.mute
                                    ? require("../../assets/icon/ic-mute.png")
                                    : require("../../assets/icon/ic-mute-active.png"),
                                I18n.t("CallScreen.mute"),
                                this.mute
                            )}
                        </View>
                        <Button
                            style={{
                                width: "40%",
                                backgroundColor: "#FF4B56",
                                marginTop: 30
                            }}
                            centerContent={
                                <AppImage
                                    local
                                    source={require("../../assets/icon/ic-horizontalCall.png")}
                                    style={{ width: 25, height: 10 }}
                                />
                            }
                            onPress={() => this.toggleModal()}
                        />
                    </ImageBackground>
                )} */}
        <Button
          style={{
            width: '40%',
            backgroundColor: '#FF4B56',
            marginTop: 30,
          }}
          centerContent={
            <AppImage
              local
              source={require('../../assets/icon/ic-horizontalCall.png')}
              style={{width: 25, height: 10}}
            />
          }
          onPress={() => this.toggleModal()}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
    tNsReducer: state.tNsReducer,
  };
}
ReceiveCall = connect(mapStateToProps)(ReceiveCall);

export default ReceiveCall;
