import {View,StyleSheet, Pressable, Text} from 'react-native'
import {FC} from 'react';
import colors from 'app/utils/colors';

interface Props {
    title: string;
    active?: boolean;
    onPress?(): void

}


const AppButton: FC<Props> = ({title, active = true , onPress}) => {
  return (

    <Pressable style={[styles.button, active ? styles.btnActive : styles.btnDeactive]}
     onPress={active ? onPress : null}>

        <Text style={styles.title}>{title}</Text>

    </Pressable>

  );
};


const styles = StyleSheet.create({
button: {
    padding:10,
    borderRadius:5,
    alignItems:'center'
},
btnActive:{
    backgroundColor: colors.primary,
},
btnDeactive: {
    backgroundColor: colors.deActive
},
title:{
    color: colors.white,
    fontWeight:'700',
    letterSpacing:1
}

});

export default AppButton;