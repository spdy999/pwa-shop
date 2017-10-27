<template>
  <div>

    <mu-content-block>
      <mu-row gutter>
        <mu-col width="100" tablet="40" desktop="40">
          <img :src="faceUrl" width="100%" />
        </mu-col>
        <mu-col width="100" tablet="60" desktop="60">

          <mu-table v-if="predict && predict.uid" ref="table" :selectable="false" :showCheckbox="false">
            <mu-tbody>
              <mu-tr>
                <mu-td style="width:70px">Name</mu-td>
                <mu-td>{{predict.displayName}}</mu-td>
              </mu-tr>
              <mu-tr>
                <mu-td style="width:70px">ID</mu-td>
                <mu-td>{{predict.uid}}</mu-td>
              </mu-tr>
              <mu-tr>
                <mu-td style="width:70px">Time</mu-td>
                <mu-td>{{ faceTs | moment('from') }}</mu-td>
              </mu-tr>
            </mu-tbody>
          </mu-table>
        </mu-col>
        <mu-col width="100" tablet="100" desktop="100">
          <mu-raised-button label="Back to List" primary to="/shopfacelist" fullWidth />
        </mu-col>
      </mu-row>
    </mu-content-block>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      faceId: this.$route.params.id,
      faceUrl: '',
      faceTs: 0,
      predict: {
        uid: '',
        displayName: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    getFaceId(faceId) {
      return this.$firebase.database().ref('shops/recognize/' + faceId).once('value')
    }
  },
  created() {
  },
  mounted() {
    var self = this
    this.getFaceId(this.faceId)
      .then(snapshot => {
        var val = snapshot.val()
        self.faceUrl = val.uploaded_image_url
        self.faceTs = -val.ts
        return self.$firebase.database().ref('users/' + val.uid + '/profile').once('value')
      })
      .then(snapshot => {
        var val = snapshot.val()
        self.predict = val
      })
  }
}
</script>

<style scoped>

</style>
