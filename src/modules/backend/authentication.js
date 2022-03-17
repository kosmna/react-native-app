import axios from 'axios'
import queryString from 'query-string'
import { Authentication, BackendUrl, ChangePwdEndpoint, Header, SignInEndpoint, SignUpEndpoint } from './constants'

export default function index() {
  return true
}

export function UserSignIn(email, password, sso_type = "", firebase_token = "", name = "", referred_partner_id = "") {
  return new Promise((resolve, reject) => {

    const data = JSON.stringify({
      "Authorization": Authentication,
      "chkwch": "customer",
      "name": name,
      "email": email,
      "password": password,
      "sso_type": sso_type,
      "firebase_token": firebase_token,
      "referred_partner_id": parseInt(referred_partner_id) ? parseInt(referred_partner_id) : ''
    })

    let result = null
    axios.post(BackendUrl + SignInEndpoint, queryString.stringify(
      {
        "data": data
      }), {
      headers: Header
    })
      .then(response => {
        if ("data" in response) {
          const obj = response.data
          result = obj
          resolve(result)
        }
        else {
          
          reject('Error')
        }
      })
      .catch((error) => {
        console.log(error)
        
        reject('Error')
      })
      .then(() => {

      })
  })
}

export function UserSignUp(name, email, password, referred_partner_id = "") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      "Authorization": Authentication,
      "chkwch": "customer",
      "name": name,
      "email": email,
      "password": password,
      "referred_partner_id": parseInt(referred_partner_id) ? parseInt(referred_partner_id) : ''
    })

    let result = null
    axios.post(BackendUrl + SignUpEndpoint, queryString.stringify(
      {
        "data": data
      }), {
      headers: Header
    })
      .then(response => {
        if ("data" in response) {
          const obj = response.data
          result = obj
          resolve(result)
        }
        else {
          
          reject('Error')
        }
      })
      .catch((error) => {
        console.log(error)
        
        reject('Error')
      })
      .then(() => {

      })
  })
}

export function ChangePassword(refCode, email, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      "Authorization": Authentication,
      "referral_code": refCode,
      "email": email,
      "old_password": oldPassword,
      "new_password": newPassword
    })

    let result = null
    axios.post(BackendUrl + ChangePwdEndpoint, queryString.stringify(
      {
        "data": data
      }), {
      headers: Header
    })
      .then(response => {
        if ("data" in response) {
          const obj = response.data
          result = obj
          resolve(result)
        }
        else {
          
          reject('Error')
        }
      })
      .catch((error) => {
        console.log(error)
        
        reject('Error')
      })
      .then(() => {

      })
  })
}