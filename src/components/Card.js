import { TouchableOpacity, View, TextInput } from 'react-native';
import React from 'react';
import { Colors, Const, GlobalStyles } from '../helper';
import AppText from './AppText';

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClicked: false
        };
    }

    render() {
        const { style, title, isShadow, closed,doing, content, editable } = this.props;
        let titleBackgroundColor = Colors.MAIN_COLOR
        if (closed) {
          titleBackgroundColor = Colors.RED_COLOR
        }
        if (doing){
          titleBackgroundColor = Colors.GREEN_COLOR
        }
        return (
            <TouchableOpacity
                {...this.props}
                activeOpacity={1}
                style={[styles.containerStyle, GlobalStyles.shadowStyle, style]}
            >
                <View style={[styles.titleContainer, { backgroundColor: titleBackgroundColor }]}>
                    <AppText text={title} style={styles.title} />
                </View>
                <View style={styles.contentContainer}>
                    <TextInput editable={editable} style={styles.contentStyle} value={content} />
                </View>
            </TouchableOpacity>
        );
    }
}

let styles = {
    containerStyle: {
        width: 60,
        height: 40,
        marginHorizontal: 8,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Colors.WHITE_COLOR
    },
    contentStyle: {
        width: '100%',
        height: 20,
        textAlign: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        backgroundColor: Colors.WHITE_COLOR,
        width: '100%'
    },
    titleContainer: {
        height: 20,
        width: '100%',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: Const.FONT_SIZE.INFO_SIZE
    }
};
