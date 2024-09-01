import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { FC } from 'react';

interface Props {
    uri?: string
}
const width = Dimensions.get('screen').width
const imageWidth = width - 15 * 2

const ProductImage: FC<Props> = ({uri}) => {

  return (
    <Image source={{uri}} style={styles.image} resizeMethod='resize' resizeMode='cover'/>
  );
};

const styles = StyleSheet.create({
  image: {
    width: imageWidth,
    height: imageWidth / (16 / 9),
    borderRadius: 7,
  }
});

export default ProductImage;