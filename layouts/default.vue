<template lang="pug">
div
  header-bar
  .container
    .main-container.columns.m-0
      nuxt.column.is-four-fifths
      side-menu.column
  footer-bar
</template>

<style lang="sass">
html
  // font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  font-size: 16px
  word-spacing: 1px
  -ms-text-size-adjust: 100%
  -webkit-text-size-adjust: 100%
  -moz-osx-font-smoothing: grayscale
  -webkit-font-smoothing: antialiased
  box-sizing: border-box

body
  font-family: 'Segoe UI', BlinkMacSystemFont, -apple-system, 'Yu Gothic', YuGothic, Roboto, 'Helvetica Neue', Arial, Meiryo, sans-serif
  margin: 0

.main-container
  min-height: calc(100vh - 84px)
</style>
