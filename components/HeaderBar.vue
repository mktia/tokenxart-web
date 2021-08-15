<template lang="pug">
header.has-background-black.has-text-white
  .container.is-flex.is-justify-content-space-between.is-align-items-center.px-2
    h1.has-text-weight-light(@click='go("/")') Tokenxart
    button.button.is-link.is-rounded.is-small(:disabled="hasWallet", @click="connectWallet")
      span.icon.is-small
        fa-icon(icon="wallet")
      span(v-if="hasWallet") connected
      span(v-else) connect wallet
</template>

<script>
export default {
  data() {
    return {
      account: null,
    }
  },
  mounted() {
    this.account = window.ethereum.selectedAddress
  },
  computed: {
    hasWallet() {
      return this.account !== null
    },
  },
  methods: {
    async connectWallet() {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      this.account = accounts[0]
    },
    go(path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang="sass" scoped>
header
  .container
    height: 3rem

h1
  font-size: 1.5rem
</style>
