<template>
  <div>
    <mu-card>
      <mu-table class="ttable" border="0" width="100%" :selectable="false" :showCheckbox="false">
        <mu-thead>
          <mu-tr>
            <mu-th width="15%">Customer</mu-th>
            <mu-th width="30%">Current Cart</mu-th>
            <mu-th width="30%">Recommender</mu-th>
            <mu-th width="25%">Summary</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <template v-for="(item,idx) in customerList2">
            <mu-tr valign="top">
              <mu-td class="thumb" style="text-align:center" v-bind:key="idx">
                <img :src="item.uploaded_image_url" style="width:100%" />
                <br />{{item.displayName}}
                <br />
                <mu-badge v-if="item.face" :content="item.face[0].faceAttributes.gender.toUpperCase() + ' - ' + item.face[0].faceAttributes.age" />
              </mu-td>
              <mu-td valign="top" v-bind:key="idx">
                <mu-auto-complete hintText="Fill-in product" :maxSearchResults="8" filter="caseInsensitiveFilter" :dataSource="dataSource" @select="handleSelect" v-model="currentText" />
                <template v-for="(obj,idx2) in selectList">
                  <br />
                  <mu-checkbox v-model="checkList" :label="obj.text" :nativeValue="obj.value" name="group" @change="handleRemove(obj.value)" />
                </template>
                <br />
                <mu-raised-button label="Recommend Me" primary @click="getRecommend()" />
              </mu-td>
              <mu-td valign="top" v-bind:key="idx">
                Recommend {{recList.length}} item
                <template v-for="itemId in recList">
                  <mu-checkbox :label="products[itemId]" :value="itemId" /><br />
                </template>
              </mu-td>
              <mu-td valign="bottom" v-bind:key="idx">
                <div style="font-size:1em">Discount</div>
                <div style="font-size:3em">0%</div>
                <mu-raised-button label="Buy" icon="shopping_cart" primary /> &nbsp;
                <mu-raised-button label="Void" icon="delete" secondary />
              </mu-td>
            </mu-tr>
          </template>
        </mu-tbody>
      </mu-table>
    </mu-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
import products from '../products.json'
export default {
  data() {
    return {
      currentText: '',
      checkList: [],
      customerList: [],
      customerList2: [],
      recList: [],
      products,
      dataSource: [],
      selectList: [],
      groupId: 'M18-24'
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    handleRemove(val) {
      var index = this.selectList.indexOf(val)
      this.selectList.splice(index, 1)
      index = this.checkList.indexOf(val)
      this.checkList.splice(index, 1)
    },
    handleSelect(obj) {
      this.currentText = ''
      this.selectList.push(obj)
      this.checkList.push(obj.value)
    },
    getRecommend() {
      var self = this
      // axios.post('http://35.202.6.239/api/v1.0/post_recommendation/', {
      var param = {
        itemId: self.checkList,
        group: self.groupId
      }
      console.log(param)
      axios.post('https://developers.tencent.co.th/api/v1.0/post_recommendation/', param)
        .then(function (response) {
          console.log(response)
          self.recList = response.data.recommend_itemId
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  created() {
  },
  mounted() {
    var self = this
    this.$firebase.database().ref('shops/recognize').limitToLast(1).on('value', function (snapshot) {
      var lastVal = {}
      snapshot.forEach(child => {
        var val = child.val()
        self.customerList.push(val)
        lastVal = val
      })
      if (lastVal.face[0].faceAttributes.gender === 'male') {
        if (lastVal.face[0].faceAttributes.age < 25) {
          self.groupId = 'M18-24'
        } else if (lastVal.face[0].faceAttributes.age < 35) {
          self.groupId = 'M25-34'
        } else if (lastVal.face[0].faceAttributes.age < 45) {
          self.groupId = 'M35-44'
        } else {
          self.groupId = 'M45+'
        }
      } else {
        if (lastVal.face[0].faceAttributes.age < 25) {
          self.groupId = 'F18-24'
        } else if (lastVal.face[0].faceAttributes.age < 35) {
          self.groupId = 'F25-34'
        } else if (lastVal.face[0].faceAttributes.age < 45) {
          self.groupId = 'F35-44'
        } else {
          self.groupId = 'F45+'
        }
      }
      self.customerList2 = self.customerList.reverse()
    })

    self.dataSource = []
    var i = 0;
    for (var prop in products) {
      if (i < 1000) {
        self.dataSource.push({
          value: prop,
          text: products[prop]
        })
      } else {
        break
      }
      i++
    }
    // console.log(self.dataSource)
  }
}
</script>

<style scoped>
.demo-chip-container {
  display: flex;
  flex-wrap: wrap;
}
.demo-chip {
  margin: 4px;
}
.thumb {
  width: 120px;
}
.thumb img {
  width: 120px;
}
.ttable td {
  padding: 1em;
}
</style>
