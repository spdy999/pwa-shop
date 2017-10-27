<template>
  <div>
    <mu-grid-list class="gridlist-demo" :cols="2">
      <mu-sub-header>Face @ {{ ts | moment('YYYY-MM-DD / HH:mm:ss') }}</mu-sub-header>
      <mu-grid-tile v-for="(item,index) in faceList" :key="index">
        <router-link :to="'/shopfaceid/' + item.key"><img :src="item.uploaded_image_url" style="width:100%;" /></router-link>
        <span slot="title">{{item.displayName?item.displayName:item.uid}}</span>
        <span slot="subTitle">{{item.confidence}} @ {{-item.ts | moment('from')}}</b>
        </span>
        <mu-icon-button icon="chevron_right" slot="action" :to="'/shopfaceid/' + item.key" />
      </mu-grid-tile>
    </mu-grid-list>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      faceList: [],
      ts: Date.now()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
  },
  created() {
    var self = this
    setInterval(function () {
      self.ts = Date.now()
    }, 1000)
  },
  mounted() {
    var self = this
    self.$firebase.database().ref('shops/recognize').orderByChild('ts').on('value', function (snapshot) {
      self.faceList = []
      snapshot.forEach(child => {
        var val = child.val()
        val.key = child.key
        self.faceList.push(val)
      })
    })
  }
}
</script>

<style scoped>

</style>
