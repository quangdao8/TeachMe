/* eslint-disable no-class-assign */
import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';
import {
  View,
  Modal,
  AsyncStorage,
  Vibration,
  Platform,
  DeviceEventEmitter,
  NativeModules,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Navigator from './navigation';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Icon, Root} from 'native-base';
import {Colors} from './helper/index';
import {AppText, Button, LocalNotification} from './components';
import {Const} from './helper/index';
import {alertActions, userActions} from './actions';
// import firebase from "react-native-firebase";
import fbDatabase from '@react-native-firebase/database';
import I18n from './helper/locales';
import {onNavigate} from './actions/navigateAction';
import {GROUP_TYPE, ALERT_TYPE, DEVICE, PD} from './helper/Consts';
import VoipPushNotification from 'react-native-voip-push-notification';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
// import VoipCallios from "./VoipCallios";
// import VoipReceiver from "./VoipReceiver";
import {hasCallAction, getUserData} from './actions/userActions';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
// import {getUserData} from
const _ = require('lodash');
const forceInset = {bottom: 'always', top: 'never'};
const Sound = require('react-native-sound');
if (Platform.OS == 'ios') {
  Sound.setCategory('Ambient');
}

// const notificationsA = firebase.notifications();
const url = 'https://yolearn.vn/chon-goi';
class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: props.languageReducer.language,
      vibration: props.settingReducer.data.vibration,
      sound: props.settingReducer.data.sound,
      messageNoti: props.settingReducer.data.messageNoti,
      groupNoti: props.settingReducer.data.groupNoti,
      title: '',
      content: '',
      type: ALERT_TYPE.SUCCESS,
      showAlert: false,
      dataCall: {},
      openVideoCall: false,
    };

    this.sound = new Sound('messenger.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        return;
      }
    });
    I18n.locale = this.props.languageReducer.language;
  }

  finishActivity() {
    NativeModules.ReactNativeStarterModule.finishActivity();
    // setTimeout(() => {
    // NativeModules.ReactNativeStarterModule.exitApp()
    // }, 100)
  }

  phoneStatePermission() {
    check(PERMISSIONS.ANDROID.READ_PHONE_STATE).then(result => {
      if (result === RESULTS.DENIED) {
        request(PERMISSIONS.ANDROID.READ_PHONE_STATE).then(() => {
          if (Platform.OS === 'android') {
            setTimeout(() => {
              Alert.alert(
                I18n.t('Alert.permission'),
                I18n.t('Alert.otherPermission'),
                [{text: 'OK', onPress: () => Linking.openSettings()}],
                {cancelable: false},
              );
            }, 1000);
          }
        });
      }
    });
  }

  async componentDidMount(prevProps) {
    // firebase.notifications().removeDeliveredNotification('notificationId');
    if (Platform.OS == 'ios') {
      await VoipPushNotification.requestPermissions(); // required
      this.getVoipToken();
      // VoipPushNotification.addEventListener("notification", notification => {
      //     const data = notification.getData();
      //     const { avatar, caller, callerName, isCanReceive, isVideo, status, to, voipToken } = data;
      //     return RNCallKeep.displayIncomingCall(
      //         "uuid-oasodi-90q29=kasijd",
      //         callerName,
      //         callerName,
      //         "number",
      //         isVideo
      //     );
      // });
    } else {
      this.phoneStatePermission();
      NativeModules.ReactNativeStarterModule.registerModuleStarted(
        'start react',
      );
      const {userReducer = {}} = this.props;
      const {data = {}} = userReducer;
      const {id = 0} = data;
      // let id = _.isEmpty(data) ? 0 : data.id;
      if (id > 0) {
        fbDatabase
          .database()
          .ref(`video-call/${id}`)
          .once('value', snapshot => {
            if (!snapshot.exists()) {
              this.finishActivity();
            }
          });

        fbDatabase
          .database()
          .ref(`video-call/${id}`)
          .limitToLast(1)
          .on('child_added', childSnapshot => {
            let lastItem = childSnapshot.toJSON();
            const {status} = lastItem;
            if (status === 'finished') {
              this.finishActivity();
              fbDatabase.database().ref(`video-call/${id}`).remove();
            }
          });
      }

      DeviceEventEmitter.addListener('decline_incoming_call', e => {
        const callData = e;
        const {caller, to} = callData;
        fbDatabase
          .database()
          .ref(`video-call/${JSON.parse(caller)}`)
          .push({
            caller: JSON.parse(caller),
            to: JSON.parse(to),
            status: 'finished',
            isCanReceive: true,
          })
          .then(res => {
            this.finishActivity();
          });
        setTimeout(() => {
          fbDatabase
            .database()
            .ref(`video-call/${JSON.parse(caller)}`)
            .remove();
        }, 500);
      });

      DeviceEventEmitter.addListener('accept_incoming_call', e => {
        const callData = e;
        const {caller, isCanReceive, isVideo, to, callerName, avatar} =
          callData;

        setTimeout(() => {
          this.props.dispatch(
            hasCallAction({
              avatar: avatar,
              caller: JSON.parse(caller),
              callerName: callerName,
              isCanReceive: JSON.parse(isCanReceive),
              isVideo: JSON.parse(isVideo),
              status: 'connected',
              to: JSON.parse(to),
            }),
          );
        }, 10);
      });
    }

    //listen from call decline

    // Create chanel for android
    // const channel = new firebase.notifications.Android.Channel(
    //   'general',
    //   'General',
    //   firebase.notifications.Android.Importance.Max,
    // ).setDescription('General');
    // firebase.notifications().android.createChannel(channel);
    // await this.requestNotificationPermission();
    // await this.getDeviceToken();
    // this.initialNotification();
    // this.initNotificationDisplayedListener();
    // this.initNotificationReceiveListener(channel);
    // this.initNotificationOpenedListener();
    //TODO: VOIP PUSH
    // AsyncStorage.removeItem(Const.LOCAL_STORAGE.VOIP_TOKEN);
  }

  componentDidUpdate(prev) {
    const {settingReducer, languageReducer, alertReducer} = this.props;
    if (prev.settingReducer !== settingReducer) {
      this.setState({
        vibration: settingReducer.data.vibration,
        sound: settingReducer.data.sound,
        messageNoti: settingReducer.data.messageNoti,
        groupNoti: settingReducer.data.groupNoti,
      });
    }
    if (prev.languageReducer !== languageReducer) {
      I18n.locale = languageReducer.language;
      this.setState({lang: languageReducer.language});
    }
    if (prev.alertReducer !== alertReducer) {
      const {title, content, type, showAlert} = alertReducer;
      if (prev.alertReducer.showAlert !== alertReducer.showAlert) {
        this.setState({title, content, type, showAlert});
      }
    }
  }

  playSound() {
    this.sound.stop(() => {
      this.sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }

  requestNotificationPermission = () => {
    // firebase
    //   .messaging()
    //   .requestPermission()
    //   .then(() => {
    //     // User has authorised
    //     console.log('Notification authorized');
    //   })
    //   .catch(error => {
    //     // User has rejected permissions
    //     console.log(error);
    //   });
  };

  async updateNotificationId(deviceToken) {
    try {
      await AsyncStorage.setItem(Const.LOCAL_STORAGE.DEVICE_TOKEN, deviceToken);
    } catch (error) {
      console.log(error);
    }
    const {userReducer} = this.props;
    if (!_.isEmpty(userReducer.data)) {
      const result = await userActions.updateNotificationId({
        id: userReducer.data.id,
        deviceToken,
      });
    }
  }

  getDeviceToken = () => {
    // firebase
    //   .messaging()
    //   .getToken()
    //   .then(fcmToken => {
    //     if (fcmToken) {
    //       // GET DEVICE TOKEN AND SEND TO SERVER
    //       this.updateNotificationId(fcmToken);
    //     } else {
    //       // user doesn't have a device token yet
    //     }
    //   });
  };

  getVoipToken() {
    VoipPushNotification.addEventListener('register', token => {
      AsyncStorage.setItem(Const.LOCAL_STORAGE.VOIP_TOKEN, token)
        .then(() => {})
        .catch(error => console.log('error====>', error));
      //     // send token to your apn provider server
    });
  }

  initialNotification = async () => {
    // const notificationOpen = await firebase
    //   .notifications()
    //   .getInitialNotification();
    // if (_.isEmpty(notificationOpen)) return;
    // const {action, notification} = notificationOpen;
    // setTimeout(() => {
    //   if (action) {
    //     // alert("open");
    //     if (notification._data.type == 'Chat') {
    //       // PRESS NOTIFICATION TO CHAT

    //       this.dispatchNavigate('Chat', notification._data.chatRoomId);
    //       return;
    //     }
    //     if (!_.isEmpty(notification._data.caller)) {
    //       // PRESS NOTIFICATION TO CHAT
    //       this.dispatchNavigate('Call', parseInt(notification._data.caller));
    //       return;
    //     }
    //     // if (notification._data.type == "Chat")
    //   }
    // }, 2000);
  };

  componentWillMount() {}

  initNotificationDisplayedListener() {
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
  }

  initNotificationReceiveListener(channel) {
    const _this = this;
    const {userReducer} = this.props;
    // this.notificationListener = firebase
    //   .notifications()
    //   .onNotification(async notification => {
    //     // const badgeCount = await notificationsA.getBadge();

    //     // notification.android.setChannelId("general");
    //     // notificationsA.setBadge(badgeCount + 1);
    //     // // notificationsA.displayNotification(notification);

    //     const {vibration, sound, messageNoti, groupNoti} = _this.state;
    //     const {currentRoom} = this.props;
    //     const {_data} = notification;
    //     if (!_data.caller) {
    //       if (_data.type == 'topup') {
    //         this.topupProcess(_data);
    //       } else {
    //         if (_.isEmpty(currentRoom) || currentRoom.id != _data.chatRoomId) {
    //           if (
    //             (!messageNoti && _data.group_type == GROUP_TYPE.PRIVATE) ||
    //             (!groupNoti && _data.group_type == GROUP_TYPE.GROUP)
    //           )
    //             return;

    //           sound && this.playSound();

    //           vibration && Vibration.vibrate([500, 200, 50, 400]);
    //           this.notiRef.openNoti(JSON.parse(_data.title), _data.body, () => {
    //             this.dispatchNavigate('Chat', _data.chatRoomId);
    //             // alert("Hello");
    //           });
    //         }
    //       }
    //     }
    //   });
  }

  topupProcess(_data) {
    const {userReducer, dispatch} = this.props;
    setTimeout(() => {
      dispatch(alertActions.closeAlert());
    }, 500);
    setTimeout(async () => {
      let paramsAlert = {};
      switch (_data.rspcode) {
        case '00':
          paramsAlert = {
            content: I18n.t('Alert.topupSuccess'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.SUCCESS,
          };
          let params = {id: userReducer.data.id};
          let newUserData = await getUserData(params);
          if (!newUserData.error) {
            this.props.dispatch(
              userActions.loginSuccess({
                ...userReducer.data,
                ...newUserData.response,
              }),
            );
          } else {
            // error get userdata
          }
          break;
        case '01':
          paramsAlert = {
            content: I18n.t('Alert.topup01'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.ERROR,
          };
          break;
        case '02':
          paramsAlert = {
            content: I18n.t('Alert.topup02'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.ERROR,
          };
          break;
        case '04':
          paramsAlert = {
            content: I18n.t('Alert.topup04'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.ERROR,
          };
          break;
        case '97':
          paramsAlert = {
            content: I18n.t('Alert.topup97'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.ERROR,
          };
          break;
        case '99':
          paramsAlert = {
            content: I18n.t('Alert.topup99'),
            title: I18n.t('Alert.notice'),
            type: Const.ALERT_TYPE.ERROR,
          };
          break;
        default:
          break;
      }
      this.props.dispatch(alertActions.openAlert(paramsAlert));
    }, 1500);
  }

  dispatchNavigate(screen, roomId) {
    const {dispatch} = this.props;
    dispatch(onNavigate(screen, roomId));
  }

  // async openNotificationEnrollment(params) {
  //     const { dispatch } = this.props;
  //     // const userMode = await Storage.get(Consts.STORAGE.USER_MODE);
  //     // dispatch(notificationActions.openNotificationEnrollment(params));
  // }

  // async openNotificationQuestions(params) {
  //     const { dispatch } = this.props;
  //     // setTimeout(() => {
  //     //     this.dispatchNavigate("Chat", notification._data.chatRoomId);
  //     // }, 10000);
  //     // dispatch(notificationActions.openNotificationQuestions(params));
  // }

  initNotificationOpenedListener() {
    // this.notificationOpenedListener = firebase
    //   .notifications()
    //   .onNotificationOpened(notificationOpen => {
    //     if (_.isEmpty(notificationOpen)) return;
    //     const {action, notification} = notificationOpen;

    //     if (action) {
    //       if (notification._data.type == 'topup') {
    //         this.topupProcess(notification._data);
    //         return;
    //       }
    //       // alert("open");
    //       if (notification._data.type == 'Chat') {
    //         // PRESS NOTIFICATION TO CHAT
    //         this.dispatchNavigate('Chat', notification._data.chatRoomId);
    //         return;
    //       }
    //       if (!_.isEmpty(notification._data.caller)) {
    //         // PRESS NOTIFICATION TO CHAT
    //         this.dispatchNavigate('Call', parseInt(notification._data.caller));
    //         return;
    //       }
    //     }
    //   });
  }

  renderAlert(title, content, type, showAlert) {
    const {dispatch} = this.props;
    let color = Colors.MAIN_COLOR;
    let icon = 'ios-checkmark';
    switch (type) {
      case Const.ALERT_TYPE.SUCCESS:
        color = Colors.MAIN_COLOR;
        break;
      case Const.ALERT_TYPE.ERROR:
        color = Colors.RED_COLOR;
        icon = 'ios-close';
        break;
      case Const.ALERT_TYPE.WARNING:
        color = Colors.YELLOW_COLOR;
        icon = 'ios-information';
        break;
      default:
        break;
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAlert}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.containerModal}>
          <View style={styles.contentModal}>
            <View style={styles.headerModal}>
              <View style={[styles.headerImage, {backgroundColor: color}]}>
                <Icon name={icon} style={{fontSize: 50, color: 'white'}} />
              </View>
            </View>
            <View style={styles.bodyModal}>
              <AppText text={title} style={styles.titleAlert} />
              <AppText text={content} style={styles.contentAlert} />
              <Button
                style={{width: 150, height: 40}}
                title={'OK'}
                onPress={() => {
                  dispatch(alertActions.closeAlert());
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  closeModal = () => {
    this.props.dispatch(alertActions.closeModal());
  };

  renderModal = () => {
    const {alertReducer} = this.props;
    return (
      <Modal
        visible={alertReducer.showModal}
        transparent
        animationType="slide"
        onRequestClose={this.closeModal}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContainer}
          onPress={this.closeModal}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => {}}>
            <AppText text={I18n.t('Alert.service')} style={styles.txtModal} />
            <TouchableOpacity
              style={styles.btnBuyNow}
              onPress={() => {
                Linking.canOpenURL(url).then(supported => {
                  if (supported) {
                    Linking.openURL(url);
                  } else {
                    console.log("Don't know how to open URI: " + url);
                  }
                });
                setTimeout(() => {
                  this.closeModal();
                }, 200);
              }}>
              <AppText text={I18n.t('Alert.buyNow')} style={styles.txtBuyNow} />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  render() {
    const {loadingReducer, alertReducer} = this.props;
    const {dataCall} = this.state;
    let data = {};
    if (!_.isEmpty(dataCall)) {
      data = {
        callData: dataCall,
        callerId: dataCall.caller,
        isVideo: dataCall.isVideo,
        roomId: dataCall.to,
        userId: dataCall.to,
      };
    }
    if (isIphoneX()) {
      return (
        <SafeAreaView forceInset={forceInset} style={styles.container}>
          <Root>
            <View style={styles.content}>
              <Navigator />
              <LocalNotification onRef={noti => (this.notiRef = noti)} />
              <Spinner visible={loadingReducer.show} />
              {this.renderAlert(
                this.state.title,
                this.state.content,
                this.state.type,
                this.state.showAlert,
              )}
              {this.renderModal()}
            </View>
          </Root>
        </SafeAreaView>
      );
    } else {
      return (
        <View style={styles.content}>
          <Root>
            <Navigator />
            <LocalNotification onRef={noti => (this.notiRef = noti)} />
            <Spinner visible={loadingReducer.show} />
            {this.renderAlert(
              this.state.title,
              this.state.content,
              this.state.type,
              this.state.showAlert,
            )}
            {this.renderModal()}
          </Root>
        </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#db6500',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  titleAlert: {
    fontSize: Const.FONT_SIZE.TITLE,
    marginTop: 16,
    fontWeight: '500',
    color: 'black',
  },
  contentAlert: {
    width: '80%',
    fontSize: Const.FONT_SIZE.CONTENT_SIZE + 2,
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 16,
    color: 'black',
  },
  containerModal: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentModal: {
    marginTop: '20%',
    alignItems: 'center',
    witdh: '80%',
  },
  headerModal: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 30,
    borderColor: 'white',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_COLOR,
    zIndex: 999,
  },
  headerImage: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
  },
  bodyModal: {
    marginTop: -30,
    backgroundColor: 'white',
    padding: 16,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.BLACK + '50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.BACKGROUND_MODAL,
    padding: PD.PADDING_5,
    borderRadius: 20,
    maxWidth: '80%',
    alignItems: 'center',
  },
  txtModal: {
    color: Colors.WHITE_COLOR,
    fontSize: responsiveFontSize(2.2),
    textAlign: 'center',
  },
  txtBuyNow: {
    color: Colors.WHITE_COLOR,
    fontSize: responsiveFontSize(2.3),
  },
  btnBuyNow: {
    backgroundColor: Colors.MAIN_COLOR,
    padding: PD.PADDING_2,
    marginTop: PD.PADDING_6,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
};

function mapStateToProps(state) {
  return {
    loadingReducer: state.loadingReducer,
    alertReducer: state.alertReducer,
    userReducer: state.userReducer,
    currentRoom: state.chatHistoriesReducer.currentRoom,
    languageReducer: state.languageReducer,
    settingReducer: state.settingReducer,
  };
}
MainApp = connect(mapStateToProps)(MainApp);
export default MainApp;
