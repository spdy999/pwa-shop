<template>
  <div>
    <div v-show="step===0">
      <div style="position: absolute; bottom:0; width:100%; padding:0 10px; z-index:999">
        <mu-raised-button class="btnCamera" fullWidth secondary icon="arrow_back" label="Cancel" @click="handleCancel" />
        <mu-raised-button :disabled="!allowCapture" class="btnCamera" fullWidth primary icon="camera" label="Capture" @click="handleCapture" />
      </div>
      <video ref="video" id="video" autoplay="true" width="100%"></video>
    </div>
    <div v-show="step===1">
      <div style="position: absolute; bottom:0; width:100%; padding:0 10px; z-index:999">
        <div v-show="!btnDisabled">
          <mu-raised-button class="btnCamera" fullWidth secondary icon="arrow_back" label="Re-Capture Again" @click="handleReCapture" />
          <mu-raised-button class="btnCamera" fullWidth primary icon="save" label="Save Change" @click="handleSave" />
        </div>
        <div v-show="btnDisabled">
          <mu-raised-button class="btnCamera" :disabled="true" fullWidth primary icon="hourglass_empty" label="Saving..." />
        </div>
      </div>
      <img id="preview" :src="captureData" width="100%" />
    </div>
    <!--
                                                        <div :class="viewMode?'orientationH':'orientationV'">
                                                          <div class="cameraButton">
                                                            <mu-raised-button class="cameraBtn1" fullWidth secondary icon="arrow_back" label="Back" @click="handleCancel" :disabled="captureDisabled" />
                                                          </div>
                                                          <div class="cameraButton">
                                                            <mu-raised-button class="cameraBtn2" fullWidth primary icon="camera" :label="captureLabel[captureStatus]" @click="handleCapture" :disabled="captureDisabled" />
                                                          </div>
                                                          <div style="clear:both"></div>
                                                        </div>
                                                        <div v-if="captureMode === 'vdo'">
                                                          <video ref="video" autoplay="true" width="100%"></video>
                                                        </div>
                                                        <div v-if="captureMode === 'preview'">
                                                          <img :src="captureData" style="width:100%" />>
                                                        </div>
                                                        -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Kairos from 'kairos-api'
var client = new Kairos('60bb2ea7', '72f2ce0103471c4e4a838d443ffb6cee')
export default {
  data() {
    return {
      width: 640,
      height: 480,
      step: 0,
      viewMode: 0, // 0 = vertical, 1 = horizontal
      videoTracks: [],
      videoTrackNo: 0,
      imageCapture: null,
      btnDisabled: false,
      captureLabel: ['Capture', 'Uploading'],
      captureStatus: 0,
      captureMode: 'vdo',
      captureData: null,
      allowCapture: true
    }
  },
  computed: {
    ...mapState(['user'])
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
      video: {
        optional: [
          { minWidth: 320 },
          { minWidth: 640 },
          { minWidth: 1024 },
          { minWidth: 1280 },
          { minWidth: 1920 },
          { minWidth: 2560 }
        ]
      },
      audio: false
    })
      .then(mediaStream => {
        self.$refs.video.srcObject = mediaStream
        self.videoTracks = mediaStream.getVideoTracks()
        self.imageCapture = new window.ImageCapture(self.videoTracks[self.videoTrackNo])
      })
      .catch(error => console.log(error))
  },
  beforeDestroy() {
    var tracks = this.$refs.video.srcObject.getVideoTracks()
    tracks[0].stop()
  },
  methods: {
    handleSave() {
      var self = this
      if (self.user) {
        self.btnDisabled = true
        var canvas = this.getCapture()

        client.enroll({
          image: canvas.toDataURL('image/jpeg'),
          subject_id: self.user.uid,
          gallery_name: 'SID'
        })
          .then(res => {
            console.log(res)
            self.$firebase.database().ref('users/' + self.user.uid + '/enroll/').push(res.body)
            return res.body.uploaded_image_url
          })
          .then(res => {
            console.log(res)
            return self.$firebase.database().ref('users/' + self.user.uid + '/profile/').set({
              displayName: self.user.displayName,
              uid: self.user.uid,
              photoURL: self.user.photoURL,
              avatarURL: res
            })
          })
          .then(res => {
            self.btnDisabled = false
            self.step = 0
            // self.$router.push('/profile')
          })
      }
      /* upload cloud storage
      this.uploadCloudStorage(canvas.toDataURL('image/jpeg'), canvas.width, canvas.height)
        .then(res1 => {
          console.log(res1)
          return self.$firebase.database().ref('users/' + self.user.uid + '/profile').update({
            avatarURL: res1.downloadURL,
            displayName: self.user.displayName,
            email: self.user.email,
            uid: self.user.uid
          })
        })
        .then(res2 => {
          self.btnDisabled = false
          self.step = 0
          self.$router.push('/profile')
        })
        */
    },
    handleReCapture() {
      this.step = 0
    },
    handleTrack() {
      if (this.videoTrackNo + 1 < this.videoTracks.length) {
        this.videoTrackNo++
      } else {
        this.videoTrackNo = 0
      }
    },
    getUserMediaSuccess(stream) {
      var video = this.$refs.video
      video.src = window.URL.createObjectURL(stream)
    },
    handleCancel() {
      this.$router.push('/profile')
    },
    handleCapture() {
      var canvas = this.getCapture()
      this.captureData = canvas.toDataURL('image/jpeg')
      this.step = 1
      /*
      this.captureDisabled = true
      this.captureStatus = 1
      var canvas = this.getCapture()
      this.captureData = canvas.toDataURL('image/jpeg')
      this.captureMode = 'preview'
      */
      /*
      this.uploadCloudStorage(canvas.toDataURL('image/jpeg'), canvas.width, canvas.height)
        .then(res => {
          console.log('Success')
          console.log(res)
          this.captureDisabled = false
          this.captureStatus = 0
        })
        .catch(err => {
          console.log('Error')
          console.log(err)
          this.captureDisabled = false
          this.captureStatus = 0
        })
      */
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
    uploadCloudStorage(imgDataURL, imgWidth, imgHeight) {
      var message = imgDataURL
      // var fileName = (Date.now()).toString() + '.jpg'
      var fileName = this.user.uid + '.jpg'
      var storageRef = this.$firebase.storage().ref('users/' + fileName)
      var metadata = {
        customMetadata: {
          // width: imgWidth,
          // height: imgHeight,
          uid: this.user ? this.user.uid : ''
        }
      }
      return storageRef.putString(message, 'data_url', metadata)
    }
  }
}

</script>
<style scoped>
.btnCamera {
  height: 50px;
  margin-bottom: 10px;
}

#video {
  position: absolute;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}

#preview {
  position: absolute;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}
</style>
