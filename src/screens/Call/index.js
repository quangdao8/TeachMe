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
import {Const, Colors} from 'helper/index';
import {types, userActions} from 'actions/index';
import {chatHistoriesAction} from 'actions';
import {
  Container,
  Button,
  AppImage,
  Input,
  AppText,
  AppImageCircle,
} from 'components/index';
import styles from './styles';
import I18n from 'helper/locales';
import {Images} from 'assets';
import LinearGradient from 'react-native-linear-gradient';
import NoteScreen from './NoteScreen';
import EndCall from './EndCall';
import firebase from '@react-native-firebase/app';
import IncallManager from 'react-native-incall-manager';
import {ServiceHandle} from 'helper';
import {callAddRequest, voipPushCall} from 'actions/callActions';
import uuid from 'uuid';
import RNCallKeep from 'libraries/CallKeep';
import {USER_TYPE} from 'helper/Consts';
const moment = require('moment');
const IOS = Platform.OS === 'ios';
const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');

class Call extends React.Component {
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
    this.user = this.props.navigation.getParam('item') || {};
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

  checkFriendStatus = (content, type) => {
    // let isNoti;
    firebase
      .database()
      .ref('/status/')
      .orderByChild('id')
      .endAt(this.friendId)
      .limitToLast(1)
      .once('value', childSnapshot => {
        const lastItem = childSnapshot.toJSON();
        const value = Object.values(lastItem);
        const item = value[0];
        const {id = 0, status = true} = item;
        if (
          this.user.friendType === Const.USER_TYPE.STUDENT ||
          (id > 0 && status)
        ) {
          if (item.platform == 'ios' && type !== 'missCall') {
            return;
          }
          if (type === 'dialing') {
            return;
          }
          if (type === 'missCall') {
            return this.sendNoti(content);
          }
        }
      });
  };

  sendNoti(content) {
    chatHistoriesAction.sendNotiForOther(content);
  }

  voipCallRequest(action, body) {
    let {first_name, last_name} = this.props.userReducer.data.user;
    let name = first_name + ' ' + last_name;
    const {params = {}} = this.props.navigation.state;
    const {item = {}} = params;
    const {notificationId = ''} = item;
    firebase
      .database()
      .ref('/status/')
      .orderByChild('id')
      .endAt(this.friendId)
      .limitToLast(1)
      .once('value', childSnapshot => {
        const lastItem = childSnapshot.toJSON();
        const value = Object.values(lastItem);
        const item = value[0];
        const {id, voip, status, platform, language = 'vi'} = item;
        this.friendPlatForm = platform;
        if (status) {
          if (platform == 'ios') {
            body.voipToken = voip;
            if (this.user.isVideo) {
              body.hasVideo = 'has';
            } else {
              body.hasVideo = 'donthas';
            }
            voipPushCall(body)
              .then(res => {})
              .catch(error => {});
          } else if (action === 'dialing') {
            const body = {
              avatar: this.props.userReducer.data.avatar,
              caller: this.myId,
              callerName: first_name + ' ' + last_name,
              isCanReceive: false,
              isVideo: this.user.isVideo,
              status: 'dialing',
              to: this.friendId,
              language: language,
            };
            ServiceHandle.sendDataMessagingAndroid(voip, body);
          }
        }
      });
  }

  checkCall(isVideo) {
    const {userReducer} = this.props;
    const {data} = userReducer;
    const {user, avatar, amount = 0} = data;
    const {first_name, last_name} = user;
    const {notificationId} = this.user;
    this.calledDb.limitToLast(1).once('value', childSnapshot => {
      const child = childSnapshot.toJSON() || {};
      const item = Object.values(child)[0] || {};
      const {isCanReceive = true, caller = 0, status} = item || {};
      if (!!item && !isCanReceive) {
        if (caller !== this.myId) {
          this.busy();
          return;
        }
      } else {
        this.calledDb
          .push({
            caller: this.myId,
            to: this.friendId,
            status: 'dialing',
            isCanReceive: false,
            callerName: first_name + ' ' + last_name,
            avatar: avatar,
            isVideo: this.user.isVideo,
          })
          .then(async data => {
            //TODO: PUSH NOTI TO OTHER
            let message = {
              avatar: avatar,
              caller: this.myId,
              callerName: first_name + ' ' + last_name,
              isCanReceive: false,
              isVideo: this.user.isVideo,
              status: 'dialing',
              to: this.friendId,
            };
            this.voipCallRequest(Const.CALLING_ACTION.DIALING, message);

            let content = {
              notificationId: [notificationId],
              noti: {
                body: `${I18n.t('CallScreen.haveCall')} ${
                  this.user.isVideo
                    ? I18n.t('CallScreen.video')
                    : I18n.t('CallScreen.audio')
                } ${I18n.t('CallScreen.from')} ${first_name} ${last_name}`,
                title: I18n.t('CallScreen.notice'),
              },
              message,
            };
            this.checkFriendStatus(content, 'dialing');
            this.myDb
              .push({
                caller: this.myId,
                to: this.friendId,
                status: 'dialing',
                isCanReceive: false,
              })
              .catch(e => console.log(e));
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  }

  busy() {
    this.isBusy = true;
    IncallManager.setKeepScreenOn(false);
    IncallManager.setForceSpeakerphoneOn(false);
    IncallManager.stopRingback();
    IncallManager.stop({busytone: '_BUNDLE_'});
    clearTimeout(this.callTimeOut);
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 1000);
  }

  async componentDidMount() {
    // const { userReducer } = this.props;
    // const { data } = userReducer;
    // const { name, avatar, amount = 0 } = data;
    // const { notificationId, of_user, calledId } = this.user;
    // console.log('++++++++++++++++++++', userReducer);

    // firebase.database().ref(`/video-call/${calledId}`).push({
    //     caller: this.myId,
    //     to: of_user,
    //     status: "dialing",
    //     isCanReceive: false,
    //     callerName: name,
    //     avatar: avatar,
    //     isVideo: this.user.isVideo
    // }).then(() => console.log('Data updated.')).catch(e=> console.log('==================', e));

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    this.callTimeOut = setTimeout(() => {
      this.toggleModal();
    }, 60000);
    const {userReducer, tNsReducer} = this.props;
    const {data} = userReducer;
    const {amount = 0} = data;
    this.user = this.props.navigation.getParam('item') || {};

    const {
      calledId = 0,
      of_user = 0,
      isVideo = false,
      notificationId,
      friendType,
    } = this.user;
    this.friendId = await calledId;
    this.myId = await of_user;
    this.myDb = firebase.database().ref(`video-call/${of_user}`);
    this.calledDb = firebase.database().ref(`video-call/${calledId || 0}`);
    // let default_Fee = 0
    // let consultantFee = await ServiceHandle.get(`/consultant_fee/?user_id=${this.friendId}&active=1`);
    // if (
    //     !consultantFee.error &&
    //     consultantFee.response[0] &&
    //     consultantFee.response[0].consultant_fee > default_Fee
    // ) {
    //     default_Fee = consultantFee.response[0].consultant_fee;
    // }
    // if (amount < default_Fee / 2) {
    //     IncallManager.stop({ busytone: "_BUNDLE_" });
    //     Alert.alert(
    //         I18n.t("Alert.notice"),
    //         I18n.t("Alert.notEnoughMoney"),
    //         [{ text: "OK", onPress: () => this.props.navigation.goBack() }],
    //         { cancelable: false }
    //     );
    //     return;
    // } else {
    await IncallManager.checkRecordPermission();
    IncallManager.start({
      media: isVideo ? 'video' : 'audio',
      auto: true,
      ringback: '_BUNDLE_',
    });
    // if (!isVideo) {
    //     IncallManager.setForceSpeakerphoneOn(false);
    // } else {
    //     IncallManager.setForceSpeakerphoneOn(true);
    // }
    DeviceEventEmitter.addListener('WiredHeadset', data => {
      const {deviceName, hasMic, isPlugged = false} = data;
      if (!this.state.isSpeaker) {
        if (!isPlugged && isVideo) {
          IncallManager.setForceSpeakerphoneOn(true);
        } else if (isPlugged) {
          IncallManager.setForceSpeakerphoneOn(false);
        }
      }
    });
    IncallManager.setKeepScreenOn(true);

    firebase
      .database()
      .ref('/status/')
      .orderByChild('id')
      .endAt(this.friendId)
      .limitToLast(1)
      .once('value', childSnapshot => {
        const lastItem = childSnapshot.toJSON();
        const value = Object.values(lastItem);
        const item = value[0];
        const {id = 0, status = true} = item;
        if (this.user.friendType === Const.USER_TYPE.STUDENT) {
          return this.checkCall(isVideo);
        } else {
          if (id > 0 && status) {
            return this.checkCall(isVideo);
          } else {
            this.busy();
            if (!this.isAddCallLog) {
              const paramsAdd = {
                user_call_id: this.myId,
                user_receive_id: this.friendId,
                start_time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS'),
                end_time: moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
                duration: 0,
                note_called_user: this.note.trim(),
              };
              callAddRequest(paramsAdd, this.myId);
              this.isAddCallLog = true;
            }
            return;
          }
        }
        // return false;
      });

    this.myDb.limitToLast(1).on('child_added', childSnapshot => {
      const lastItem = childSnapshot.toJSON();
      const {isCanReceive, caller, status, to} = lastItem;
      if (status === 'connected' && caller === this.myId) {
        if (this.callTimeOut) {
          clearTimeout(this.callTimeOut);
        }
        IncallManager.stopRingback();
        // let a = {};
        this.calledDb
          .push({
            caller: this.myId,
            to: this.friendId,
            status: 'connected',
            isCanReceive: false,
            isVideo: this.user.isVideo,
            isCaller: true,
            media: {
              width: DEVICE_WIDTH,
              height: DEVICE_HEIGHT,
            },
            // from: a.from
          })
          .then(data => {
            const paramsAdd = {
              user_call_id: this.myId,
              user_receive_id: this.friendId,
              start_time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS'),
              // end_time: moment()
              //     .utc()
              //     .format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
              duration: 1,
              // note_called_user: this.note
            };
            if (!this.isAddCallLog) {
              this.isAddCallLog = true;
              ServiceHandle.post('call_log/', paramsAdd)
                .then(res => {
                  if (!res.error) {
                    firebase
                      .database()
                      .ref(`/call-log-id/${this.friendId}`)
                      .push({
                        call_log: res.response.id,
                      })
                      .then(data => {
                        this.isToVideoCall = true;
                        this.props.navigation.replace('VideoCall', {
                          roomId: this.friendId,
                          isFrom: true,
                          userId: this.myId,
                          callerId: this.myId,
                          isVideo: this.user.isVideo,
                          note: this.note,
                          isSpeaker: this.state.isSpeaker,
                          isMute: this.state.mute,
                          consultant_fee: this.user.consultant_fee,
                          callData: {
                            callerName: this.user.nickname,
                            avatar: this.user.avatar,
                          },
                          friendType: this.user.friendType,
                          callLogId: res.response.id,
                        });
                      });
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            }
          })
          .catch(e => {
            console.log(e);
          });
        return;
      }
      if (
        status === 'finished' &&
        caller === this.myId &&
        !this.isToVideoCall
      ) {
        if (this.callTimeOut) {
          clearTimeout(this.callTimeOut);
        }
        IncallManager.stopRingback();
        IncallManager.setKeepScreenOn(false);
        IncallManager.setForceSpeakerphoneOn(false);
        IncallManager.stop({busytone: '_BUNDLE_'});
        if (this.myDb) {
          this.myDb.remove();
          if (this.calledDb) {
            this.calledDb.remove();
          }
        }
        if (!this.isAddCallLog) {
          const paramsAdd = {
            user_call_id: this.myId,
            user_receive_id: this.friendId,
            start_time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS'),
            end_time: moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS'),
            duration: 0,
            note_called_user: this.note.trim(),
          };
          callAddRequest(paramsAdd, this.myId);
          this.isAddCallLog = true;
        }
        IncallManager.stop();
        if (Platform.OS === 'ios') {
          RNCallKeep.endAllCalls();
        }
        this.props.navigation.goBack();
        return;
      }
    });
    return;
    // }
  }

  toggleModal = () => {
    this.props.navigation.goBack();
    if (this.isBusy) {
        return;
    }
    if (!this.isBusy) {
        //TODO: END CALL
        const { userReducer } = this.props;
        const { data } = userReducer;
        const { user, avatar, amount = 0 } = data;
        const { first_name, last_name } = user;
        const { calledId = 0, of_user = 0, isVideo = false, notificationId } = this.user;
        if (this.callTimeOut) {
            clearTimeout(this.callTimeOut);
        }
        let message = {
            avatar: avatar,
            caller: this.myId,
            callerName: first_name + " " + last_name,
            isCanReceive: false,
            isVideo: this.user.isVideo,
            to: this.friendId,
            status: "finished"
        };
        // if (this.friendPlatForm === "ios") {
        //     this.voipCallRequest(Const.CALLING_ACTION.FINISHED, message);
        // }
        let content = {
            notificationId: [notificationId],
            noti: {
                body: `${I18n.t("CallScreen.haveMissedCall")} ${first_name} ${last_name}`,
                title: I18n.t("Alert.notice")
            },
            message
        };

        IncallManager.stop({ busytone: "_BUNDLE_" });
        IncallManager.setKeepScreenOn(false);
        IncallManager.setForceSpeakerphoneOn(false);
        IncallManager.stopRingback();
        if (amount > 0) {
            this.checkFriendStatus(content, "missCall");
        }
        this.calledDb
            .push({
                caller: this.myId,
                to: this.friendId,
                status: "finished",
                isCanReceive: true
            })
            .then(() => {
                setTimeout(() => {
                    this.calledDb && this.calledDb.remove();
                }, 1000);
            });
        this.myDb
            .push({
                caller: this.myId,
                to: this.friendId,
                status: "finished",
                isCanReceive: true
            })
            .then(() => {
                setTimeout(() => {
                    this.myDb && this.myDb.remove();
                }, 1000);
            });
    }
  };

  renderButton = (source, title, onPress) => {
    return (
      <View>
        <TouchableOpacity onPress={onPress} style={styles.btnNoteDisable}>
          <AppImage local source={source} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        <AppText
          text={title}
          style={{color: Colors.WHITE_COLOR, textAlign: 'center'}}
        />
      </View>
    );
  };

  changeSpeaker = () => {
    IncallManager.setSpeakerphoneOn(!this.state.isSpeaker);
    IncallManager.setForceSpeakerphoneOn(!this.state.isSpeaker);
    this.setState({isSpeaker: !this.state.isSpeaker});
  };

  mute = () => {
    this.setState({mute: !this.state.mute});
  };

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

        {call ? (
          <NoteScreen
            onEndCall={() => {
              this.toggleModal(), this.setState({call: false});
            }}
            onSave={value => {
              this.setState({note: value, call: false});
            }}
            onChangeNote={text => (this.note = text)}
            isMute={this.state.mute}
            isSpeaker={this.state.isSpeaker}
            onMute={this.mute}
            onSpeaker={this.changeSpeaker}
            onPress={() => {
              this.setState({call: false});
              this.note = this.state.note;
            }}
            inputRef={input => (this.inputNote = input)}
            source={{uri: user.avatar}}
            text={note}
          />
        ) : (
          <ImageBackground
            style={{width: '100%', height: '100%', alignItems: 'center'}}
            source={{uri: user.avatar}}>
            <LinearGradient
              colors={Colors.GRADIENTBLACK}
              style={styles.gradient}
            />
            <AppImage
              source={{uri: user.avatar}}
              style={styles.avatar}
              resizeMode="cover"
            />
            <AppText text={user.nickname} style={styles.txtCallName} />
            <AppText
              text={I18n.t('CallScreen.calling')}
              style={styles.txtCalling}
            />
            <View style={styles.viewBtn}>
              {this.renderButton(
                require('../../assets/icon/ic-note.png'),
                I18n.t('CallScreen.note'),
                () => {
                  this.setState({call: true}, () => {
                    this.inputNote.focus();
                  });
                },
              )}
              {this.renderButton(
                !this.state.isSpeaker
                  ? require('../../assets/icon/ic-externalSpeaker.png')
                  : require('../../assets/icon/ic-externalSpeaker-active.png'),
                I18n.t('CallScreen.externalSpeaker'),
                this.changeSpeaker,
              )}
              {this.renderButton(
                !this.state.mute
                  ? require('../../assets/icon/ic-mute.png')
                  : require('../../assets/icon/ic-mute-active.png'),
                I18n.t('CallScreen.mute'),
                this.mute,
              )}
            </View>
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
          </ImageBackground>
        )}
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
Call = connect(mapStateToProps)(Call);

export default Call;
