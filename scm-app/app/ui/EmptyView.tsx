import { View, StyleSheet, Text } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';

interface Props {
    title: string;
}

const EmptyView: FC<Props> = ({title}) => {

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: colors.active,
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.6
  }
});

export default EmptyView;