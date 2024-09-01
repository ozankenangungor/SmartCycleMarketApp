import { View, StyleSheet, Pressable } from 'react-native';
import { FC } from 'react';
import {Ionicons} from '@expo/vector-icons'
import colors from '@utils/colors';


interface Props {
    onPress?(): void;
    visible?: boolean;
}

const OptionButton: FC<Props> = ({onPress, visible}) => {
    if(!visible) return null;
  return (
    <Pressable onPress={onPress}>
    <Ionicons name='ellipsis-vertical-sharp' color={colors.primary} size={20}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {

  }
});

export default OptionButton;