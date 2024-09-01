import { View, StyleSheet, Pressable } from 'react-native';
import { FC } from 'react';
import {AntDesign} from '@expo/vector-icons'
import colors from '@utils/colors';
import LottieView from 'lottie-react-native';

interface Props {
    onPress?(): void;
    busy?: boolean;
}

const ChatIcon: FC<Props> = ({onPress, busy}) => {
    if(busy) return(
        <View style={styles.common}>
            <View style={styles.flex1} >
                <LottieView style={styles.flex1} source={require('../../assets/loading_2.json')}
                autoPlay loop/>
            </View>
        </View>
    )

  return (
    <Pressable style={[styles.common, styles.messageOpener]} onPress={onPress}>
    <AntDesign name="message1" size={20} color={colors.white} />
    </Pressable>

  );
};

const styles = StyleSheet.create({
    common: {
        width: 50,
        height: 50,
        bottom: 20,
        right: 50,
        position: 'absolute',
    },
    messageOpener: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: colors.active, 
      },
      flex1: {
        flex: 1
      }
});

export default ChatIcon;