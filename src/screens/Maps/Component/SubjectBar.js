import React, { PureComponent } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import { Colors } from "helper";
import { DEVICE, DIMENSION } from "helper/Consts";
import { AppText, AppImage } from "components";

import { Images, ICON, FONT_SF } from "assets";
import FastImage from "react-native-fast-image";

class SubjectBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: -1
        };
    }

    onPress(item) {
        let { onPressItem = () => {} } = this.props;
        this.setState({ id: item.id });
        onPressItem(item);
    }

    renderNoChoice(item) {
        return (
            <TouchableOpacity onPress={() => this.onPress(item)} style={styles.itemContainer}>
                <AppImage
                    local
                    source={require("../../../assets/image/subjects/choiced/van.png")}
                    style={styles.icon}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <AppText text={item.name.toUpperCase()} style={styles.txtChoiced} />
            </TouchableOpacity>
        );
    }

    renderChoiced(item) {
        return (
            <TouchableOpacity onPress={() => this.onPress(item)} style={styles.itemContainerChoiced}>
                <AppImage
                    local
                    source={require("../../../assets/image/subjects/choiced/van.png")}
                    style={styles.icon}
                />
                <AppText text={item.name.toUpperCase()} style={styles.txtChoiced} />
            </TouchableOpacity>
        );
    }

    renderItems(item) {
        let { id } = this.state;

        if (item) {
            return id == item.id ? this.renderChoiced(item) : this.renderNoChoice(item);
        } else {
            return null;
        }
    }

    render() {
        const { data, style } = this.props;
        const { id } = this.state;
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={data}
                style={[styles.container, style]}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                renderItem={({ item }) => this.renderItems(item)}
                extraData={id || data}
            />
        );
    }
}

const BAR_HEIGHT = DIMENSION.MAP_BOTTOM_BAR_HEIGHT;
const BTN_WIDTH = DIMENSION.MAP_SUBJECT_BTN_WIDTH;

const styles = {
    container: {
        backgroundColor: Colors.MAIN_COLOR,
        height: BAR_HEIGHT,
        flex: 1
    },

    itemContainer: {
        backgroundColor: "transparent",
        height: BAR_HEIGHT,
        minWidth: BTN_WIDTH,
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    itemContainerChoiced: {
        backgroundColor: "#C4681B",
        height: BAR_HEIGHT,
        minWidth: BTN_WIDTH,
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    txtChoiced: {
        color: Colors.WHITE_COLOR,
        fontFamily: FONT_SF.MEDIUM
    },
    txtNoChoice: {
        color: "rgb(91, 210, 255)",
        fontFamily: FONT_SF.MEDIUM
    },
    icon: {
        height: BTN_WIDTH / 4,
        width: BTN_WIDTH / 4
    }
};

export default SubjectBar;
