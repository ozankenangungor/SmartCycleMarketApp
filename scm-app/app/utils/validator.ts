import * as yup from 'yup'

type ValidationResult <T> = { 
 error?: string; 
 values?: T
}

export const yupValidate = async <T extends object> (schema: yup.Schema, value: T) : Promise<ValidationResult<T>> => {

    try {
      const data = await schema.validate(value)
      return { values: data}
    } catch (error) {
        if(error instanceof yup.ValidationError) {
            return {error: error.message}
        }else {
           return {error: (error as any).message}
        }
    }

}


export const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/

yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(emailRegex, {
        message,
        name: 'email',
        excludeEmptyString: true
    })
})

export const newUserSchema = yup.object({
    name: yup.string().required("Name is missing"),
    email: yup.string().email("Invalid email").required("Email is missing"),
    password: yup.string().required("Password is ma21issing").matches(passwordRegex, "Password is too simple")
})

export const signInSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is missing"),
    password: yup.string().required("Password is missing").matches(passwordRegex,"Password is too simple")
})

export const newProductSchema = yup.object({
    name: yup.string().required('Product name is missing!'),
    description: yup.string().required('Product description is missing!'),
    category: yup.string().required("Product category is missing"),
    price: yup.string().transform((value) => {
        if(isNaN(+value)) return "";
        return value
    }).required("Product price is missing"),
    purchasingDate: yup.date().required("Purchasing date is missing!")

})