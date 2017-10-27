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
            <mu-td class="thumb" style="text-align:center">
              <img src="/img/avatar.png" />
            </mu-td>
            <mu-td valign="top">
              <mu-checkbox label="Sausage" :value="true" /><br />
              <mu-checkbox label="Sausage" :value="true" /><br />
              <mu-checkbox label="Sausage" :value="true" /><br />
            </mu-td>
            <mu-td valign="top">
              <mu-checkbox label="Gum" :value="false" /><br />
              <mu-checkbox label="Candy" :value="false" /><br />
            </mu-td>
            <mu-td valign="bottom">
              <div style="font-size:1em">Discount</div>
              <div style="font-size:3em">0%</div>
              <mu-raised-button label="Buy" icon="shopping_cart" primary />
              &nbsp;
              <mu-raised-button label="Void" icon="delete" secondary />
            </mu-td>
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
  padding:1em
}
</style>
