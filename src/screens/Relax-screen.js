import React from "react";
import  styled  from 'styled-components/native';
import { SafeArea} from "../utils/safe-areacomponent";
import {Text, View} from "react-native"


export const RelaxScreen = () => {
    return (
        <SafeArea>
            <View>
                <Text> Relax Screen </Text>
            </View>
        </SafeArea>
    )
}