import React, {Dispatch, SetStateAction, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableHighlight} from "react-native";

import COLORS from "../colors";
import { Option } from "../screens/Gamble";

interface SelectionProps {
    onPress(): void;
    text: Option;
    style?: object;
    selected?: Option;
}

export const SelectionButton: React.FC<SelectionProps> = ({onPress, text, style=null, selected}) => {

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, selected == text  ? {backgroundColor: COLORS.secondary} : {}]}>
                <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )

}

interface Props {
    onPress(): void;
    text: string;
}
export const DefaultButton: React.FC<Props> = ({onPress, text}) => {
    
        return (
            <TouchableHighlight onPress={onPress} style={[styles.button]} underlayColor={COLORS.secondary}>
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
        height: 50,
        width: "30%",
        justifyContent: 'center',

    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    }
})
