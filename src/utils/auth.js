import crypto from 'crypto'
import expressJWT from 'express-jwt'
import jwt from 'jsonwebtoken'
import * as usersDB from '../db/users'

const secret = '____getsimpl___secret'
const iterations = process.env.NODE_ENV === 'production' ? 1000 : 1
const sixtyDaysInSeconds = 60 * 60 * 24 * 60

function getSaltAndHash(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 512, 'sha512')
    .toString('hex')
  return {salt, hash}
}

function isPasswordValid(password, {salt, hash}) {
  return (
    hash ===
    crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('hex')
  )
}

function getUserToken({id, phoneNumber}) {
  const issuedAt = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      id,
      phoneNumber,
      iat: issuedAt,
      exp: issuedAt + sixtyDaysInSeconds,
    },
    secret,
  )
}

const authMiddleware = expressJWT({secret})

async function authenticateUser(phoneNumber, password) {
  const user = await usersDB.getByPhoneNumber(phoneNumber)
  if (!user || !isPasswordValid(password, user)) {
    return {
      info: 'password is invalid',
    }
  }
  return {user}
}

const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

function userToJSON(user) {
  return omit(['hash', 'salt', 'updated_at', 'created_at'], user)
}

function isPasswordAllowed(password) {
  return password.length > 6 && /\d/.test(password) && /[a-z]/.test(password)
}

export {
  authMiddleware,
  getSaltAndHash,
  userToJSON,
  getUserToken,
  isPasswordAllowed,
  authenticateUser,
}
