import {View,StyleSheet, Text, Image, SafeAreaView, Platform, StatusBar, TextInput, KeyboardAvoidingView, ScrollView} from 'react-native'
import {FC, useState} from 'react';
import WelcomeHeader from 'app/ui/WelcomeHeader';
import colors from 'app/utils/colors';
import FormInput from '@ui/FormInput';
import AppButton from '@ui/AppButton';
import FormDivider from '@ui/FormDivider';
import FormNavigator from '@ui/FormNavigator';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'app/navigator/AuthNavigator';
import { newUserSchema, yupValidate } from 'app/utils/validator';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import { showMessage } from 'react-native-flash-message';
import client from 'app/api/client';
import useAuth from 'app/hooks/useAuth';



interface Props {}


const SignUp : FC <Props> =  ( props ) => {
  const [userInfo, setUserInfo] = useState({name: '', email: '', password: ''})
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()
  const {email, name, password} = userInfo;
  const [busy, setBusy] = useState(false)
  const {signIn} = useAuth()

  const handleChange = (name: string) => (text: string) => {
    setUserInfo({...userInfo, [name]: text})
  }

  const handleSubmit = async () => { 
    const {values, error} = await yupValidate(newUserSchema, userInfo);

    if(error) return showMessage({message: error, type: 'danger'});
    
    setBusy(true);

    const res = await runAxiosAsync<{message: string}>(client.post("/auth/sign-up", values));

    if(res?.message) {
      showMessage({message: res.message, type:"success"})
      signIn(values!)
    }
    setBusy(false)
  }

  return (
<CustomKeyAvoidingView>
<View style={styles.innerContainer}>
    <WelcomeHeader/>

    <View style={styles.formContainer}>

      <FormInput placeholder='Name' value={name} onChangeText={handleChange("name")} />
      <FormInput placeholder='Email' keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={handleChange("email")} />
      <FormInput placeholder='Password' secureTextEntry value={password} 
      onChangeText={handleChange("password")}/>

      <AppButton title="Sign Up" active={!busy} onPress={handleSubmit} />

      <FormDivider/>

      <FormNavigator leftTitle='Forget Password' rightTile='Sign In'
      onLeftPress={() => navigation.navigate('ForgetPassword')}
      onRightPress={() => navigation.navigate('SignIn')} />
      </View>
    </View>
</CustomKeyAvoidingView>
  );
};

export default SignUp;



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

