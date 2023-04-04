import { DEVICE } from "helper/Consts";
import { Const, Colors } from "helper/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

const styles = {
  //index
  input: {
    width: "70%",
    marginTop: 60,
    marginBottom: 25
  },
  inputsWrap: {
    width: "100%",
    padding: 16,
    marginTop: 30
  },
  btnNoteDisable: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  gradient: {
    height: DEVICE.DEVICE_HEIGHT,
    backgroundColor: "transparent",
    position: "absolute",
    opacity: 0.5,
    zIndex: 0,
    width: DEVICE.DEVICE_WIDTH
  },
  txtCallName: {
    color: Colors.WHITE_COLOR,
    fontSize: responsiveFontSize(3),
    fontWeight: "400",
    marginTop: height / 10
  },
  viewBtn: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: height / 5
  },
  txtCalling: {
    color: Colors.WHITE_COLOR,
    fontSize: responsiveFontSize(2.3)
    // marginTop: -10
  },
  // NoteScreen
  titleAlert: {
    fontSize: Const.FONT_SIZE.TITLE + 4,
    marginTop: 16,
    fontWeight: "400",
    color: "black"
  },
  contentAlert: {
    width: "100%",
    fontWeight: "400",
    fontSize: Const.FONT_SIZE.CONTENT_SIZE + 4,
    color: "black"
  },
  inputNote: {
    width: "90%",
    height: height / 3,
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: 15,
    paddingLeft: 15,
    fontSize: 18,
    marginTop: 10
  },
  container: {
    // flex: 1,
    // width: "100%",
    // position: "relative",
    height: width,
    width: height
  },
  myVideo: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 990
  }
  //EndCall
};
export default styles;
