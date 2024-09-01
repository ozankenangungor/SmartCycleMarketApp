import {connect} from 'mongoose'

const uri = 'mongodb://localhost:27017/smart'

connect(uri).then(()=>{
    console.log('db connected succesfully')
}).catch((error)=>{
    console.log('db connection error'+error.message)
})

    