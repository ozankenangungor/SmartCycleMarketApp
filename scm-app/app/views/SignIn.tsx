import {View,StyleSheet, Text, Image, SafeAreaView, Platform, StatusBar, TextInput, KeyboardAvoidingView, ScrollView} from 'react-native'
import {FC, useState} from 'react';
import WelcomeHeader from 'app/ui/WelcomeHeader';
import colors from 'app/utils/colors';
import FormInput from '@ui/FormInput';
import AppButton from '@ui/AppButton';
import FormDivider from '@ui/FormDivider';
import FormNavigator from '@ui/FormNavigator';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import {  NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'app/navigator/AuthNavigator';
import { newUserSchema, signInSchema, yupValidate } from 'app/utils/validator';
import { showMessage } from 'react-native-flash-message';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import axios from 'axios';
import client from 'app/api/client';
import { useDispatch } from 'react-redux';
import { updateAuthState } from 'app/store/auth';
import useAuth from 'app/hooks/useAuth';

interface Props {}


const SignIn : FC <Props> =  ( props ) => {
  const navigation = useNavigation <NavigationProp<AuthStackParamList>> ()
  const [userInfo, setUserInfo] = useState({ email: "", password: "" })
  const {email, password} = userInfo
  const {signIn} = useAuth()

  const handleSubmit = async () => {
    const {values, error} = await yupValidate(signInSchema, userInfo)
    if(error) return showMessage({message: error, type:'danger'});

    if(values) signIn(values);
  }

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({...userInfo, [name]: text})
  }

  return (

  <CustomKeyAvoidingView>
    
    <View style={styles.innerContainer}>
      <WelcomeHeader/>
  
      <View style={styles.formContainer}>
  
        <FormInput placeholder='Email' keyboardType="email-address"autoCapitalize='none' onChangeText={handleChange("email")} value={email} />

        <FormInput placeholder='Password' keyboardType='email-address' autoCapitalize='none' onChangeText={handleChange('password')} 
        value={password} />
  
        <AppButton title="Sign in"  onPress={handleSubmit}   />
  
        <FormDivider/>
  
        <FormNavigator leftTitle='Forget Password' rightTile='Sign Up' 
        onLeftPress={() => navigation.navigate('ForgetPassword')}
        onRightPress={() => navigation.navigate('SignUp')} />
        
      </View>
  
      </View>
  </CustomKeyAvoidingView>

  );
};

export default SignIn;



const styles = StyleSheet.create({
container: {
  flex:1
},


formContainer: {
  marginTop:30,
  
},
innerContainer: {
  padding:15,
  flex:1
}

});