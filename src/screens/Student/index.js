import React from "react";
import { View, StatusBar, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { connect } from "react-redux";
import { Fab } from "native-base";
import { Colors, Convert } from "helper/index";
import { types, contactAction } from "actions/index";
import { Container, AppImage, AppText } from "components/index";
import styles from "./styles";
import { ICON } from "assets";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { DEVICE } from "helper/Consts";
import CardStudent from "./CardStudent";

const _ = require("lodash");

class Student extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            active: false,
            teacherData: [],
            backUpData: [],
            refresh: false,
            tabs: false,
            initialRender: 1
        };
        this.valueSearch = "";
        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }
    componentWillMount() {}
    componentDidMount() {
        this.onRefresh();
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = e => {
        this.setState({
            keyboardHeight: e.endCoordinates.height + 10 - 55
        });
    };

    _keyboardDidHide = () => {
        this.setState({ keyboardHeight: 10 });
    };

    onRefresh() {
        if (!_.isEmpty(this.valueSearch)) {
            this.onSearch(this.valueSearch);
        } else {
            this.setState({ refresh: true }, () => {
                const { dispatch, userReducer } = this.props;

                let params = {
                    of_user__id: userReducer.data.id
                };
                dispatch(contactAction.getContactRequest(params));
            });
        }
    }

    renderItem(item) {
        return <CardStudent item={item} navigation={this.props.navigation} />;
    }

    componentDidUpdate(prevProps) {
        const { contactReducer, dispatch } = this.props;
        if (prevProps.contactReducer !== contactReducer) {
            if (contactReducer.type === types.GET_CONTACT_SUCCESS) {
                this.setState({ refresh: false }, () => {
                    this.getTeacher(contactReducer);
                });
            }
            if (contactReducer.type === types.GET_CONTACT_FAILED) {
                this.setState({ refresh: false });
            }
        }
    }

    onSearch(value) {
        let { backUpData } = this.state;
        if (_.isEmpty(backUpData)) return;
        clearTimeout(this.timeout);
        this.setState({ teacherData: [], refresh: true }, () => {
            this.timeout = setTimeout(() => {
                this.valueSearch = value.trim();
                let mainData = _.filter(backUpData, function(o) {
                    const userName = o.nickname || o.about_user.user.first_name + " " + o.about_user.user.last_name;

                    const removeDia = Convert.removeDiacritics(userName.toLowerCase());
                    const valueRemovDia = Convert.removeDiacritics(value.toLowerCase());
                    return (
                        // _.includes(userName.toLowerCase(), value.toLowerCase()) ||
                        _.includes(removeDia, valueRemovDia)
                    );
                });
                this.setState({ teacherData: mainData, refresh: false });
                // if (value.trim()) {
                //     this.setState({ teacherData: mainData, refresh: false });
                // } else {
                //     this.valueSearch = "";
                //     this.setState({ teacherData: backUpData, refresh: false });
                // }
            }, 1500);
        });
    }

    getTeacher(contactReducer) {
        // const { contactReducer } = this.props;

        let listTeacher = _.filter(contactReducer.data.response, function(o) {
            return o.is_like == true && o.about_user.type == 0;
        });
        this.setState({
            teacherData: listTeacher,
            backUpData: listTeacher
        });
    }

    renderEmptyStudent() {
        let { refresh, backUpData } = this.state;
        return (
            !refresh && (
                <AppText
                    text={_.isEmpty(backUpData) ? I18n.t("student.emptyFavorite") : I18n.t("callHistory.noResult")}
                    style={styles.textEmpty}
                />
            )
        );
    }

    renderListTeacher() {
        const { initialRender, refresh, keyboardHeight } = this.state;
        const { teacherData } = this.state;

        return (
            <View style={{ width: DEVICE.DEVICE_WIDTH, flex: 1 }}>
                <FlatList
                    initialNumToRender={initialRender}
                    ref={ref => (this.flatlist = ref)}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                    showsVerticalScrollIndicator={false}
                    data={teacherData}
                    extraData={this.state}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={refresh}
                    onRefresh={() => this.onRefresh()}
                    ListEmptyComponent={this.renderEmptyStudent()}
                />
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { tabs, active } = this.state;

        return (
            <Container
                scrollEnabled={false}
                contentContainerStyle={{
                    flex: 1,
                    backgroundColor: Colors.CONTENT_COLOR,
                    alignItems: "flex-start"
                }}
            >
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
                <HeaderApp
                    isSearch={!tabs}
                    onChangeText={value => this.onSearch(value)}
                    leftOnPress={() => navigation.navigate("StartLogin")}
                    navigation={navigation}
                    title={I18n.t("ListUserScreen.yoleanTeacher")}
                />

                {this.renderListTeacher()}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer
    };
}
Student = connect(mapStateToProps)(Student);
export default Student;
