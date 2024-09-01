import { isValidObjectId } from 'mongoose'
import * as yup from 'yup'
import categories from './categories'
import { parseISO } from 'date-fns'

const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
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
    email: yup.string().email("Invali1d email").required("Email is misssing"),
    password: yup.string().required("Password is ma21issing").matches(passwordRegex, "Password is too simple")
})

export const verifyTokenSchema = yup.object({
    id: yup.string().test({
        name:"valid-id",
        message:'Invalid user id',
        test:(value)=>{
            return isValidObjectId(value)
        }
    }),
    token: yup.string().required("Token is missing"),
})

export const resetPassSchema = yup.object({
    id: yup.string().test({
        name:"valid-id",
        message:'Invalid user id',
        test:(value)=>{
            return isValidObjectId(value)
        }
    }),
    token: yup.string().required("Token is missing"),
    password: yup.string().required("Password is ma21iss2aing").matches(passwordRegex, "Password is too simple")
})


export const newProductSchema = yup.object({
    name: yup.string().required('Name is missing'),
    description: yup.string().required('Description is missing'),
    category: yup.string().oneOf(categories,"Invalid Category").required("Category is missing"),
    price: yup.string().transform((value)=>{
        if(isNaN(+value)) return '';
        return +value
    }).required("Price is missing"),
    purchasingDate: yup.string().transform((value)=>{
        try {
        return parseISO(value)
            
        } catch (error) {
            return ''
        }
    }).required("Purchasing date is missing")

})