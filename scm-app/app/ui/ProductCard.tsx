import { View, StyleSheet, Text, Pressable, Image } from 'react-native';
import { FC } from 'react';
import GridView from '@ui/GridView';
import colors from '@utils/colors';
import { formatPrice } from '@utils/helper';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { LatestProduct } from '@components/LatestProductList';
interface Props {
    product: LatestProduct;
    onPress(item: LatestProduct): void;
}

const ProductCard: FC<Props> = ({product, onPress}) => {

  return (
            <Pressable style={styles.productContainer} onPress={() => onPress(product)}>
                { product.thumbnail ? <Image source={{uri: product.thumbnail}} style={styles.thumbnail}/>
               :<View style={[styles.thumbnail, styles.noImageView]}><MaterialCommunityIcons name='image-off' size={34} color={colors.primary}/>
               </View> }
                <Text style={styles.price}>{formatPrice(product.price)}</Text>
               <Text style={styles.name}>{product.name}</Text>
            </Pressable>
  );
};

const styles = StyleSheet.create({
    productContainer: {
      padding: 7
    },
    thumbnail: {
      width: '100%',
      height: 100,
      borderRadius: 5
    },
    noImageView: {
      backgroundColor: colors.deActive,
      alignItems: 'center',
      justifyContent: 'center'
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.active,
      paddingTop: 5
    }
  });

export default ProductCard;