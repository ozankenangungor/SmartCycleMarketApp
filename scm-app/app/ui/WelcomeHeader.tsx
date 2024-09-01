import {View,StyleSheet, SafeAreaView, Image, Platform, StatusBar, Text} from 'react-native'
import {FC} from 'react';
import colors from 'app/utils/colors';

interface Props {}

const heading = "Online MarketPlace for Used Goods";
const subHeading = "Buy or sell used goods with trust. Chat directly with sellers,ensuring  a"


const WelcomeHeader: FC<Props> = (props) => {
  return (

    <View style={styles.container} > 
    <Image source={require('assets/hero.png')} style={styles.image} resizeMode='contain' resizeMethod='resize'/>
    <Text style={styles.heading}>{heading}</Text>
    <Text style={styles.subHeading}>{subHeading}</Text>

     </View>

  );
};

export default WelcomeHeader;



const styles = StyleSheet.create({
    container: {
        padding:15,
    },
image: {
    width:250,
    height:250,
    marginLeft:40,
},
heading: {
    fontWeight:'600',
    fontSize:20,
    textAlign:'center',
    letterSpacing:1,
    marginBottom:5,
    color: colors.primary
},
subHeading: {
    fontSize:12,
    textAlign:'center',
    letterSpacing:1,
    marginBottom:5,
    color: colors.primary,
    lineHeight:14
}

});

