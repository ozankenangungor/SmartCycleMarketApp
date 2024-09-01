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
import { emailRegex } from 'app/utils/validator';
import { showMessage } from 'react-native-flash-message';
import client from 'app/api/client';
import { runAxiosAsync } from 'app/api/runAxiosAsync';

interface Props {}


const ForgetPassword : FC <Props> =   ( props ) => {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>()

  const handleSubmit = async () => {
    if(!emailRegex.test(email)) return showMessage({message: 'Invalid email', type:'danger'});

    setBusy(true)

    const response =  await runAxiosAsync<{message: string}>(client.post('/auth/forget-pass', {email}))

    setBusy(false)

    if(response) return showMessage({message: response.message, type:'success'});
  }
  return (

    <KeyboardAvoidingView style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={30} > 
    <ScrollView>

      <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
    <WelcomeHeader/>

    <View style={styles.formContainer}>

      <FormInput placeholder='Email' keyboardType='email-address' autoCapitalize='none'
      value={email} onChangeText={text => setEmail(text)} />

      <AppButton title={busy ? 'Please Wait...' : 'Request Link'} onPress={handleSubmit} active={!busy} />

      <FormDivider/>

      <FormNavigator leftTitle='Sign Up' rightTile='Sign In'
      onLeftPress={() => navigation.navigate('SignUp')}
      onRightPress={() => navigation.navigate('SignIn')} />
      </View>
    </View>
      </CustomKeyAvoidingView>

    </ScrollView>
     </KeyboardAvoidingView>

  );
};

export default ForgetPassword;



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