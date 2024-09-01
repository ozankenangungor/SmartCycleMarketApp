import { View, StyleSheet, FlatList, Text, Pressable } from 'react-native';
import { FC, useEffect, useState } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import ProductImage from '@ui/ProductImage';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import { getListings, Product, updateListings } from 'app/store/listings';
import { useDispatch, useSelector } from 'react-redux';

interface Props {

}

type ListingResponse = {
  products: Product[] 

}
const Listings: FC<Props> = (props) => {
  // const [listings, setListings] = useState<Product[]>([])
  const [fetching, setFetching] = useState(false)

  const {authClient} = useClient()
  
  const navigation = useNavigation<NavigationProp<ProfileNavigatorParamList>>()

  const dispatch = useDispatch()
  const listings = useSelector(getListings)

  const fetchListings = async () => {
        setFetching(true)
        const res = await runAxiosAsync<ListingResponse>(authClient.get('/product/listings'))
        setFetching(false)
        if(res) dispatch(updateListings(res.products));
  }

  useEffect(() => {
    fetchListings()
  },[])
  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton/>}/>

      <FlatList data={listings} renderItem={({item})=>{
        return (
          <Pressable style={styles.listItem} onPress={() => navigation.navigate('SingleProduct', {product: item})}>
            <ProductImage uri={item.thumbnail}/>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          </Pressable>
        )
      }}  keyExtractor={(item) => item.id} contentContainerStyle={styles.flatList} refreshing={fetching} onRefresh={fetchListings}/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  listItem: {
    paddingBottom: 15,
  },
  flatList: {
    paddingBottom: 20,
  },
  productName: {
    fontWeight: '500',
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10
  }
});

export default Listings;