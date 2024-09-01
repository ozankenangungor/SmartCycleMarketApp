import { View, StyleSheet, Text } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';

interface Props {
    icon: JSX.Element,
    name: string
}

const CategoryOption: FC<Props> = ({icon, name}) => {

  return (
    <View style={styles.container}> 
          <View style={styles.icon}>{icon}</View>
          <Text style={styles.category}>{name}</Text>
          </View>
  );
};

const styles = StyleSheet.create({
  container:{
   flexDirection:'row',
   alignItems:'center'
  },
  icon: {
    transform: [{ scale: 0.7 }],
  },
  category: {
    color: colors.primary,
    paddingVertical: 10,
  }
 

});

export default CategoryOption;