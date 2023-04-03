import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import {Colors } from '../helper';

export default class AppImage extends React.PureComponent {
    render() {
        const { title } = this.props;
        return (
            <View style={styles.headerPopUp}>
                <View style={{ width: 30, height: 30, borderRadius: 5, backgroundColor: Colors.MAIN_COLOR }} />
                <AppText style={{ fontWeight: '700', fontSize: 25, marginLeft: 16 }} text={title} />
            </View>
        );
    }
}
const styles = {
    headerPopUp: {
        width: '90%',
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 40,
        alignSelf: 'center',
        flexDirection: 'row'
    }
};
