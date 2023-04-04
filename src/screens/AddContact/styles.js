import { Const, GlobalStyles, Helper, ServiceHandle, Colors, Images } from "helper/index";

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR
  },
  body: {
    flex: 1,
    width: "100%",
    padding: Const.PD.PADDING_6 * 1.5
  },
  input: {
    height: Const.DIMENSION.BUTTON_HEIGHT,
    marginBottom: Const.PD.PADDING_6
  },
  view: {
    height: Const.DIMENSION.BUTTON_RADIUS
  },
  avatar: {
    height: Const.DIMENSION.H3 - 8,
    // aspectRatio: 1,
    borderRadius: (Const.DIMENSION.H3 - 8)/2
  },
  button: {
    width: "50%",
    height: Const.DIMENSION.BUTTON_HEIGHT - 4
  },
  buttonDis: {
    width: "50%",
    height: Const.DIMENSION.BUTTON_HEIGHT - 4,
    backgroundColor: Colors.DIABLED_BUTTON
  }
};
export default styles;
