<template>
  <div>
    <div v-if="mode==='main'">
      <mu-list>
        <mu-sub-header>Gallery List</mu-sub-header>
        <template v-for="(item,idx) in galleryList" v-if="galleryList.length">
          <mu-list-item :title="item" v-bind:key="idx" @click="handleGalleryView(item)">
            <mu-icon slot="left" value="insert_photo" />
          </mu-list-item>
        </template>
        <template v-if="!galleryList.length">
          <mu-list-item>No gallery</mu-list-item>
        </template>
      </mu-list>
    </div>
    <div v-if="mode==='galleryView'">
      <mu-list>
        <mu-flat-button label="Back" @click="handleMain()" icon="arrow_back"></mu-flat-button>
        <template v-for="(item,idx) in subjectList">
          <mu-list-item :title="item.subject_id" v-bind:key="idx" @click="handleDelete(item.gallery_name, item.subject_id)">
            <mu-icon slot="left" value="delete" />
          </mu-list-item>
        </template>
      </mu-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Kairos from 'kairos-api'
var client = new Kairos('60bb2ea7', '72f2ce0103471c4e4a838d443ffb6cee')
export default {
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      mode: 'main',
      galleryList: [],
      subjectList: []
    }
  },
  mounted() {
    this.handleGalleryList()
  },
  methods: {
    handleGalleryList() {
      var self = this
      client.galleryListAll()
        .then(res => {
          self.galleryList = res.body.gallery_ids
        })
    },
    handleDelete(gallery_name, subject_id) {
      var self = this
      if (confirm('Delete?')) {
        client.galleryRemoveSubject({
          gallery_name: gallery_name,
          subject_id: subject_id
        })
          .then(res => {
            self.mode = 'main'
          })
      }
    },
    handleMain() {
      this.mode = 'main'
    },
    handleGalleryView(gallery_name) {
      var self = this
      client.galleryView({
        gallery_name: gallery_name
      })
        .then(res => {
          if (res.body.Errors && res.body.Errors.length) {
            if (res.body.Errors[0].ErrCode === 5004) {
              alert('Gallery is empty.')
              self.handleGalleryList()
              self.mode = 'main'
            }
          } else {
            console.log(res)
            self.subjectList = []
            for (var i = 0; i < res.body.subject_ids.length; i++) {
              self.subjectList.push({
                gallery_name: gallery_name,
                subject_id: res.body.subject_ids[i]
              })
            }
            self.mode = 'galleryView'
          }
        })
    }
  }
}
</script>

<style lang="scss">

</style>
