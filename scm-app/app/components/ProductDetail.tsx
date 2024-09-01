import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { FC } from 'react';
import { formatDate } from '@utils/date';
import AvatarView from '@ui/AvatarView';
import colors from '@utils/colors';
import { formatPrice } from '@utils/helper';
import ImageSlider from './ImageSlider';
import { Product } from 'app/store/listings';

interface Props {
    product: Product
}

const ProductDetail: FC<Props> = ({product}) => {

  return (
    <View style={styles.container}>

        <ScrollView >

        {/* Images */}
        <ImageSlider images={product.image}/>

        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.date}>Purchased on: {formatDate(product.date, '^dd LLL yyyy')}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.profileContainer}>
            <AvatarView uri={product.seller.avatar} size={60}/>
            <Text style={styles.profileName}>{product.seller.name}</Text>
        </View>

    </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  category: {
    marginTop: 15,
    color: colors.primary,
    fontWeight: "bold",

  },
  price: {
    marginTop: 5,
    color: colors.active,
    fontWeight: 'bold',
    fontSize: 20
  },
  date: {
    marginTop: 5,
    color: colors.active,
    fontWeight: 'bold',
  },
  name: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 1,
    fontWeight: 'bold',
    fontSize: 20
  },
  description: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 0.5
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  profileName: {
    paddingLeft: 15,
    color: colors.primary,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    fontSize : 20,
  }
});

export default ProductDetail;