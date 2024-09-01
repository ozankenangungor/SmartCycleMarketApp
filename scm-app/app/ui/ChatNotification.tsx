import { View, StyleSheet, Pressable } from 'react-native';
import { FC } from 'react';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '@utils/colors';
interface Props {
    indicate?: boolean
    onPress?(): void
}

const ChatNotification: FC<Props> = ({indicate, onPress}) => {

  return (
    <Pressable style={styles.container} onPress={onPress} >
        <MaterialCommunityIcons name='message' size={24} color={indicate ? colors.active : colors.primary} />
        {indicate && <View style={styles.indicator}/>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    position: 'relative',
  },
  indicator: {
    width: 15,
    height: 15,
    backgroundColor: colors.active,
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    right: 10,
    borderWidth: 2,
    borderColor: colors.white
  }
});

export default ChatNotification;