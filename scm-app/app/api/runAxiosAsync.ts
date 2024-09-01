import { newUserSchema, yupValidate } from "app/utils/validator";
import axios, { AxiosError, AxiosResponse } from "axios";
import { showMessage } from "react-native-flash-message";


export const runAxiosAsync = async <T> (promise: Promise<AxiosResponse<T>>): Promise<T | null> => {
    try {

        const response = await promise
        return response.data
          
        } catch (error) {
          let message = (error as any).message
          if(error instanceof AxiosError) {
            const response = error.response
            if(response) {
              message = response.data.message
            }
          }
          showMessage({message, type:'danger'})
        }
        return null
}
