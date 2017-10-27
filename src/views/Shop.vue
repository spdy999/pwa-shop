<template>
  <div class="main">
    <mu-content-block>
      <pre>
Use case:
- This page will accessed from cashier DESKTOP
- For "user", please visit "<router-link to="/">home</router-link>"

Camera:
- Take <router-link to="/cameraoutside">OUTSIDE Camera</router-link>
- Take <router-link to="/camerainstore">IN-STORE Camera</router-link>

        </pre>
    </mu-content-block>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
