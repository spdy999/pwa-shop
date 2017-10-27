<template>
  <div>
    <mu-sub-header>List</mu-sub-header>
    <mu-content-block>
      <mu-select-field v-model="product" label="Select product">
        <mu-menu-item v-for="(item,idx) in shelfList" :key="idx" :value="item" :title="item" />
      </mu-select-field>
      <mu-raised-button primary label="Add" @click="handleSelect()" />
      <mu-raised-button secondary label="Clear" @click="handleClear()" />
    </mu-content-block>
    <mu-sub-header>Your cart</mu-sub-header>
    <mu-content-block>
      {{selectList}}
    </mu-content-block>
    <mu-content-block>
      <mu-raised-button secondary label="Get Recommend items" fullWidth @click="handleRecommend()" />
    </mu-content-block>
    <mu-sub-header>Recommend List</mu-sub-header>
    <mu-content-block>
      {{recommendList}}
    </mu-content-block>
    <mu-content-block>
      <mu-raised-button primary label="Checkout" fullWidth @click="handleCheckout()" />
    </mu-content-block>
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
      product: '',
      shelfList: ['a', 'b'],
      selectList: [],
      recommendList: []
    }
  },
  methods: {
    handleSelect() {
      var val = this.product
      this.selectList.push(val)
    },
    handleClear() {
      this.selectList = []
    },
    handleRecommend() {
      // connect to webservice & get recommend list
      this.recommendList = []
    },
    handleCheckout() {
      // go to check out
    }
  }
}
</script>
<style scoped>

</style>
