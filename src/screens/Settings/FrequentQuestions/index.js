import React from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Colors, Const } from "helper";
import { AppText } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { Spinner } from "native-base";
import WebView from "react-native-webview";
const _ = require("lodash");
const SECTIONS = [
    {
        title:
            "1. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title:
            "2. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it, making it look?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "3. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "4. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "5. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "6. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "7. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        title: "8. It is a long established fact that a reader will be distracted by?",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
];

class FrequentQuestions extends React.Component {
    constructor(props) {
        const drawer = props.navigation.getParam("drawer");
        super(props);
        this.state = {
            activeSections: [],
            loading: true
        };
        this.drawer = drawer == "drawer";
        this.url = { uri: "https://github.com/facebook/react-native" };
    }

    componentDidMount() {
        setTimeout(() => {
            // this.updateMoney();
            this.setState({ loading: false });
        }, 500);
    }

    _renderHeader = (section, index, isActive) => {
        return (
            <View style={styles.header}>
                <AppText style={[styles.headerText, isActive ? { color: "blue" } : null]} text={section.title} />
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.content}>
                <AppText style={styles.contentText} text={section.content} />
            </View>
        );
    };

    _renderFooter = () => {
        return <View style={{ borderBottomColor: Colors.WHITE_COLOR, borderBottomWidth: 2 }} />;
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    renderLoading() {
        return <Spinner color="#000" />;
    }

    render() {
        let { activeSections, loading } = this.state;
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <HeaderApp title={I18n.t("settings.frequentQeustions")} isBack={!this.drawer} navigation={navigation} />
                {/* <ScrollView style={styles.body}>
                    <View style={styles.view} />
                    <Accordion
                        sections={SECTIONS}
                        activeSections={activeSections}
                        // renderSectionTitle={this._renderSectionTitle}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        renderFooter={this._renderFooter}
                        onChange={this._updateSections}
                        underlayColor="transparent"
                    />
                </ScrollView> */}
                <View style={styles.webview}>
                    {!loading && (
                        <WebView
                            style={{ width: Const.DEVICE.DEVICE_WIDTH }}
                            renderLoading={() => this.renderLoading()}
                            scalesPageToFit
                            source={this.url}
                            onNavigationStateChange={() => {}}
                        />
                    )}
                    {loading && this.renderLoading()}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer,
        userReducer: state.userReducer
    };
}
FrequentQuestions = connect(mapStateToProps)(FrequentQuestions);
export default FrequentQuestions;
