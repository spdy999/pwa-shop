<template>
  <div>
    <mu-card>
      <mu-card-header :title="user.displayName" :subTitle="user.email">
        <mu-avatar :src="user.photoURL" slot="avatar" />
      </mu-card-header>
      <mu-card-media v-if="avatarURL">
        <img :src="avatarURL" />
      </mu-card-media>
      <mu-card-actions>
        <mu-raised-button primary fullWidth label="Change My Picture" to="/cameraavatar" />
        <!-- <mu-raised-button secondary fullWidth label="Test Detect" to="/cameradetect" /> -->
        <mu-raised-button secondary fullWidth label="Sign out" to="/logout" />
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      avatarURL: ''
    }
  },
  mounted() {
    var self = this
    if (this.user) {
      this.$firebase.database().ref('users/' + this.user.uid + '/profile').once('value')
        .then(snapshot => {
          var val = snapshot.val()
          if (val) {
            self.avatarURL = val.avatarURL
          }
        })
    }
  }
}
</script>

<style lang="scss">

</style>
