import React from "react";
import  styled  from 'styled-components/native';
import { SafeArea} from "../utils/safe-areacomponent";
import {Text, View} from "react-native"


export const SleepScreen = () => {
    return (
        <SafeArea>
            <View>
                <Text> Sleep Screen </Text>
            </View>
        </SafeArea>
    )
}