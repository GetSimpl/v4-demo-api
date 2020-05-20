import db from './index'

function insert(user) {
  return db('users')
    .insert(user)
    .then((ids) => ({id: ids[0]}))
}

function getByPhoneNumber(phoneNumber) {
  return db('users').where('phone_number', phoneNumber).first()
}

export {getByPhoneNumber, insert}
