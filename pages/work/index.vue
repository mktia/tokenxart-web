<template lang="pug">
.tokens
  div(v-for="token in tokenList")
    p {{ token.title }}
    p jhf
</template>

<script>
import db from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

export default {
  async asyncData() {
    const querySnapshot = await getDocs(collection(db, 'tokens'))
    const tokenList = []
    querySnapshot.forEach((doc) => {
      tokenList.push(doc.data())
    })
    return { tokenList }
  },
}
</script>
