<template lang="pug">
.container
  .token.mt-5.px-2
    div(v-if="data !== undefined")
      figure.image
        img.img(:src="data.blob")
      p.is-capitalized.has-text-grey.mt-4
        span token #
        span {{ data.tokenId }}
      h2.work-title.is-size-3.mb-3 {{ data.token.title }}
      p {{ data.token.description }}
      p.mt-3 @{{ data.token.creator.name }}
        span.has-text-grey.is-size-7.ml-2 - {{ data.token.creator.address }}
    div(v-else)
      p error: Not found
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const fbData = await $axios.$get(`/api/token/${params.cid}`)

    if (fbData.code === 404) {
      return { data: undefined }
    }

    const res = await $axios.$get(`/api/ipfs/get/${params.cid}`)
    const data = res.data
    data.tokenId = fbData.tokenId

    return { data }
  },
}
</script>

<style lang="sass" scoped>
.img
  background-color: #000
  max-height: 400px
  object-fit: contain

.work-title
  line-height: 2rem
</style>