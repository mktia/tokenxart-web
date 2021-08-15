<template lang="pug">
.card
  .card-image
    figure.image.is-4by3
      img.img(:src='token.blob')
  .card-content
    .media
      .media-content
        p.title.is-4 {{ token.title }}
        p.subtitle.is-6 @{{ token.creator.name }}
    .content
      p {{ token.description }}
      time {{ formatDate(token.timestamp) }}
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate: function (timestamp) {
      const date = new Date(Number(timestamp))
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return (
        `${date.getHours()}:${date.getMinutes()} - ` +
        `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.img
  object-fit: cover
</style>
