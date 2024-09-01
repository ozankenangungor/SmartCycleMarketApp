import { View, StyleSheet, Text } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';

interface Props {

}

const EmptyChatContainer: FC<Props> = (props) => {

  return (
    <View style={styles.container}>
        <View style={styles.messageContainer}>
        <Text style={styles.message}>Starting a conversation can be tough, but it's always rewarding! A simple 'hi' can open the door to a great chat—give it a try and see where it leads!</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    transform: [{rotate: "180deg"}, ]
  },
  messageContainer: {
    backgroundColor: colors.deActive,
    padding: 15,
    borderRadius: 5
  },
  message: {
    color: colors.active,
    fontSize: 12,
    textAlign: 'center'
  }
});

export default EmptyChatContainer;