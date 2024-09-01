import { View, StyleSheet, FlatList, Image, Pressable, StyleProp, ViewStyle } from 'react-native';
import { FC } from 'react';

interface Props {
    images: string[];
    onPress?(item: string): void;
    onLongPress?(item: string): void;
    style?: StyleProp<ViewStyle>
}

const HorizontalImageList: FC<Props> = ({images, onPress, onLongPress, style}) => {

  return (
    
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={images} renderItem={({item}) => {
        return (
        <Pressable style={styles.listItem} 
         onPress={() => onPress && onPress(item)}
         onLongPress={() => onLongPress && onLongPress(item)}>
        <Image source={{uri: item}} style={styles.image} />
        </Pressable>
        )
      }} keyExtractor={(item) => item} contentContainerStyle={style}/>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: 'hidden'
  },
  image:  {
    flex:1
  }
});

export default HorizontalImageList;