import { View, StyleSheet, Text, ScrollView } from "react-native";
import { FC, useEffect, useState } from "react";
import ChatNotification from "@ui/ChatNotification";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "app/navigator/AppNavigator";
import SearchBar from "@components/SearchBar";
import CategoryList from "@components/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "@components/LatestProductList";
import useClient from "app/hooks/useClient";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import socket, { handleSocketConnection } from "app/socket";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { addNewActiveChats, getUnreadChatsCount } from "app/store/chats";

interface Props {}

type ActiveChat = {
  id: string;
  lastMessage: string;
  timestamp: string;
  unreadChatCounts: number;
  peerProfile: {
      id: string;
      name: string;
      avatar?: string;
  }
}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatsCount)

  const fetchLatestProduct = async () => {
    const response = await runAxiosAsync<{ products: LatestProduct[] }>(authClient.get("/product/latest"));
    if (response?.products) setProducts(response.products);
  };

 
  const fetchLastChats = async () => {
    const response = await runAxiosAsync<{chats: ActiveChat[]}>(authClient('/conversation/last-chats'))
    if(response) dispatch(addNewActiveChats(response.chats))
 }


 useEffect(() => {
  const handleApiRequest = async () => {
    await fetchLatestProduct()
    await fetchLastChats()
  }
  handleApiRequest()
 },[])


  //socket
  useEffect(() => {
    if(authState.profile) handleSocketConnection(authState.profile, dispatch);

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <ChatNotification onPress={() => navigation.navigate("Chats")} indicate={totalUnreadMessages > 0} />
      <ScrollView style={styles.container}>
        <SearchBar />
        <CategoryList onPress={(category) =>navigation.navigate("ProductList", { category })}/>
        <LatestProductList data={products} onPress={({ id }) => navigation.navigate("SingleProduct", { id })}/>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
});
export default Home;
