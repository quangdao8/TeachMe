import React from "react";
import { Fab, Icon } from "native-base";
import { DEVICE } from "helper/Consts";
import { Colors } from "helper";
import { ICON } from "assets";
import { AppImage } from "components";

const FAB_HEIGHT = 55;
const FAB_RADIUS = FAB_HEIGHT / 2;
class FABButton extends React.PureComponent {
    render() {
        const { onPress } = this.props;
        return (
            <Fab
                direction="up"
                containerStyle={{ marginRight: 10, marginBottom: 10 }}
                style={styles.fabActive}
                position="bottomRight"
                onPress={() => onPress()}
            >
                <AppImage local source={ICON.chat_active} style={{ width: 25, height: 25 }} />
            </Fab>
        );
    }
}

FABButton.defaultProps = {
    onPress: () => {}
};

const styles = {
    fabActive: {
        backgroundColor: Colors.MAIN_COLOR,
        width: FAB_HEIGHT,
        height: FAB_HEIGHT,
        borderRadius: FAB_RADIUS
    }
};

export default FABButton;
