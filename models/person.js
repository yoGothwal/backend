const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 4,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate:{
      validator: function (v){
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Format should be XX-YYYYYYY or XXX-YYYYYYY`
    }

    // code: {
    //   type: String,
    //   minLength: 2,
    //   maxLength: 3,
    // },
    // number:{
    //   type: String,

    // }

  },
})

const Person = mongoose.model('Person', personSchema)
// Customize toJSON output
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  },
})
module.exports = Person
