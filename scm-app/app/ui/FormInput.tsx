import colors from "app/utils/colors"
import { FC, useState } from "react"
import { StyleSheet, TextInput, TextInputProps, View } from "react-native"

interface Props extends TextInputProps {}

const FormInput : FC<Props> = (props) => {
  const [isFocused, setisFocused] = useState(false)

    return(
      <TextInput
      style={[styles.input, isFocused ? styles.borderActive : styles.borderDeactive]}  
      placeholderTextColor={colors.primary}
      {...props} 
      onFocus={() => {setisFocused(true)}} 
      onBlur={() => setisFocused(false)}  />
    )
}

const styles = StyleSheet.create({
    input: {
        width: "100%",
        padding:8,
        borderRadius:5,
        marginBottom: 15,
     
      },
      borderDeactive: {
        borderWidth:1,
        borderColor: colors.deActive
      },
      borderActive: {
        borderWidth:1,
        borderColor: colors.primary
      }
})

export default FormInput