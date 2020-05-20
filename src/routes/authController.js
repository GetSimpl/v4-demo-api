import {
  getSaltAndHash,
  userToJSON,
  getUserToken,
  isPasswordAllowed,
  authenticateUser,
} from '../utils/auth'
import * as usersDB from '../db/users'

const authUserToJSON = (user) => ({
  ...userToJSON(user),
  token: getUserToken(user),
})

async function register(req, res) {
  const {phoneNumber, password} = req.body
  if (!phoneNumber) {
    return res.status(400).json({message: `phone number can't be blank`})
  }

  if (!password) {
    return res.status(400).json({message: `password can't be blank`})
  }
  if (!isPasswordAllowed(password)) {
    return res.status(400).json({message: `password is not strong enough`})
  }
  const existingUser = await usersDB.getByPhoneNumber(phoneNumber)
  if (existingUser) {
    return res.status(400).json({message: `phone number already exists`})
  }
  const newUser = await usersDB.insert({
    phone_number: phoneNumber,
    ...getSaltAndHash(password),
  })
  return res.json({user: authUserToJSON(newUser)})
}

async function login(req, res) {
  if (!req.body.phoneNumber) {
    return res.status(400).json({message: `phone number can't be blank`})
  }

  if (!req.body.password) {
    return res.status(400).json({message: `password can't be blank`})
  }

  const {user, info} = await authenticateUser(
    req.body.phoneNumber,
    req.body.password,
  )

  if (user) {
    return res.json({user: authUserToJSON(user)})
  } else {
    return res.status(400).json(info)
  }
}

function me(req, res) {
  if (req.user) {
    return res.json({user: authUserToJSON(req.user)})
  } else {
    return res.status(404).send()
  }
}

export {me, login, register}
