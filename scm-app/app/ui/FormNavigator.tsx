import {View,StyleSheet, Pressable, Text} from 'react-native'
import {FC} from 'react';
import colors from 'app/utils/colors';

interface Props {
    leftTitle: string;
    rightTile: string;
    onLeftPress(): void;
    onRightPress(): void;
}


const FormNavigator: FC<Props> = ({leftTitle, rightTile, onLeftPress, onRightPress}) => {
  return (
    <View style={styles.container} > 
    <Pressable onPress={onLeftPress} >
        <Text style={styles.title}>{leftTitle}</Text>
    </Pressable>
    <Pressable onPress={onRightPress} >
        <Text style={styles.title} >{rightTile}</Text>
    </Pressable>
     </View>

  );
};


const styles = StyleSheet.create({
container: { 
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
 },
 title:{
    color: colors.primary,
    marginHorizontal:10
 }

});

export default FormNavigator;