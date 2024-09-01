import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';

export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: "TRY"
    }).format(amount)
}

export const selectImages = async (options?: ImagePicker.ImagePickerOptions) => {
  let result: string[] = [];
  try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.3,
          ...options
      });

      if (assets) {
          result = assets.map(({ uri }) => uri);
      }
  } catch (error) {
      console.error('Error selecting images:', error);
      showMessage({ message: 'An error occurred while selecting images.', type: 'danger' });
  }

  return result;
};