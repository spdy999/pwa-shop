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
          <mu-tr valign="top">
            <template v-for="(item,idx) in customerList2">
              <mu-td class="thumb" style="text-align:center" v-bind:key="idx">
                <img :src="item.uploaded_image_url" style="width:100%" />
                <br />{{item.displayName}}
                <br />
                <mu-badge v-if="item.face" :content="item.face[0].faceAttributes.gender.toUpperCase() + ' - ' + item.face[0].faceAttributes.age" />
              </mu-td>
              <mu-td valign="top" v-bind:key="idx">
                <mu-checkbox label="Sausage" :value="true" /><br />
                <mu-checkbox label="Sausage" :value="true" /><br />
                <mu-checkbox label="Sausage" :value="true" /><br />
              </mu-td>
              <mu-td valign="top" v-bind:key="idx">
                <mu-checkbox label="Gum" :value="false" /><br />
                <mu-checkbox label="Candy" :value="false" /><br />
              </mu-td>
              <mu-td valign="bottom" v-bind:key="idx">
                <div style="font-size:1em">Discount</div>
                <div style="font-size:3em">0%</div>
                <mu-raised-button label="Buy" icon="shopping_cart" primary /> &nbsp;
                <mu-raised-button label="Void" icon="delete" secondary />
              </mu-td>
            </template>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </mu-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      customerList: [],
      customerList2: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
  },
  created() {
  },
  mounted() {
    var self = this
    this.$firebase.database().ref('shops/recognize').limitToLast(6).on('value', function (snapshot) {
      snapshot.forEach(child => {
        self.customerList.push(child.val())
      })
      self.customerList2 = self.customerList.reverse()
    })
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
