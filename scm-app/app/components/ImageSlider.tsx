import { View, StyleSheet, FlatList, Text, ViewToken } from 'react-native';
import { FC, useRef, useState } from 'react';
import ProductImage from '@ui/ProductImage';
import colors from '@utils/colors';

interface Props {
    images?: string[];
}

const ImageSlider: FC<Props> = ({images}) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const viewableConfig = useRef({itemVisiblePercentThreshold: 10})

    const onViewableItemsChanged = useRef((info: {viewableItems: ViewToken[]; changed: ViewToken[]}) => {
        setActiveIndex(info.viewableItems[0].index || 0)
    })

    if(!images?.length) return null;
  return (
    <View style={styles.container}>

        <FlatList contentContainerStyle={styles.flatList} data={images} renderItem={({item}) => <ProductImage uri={item}/>} 
        horizontal showsHorizontalScrollIndicator={false} pagingEnabled 
        viewabilityConfig={viewableConfig.current} onViewableItemsChanged={onViewableItemsChanged.current}/>

        <View style={styles.indicator}>
            <Text style={styles.indicatorText}>{activeIndex + 1} / {images?.length}</Text>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  flatList: {
    position: 'relative'
  },
  indicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 35,
    height: 25,
    backgroundColor: colors.backDropDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
    
  },
  indicatorText: {
    fontWeight: 'bold',
    color: colors.white
  }
});

export default ImageSlider;