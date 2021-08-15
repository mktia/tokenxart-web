// API to return JSON

import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore'
import db from '../firebaseConfig'

const express = require('express')
const app = express()
const IPFS = require('ipfs-core')

// IPFS
app.get('/ipfs/get/:cid', async (req, res) => {
  const ipfs = await IPFS.create()
  const stream = ipfs.cat(req.params.cid)
  let dataString = ''

  for await (const chunk of stream) {
    dataString += chunk.toString()
  }
  const data = JSON.parse(dataString)

  ipfs.stop()

  if (dataString !== '') {
    res.json({
      code: 200,
      data
    })
  } else {
    res.json({
      code: 404,
      error: 'No data on IPFS',
    })
  }
})

// Firebase
app.get('/token/:cid', async (req, res) => {
  const docRef = doc(db, 'tokens', req.params.cid)
  const docSnap = await getDoc(docRef)
  const data = docSnap.exists ? docSnap.data() : undefined
  if (data !== undefined) {
    res.json({
      code: 200,
      cid: data.cid,
      timestamp: data.timestamp,
      tokenId: data.tokenId,
    })
  } else {
    res.json({
      code: 404,
      error: 'No such document',
    })
  }
})

app.get('/tokens/all', async (req, res) => {
  const q = query(collection(db, 'tokens'))
  const querySnapshot = await getDocs(q)
  const tokens = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    tokens.push({
      cid: data.cid,
      timestamp: data.timestamp,
      tokenId: data.tokenId,
    })
  })

  if (tokens.length !== 0) {
    res.json({
      code: 200,
      tokens,
    })
  } else {
    res.json({
      code: 404,
      error: 'No token',
    })
  }
})

module.exports = {
  path: '/api',
  handler: app,
}
