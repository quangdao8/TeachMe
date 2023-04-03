import React from 'react';
import { View, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';
import { AppText } from '../components/index';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

import { Const, Colors, GlobalStyles, I18n } from '../helper/index';
import { ICON } from '../assets/index';
import AppImage from './AppImage';
import { getChatRoomDetail } from '../actions/chat/chatHistoriesAction';
import { STRING } from '../helper/Consts';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Tabbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: props.languageReducer.language
        };
        this.firtTime = false;
    }

    componentDidUpdate(prevProps) {
        const { dispatch, drawerReducer, navigation, navigateReducer } = this.props;
        const { state } = navigation;
        if (prevProps.drawerReducer != drawerReducer) {
            if (drawerReducer.drawerOpen) {
                navigation.toggleDrawer();
            }
        }
        if (prevProps.navigateReducer !== navigateReducer) {
            if (navigateReducer.screen == 'Chat') {
                this.params = {
                    routeName: 'StackChat',
                    params: { firstTime: 'firstTime' }
                };
                if (!this.firtTime) {
                    this.firtTime = true;
                    setTimeout(() => {
                        AsyncStorage.setItem(STRING.NOTI, 'firsttime').then(res => {
                            navigation.navigate('StackChat');
                        });
                    }, 0);
                } else {
                    setTimeout(() => {
                        navigation.navigate('StackChat');
                    }, 0);
                }
                return;
            }
            if (navigateReducer.screen == 'Call') {
                setTimeout(() => {
                    navigation.navigate('StackCall');
                }, 0);
                return;
            }
        }
    }

    renderRegularTab = (route, navigation, isActive, tabName, icon_name, idx) => {
        const iconName = `${icon_name.toLowerCase()}_active`;
        return (
            <TouchableOpacity
                key={tabName}
                style={isActive ? [styles.regularTabActive] : [styles.regularTab]}
                onPress={() => this.onPressTab(route, tabName, idx)}
            >
                <AppImage local style={{ width: 20, height: 20 }} resizeMode="contain" source={ICON[iconName]} />
                <AppText style={[styles.tabTitle, { color: 'white' }]} text={tabName.toUpperCase()} />
            </TouchableOpacity>
        );
    };

    onPressTab(route, tabName, idx) {
        const { navigation, userReducer } = this.props;
        navigation.navigate(route.routeName);

        const currentIndex = navigation.state.index;
        let resetAction = '';

        if (idx === currentIndex) {
            switch (idx) {
                case 0:
                    resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'CallHistory' })]
                    });
                    navigation.dispatch(resetAction);
                    break;

                case 2:
                    resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'ListUser' })]
                    });
                    navigation.dispatch(resetAction);
                    break;
                case 3:
                    resetAction = StackActions.reset({
                        index: 0,
                        actions:
                            userReducer.data.type == 1
                                ? [NavigationActions.navigate({ routeName: 'Student' })]
                                : [NavigationActions.navigate({ routeName: 'ListTeacher' })]
                    });
                    navigation.dispatch(resetAction);
                    break;
            }
        }
    }

    render() {
        const { navigation } = this.props;
        const { routes, index } = navigation.state;
        const { userReducer } = this.props;

        const tabNames = [
            I18n.t('tabbar.call'),
            I18n.t('tabbar.chat'),
            I18n.t('tabbar.contact'),
            userReducer.data.type == 1 ? I18n.t('tabbar.student') : I18n.t('tabbar.teacher')
        ];

        const tab_icons = ['call', 'chat', 'contact', 'teacher'];
        return (
            <View style={[styles.containerStyle]}>
                {tabNames.map((tabName, idx) => {
                    const isActive = index === idx;
                    return this.renderRegularTab(routes[idx], navigation, isActive, tabName, tab_icons[idx], idx);
                })} 
            </View>
        );
    }
}
const styles = {
    containerStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: Colors.MAIN_COLOR
    },
    regularTab: {
        flex: 1,
        height: '100%',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    regularTabActive: {
        flex: 1,
        height: '100%',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#C4681B'
    },
    tabTitle: {
        fontWeight: '400',
        fontSize: Const.FONT_SIZE.CONTENT_SIZE
    }
};

function mapStateToProps(state) {
    return {
        breakReducer: state.breakReducer,
        userReducer: state.userReducer,
        languageReducer: state.languageReducer,
        navigateReducer: state.navigateReducer
    };
}
Tabbar = connect(mapStateToProps)(Tabbar);

export default Tabbar;
