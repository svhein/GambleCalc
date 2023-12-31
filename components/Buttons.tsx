import React, {Dispatch, SetStateAction, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableHighlight} from "react-native";

import COLORS from "../colors";
import { Options } from "../screens/GambleScreen";

interface SelectionProps {
    onPress(): void;
    text: Options;
    style?: object;
    selected?: Options;
}

export const SelectionButton: React.FC<SelectionProps> = ({onPress, text, style=null, selected}) => {

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style, selected == text  ? {backgroundColor: COLORS.secondary} : {}]}>
                <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )

}

interface Props {
    onPress(): void;
    text: string;
    style?: object;
}
export const DefaultButton: React.FC<Props> = ({onPress, text, style}) => {
    
        return (
            <TouchableHighlight onPress={onPress} style={[styles.button, style]} underlayColor={COLORS.secondary}>
                    <Text style={styles.buttonText}>{text}</Text>
            </TouchableHighlight>
        )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: "30%",
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: "Play-Bold"
    }
})
