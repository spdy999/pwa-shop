<template>
  <div>
    <div v-show="step===0">
      <div style="position: absolute; bottom:0; width:100%; padding:0 10px; z-index:999">
        <mu-raised-button class="btnCamera" fullWidth secondary icon="arrow_back" label="Cancel" @click="handleCancel" />
        <mu-raised-button :disabled="!allowCapture" class="btnCamera" fullWidth primary icon="camera" label="Capture" @click="handleCapture" />
      </div>
      <video ref="video" id="video" autoplay="true" :width="width" :height="height"></video>
      <canvas id="canvas" ref="canvas" :width="width" :height="height"></canvas>
    </div>
    <div v-show="step===1">
      <img :src="captureData" :width="width" :height="height" />
      <div style="position: absolute; bottom:0; width:100%; padding:0 10px">
        <div v-show="!btnDisabled">
          <mu-raised-button class="btnCamera" fullWidth secondary icon="arrow_back" label="Re-Capture Again" @click="handleReCapture" />
          <mu-raised-button class="btnCamera" fullWidth primary icon="save" label="Save Change" @click="handleSave" />
        </div>
        <div v-show="btnDisabled">
          <mu-raised-button class="btnCamera" :disabled="true" fullWidth primary icon="hourglass_empty" label="Saving..." />
        </div>
      </div>
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
      allowCapture: false,
      video: null,
      canvas: null,
      context: null,
      tracker: null,
      trackerTask: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    var self = this
    self.video = document.getElementById('video')
    self.canvas = document.getElementById('canvas')
    self.context = self.canvas.getContext('2d')
    self.tracker = new tracking.ObjectTracker('face')
    self.tracker.setInitialScale(4)
    self.tracker.setStepSize(2)
    self.tracker.setEdgesDensity(0.1)
    self.trackerTask = tracking.track('#video', self.tracker, { camera: true })
    self.tracker.on('track', function (event) {
      self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
      event.data.forEach(function (rect) {
        self.context.strokeStyle = '#a64ceb';
        self.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        self.context.font = '11px Helvetica';
        self.context.fillStyle = "#fff";
        self.context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        self.context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      });
    });
  },
  beforeDestroy() {
    this.trackerTask.stop()
    var tracks = this.$refs.video.srcObject.getVideoTracks()
    tracks[0].stop()
  },
  methods: {
    handleSave() {
      var self = this
      this.btnDisabled = true
      // this.$router.push('/profile')
      setTimeout(function () {
        self.$router.push('/profile')
      },
        2000)
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
      var fileName = (Date.now()).toString() + '.jpg'
      var storageRef = this.$firebase.storage().ref('camera/' + fileName)
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

#canvas {
  position: absolute;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
  z-index: 999;
}
</style>
