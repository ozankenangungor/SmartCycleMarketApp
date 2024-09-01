import { View, StyleSheet, Pressable, Text, FlatList, Image } from 'react-native';
import { FC, useState } from 'react';
import FormInput from '@ui/FormInput';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import colors from '@utils/colors';
import DatePicker from '@ui/DatePicker';
import OptionModal from '@components/OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';
import {AntDesign} from '@expo/vector-icons'
import AppButton from '@ui/AppButton';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import * as ImagePicker from 'expo-image-picker'
import { showMessage } from 'react-native-flash-message';
import HorizontalImageList from '@components/HorizontallImageList';
import { newProductSchema, yupValidate } from '@utils/validator';
import mime from 'mime'
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import LoadingSpinner from '@ui/LoadingSpinner';
import OptionSelector from './OptionSelector';
import { selectImages } from '@utils/helper';
import CategoryOptions from '@components/CategoryOptions';

interface Props {

}

const defaultInfo = {
  name: '',
  description: '',
  category: '',
  price: '',
  purchasingDate: new Date()
}

const imageOptions = [{
  value: "Remove Image",
  id: "remove"
}]

const NewListing: FC<Props> = (props) => {
  const [images, setImages] = useState<string[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [productInfo, setProductInfo] = useState({...defaultInfo})
  const [selectedImage, setSelectedImage] = useState('')
  const [busy, setBusy] = useState(false)
  const {authClient} = useClient()

  
  const {category, description, name, price, purchasingDate} = productInfo

  const handleChange = (name: string) => (text: string) => {
    return setProductInfo({...productInfo, [name]: text})
  }

  const handleSubmit = async () => {
   const {error} = await yupValidate(newProductSchema, productInfo)
   if(error) return showMessage({message: error, type:'danger'});

   setBusy(true)

   // submit this form
   const formData = new FormData()

   type productInfoKeys = keyof typeof productInfo

   for (let key in productInfo) {
    const value = productInfo[key as productInfoKeys]

    if (value instanceof Date) formData.append(key, value.toISOString());
    else formData.append(key, value);
   }

   // appending images
   const newImages = images.map((img, index) => ({
    name: 'image_' + index,
    type: mime.getType(img),
    uri: img
   }))

   for(let img of newImages) {
    formData.append('images', img as any)
   }

  const res = await runAxiosAsync<{message: string}>(authClient.post('/product/list', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }))

  setBusy(false)
  
  if(res) {
    showMessage({message: res.message, type:'success'})
    setProductInfo({...defaultInfo})
    setImages([])

  }
  //  formData.append("name", productInfo.name)
  //  formData.append("category", productInfo.category)
  }

  const handleOnImageSelection = async () => {
    
    const newImages = await selectImages()

    setImages([...images, ...newImages])

  }

  return (
    <CustomKeyAvoidingView>
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      <Pressable style={styles.fileSelector} onPress={handleOnImageSelection} >
        <View style={styles.iconContainer} > 
        <FontAwesome5 name="images" size={24} color="black" />
        </View>
        <Text style={styles.btnTitle} >Add Images</Text>
        </Pressable>

        <HorizontalImageList images={images} onLongPress={(item) => {
          setSelectedImage(item)
          setShowImageOptions(true)
        }}/>


       {/* <FlatList horizontal showsHorizontalScrollIndicator={false} data={images} renderItem={({item}) => {
          return <Image source={{uri: item}} style={styles.selectedImage} />
        }} keyExtractor={(item) => item}/>   */}

      </View>
 



        <FormInput value={name} placeholder='Product Name' onChangeText={handleChange('name')}/>

        <FormInput value={price} placeholder='Price' onChangeText={handleChange('price')} keyboardType='numeric'/>

        <DatePicker title='Purchasing Date: ' value={purchasingDate}
         onChange={(date) => setProductInfo({...productInfo, purchasingDate: date})} />

        <CategoryOptions onSelect={handleChange('category')} title={category || "Category"}/>

        <FormInput value={description} placeholder='Description' multiline numberOfLines={4} 
         onChangeText={handleChange('description')}/>
 
        <AppButton title="List Product" onPress={handleSubmit} />

      


        {/* Image Options */}
<       OptionModal visible={showImageOptions} onRequestClose={setShowImageOptions} options={imageOptions} 
         renderItem={(item) => {
          return (
            <Text style={styles.imageOption}>{item.value}</Text>
          )
         }} 
         onPress={(option) => {
          if(option.id === 'remove') {
            const newImages = images.filter(img => img !== selectedImage)
            setImages([...newImages])
          }
         } }  />


    </View>
    <LoadingSpinner visible={busy}/>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding:15,
    flex:1
  },
  imageContainer: {
    flexDirection: 'row'
  },
  btnTitle: {
    color:colors.primary,
    marginTop:5,
  },
  fileSelector: {
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    alignSelf:'flex-start'
  },
  iconContainer: {
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius:7
  },
  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5
  },
  categorySelector: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'100%',
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5
  },
  categoryTitle: {
    color: colors.primary
  },
  imageOption: {
    fontWeight: '600',
    fontSize: 18,
    color: colors.primary,
    padding: 10
  }
 
});

export default NewListing;


