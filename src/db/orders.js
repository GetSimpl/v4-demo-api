import db from './index'

function createOrder({phoneNumber, amountInPaise}) {
  return db('orders').insert({
    phone_number: phoneNumber,
    amount_in_paise: amountInPaise,
    status: 'PENDING',
  })
}

function addOrderPayment(orderId, transactionId) {
  return db('orders').where('id', orderId).first().update({
    transaction_id: transactionId,
    status: 'COMPLETED',
  })
}

export {createOrder, addOrderPayment}
