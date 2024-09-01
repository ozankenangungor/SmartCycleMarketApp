import { View, StyleSheet, Pressable } from 'react-native';
import { FC } from 'react';
import { useNavigation } from '@react-navigation/native';

interface Props {
    center?: JSX.Element | null;
    right?: JSX.Element | null;
    backButton?: JSX.Element | null;
}

const AppHeader: FC<Props> = ({center, right, backButton}) => {
    const {goBack, canGoBack} = useNavigation()

  return (
    <View style={styles.container}>

        {/* back button */}
        {canGoBack() && <Pressable onPress={goBack}>{backButton}</Pressable>}

        {/* center ui */}
            {center}

        {/* right ui */}
            {right}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  }
});

export default AppHeader;