<template>
  <div>
    <mu-card>
      <mu-card-text>
        <img :src="imgData" style="width:100%" />
      </mu-card-text>
      <mu-card-actions>
        <mu-raised-button fullWidth primary label="Change Selfie" to="/cameraavatar" />
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      imgData: '/img/avatar.png'
    }
  }
}
</script>

<style lang="scss">

</style>
