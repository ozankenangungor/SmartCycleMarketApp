import { View, StyleSheet, Text, FlatList } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { AppStackParamList } from 'app/navigator/AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { LatestProduct } from '@components/LatestProductList';
import ProductGridView from '@components/ProductGridView';
import colors from '@utils/colors';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import EmptyView from '@ui/EmptyView';
import ProductCard from '@ui/ProductCard';

type Props =  NativeStackScreenProps<AppStackParamList, "ProductList">


const ProductList: FC<Props> = ({route, navigation}) => {
  const [products, setProducts] = useState<LatestProduct[]>([])
  const {category} = route.params
  const {authClient} = useClient()

  const col = 2
  const isOdd = products.length % col !== 0 

  const fetchProducts = async (category: string) => {
   const response = await runAxiosAsync<{products: LatestProduct[]}>(authClient.get(`/product/by-category/${category}`))
   if(response) setProducts(response?.products)
  }

  useEffect(() => {
    fetchProducts(category)
  },[category])

  if(!products.length) return <View style={styles.container}>
    <AppHeader backButton={<BackButton/>} center={<Text style={styles.title}>{category}</Text>}/>
    <EmptyView title='There is no product in this category!'/>
  </View>

  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton/>} center={<Text style={styles.title}>{category}</Text>}/>

      <FlatList numColumns={2} data={products} renderItem={({item, index}) => {
        return (
          <View style={{flex: isOdd && index === products.length -1 ? 1/col : 1}}>
            <ProductCard product={item} onPress={({id}) => navigation.navigate("SingleProduct",{id})}/>
          </View>
        )
      }
     } />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontWeight: '600',
    color: colors.primary,
    paddingBottom: 5,
    fontSize: 18

  }
});

export default ProductList;