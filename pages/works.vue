<template lang="pug">
.container
  .is-flex.is-flex-wrap-wrap.is-justify-content-center.mt-5
    .token(v-for='token in tokens')
      .card-container.m-2(@click='go(`/work/${tokens[0].cid}`)')
        card(:token='tokens[0]')
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get('/api/tokens/all')

    if (data.code === 404) {
      return { data: undefined }
    }

    const tokens = []
    for await (const token of data.tokens) {
      const tokenData = await $axios.$get(`/api/ipfs/get/${token.cid}`)
      tokens.push({
        blob: tokenData.data.blob,
        cid: token.cid,
        creator: tokenData.data.token.creator,
        description: tokenData.data.token.description,
        timestamp: token.timestamp,
        title: tokenData.data.token.title,
      })
    }

    return { tokens }
  },
  methods: {
    go: function (path) {
      this.$router.push(path)
    },
  },
}
</script>

<style lang="sass" scoped>
.card-container
  width: 280px
</style>
