// Initialize Cloud Firestore through Firebase
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

if (getApps().length === 0) {
  initializeApp({
    apiKey: 'AIzaSyCQDewOvia_aHA-F_ZpLYMLXDGmD1IPmcQ',
    authDomain: 'tokenxart.firebaseapp.com',
    projectId: 'tokenxart',
    storageBucket: 'tokenxart.appspot.com',
    messagingSenderId: '96707459761',
    appId: '1:96707459761:web:b2e0e832c4ba6134ce8090',
  })
}

const db = getFirestore()

export default db
