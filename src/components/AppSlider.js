import React from "react";
import Slider from "react-native-slider";
import { ICON } from "../assets";
import { Colors } from "../helper";

const AppSlider = (props = { onSlidingComplete, value, disabled }) => {
    let { value, onSlidingComplete = () => {}, disabled = false } = props;
    return (
        <Slider
            onSlidingComplete={e => onSlidingComplete(e)}
            thumbTintColor="transparent"
            minimumValue={0}
            step={5}
            disabled={disabled}
            maximumTrackTintColor="#fdebdc"
            minimumTrackTintColor={Colors.MAIN_COLOR}
            maximumValue={100}
            value={value}
            thumbImage={ICON.STAR}
            thumbStyle={styles.thumbStyle}
            trackStyle={styles.trackStyle}
        />
    );
};

const styles = {
    thumbStyle: {
        width: 20,
        height: 20,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1
    },
    trackStyle: {
        height: 14,
        borderRadius: 7
        // backgroundColor: "#9ee1f2",
    }
};

export default AppSlider;
