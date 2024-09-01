import {View,StyleSheet, DimensionValue, ColorValue} from 'react-native'
import {FC} from 'react';
import colors from 'app/utils/colors';

interface Props {
  width?: DimensionValue;
  height?: DimensionValue,
  backgroundColor?: ColorValue

}


const FormDivider: FC<Props> = ({width = '50%', height = 2, backgroundColor = colors.deActive}) => {
  return (

    <View style={[styles.container, {width, height, backgroundColor}]} />

  );
};


const styles = StyleSheet.create({
container: {
  alignSelf:'center',
  marginVertical:30
 }

});

export default FormDivider;