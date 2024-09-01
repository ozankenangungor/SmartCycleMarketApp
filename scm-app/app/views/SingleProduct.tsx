import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import ProductDetail from '@components/ProductDetail';
import useAuth from 'app/hooks/useAuth';
import colors from '@utils/colors';
import OptionButton from '@ui/OptionButton';
import OptionModal from '@components/OptionModal';
import { Feather,AntDesign } from "@expo/vector-icons";
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@ui/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deleteItem, Product } from 'app/store/listings';
import client from 'app/api/client';
import ChatIcon from '@components/ChatIcon';



type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'SingleProduct'>

const menuOptions = [
  {
    name: "Edit",
    icon: <Feather name="edit" size={20} color={colors.primary} />,
  },
  {
    name: "Delete",
    icon: <Feather name="trash-2" size={20} color={colors.primary} />,
  },
];

const SingleProduct: FC<Props> = ({route, navigation}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [busy, setBusy] = useState(false)
  const [fetchingChatId, setFetchingChatId] = useState(false)
  const {product, id} = route.params
  const {authState} = useAuth()
  const {authClient} = useClient()
  const dispatch = useDispatch()
  const [productInfo, setProductInfo] = useState<Product>()

  const isAdmin = authState.profile?.id === productInfo?.seller.id

  const onDeletePress = () => {
    Alert.alert('Are you sure?', 'This action will remove this product permanently', [{text: "Delete", style:'destructive', onPress: confirmDelete}, {text: 'Cancel', style: "cancel"}])
  }

  const confirmDelete = async () => {
    if(!product?.id) return;

    setBusy(true)

    const res = await runAxiosAsync<{message: string}>(authClient.delete(`/product/${product.id}`))

    setBusy(false)
    
    if(res?.message){ 
    dispatch(deleteItem(product?.id))
    showMessage({message: res.message, type: 'success'})
    navigation.navigate('Listings')
    }
  }

  const fetchProductInfo = async (id: string) => {
    const response = await runAxiosAsync<{product: Product}>(authClient(`/product/detail/${id}`))
    if(response) setProductInfo(response.product)
  }

  useEffect(() => {
    if(id) fetchProductInfo(id);

    if(product) setProductInfo(product);

  },[id, product])

  const onChatBtnPress = async () => {
    if(!productInfo) return;
    setFetchingChatId(true)
    const res = await runAxiosAsync<{conversationId: string}>(authClient.get(`/conversation/with/${productInfo.seller.id}`))
    setFetchingChatId(false)
    if(res) navigation.navigate('ChatWindow', {conversationId: res.conversationId, peerProfile: productInfo.seller })
  }
 
  return (
    <>

    <AppHeader backButton={<BackButton/>} right={<OptionButton visible={isAdmin} onPress={() => setShowMenu(true)}/>}/>

    <View style={styles.container}>
    {productInfo ? <ProductDetail product={productInfo}/> : <></>}

    {!isAdmin && <ChatIcon onPress={onChatBtnPress} busy={fetchingChatId}/>}

    </View>

    <OptionModal visible={showMenu} onRequestClose={setShowMenu} options={menuOptions} 
    renderItem={({icon, name}) =>
    <View style={styles.option}>
      {icon}
    <Text style={styles.optionTitle}>{name}</Text>
    </View>} 
     
     onPress={(option) => {
      if(option.name === 'Delete') onDeletePress() ; 
      if(option.name === 'Edit') navigation.navigate('EditProduct', {product: product!})
     }}/>

     <LoadingSpinner visible={busy}/>

    </> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary
  },
 
});

export default SingleProduct;

