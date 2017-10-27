<template>
  <div class="main">
    <mu-content-block>
      <pre>
Use case:
- This page will accessed from user's mobile phone
- For "Shop admin", please visit "<router-link to="/shop">shop</router-link>"

Step:
1. Click "Profile" then register your self
2. After login success, click "Change My Picture"
- Selfie yourself to register face to system
3. Click "shopping" then select item add to your cart
- We use this step to simulation shopping in-store
4. Click "checkout" to confirm your cart
- The checkout data will be sent to cashier
5. Cashier will ask you
- give you a "recommder products"
- ask you to "smile" to get a %discount coupon
- the coupon will be availble in your account for sharing to your frieds or your next purchase
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
