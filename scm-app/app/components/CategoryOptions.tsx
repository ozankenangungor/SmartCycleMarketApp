import { View, StyleSheet } from 'react-native';
import { FC, useState } from 'react';
import OptionSelector from '@views/OptionSelector';
import OptionModal from './OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';

interface Props {
    title: string;
    onSelect(category: string): void;
}

const CategoryOptions: FC<Props> = ({title, onSelect}) => {
    const [showCategoryModal, setShowCategoryModal] = useState(false)

  return (
    <View style={styles.container}>

     <OptionSelector title={title} onPress={() => setShowCategoryModal(true)}/>
        

     <OptionModal 
      visible={showCategoryModal}
      onRequestClose={setShowCategoryModal} 
      options={categories} 
      renderItem={(item) => {
          return <CategoryOption {...item} /> 
         }} 
      onPress={(item) => onSelect(item.name) }  />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  }
});

export default CategoryOptions;