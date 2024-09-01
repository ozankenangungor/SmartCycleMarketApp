import { View, StyleSheet, Modal, ScrollView, Text, Pressable } from 'react-native';
import { FC } from 'react';
import colors from '@utils/colors';

interface Props <T> {
    visible: boolean;
    onRequestClose(state: boolean): void;
    options: T[]
    renderItem(item: T): JSX.Element
    onPress(item: T): void
}

const OptionModal =  <T extends unknown> ({visible, onRequestClose, options, onPress, renderItem }: Props<T>) => {

  const handleClose = () =>{
  onRequestClose(!visible)
  }

  return (
    <Modal visible={visible}  onRequestClose={() => onRequestClose(!visible)}  transparent>

        <Pressable style={styles.container} onPress={handleClose}>
            <View style={styles.innerContainer}>
            <ScrollView>
                {options.map((item, index) => {
                    return <Pressable  key={index} onPress={() => {onPress(item); handleClose(); }}>

                        {renderItem(item)}
                        
                    </Pressable>
                })}
            </ScrollView>
            </View>
        </Pressable>

    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, 
    alignItems:'center',
    justifyContent:'center',
    padding: 15,
    backgroundColor: colors.backDrop
},
  innerContainer: {
    width:'100%',
    backgroundColor: colors.deActive,
    padding: 10,
    borderRadius: 7,
    maxHeight: 200
  }
});

export default OptionModal;