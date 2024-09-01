import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { FC, useState } from 'react';
import AppHeader from '@components/AppHeader';
import BackButton from '@ui/BackButton';
import colors from '@utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileNavigatorParamList } from 'app/navigator/ProfileNavigator';
import HorizontalImageList from '@components/HorizontallImageList';
import {FontAwesome5} from '@expo/vector-icons'
import FormInput from '@ui/FormInput';
import DatePicker from '@ui/DatePicker';
import OptionSelector from './OptionSelector';
import OptionModal from '@components/OptionModal';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { selectImages } from '@utils/helper';
import CategoryOptions from '@components/CategoryOptions';
import AppButton from '@ui/AppButton';
import { newProductSchema, yupValidate } from '@utils/validator';
import { showMessage } from 'react-native-flash-message';
import mime from 'mime'
import LoadingSpinner from '@ui/LoadingSpinner';
import deepEqual from 'deep-equal';

type  Props =  NativeStackScreenProps<ProfileNavigatorParamList, "EditProduct">

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date; 
  } 

const imageOptions = [
    { value: "Use as thumbnail", id: "thumb"},
    { value: "Remove Image", id: "remove"},
]

const EditProduct: FC<Props> = ({route}) => {
    const productInfoToUpdate = {...route.params.product, price: route.params.product?.price.toString(), date: new Date(route.params.product?.date!)}
    const [product, setProduct] = useState({...productInfoToUpdate})

    const [selectedImage, setSelectedImage] = useState('')
    const [showImageOptions, setShowImageOptions] = useState(false)

    const [busy, setBusy] = useState(false)

    const {authClient} = useClient()

    const isFormChanged = deepEqual(productInfoToUpdate, product)


    const onLongPress = (image: string) => {
        setSelectedImage(image)
        setShowImageOptions(true)
    }

    const removeSelectedImage = async () => {
        const notLocalImage = selectedImage.startsWith('https://res.cloudinary.com');

        const images = product.image
        const newImages = images?.filter(img => img !== selectedImage)
        setProduct({...product, image: newImages})

        if(notLocalImage) {
            const splittedItems = selectedImage.split('/')
            const imageId = splittedItems[splittedItems.length -1 ].split(".")[0]
            await runAxiosAsync(authClient.delete(`/product/image/${product?.id}/${imageId}`))
        }
    }

    const handleOnImageSelect = async () => {

    const newImages = await selectImages()
    const oldImages = product.image || []

    const images = oldImages.concat(newImages)
    
    setProduct({...product, image: [...images]})

    }

    const makeSelectedImageAsThumbnail = () => {
      if(selectedImage.startsWith("https://res.cloudinary.com")) {
        setProduct({...product, thumbnail: selectedImage})
      }
    }

    const handleOnSubmit = async () => {

      const dateToUpdate: ProductInfo = {
        name: product.name!,
        category: product.category!,
        description: product.description!,
        price: product.price!,
        purchasingDate: product.date,
       }
       
       const {error } = await yupValidate(newProductSchema, dateToUpdate)
       if(error) return showMessage({message: error, type:'danger'});

      const formData = new FormData()

      if(product.thumbnail) formData.append('thumbnail', product.thumbnail)
      
      type productInfoKeys = keyof typeof dateToUpdate
      
      for(let key in dateToUpdate) {
        const value = dateToUpdate[key as productInfoKeys]
        if(value instanceof Date) {
          formData.append(key, value.toISOString())
        }else {
        formData.append(key, value)
        }
      }


      product.image?.forEach((img, index) => {
        if(!img.startsWith('https://res.cloudinary.com')) { 
          formData.append('images', {
            uri: img,
            name: "image_" + index,
            type: mime.getType(img) || 'image/jpg'
          } as any)
        }}) 

      // send our new data to api
     setBusy(true)
     const response = await runAxiosAsync<{message: string}>(authClient.patch(`/product/${product.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
     }))
     setBusy(false)
     if(response) showMessage({message: response.message, type:'success'})
    }

    return (
    <>
    <AppHeader backButton={<BackButton/>}/>
    <View style={styles.container}>
        <ScrollView>
            <Text style={styles.title}>Images</Text>
            <HorizontalImageList images={product?.image || []} onLongPress={onLongPress}/>
            <Pressable style={styles.imageSelector} onPress={handleOnImageSelect}>
                <FontAwesome5 name='images' size={30} color={colors.primary} />
            </Pressable>

            <FormInput placeholder='Product name' value={product!.name} onChangeText={(name) => setProduct({...product, name})}/>
            <FormInput placeholder='Price' keyboardType="numeric" value={product.price!.toString()} onChangeText={(price) => setProduct({...product, price})}/>

            <DatePicker value={product.date!} title='Purchasing Date' onChange={(date) => setProduct({...product, date})}/>
            
            <CategoryOptions onSelect={(category) =>setProduct({...product, category})} title={product.category || "Category"}/>

            <FormInput placeholder='Description' value={product?.description} onChangeText={(description) => setProduct({...product, description})} />

            {!isFormChanged && <AppButton title='Update Product' onPress={handleOnSubmit}/>}
 
        </ScrollView>
    </View>

    <OptionModal visible={showImageOptions} onRequestClose={setShowImageOptions} options={imageOptions} renderItem={(option) => {
        return <Text style={styles.option}>{option.value}</Text>
    }} 
    
    onPress={({id}) => {
        if(id === 'thumb') makeSelectedImageAsThumbnail();
        if(id === 'remove') removeSelectedImage();
    }}/>

    <LoadingSpinner visible={busy}/>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
    marginBottom: 10
  },
  imageSelector: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 7,
    marginVertical: 1,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary
  }
});

export default EditProduct;