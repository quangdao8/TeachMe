import React, { Component } from "react";
import { PD, DEVICE } from "helper/Consts";
import { View, TouchableOpacity, TextInput, FlatList, Keyboard } from "react-native";
import FastImage from "react-native-fast-image";
import chatFn from "../Functions";
import { Icon } from "native-base";
import I18n from "helper/locales";

const moment = require("moment");
import { create } from "apisauce";
import { AppImage } from "components";
const API_KEY = "api_key=8afRMvm7AU3Quo5FstCnZw6DPQOupI1C";
const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.15;
const LIMIT_RATE = `&limit=15&rating=G`;
class Giphy extends Component {
    constructor(props) {
        super(props);
        this.api = create({
            baseURL: "https://api.giphy.com/v1/gifs/",
            headers: { Accept: "application/json" },
            timeout: 30000
        });
        this.state = {
            data: [],
            searchText: ""
        };
    }

    async getTrending() {
        let response = await this.api.get(`trending?${LIMIT_RATE}&${API_KEY}`);
        return response;
    }
    async getRandom() {
        let response = await this.api.get(`random?&${API_KEY}&tag=`);
        return response;
    }

    async getSearch(e) {
        let response = await this.api.get(`search?&${API_KEY}&${LIMIT_RATE}&q=${e}`);
        return response;
    }

    async componentDidMount() {
        let response = await this.getTrending();
        this.setState({
            data: response.data.data
        });
    }

    async onChangeText(e) {
        let response = await this.getSearch(e);
        this.setState({
            data: response.data.data
        });
    }

    onPress(gif) {
        Keyboard.dismiss();
        const { user, lastMessage, onSend = () => {} } = this.props;
        let index = lastMessage && lastMessage.index ? lastMessage.index : 0;
        onSend(chatFn.convertMessImage(gif.url, gif, user, index));
    }

    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.onPress(item.images.downsized_medium)}
                style={{ marginHorizontal: 4 }}
            >
                <AppImage source={{ uri: item.images.preview_gif.url }} style={{ height: HEIGHT, width: HEIGHT }} />
            </TouchableOpacity>
        );
    }

    onClose() {
        let { onClose = () => {} } = this.props;
        onClose();
    }

    render() {
        let { data } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.btnWrap}>
                    <TouchableOpacity
                        onPress={() => this.onClose()}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    >
                        <Icon name="ios-close" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // style={{ height: HEIGHT }}
                    horizontal
                    data={data}
                    extraData={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => this.renderItem(item)}
                />
                <View style={styles.inputWrap}>
                    <TextInput
                        onChangeText={e => this.onChangeText(e)}
                        style={styles.input}
                        placeholder={I18n.t("chat.searchGif")}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
        borderBottomColor: "#999999",
        borderBottomWidth: 0.3,
        overflow: "hidden"
    },
    btnWrap: {
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: PD.PADDING_4
    },
    inputWrap: {
        paddingTop: 8,
        paddingHorizontal: PD.PADDING_4
    },
    input: {
        height: 40,
        // width: DEVICE.DEVICE_WIDTH,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#999999",
        paddingHorizontal: 20
    }
};

export default Giphy;
