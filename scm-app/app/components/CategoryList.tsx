import { View, StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { FC } from 'react';
import categories from '@utils/categories';
import colors from '@utils/colors';

interface Props {
    onPress(category: string): void;
}


const CategoryList: FC<Props> = ({onPress}) => {

  return (
    <View style={styles.container}>
        <FlatList horizontal data={categories} renderItem={({item}) => {
            return (
            <Pressable style={styles.listItem} onPress={() => onPress(item.name)}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text numberOfLines={2} style={styles.categoryName}>{item.name}</Text>
            </Pressable>)
        }} showsHorizontalScrollIndicator={false}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 20
  },
  listItem: {
    width: 80,
    marginRight: 20
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary 
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 2,
    color: colors.primary,
  }
});

export default CategoryList;