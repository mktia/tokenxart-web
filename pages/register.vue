<template lang="pug">
.container.register-form.mt-4.px-3
  .message.is-danger(v-if="errorMessages.length !== 0")
    .message-body
      p(v-for="message in errorMessages") {{ message }}
  .field
    .label Title
    .control
      input.input(v-model="token.title", type="text", placeholder="Title of the work")
  .field
    .label Description
    .control
      input.input(v-model="token.description", type="text", placeholder="Description of the work")
  .field
    .label Creator
    .control
      input.input(v-model="token.creator.name", type="text", placeholder="Creator's name")
  .file
    label.file-label
      input.file-input(type="file", accept="image/*", @change="setImage")
      span.file-cta
        span.file-icon
          fa-icon(icon="file-upload")
        span.file-label Upload an image
  figure.my-5
    img(:src="blob")
  .field.is-grouped
    .control
      button.button.is-link.mr-1(@click="confirm") Confirm
      button.button.is-link.is-light(@click="cancel") Delete
  .modal(:class="{'is-active': isActiveModal}")
    .modal-background
    .modal-content
      .card
        .card-image
          figure
            img(:src="blob")
        .card-content
          .content
            p.title.is-4 {{ this.token.title }}
            p.subtitle.is-7 @{{ this.token.creator.name }} - {{ this.token.creator.address }}
            p {{ this.token.description }}
        .card-footer
          a.card-footer-item(href="#", @click="mint") Mint
          a.card-footer-item(href="#", @click="closeModal") Cancel
    button.modal-close(area-label="close", @click="closeModal")
</template>

<script>
import TokenxartJSON from '../../../Solidity/tokenxart/build/contracts/Tokenxart.json'
import db from '../firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'

const BASE_URL = 'http://localhost:3000'

const IPFS = require('ipfs-core')
const Web3 = require('web3')

export default {
  data() {
    return {
      blob: '',
      errorMessages: [],
      isActiveLink: true,
      isActiveModal: false,
      token: {
        creator: { address: '', name: '' },
        description: '',
        title: '',
      },
    }
  },
  methods: {
    cancel() {
      this.blob = ''
      this.token.creator.name = ''
      this.token.description = ''
      this.token.title = ''
    },
    closeModal() {
      this.isActiveLink = true
      this.isActiveModal = false
    },
    async confirm() {
      this.errorMessages = []
      if (this.token.title === '') {
        this.errorMessages.push('Title is required')
      }
      if (this.token.description === '') {
        this.errorMessages.push('Description is required')
      }
      if (this.token.creator.name === '') {
        this.errorMessages.push("Creator's name is required")
      }
      if (this.blob === '') {
        this.errorMessages.push('Image is required')
      }
      if (this.errorMessages.length !== 0) return

      const web3 = new Web3('http://localhost:7545')
      const accounts = web3.eth.getAccounts()

      this.token.creator.address = accounts[0]
      this.isActiveModal = true
    },
    setImage(event) {
      const file = event.target.files[0]
      if (file === null) return

      const reader = new FileReader()
      reader.onload = (e) => {
        this.blob = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async mint() {
      if (!this.isActiveLink) return
      this.isActiveLink = false

      // Upload to IPFS
      const ipfs = await IPFS.create()
      const data = {
        blob: this.blob,
        token: this.token,
      }
      const { cid } = await ipfs.add(JSON.stringify(data))

      ipfs.stop()

      // Connect to Metamask
      const web3 = new Web3('http://localhost:7545')
      const accounts = web3.eth.getAccounts()

      // Connect to contract
      const ABI = TokenxartJSON.abi
      const CONTRACT_ADDRESS = process.env.contractAddress
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
        from: accounts[0],
      })

      // Mint NFT
      try {
        const result = await contract.methods
          .registerWork(accounts[0], `${BASE_URL}/cids/${cid}`)
          .send()
        const tokenId = result.events.Transfer.returnValues.tokenId

        const docData = {
          cid,
          timestamp: new Date().getTime(),
          tokenId,
        }
        await setDoc(doc(db, 'tokens', cid), docData)
      } catch (error) {
        this.errorMessages.push('[SystemError]')
        this.isActiveModal = false
        switch (error.code) {
          case 4001:
            // Reject signing the tx in Metamask
            this.errorMessages.push(error.message)
            this.isActiveLink = true
            break
          case -32603:
            // Runtime error
            this.errorMessages.push(error.message)
            this.isActiveLink = true
            break
          default:
            this.errorMessages.push('Unexpected error')
            this.isActiveLink = true
            console.error(error)
        }
      }

      this.$router.push({ path: `/work/${cid}` })
    },
  },
}
</script>
