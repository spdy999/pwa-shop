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

    <div v-if="errors.length != 0" style="color: red;">
      <mu-content-block>
        {{ errors.toString() }}
      </mu-content-block>
    </div>
    <div v-else>
      <mu-content-block>
        {{recommendList}}
      </mu-content-block>
    </div>

    <mu-content-block>
      <mu-raised-button primary label="Checkout" fullWidth @click="handleCheckout()" />
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  computed: {
    ...mapState(["user"])
  },
  data() {
    return {
      product: "",
      shelfList: [29126, 7076, 12820],
      selectList: [],
      recommendList: [],
      errors: []
    };
  },
  methods: {
    handleSelect() {
      var val = this.product;
      this.selectList.push(val);
    },
    handleClear() {
      this.selectList = [];
    },
    handleRecommend() {
      // connect to webservice & get recommend list
      this.recommendList = [];
    },
    handleCheckout() {
      // go to check out
      // TODO: change post url to our recommender api
      axios
        .post(`http://jsonplaceholder.typicode.com/posts`, {
          itemID: this.selectList
        })
        .then(response => {
          console.log("====================response");
          console.log(response);

          // dummy data
          response = {
            result: "success",
            recommend_itemId: "36361"
          };
          // TODO: response.result
          if (response.result === "success") {

            this.recommendList = response.recommend_itemId;

          } else {
            // handle unsuccessful result
            console.log("====================response.result");
            console.log(response.result);
            this.errors.push("Sorry, Something went wrong. Please try again");
          }
        })
        .catch(e => {
          this.errors.push(e);
        }); 
    }
  }
};
</script>
<style scoped>

</style>
