import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
  StatusBar,
  ImageBackground,
  BackHandler,
  AppState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Container,
  Button,
  AppImage,
  Input,
  AppText,
  AppImageCircle,
} from 'components/index';
import I18n from 'helper/locales';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {
  RTCPeerConnection,
  RTCMediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStreamTrack,
  mediaDevices,
} from 'react-native-webrtc';
import styles from './styles';
import {Colors, Const} from 'helper/index';
// import { Platform } from "react-native";
import firebase from '@react-native-firebase/app';
import {DIMENSION, USER_TYPE} from 'helper/Consts';
import {Stopwatch, Timer} from 'react-native-stopwatch-timer';
import IncallManager from 'react-native-incall-manager';
import {callHistoryRequest} from 'actions/callActions';
import {updateAmount, loginSuccess, endCallAction} from 'actions/userActions';
import EndCall from '../Call/EndCall';
import NoteScreen from '../Call/NoteScreen';
import BackgroundTimer from 'react-native-background-timer';

import {thisExpression} from '@babel/types';
import {ServiceHandle} from 'helper';
import {userActions, callActions, alertActions} from 'actions';
import {numberToCurrency} from 'helper/convertLang';
import {getTeacherRequest} from 'actions/contactActions';
import {password} from 'screens/Registration';
import RNCallKeep from 'libraries/CallKeep';
// import fbRN from "react-native-firebase";
import CallDetectorManager from 'react-native-call-detection';
import uuid from 'uuid';
const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window');

const _ = require('lodash');
const moment = require('moment');

const pcPeers = {};

const configuration = Const.configurationTurnServer;

const options = {
  container: {
    backgroundColor: 'transparent',
    marginTop: 10,
    alignSelf: 'center',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#000',
    // marginLeft: 7
  },
};

// const notification = new fbRN.notifications.Notification()
//     .setNotificationId("notificationId")
//     .setTitle("Trong cuộc gọi")
//     .setBody("Nhấn để quay lai cuộc gọi")
//     .android.setChannelId("general")
//     .android.setSmallIcon("ic_launcher")
//     .android.setPriority(fbRN.notifications.Android.Priority.Max);

// let peerConnection = new RTCPeerConnection(configuration);

class VideoCall extends Component {
  // Initial state
  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    const {
      isSpeaker = false,
      isMute = false,
      callLogId,
      callData,
      isVideo,
      isFrom,
    } = params;
    this.state = {
      videoURL: '',
      isFront: true,
      friendVideo: '',
      pc: new RTCPeerConnection(configuration),
      localStream: null,
      clockStart: false,
      isMute: isMute,
      isVideo: true,
      active: false,
      call: false,
      note: '',
      price: 0,
      isSpeaker: isSpeaker,
      call_log_id: callLogId,
    };
    this.addToCallLog();
    this.functionWillMount();
    this.finish = false;
    this.price = 0;
    this.uuid = uuid.v4();
    isFrom &&
      Platform.OS === 'ios' &&
      RNCallKeep.startCall(
        this.uuid,
        callData.callerName,
        callData.callerName,
        'generic',
        isVideo,
      );
  }
  isDisconnect = false;
  isSendIce = false;
  isIceCandidateAdded = false;
  isUpdateAmount = false;
  isDisconnectFrom = false;
  isHasMedia = false;
  mediaInfo = {width: DEVICE_WIDTH, height: DEVICE_HEIGHT, isVideo: false};
  yourId = this.props.navigation.state.params.userId;
  isOffer = true;
  timer = 1;
  isAddCallLog = false;
  iceArray = [];
  friendType = this.props.navigation.state.params.friendType;
  appState = 'active';
  note = '';
  PRICE_PER_BLOCK = 0;
  price = 0;
  startBack = false;
  numberBlock = -1;

  startListenerTapped() {
    console.log('tesstttttttt detectCall lllllll');
    this.callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        console.log('tesstttttttt detectCall', event, phoneNumber);

        this.disconnectCall();

        if (event === 'Disconnected') {
          // Do something call got disconnected
        } else if (event === 'Connected') {
          // Do something call got connected
          // This clause will only be executed for iOS
        } else if (event === 'Incoming') {
          // Do something call got incoming
        } else if (event === 'Dialing') {
          // Do something call got dialing
          // This clause will only be executed for iOS
        } else if (event === 'Offhook') {
          //Device call state: Off-hook.
          // At least one call exists that is dialing,
          // active, or on hold,
          // and no calls are ringing or waiting.
          // This clause will only be executed for Android
        } else if (event === 'Missed') {
          // Do something call got missed
          // This clause will only be executed for Android
        }
      },
      true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  }

  sendMessage = (senderId, data) => {
    var msg = firebase
      .database()
      .ref(`/video-call/${this.props.navigation.state.params.roomId}`)
      .push({sender: senderId, message: data});
    setTimeout(() => {
      msg.remove();
    }, 100);
  };

  async functionWillMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }
  addToCallLog = id => {
    const {params = {}} = this.props.navigation.state;
    const {isFrom, roomId} = params;
    let self = this;
    firebase
      .database()
      .ref(`/call-log-id/${roomId}`)
      .on('child_added', childSnapshot => {
        let lastItem = childSnapshot.toJSON();
        console.log('result ===>', lastItem);
        const {call_log} = lastItem;
        self.setState({call_log_id: call_log});
      });
    return;
  };

  pressEndCall = value => {
    const {type} = this.props.userReducer.data;
    const {balance, call_log_id} = this.state;
    const {params = {}} = this.props.navigation.state;
    const {callerId, uuid} = params;
    const {userId, roomId, isFrom} = params;
    this.toggleModal();
    this.props.navigation.goBack();
    userActions.getUserData({id: callerId}).then(res => {
      if (!res.error) {
        let userUpdate = this.props.userReducer.data;
        userUpdate.amount = res.response.amount;
        this.props.dispatch(loginSuccess(userUpdate));
      }
    });
    let isTeacher = isFrom && type == USER_TYPE.TEACHER;
    let defaultTimer = 30 * this.numberBlock + 1;
    callActions
      .postCheckBlock(
        call_log_id,
        this.endTime,
        this.timer > defaultTimer ? this.timer : defaultTimer,
        1,
        this.note.trim(),
        isTeacher ? '' : value,
      )
      .then(res => {
        this.requestTransaction();
        this.timer = 1;
        this.numberBlock = -1;
        firebase
          .database()
          .ref(`/update-call-log/${roomId}`)
          .push({call_log_id});
        setTimeout(() => {
          firebase.database().ref(`/update-call-log/${roomId}`).remove();
        }, 1000);
      })
      .catch(e => {});
  };

  renderEndCall() {
    const {active, duration, startTime, price, balance} = this.state;
    const {params = {}} = this.props.navigation.state;

    return (
      <EndCall
        friendType={this.friendType}
        duration={duration}
        startTime={startTime}
        price={numberToCurrency(price)}
        balance={numberToCurrency(balance)}
        isModalVisible={active}
        onBackdropPress={() => console.log('')}
        onPress={this.pressEndCall}
      />
    );
  }

  afterCreateCallLog(res) {
    const {params = {}} = this.props.navigation.state;
    const {userId} = params;
    if (res.error === true) {
      alert(res.errorMessage);
    } else {
      this.addToCallLog(res.response.id);
      this.setState({
        callLogId: res.response.id,
      });
    }
    this.props.dispatch(callHistoryRequest(userId));
  }

  async sendLocalNoti() {
    // await fbRN.notifications().displayNotification(notification);
    console.log('start noti', notification);
  }

  _handleAppStateChange = nextAppState => {
    if (Platform.OS !== 'ios') {
      if (this.appState.match(/active/) && nextAppState === 'background') {
        this.sendLocalNoti();
      }
      if (this.appState.match(/background/) && nextAppState === 'active') {
        console.log(
          'thisvvvvvvvvvvvvvvvvvvvvvvvvv',
          this.appState,
          nextAppState,
        );
        if (!!this.timeoutId) {
          BackgroundTimer.clearTimeout(this.timeoutId);
        }
        // fbRN.notifications().removeDeliveredNotification("notificationId");
      }
      this.appState = nextAppState;
    }
  };

  requestTransaction() {
    const {dispatch, userReducer} = this.props;
    let paramsFull = {
      user_id: userReducer.data.id,
      type: [0, 1, 3],
      amount: true,
    };
    dispatch(userActions.transactionFullRequest(paramsFull));
    let params = {
      user_id: userReducer.data.id,
      type: [2, 4],
      amount: true,
    };
    dispatch(userActions.transactionRequest(params));
  }

  firstTimeRequest = false;

  componentDidMount() {
    if (Platform.OS !== 'ios') {
      check(PERMISSIONS.ANDROID.READ_PHONE_STATE).then(result => {
        if (result === RESULTS.GRANTED) {
          this.startListenerTapped();
        }
      });
    }
    AppState.addEventListener('change', this._handleAppStateChange);
    const {params = {}} = this.props.navigation.state;
    const {
      isFrom,
      userId,
      roomId,
      note = '',
      callerId,
      callData,
      isVideo,
    } = params;
    const {userReducer} = this.props;
    const {data = {}} = userReducer;
    const {amount = 0, id = 0} = data;
    if (Platform.OS !== 'ios') {
      IncallManager.turnScreenOn();
    } else {
      if (isFrom) {
        console.log('params =>', params);
        setTimeout(() => {
          RNCallKeep.updateDisplay(
            this.uuid,
            callData.callerName,
            callData.callerName,
          );
        }, 1000);
        // RNCallKeep.hasOutgoingCall();
      }
    }
    if (!this.firstTimeRequest) {
      isFrom && this.requestBlock(0, 0);
      this.firstTimeRequest = true;
    }

    firebase
      .database()
      .ref(`/video-call/${userId}`)
      .limitToLast(1)
      .on('child_added', childSnapshot => {
        const item = childSnapshot.toJSON();
        const {media, status} = item;
        if (status === 'connected' && !this.isHasMedia) {
          const {isVideo = false} = item;
          IncallManager.start({
            media: isVideo ? 'video' : 'audio',
            auto: true,
          });
          // DeviceEventEmitter.addListener("WiredHeadset", data => {
          //     const { deviceName, hasMic, isPlugged = false } = data;
          //     if (!this.state.isSpeaker) {
          //         if (!isPlugged && isVideo) {
          //             IncallManager.setForceSpeakerphoneOn(true);
          //         } else if (isPlugged) {
          //             IncallManager.setForceSpeakerphoneOn(false);
          //         }
          //     }
          // });
          this.isHasMedia = true;
          if (!this.localStream) {
            mediaDevices
              .getUserMedia({
                audio: {
                  volume: 1.0,
                  echoCancellation: true,
                  // noiseSuppression: true
                },
                video: isVideo
                  ? {
                      mandatory: {
                        width: media.width, // Provide your own width, height and frame rate here
                        height: media.height,
                        minFrameRate: 30,
                      },
                      facingMode: 'user',
                      optional: [],
                    }
                  : false,
              })
              .then(stream => {
                this.localStream = stream;
                this.setState({
                  videoURL: stream.toURL(),
                  localStream: stream,
                  isVideo: isVideo,
                  note: note,
                });
                this.createPC();
                if (this.isOffer) {
                  return this.createOffer(this.state.pc);
                }
              })

              .catch(e => {});
          }
        }
        if (status === 'finished') {
          if (!this.finish) {
            this.finish = true;
            this.props.dispatch(callHistoryRequest(userId));
          }
          this.backHandler.remove();
          if (!this.isAddCallLog) {
            console.log('request=>> stopFinished');
            this._stopBackgroundTimer();
            BackgroundTimer.stopBackgroundTimer();
            if (Platform.OS !== 'ios') {
              this.stopListenerTapped();
            }
            this.isAddCallLog = true;
            IncallManager.stop();
            if (isFrom) {
              userActions.getUserData({id}).then(res => {
                let defaultTimer = 30 * this.numberBlock + 1;
                if (!res.error) {
                  let balance = res.response.amount;
                  firebase.database().ref(`/video-call/${callerId}`).remove();
                  firebase.database().ref(`/video-call/${roomId}`).remove();
                  this.setState({
                    myId: id,
                    clockStart: false,
                    balance,
                    startTime: moment
                      .utc(this.startTime)
                      .local()
                      .format('YYYY-MM-DD HH:mm'),
                    duration: moment(
                      this.timer > defaultTimer
                        ? this.timer * 1000
                        : defaultTimer * 1000,
                    )
                      .utc()
                      .format('HH:mm:ss'),
                    price: this.price,
                    active: true,
                  });
                }
              });
              let call_log_id = this.state.call_log_id;
              let defaultTimer = 30 * this.numberBlock + 1;
              callActions
                .postCheckBlock(
                  call_log_id,
                  this.endTime,
                  this.timer > defaultTimer ? this.timer : defaultTimer,
                  1,
                  this.note.trim(),
                )
                .then(res => {
                  firebase
                    .database()
                    .ref(`/update-call-log/${roomId}`)
                    .push({call_log_id});
                  setTimeout(() => {
                    firebase
                      .database()
                      .ref(`/update-call-log/${roomId}`)
                      .remove();
                  }, 1000);
                })
                .catch(e => {});
            } else {
              this.isIceCandidateAdded = false;
              firebase.database().ref(`/video-call/${callerId}`).remove();
              firebase.database().ref(`/video-call/${roomId}`).remove();
              firebase
                .database()
                .ref(`/call-log-id/${id}`)
                .limitToLast(1)
                .on('child_added', childSnapshot => {
                  const lastItem = childSnapshot.toJSON();
                  const {call_log} = lastItem;
                  let userUpdate = this.props.userReducer.data || {};
                  if (!this.isUpdateAmount) {
                    userActions
                      .getUserData({id})
                      .then(res => {
                        this.isUpdateAmount = true;
                        if (!res.error) {
                          userUpdate.amount = res.response.amount;
                          this.props.dispatch(loginSuccess(userUpdate));
                        }
                        ServiceHandle.patch(`/call_log/${call_log}/`, {
                          note_received_user: this.note.trim(),
                        })
                          .then(res => {
                            firebase
                              .database()
                              .ref(`/call-log-id/${id}`)
                              .remove();
                          })
                          .catch(e => {
                            console.log('error patch note', e);
                            firebase
                              .database()
                              .ref(`/call-log-id/${id}`)
                              .remove();
                          });
                      })
                      .catch(e => {});
                  }
                });
            }
          }
          if (!isFrom) {
            IncallManager.setForceSpeakerphoneOn(false);
            IncallManager.setSpeakerphoneOn(false);
            IncallManager.setKeepScreenOn(false);
          }
          if (!!this.state.pc) {
            this.state.pc.close();
            this.setState({pc: null});
          }
          return;
        }
      });

    firebase
      .database()
      .ref(`/video-call/${roomId}`)
      .on('child_added', childSnapshot => {
        if (!!childSnapshot.val().message) {
          console.log(
            '==================== receive sdp',
            roomId,
            childSnapshot,
          );
          this.readMessage(childSnapshot);
        }
      });
  }

  stopListenerTapped() {
    if (!!this.callDetector) {
      this.callDetector.dispose();
      this.callDetector = null;
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (Platform.OS !== 'ios') {
      this.stopListenerTapped();
    }
    console.log('request=>> unMount');
    this._stopBackgroundTimer();
    BackgroundTimer.stopBackgroundTimer();
    if (!this.isDisconnect) {
      this.backHandler.remove();
      const {params = {}} = this.props.navigation.state;
      const {roomId, callerId} = params;
      const {localStream} = this.state;
      if (!!this.state.pc) {
        this.state.pc.close();
        this.setState({
          pc: null,
        });
      }
      this.setState({
        isVideo: true,
        note: '',
      });
      if (!!localStream && !!localStream.release()) {
        localStream.release();
      }
      this.isIceCandidateAdded = false;
      var callerFinished = firebase
        .database()
        .ref(`/video-call/${callerId}`)
        .push({
          caller: callerId,
          to: roomId,
          isCanReceive: true,
          status: 'finished',
        });

      var receiverFinished = firebase
        .database()
        .ref(`/video-call/${roomId}`)
        .push({
          caller: callerId,
          to: roomId,
          isCanReceive: true,
          status: 'finished',
        });
      setTimeout(() => {
        callerFinished.remove();
        receiverFinished.remove();
      }, 500);
    }
  }
  iceReceives = [];

  readMessage(data) {
    const {pc} = this.state;
    var msg = JSON.parse(data.val().message);
    var sender = data.val().sender;
    if (sender != this.yourId && !!pc && !!msg) {
      if (!!msg.ice) {
        pc.addIceCandidate(new RTCIceCandidate(msg.ice))
          .then(() => {
            console.log('add success');
          })
          .catch(e => {
            console.log(
              'add error',
              e,
              msg.ice,
              pc.localDescription,
              pc.remoteDescription,
            );
          });
      } else if (msg.sdp.type === 'offer') {
        console.log('add success ============');

        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .then(() => {
            if (pc.remoteDescription.type == 'offer') {
              pc.createAnswer()
                .then(desc => {
                  pc.setLocalDescription(desc)
                    .then(() => {
                      this.sendMessage(
                        this.yourId,
                        JSON.stringify({sdp: pc.localDescription}),
                      );
                    })
                    .catch(e => console.log('set Local Description error', e));
                })
                .catch(e => console.log('errror create answer', e));
            }
          })
          .catch(e => console.log('set remote error', e));
      } else if (msg.sdp.type == 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)).then(() => {
          console.log('sucess set remote answerrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        });
      }
    }
  }

  getStats = () => {
    const {pc} = this.state;
    // if (this.state.isMute) {
    //     pc.getLocalStreams()[0].getAudioTracks()[0].enabled = false;
    // }
    // if (!!pc && pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    //     const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    //     pc.getStats(track)
    //         .then(report => {
    //             console.log("getStats report", report, JSON.stringify(configuration));
    //         })
    //         .catch(e => console.log(e));
    // }
  };

  createOffer(pc) {
    if (this.props.navigation.state.params.isFrom) {
      pc.createOffer({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      }).then(desc => {
        console.log('+++++++++++++++++', desc);
        pc.setLocalDescription(desc)
          .then(() => {
            this.isOffer = false;
            this.sendMessage(
              this.yourId,
              JSON.stringify({sdp: pc.localDescription}),
            );
          })
          .catch(e => {
            console.log('aaaaaaaaaaaaaaaaaaassss', e);
          });
      });
    } else {
      this.isOffer = false;
    }
  }

  createPC = async () => {
    const {params = {}} = this.props.navigation.state;
    const {pc} = this.state;
    console.log('================', pc);

    pc.onicegatheringstatechange = event => {
      console.log('============ gather', event.target.iceGatheringState);
      if (event.target.iceGatheringState === 'complete') {
      }
    };

    pc.onicecandidate = event => {
      console.log('============ onicecandidate', event.candidate);

      if (event.candidate === null) {
      }
      if (!!event.candidate) {
        this.sendMessage(this.yourId, JSON.stringify({ice: event.candidate}));
      }
    };

    pc.onsignalingstatechange = event => {
      console.log('============ sinalingState', event.target.signalingState);
    };

    pc.oniceconnectionstatechange = event => {
      console.log(
        '============ iceConnectionState',
        event.target.iceConnectionState,
      );
      const {params = {}} = this.props.navigation.state;
      const {isFrom} = params;
      if (event.target.iceConnectionState === 'connected') {
        this.setState({clockStart: true});
        this.startTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        Platform.OS !== 'ios' &&
          BackgroundTimer.runBackgroundTimer(() => {
            // console.log("request=>> connected", this.timer);
            this.timer = this.timer + 1;
            this.endTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
          }, 1000);
        if (!this.startBack && isFrom) {
          this.startBack = true;
          setTimeout(() => {
            this.startBackgroundTimer();
          }, 500);
        }
      }

      if (
        event.target.iceConnectionState === 'disconnected' ||
        event.target.iceConnectionState === 'closed'
      ) {
        if (!this.isDisconnect) {
          this.setState({clockStart: false});
          this.endTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
          this.disconnectCall();
        }
      }
      if (event.target.iceConnectionState === 'completed') {
        
        // const [receiver] = event.target.getReceivers();
        // const remoteStream = receiver.track.remoteStream;
        // console.log('============ onnegotiationneeded ====== Remote stream:', remoteStream);
        // setTimeout(() => {
        //     this.getStats();
        // }, 1000);
        const [receiver] = event.target.getReceivers();
        console.log(
            '============ onnegotiationneeded ======',
            console.log('Receivers:', receiver),
          );
        if (receiver?.track) {
          const remoteStream = receiver.track.remoteStream;
          // Do something with the remote stream
          console.log('Remote stream:', remoteStream);
        } else {
          receiver.ontrack = function (event) {
            const remoteStream = event.streams[0];
            // Do something with the remote stream
            console.log('Remote stream:', remoteStream);
          };
        }
      }
    };

    // pc.createDataChannel("");

    pc.onnegotiationneeded = () => {
      console.log('============ onnegotiationneeded', this.isOffer);
      if (this.isOffer) {
        // this.createOffer(pc);
      }
    };

    pc.onremovestream = event => {
      console.log('=========== onremovestream', event.stream);
    };

    pc.addEventListener('track', event => {
      // Grab the remote track from the connected participant.
      console.log('============ on track add', event);

      // remoteMediaStream = remoteMediaStream || new MediaStream();
    });

    pc.ontrack = event => {
      console.log('============ on track add', event);
    };

    pc.onaddstream = event => {
      console.log('============ on stream add', event.stream, pc);
      this.setState({
        friendVideo: event.stream.toURL(),
      });
    };
    if (!!this.localStream) {
      await pc.addStream(this.localStream);
    }
  };

  switchCameraButton = () => {
    const {pc} = this.state;
    console.log('132132311231311', pc.getLocalStreams()[0].getVideoTracks()[0]);
    pc.getLocalStreams()[0].getVideoTracks()[0]._switchCamera();
  };

  startBackgroundTimer = () => {
    console.log('request=>>t here');

    Platform.select({
      ios: () => {
        console.log('request=>> connected 1', this.timer);

        BackgroundTimer.start();

        this.oneTimeOut = setInterval(() => {
          console.log('request=>> connected', this.timer);
          this.timer = this.timer + 1;
          this.endTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        }, 1000);
        this.iosTimeOutId = setInterval(() => {
          // firebase
          //     .database()
          //     .ref("z2timer")
          //     .push({ time: "startBackgroundTimer " + this.timer });
          this.requestBlock(0, 0);
        }, 30000);
        BackgroundTimer.stop();
      },
      android: () => {
        this.intervalId = BackgroundTimer.setInterval(() => {
          // Your scheduled task.
          this.requestBlock(0, 0);
        }, 30000);
      },
    })();
  };

  _stopBackgroundTimer = () => {
    Platform.select({
      ios: () => {
        !!this.oneTimeOut && clearInterval(this.oneTimeOut);
        !!this.iosTimeOutId && clearInterval(this.iosTimeOutId);
        BackgroundTimer.stop();
      },
      android: () => {
        console.log('tessttttttttttttt android');
        !!this.intervalId && BackgroundTimer.clearInterval(this.intervalId);
      },
    })();
  };

  mute = () => {
    console.log('131231232111', this.state.isMute);
    const {pc} = this.state;
    pc.getLocalStreams()[0].getAudioTracks()[0].enabled = this.state.isMute;
    this.setState({isMute: !this.state.isMute});
  };

  changeSpeaker = () => {
    // IncallManager.setSpeakerphoneOn(!this.state.isSpeaker);
    console.log('123111111111', this.state.isSpeaker);
    if (!this.state.isSpeaker) {
      IncallManager.chooseAudioRoute('SPEAKER_PHONE');
    }
    IncallManager.setForceSpeakerphoneOn(!this.state.isSpeaker);
    this.setState({isSpeaker: !this.state.isSpeaker});
  };

  disconnectCall() {
    // TODO:: END CALL RNCALLKEEP
    if (Platform.OS === 'ios') {
      // RNCallKeep.endAllCalls();
      RNCallKeep.endCall(this.uuid);
    }
    const {dispatch} = this.props;
    dispatch(endCallAction());
    if (!this.isDisconnect) {
      this.isDisconnect = true;
      const {pc, localStream} = this.state;
      const {params = {}} = this.props.navigation.state;
      const {roomId, callerId, isFrom} = params;
      this.isOffer = false;

      this.isIceCandidateAdded = false;
      if (!!pc) {
        pc.close();
        pc.onicecandidate = null;
        pc.onaddstream = null;
        this.setState({
          pc: null,
        });
      }
      this.setState({call: false});
      this.isDisconnectFrom = true;

      var callerFinished = firebase
        .database()
        .ref(`/video-call/${callerId}`)
        .push({
          caller: callerId,
          to: roomId,
          isCanReceive: true,
          status: 'finished',
        });
      var receiverFinished = firebase
        .database()
        .ref(`/video-call/${roomId}`)
        .push({
          caller: callerId,
          to: roomId,
          isCanReceive: true,
          status: 'finished',
        });

      setTimeout(() => {
        callerFinished.remove();
        receiverFinished.remove();
      }, 500);

      if (isFrom) {
        this.endTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
      } else {
        this.props.navigation.goBack();
      }
    }
  }

  requestBlock(seconds, time) {
    const {params = {}} = this.props.navigation.state;
    const {roomId} = params;
    if (!this.isAddCallLog) {
      console.log('request=>>', this.state.call_log_id, seconds, time);
      let call_log_id = this.state.call_log_id;
      this.numberBlock += 1;
      let defaultTimer = 30 * this.numberBlock + 1;
      this.endTime = moment().utc().format('YYYY-MM-DD HH:mm:ss.SSSSSS');
      callActions
        .postCheckBlock(this.state.call_log_id, this.endTime, defaultTimer, 0)
        .then(res => {
          console.log('request check block=>>>>>>>>>>>>>', res);
          // if (res.error) {
          //     this.disconnectCall();
          // }
          // else {
          firebase
            .database()
            .ref(`/update-call-log/${roomId}`)
            .push({call_log_id});
          setTimeout(() => {
            firebase.database().ref(`/update-call-log/${roomId}`).remove();
          }, 1000);
          this.price = res.response.call_fee;
          // this.setState({ price: res.response.call_fee });
          // }
        })
        .catch(e => {
          console.log('request=>>>>>>>>>>>>>', e);
        });
    } else {
      console.log('request=>> stopFinished', this.isAddCallLog);
      this._stopBackgroundTimer();
      BackgroundTimer.stopBackgroundTimer();
      if (Platform.OS !== 'ios') {
        this.stopListenerTapped();
      }
    }
  }

  getMsecs = time => {};

  toggleModal = () => {
    this.setState({active: false});
  };

  renderButton = (source, title, onPress, color) => {
    return (
      <View>
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.btnNoteDisable,
            !!color ? {backgroundColor: color} : {},
          ]}>
          <AppImage source={source} style={{width: 30, height: 30}} />
        </TouchableOpacity>
      </View>
    );
  };

  renderNote(avatar) {
    return (
      <NoteScreen
        onEndCall={() => {
          this.disconnectCall();
          if (!this.props.navigation.state.params.isFrom) {
            this.toggleModal();
          }
          this.setState({call: false});
        }}
        onChangeNote={text => (this.note = text)}
        onMute={this.mute}
        onSpeaker={this.changeSpeaker}
        isMute={this.state.isMute}
        isSpeaker={this.state.isSpeaker}
        text={this.state.note}
        onSave={value => this.setState({note: value, call: false})}
        onPress={() => {
          this.setState({call: false});
          this.note = this.state.note;
        }}
        inputRef={input => (this.inputNote = input)}
        source={{uri: avatar}}
      />
    );
  }

  render() {
    const {active, call} = this.state;
    const {params = {}} = this.props.navigation.state;
    const {callData = {}, isVideo = false, callerId} = params;
    const {userId, roomId} = params;
    const {userReducer} = this.props;
    const {data = {}} = userReducer;
    const {amount = 0, id = 0} = data;
    const {callerName = '', avatar = ''} = callData;
    if (isVideo) {
      return (
        <View
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            backgroundColor: Colors.SKY_BLUE,
          }}>
          {call ? this.renderNote(avatar) : null}
          <View style={{display: call ? 'none' : 'flex'}}>
            <View
              style={[
                styles.myVideo,
                {width: DEVICE_WIDTH / 3, height: DEVICE_HEIGHT / 3},
              ]}>
              <RTCView
                zOrder={1}
                streamURL={this.state.videoURL}
                style={{
                  width: DEVICE_WIDTH / 3,
                  height: DEVICE_HEIGHT / 3,
                }}
              />
              <TouchableOpacity
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#ccc',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  bottom: 10,
                  position: 'absolute',
                }}
                onPress={this.switchCameraButton}>
                <AppImage
                  source={require('../../assets/icon/switch-camera.png')}
                  style={{width: 10, height: 10}}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: DEVICE_WIDTH, height: DEVICE_HEIGHT}}>
              <RTCView
                streamURL={this.state.friendVideo || 'test'}
                style={[{width: DEVICE_WIDTH, height: DEVICE_HEIGHT}]}
              />
            </View>
            <View
              style={{
                width: '100%',
                position: 'absolute',
                bottom: 50,
                zIndex: 990,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                }}>
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
                  require('../../assets/icon/call-active.png'),
                  I18n.t('CallScreen.externalSpeaker'),
                  () => this.disconnectCall(),
                  'red',
                )}
                {this.renderButton(
                  this.state.isMute
                    ? require('../../assets/icon/ic-mute-active.png')
                    : require('../../assets/icon/ic-mute.png'),
                  I18n.t('CallScreen.mute'),
                  this.mute,
                )}
              </View>
              <Stopwatch
                start={this.state.clockStart}
                reset={false}
                options={options}
                getMsecs={this.getMsecs}
              />
            </View>
            {this.renderEndCall()}
          </View>
        </View>
      );
    }
    return (
      <Container scrollEnabled={false}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />

        {call ? this.renderNote(avatar) : null}
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            display: call ? 'none' : 'flex',
          }}
          source={{uri: avatar}}>
          <LinearGradient colors={Colors.GRADIENT} style={styles.gradient} />
          <AppImage
            source={{uri: avatar}}
            style={styles.avatar}
            resizeMode="cover"
          />
          <AppText text={callerName} style={styles.txtCallName} />
          <Stopwatch
            start={this.state.clockStart}
            reset={false}
            options={styles.txtCalling}
            getMsecs={this.getMsecs}
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
              this.state.isMute
                ? require('../../assets/icon/ic-mute-active.png')
                : require('../../assets/icon/ic-mute.png'),
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
                source={require('../../assets/icon/ic-horizontalCall.png')}
                style={{width: 25, height: 10}}
              />
            }
            onPress={() => this.disconnectCall()}
          />
        </ImageBackground>
        {this.renderEndCall()}
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
VideoCall = connect(mapStateToProps)(VideoCall);

export default VideoCall;
