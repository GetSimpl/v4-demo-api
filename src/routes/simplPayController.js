import axiosConfig from '../utils/axiosConfig'
import {createOrder, addOrderPayment} from '../db/orders'

function isUserEligible({body: {phoneNumber, amountInPaise, payload}}, res) {
  if (!payload) res.status(400).json({message: `payload can't be blank`})
  if (!phoneNumber)
    res.status(400).json({message: `phone number can't be blank`})
  if (!amountInPaise)
    res.status(400).json({message: `amount in paise can't be blank`})

  return axiosConfig
    .post('/check_eligibility', {
      phone_number: phoneNumber,
      amount_in_paise: amountInPaise,
      payload: payload,
    })
    .then(({data}) => res.status(200).json(data))
}

//function paymentRedirection({token, available_credit}) {}

async function chargeUser(
  {body: {phoneNumber, amountInPaise, token, ...rest}},
  res,
) {
  if (!token) res.status(400).json({message: `token can't be blank`})
  if (!phoneNumber)
    res.status(400).json({message: `phone number can't be blank`})
  if (!amountInPaise)
    res.status(400).json({message: `amount in paise can't be blank`})
  if (!rest.shipping_address)
    res.status(400).json({message: `shipping address can't be blank`})
  if (!rest.billing_address)
    res.status(400).json({message: `billing address can't be blank`})

  // order creation is done here for convience
  const [id] = await createOrder({phoneNumber, amountInPaise})
  const {data} = await axiosConfig.post(`/transaction`, {
    token,
    phone_number: phoneNumber,
    amount_in_paise: amountInPaise,
    order_id: id,
    ...rest,
  })

  if (data.data) {
    await addOrderPayment(id, data.data.transaction.id)
    res.status(200).json({
      success: true,
      transactionId: data.data.transaction.id,
    })
  } else res.status(200).json(data)
}

function refundUser({body: {amountInPaise, reason, transactionId}}, res) {
  if (!amountInPaise)
    res.status(400).json({message: `amount in paise can't be blank`})
  if (!reason) res.status(400).json({message: `reason can't be blank`})
  if (!transactionId)
    res.status(400).json({message: `transaction id can't be blank`})

  return axiosConfig
    .post('/refund', {
      amount_in_paise: amountInPaise,
      reason: reason,
      transaction_id: transactionId,
    })
    .then(({data}) => res.status(200).json(data))
}

export {isUserEligible, chargeUser, refundUser}
