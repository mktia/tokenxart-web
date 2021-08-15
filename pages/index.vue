<template lang="pug">
.top-container.is-flex.is-justify-content-center.is-align-items-center
  .message.has-text-centered
    p.is-size-4 Create Non-Fungible Token of digital arts for testing
    .is-flex.is-justify-content-center.mt-6
      a.button.is-link.mr-2(href="/register") Create NFT
      a.button.is-link(href="/works") List of works
</template>

<script>
export default {
  layout: 'top'
}
</script>

<style lang="sass" scoped>
.message
  background: transparent
  width: 288px

.top-container
  background: url('../assets/images/wall.webp')
  height: 100vh
</style>