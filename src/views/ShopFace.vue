<template>
  <div>
    <mu-card>
      <mu-card-text>
        <video v-if="step===0" ref="video" id="video" autoplay="true" width="100%"></video>
        <img id="preview" :src="captureData" width="100%" v-if="step==1" />
      </mu-card-text>
      <mu-card-actions>

        <mu-raised-button icon="search" :disabled="btnCaptureDisabled" v-model="btnCapture" primary :label="btnCapture" fullWidth @click="handleCapture" />
        <br /><br />
        <mu-raised-button icon="photo_library" secondary label="Go to face list" fullWidth to="/shopfacelist" />
      </mu-card-actions>
    </mu-card>
  </div>
</template>
<script>

import { mapState } from 'vuex'
import Kairos from 'kairos-api'
var client = new Kairos('60bb2ea7', '72f2ce0103471c4e4a838d443ffb6cee')
export default {
  data() {
    return {
      step: 0,
      captureData: '',
      btnCapture: 'Capture & Identify',
      btnCaptureDisabled: false,
      videoTracks: null,
      imageCapture: null,
      videoTrackNo: 0
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    handleCapture() {
      var self = this
      var canvas = this.getCapture()
      this.captureData = canvas.toDataURL('image/jpeg')
      this.step = 1
      this.btnCapture = 'Identifying'
      this.btnCaptureDisabled = true
      this.getIdentify(this.captureData)
        .then(res => {
          console.log(res)
          if (res.body.images && res.body.images.length > 0) {
            var _confidence = 0
            var _subject_id = ''
            for (var i = 0; i < res.body.images.length; i++) {
              if (res.body.images[i].transaction.confidence > _confidence) {
                _subject_id = res.body.images[i].transaction.subject_id
                _confidence = res.body.images[i].transaction.confidence
              }
            }

            if (_subject_id !== '') {
              // return Promise.resolve({ res: res, ref: self.$firebase.database().ref('users/' + _subject_id + '/profile').once('value') })
              return self.$firebase.database().ref('users/' + _subject_id + '/profile').once('value')
                .then(snapshot => {
                  var val = snapshot.val()
                  var displayName = val.displayName ? val.displayName : ''
                  var ts = Date.now()
                  var resData = {
                    images: res.body.images,
                    uploaded_image_url: res.body.uploaded_image_url,
                    uid: _subject_id,
                    confidence: _confidence,
                    ts: -ts,
                    displayName: displayName
                  }
                  return self.$firebase.database().ref('shops/recognize').push(resData)
                })
                .catch(err => {
                  return Promise.reject('not found')
                })
            } else {
              return Promise.reject(res)
            }
          } else {
            return Promise.reject(res)
          }
        })
        .then(snap => {
          console.log('Success')
          console.log(snap)
          self.$router.push('/shopfaceid/' + snap.key)
        })
        .catch(err => {
          console.log('Error')
          console.log(err)
        })
    },
    getCapture() {
      var video = this.$refs.video
      if (!this.ctx) {
        let canvas = document.createElement('canvas')
        canvas.height = video.clientHeight
        canvas.width = video.clientWidth
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
      }
      const { ctx, canvas } = this
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      // console.log('Capture: ' + canvas.width + 'x' + canvas.height)
      return canvas
    },
    getIdentify(imageData) {
      return client.recognize({
        image: imageData,
        gallery_name: 'SID'
      })
    }
  },
  beforeDestroy() {
    var tracks = this.$refs.video.srcObject.getVideoTracks()
    tracks[0].stop()
  },
  created() {
    var self = this
    // var mediaOptions = { audio: false, video: true }

    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    }

    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.')
    }
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
      .then(mediaStream => {
        self.$refs.video.srcObject = mediaStream
        self.videoTracks = mediaStream.getVideoTracks()
        self.imageCapture = new window.ImageCapture(self.videoTracks[self.videoTrackNo])
      })
      .catch(error => console.log(error))
  }
}
</script>

<style scoped>
#video {
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}

#preview {
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}
</style>
