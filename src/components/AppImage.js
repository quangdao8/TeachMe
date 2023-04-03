// import React from 'react';
// import FastImage from 'react-native-fast-image';

// export default class HeaderPopup extends React.PureComponent {
//     render() {
//         const { style, source } = this.props;
//         return <FastImage style={style} source={source} resizeMode={FastImage.resizeMode.stretch} {...this.props} />;
//     }
// }

import React from "react";
import FastImage from "react-native-fast-image";
import { View, ActivityIndicator } from "react-native";

export default class AppImage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    render() {
        const { style, source, resizeMode = FastImage.resizeMode.contain, local = false, imageStyle = {} } = this.props;
        const { isLoading } = this.state;
        if (local) {
            return (
                <FastImage
                    style={style}
                    source={source}
                    resizeMode={resizeMode}
                    onLoad={() => this.setState({ isLoading: false })}
                    {...this.props}
                />
            );
        }
        return (
            <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
                <FastImage
                    style={imageStyle}
                    source={source}
                    resizeMode={resizeMode}
                    onLoad={() => this.setState({ isLoading: false })}
                    onLoadStart={() => this.setState({ isLoading: true })}
                    {...this.props}
                />
                {isLoading && (
                    <View
                        style={[
                            {
                                position: "absolute",
                                zIndex: 3,
                                backgroundColor: "rgba(0,0,0,0.3)",
                                minHeight: 30,
                                minWidth: 30,
                                justifyContent: "center",
                                alignItems: "center"
                            },
                            style
                        ]}
                    >
                        <ActivityIndicator color="#fff" style={{ zIndex: 5 }} animating={true} />
                    </View>
                )}
            </View>
        );
    }
}
