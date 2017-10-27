<template>
  <div v-show="!fullScreen">
    <mu-appbar id="my-header">
      <router-link to="/" class="logo">Shop.ML</router-link>

      <template v-if="mode==='shop'">
        <mu-icon-button icon="camera" slot="right" @click="openBottomSheet" />
      </template>
      <!--
                  <mu-icon-button icon="search" slot="right" to="/shopface" />
                  <mu-icon-button icon="dashboard" slot="right" to="/shopdashboard" />
                  <mu-icon-button icon="shopping_cart" slot="right" to="/camerapos" />
                  <mu-icon-button icon="photo_library" slot="right" to="/gallery" />
                  -->
      <mu-icon-button v-show="!user" icon="account_circle" slot="right" to="/login" />

      <mu-flat-button v-show="user" slot="right" ref="userButton" to="/profile">
        <mu-avatar :src="user && user.photoURL" style="margin:0 10px; width:28px; height:28px" />
      </mu-flat-button>
    </mu-appbar>

    <mu-paper>
      <template v-if="mode==='shop'">
        <mu-bottom-nav :value="bottomNav" @change="handleChange">
          <mu-bottom-nav-item value="shop1" title="Acquisition" icon="A" />
          <mu-bottom-nav-item value="shop2" title="Activation" icon="A" />
          <mu-bottom-nav-item value="shop3" title="Retention" icon="R" />
          <mu-bottom-nav-item value="shop4" title="Referral" icon="R" />
          <mu-bottom-nav-item value="shop5" title="Revenue" icon="R" />
        </mu-bottom-nav>
      </template>
      <template v-if="mode==='user'">
        <mu-bottom-nav :value="bottomNav" @change="handleChange">
          <mu-bottom-nav-item value="" title="Instruction" icon="home" />
          <mu-bottom-nav-item value="profile" title="Profile" icon="account_circle" />
          <mu-bottom-nav-item value="cart" title="Shopping" icon="shopping_cart" />
        </mu-bottom-nav>
      </template>
    </mu-paper>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet">
        <mu-sub-header>
          Select Camera
        </mu-sub-header>
        <mu-list-item title="Outside Store Camera" to="/cameraoutside" />
        <mu-list-item title="In-store Camera" to="/camerainstore" />
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    fullScreen: false,
    mode: 'user',
    userMenuOpen: false,
    userMenuTrigger: null,
    bottomNav: '',
    bottomSheet: false
  }),
  computed: {
    ...mapState({
      user: 'user'
    })
  },
  watch: {
    user(val) {
      if (val) {
        this.userMenuTrigger = this.$refs.userButton.$el
      }
    },
    '$route': function () {
      // this.bottomNav = this.currentPath.substring(1)
      this.handleFullscreen()
    }
  },
  methods: {
    closeBottomSheet() {
      this.bottomSheet = false
    },
    openBottomSheet() {
      this.bottomSheet = true
    },
    handleChange(val) {
      this.bottomNav = val
      this.$router.push('/' + val)
    },
    handleFullscreen() {
      if (this.$route.path.substring(0, 7) === '/camera') {
        this.fullScreen = true
      } else if (this.$route.path.substring(0, 5) === '/shop') {
        this.fullScreen = false
        this.mode = 'shop'
      } else {
        this.fullScreen = false
        this.mode = 'user'
      }
    }
  },
  created() {
    this.handleFullscreen()
  }
}
</script>
<style lang="sass">
#my-header
  .logo
    color: white
    text-decoration: none
    padding: 10px
</style>
