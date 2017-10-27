<template>
  <div>
    <div v-show="step===0">
      <div style="position: absolute; bottom:0; width:100%; padding:0 10px; z-index:999">
        <mu-raised-button class="btnCamera" fullWidth secondary icon="arrow_back" label="Cancel" @click="handleCancel" />
        <mu-raised-button :disabled="!allowCapture" class="btnCamera" fullWidth primary icon="camera" label="Capture" @click="handleCapture" />
      </div>
      <video ref="video" id="videoid" autoplay="true" :width="width" :height="height"></video>
      <canvas id="canvasid" :width="width" :height="height"></canvas>
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
      width: 320,
      height: 240,
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
      canvasOutput: null,
      canvasOutputCtx: null,
      canvasInput: null,
      canvasInputCtx: null,
      canvasBuffer: null,
      canvasBufferCtx: null,
      srcMat: null,
      grayMat: null,
      detectFace: true,
      detectEye: false,
      faceClassifier: null,
      eyeClassifier: null
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
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
        // self.width = window.innerWidth
        // self.height = window.innerHeight

        self.$refs.video.srcObject = mediaStream
        console.log(self.height)
        // document.querySelector('video').srcObject = mediaStream
        self.videoTracks = mediaStream.getVideoTracks()
        self.imageCapture = new window.ImageCapture(this.videoTracks[this.videoTrackNo])

        // openCV
        self.canvasOutput = document.getElementById('canvasid');
        self.canvasOutputCtx = self.canvasOutput.getContext('2d');

        self.canvasInput = document.createElement('canvas')
        self.canvasInput.width = self.width
        self.canvasInput.height = self.height
        self.canvasInputCtx = self.canvasInput.getContext('2d')

        self.canvasBuffer = document.createElement('canvas')
        self.canvasBuffer.width = self.width
        self.canvasBuffer.height = self.height
        self.canvasBufferCtx = self.canvasBuffer.getContext('2d')
        self.srcMat = new cv.Mat(self.height, self.width, cv.CV_8UC4)
        self.grayMat = new cv.Mat(self.height, self.width, cv.CV_8UC1)

        self.faceClassifier = new cv.CascadeClassifier()
        self.faceClassifier.load('/js/wasm/haarcascade_frontalface_default.xml')
        self.eyeClassifier = new cv.CascadeClassifier()
        self.eyeClassifier.load('/js/wasm/haarcascade_eye.xml')
        requestAnimationFrame(self.processVideo)
      })
      .catch(error => console.log(error))
  },
  methods: {
    processVideo() {
      var video = this.$refs.video
      var self = this
      self.canvasInputCtx.drawImage(video, 0, 0, self.width, self.height)
      let imageData = self.canvasInputCtx.getImageData(0, 0, self.width, self.height)
      self.srcMat.data.set(imageData.data)
      cv.cvtColor(self.srcMat, self.grayMat, cv.COLOR_RGBA2GRAY)
      let faces = []
      let eyes = []
      let size
      if (self.detectFace) {
        let faceVect = new cv.RectVector()
        let faceMat = new cv.Mat()
        if (self.detectEye) {
          cv.pyrDown(self.grayMat, faceMat)
          size = faceMat.size()
        } else {
          cv.pyrDown(self.grayMat, faceMat)
          if (self.width > 320)
            cv.pyrDown(faceMat, faceMat)
          size = faceMat.size()
        }
        console.log('detectMultiScale')
        console.log(faceMat)
        console.log(faceVect)
        self.faceClassifier.detectMultiScale(faceMat, faceVect)
        for (let i = 0; i < faceVect.size(); i++) {
          let face = faceVect.get(i)
          faces.push(new cv.Rect(face.x, face.y, face.width, face.height))
          if (self.detectEye) {
            let eyeVect = new cv.RectVector()
            let eyeMat = faceMat.roi(face)
            eyeClassifier.detectMultiScale(eyeMat, eyeVect)
            for (let i = 0; i < eyeVect.size(); i++) {
              let eye = eyeVect.get(i)
              eyes.push(new cv.Rect(face.x + eye.x, face.y + eye.y, eye.width, eye.height))
            }
            eyeMat.delete()
            eyeVect.delete()
          }
        }
        faceMat.delete()
        faceVect.delete()
      } else {
        if (self.detectEye.checked) {
          let eyeVect = new cv.RectVector()
          let eyeMat = new cv.Mat()
          cv.pyrDown(self.grayMat, eyeMat)
          size = eyeMat.size()
          eyeClassifier.detectMultiScale(eyeMat, eyeVect)
          for (let i = 0; i < eyeVect.size(); i++) {
            let eye = eyeVect.get(i)
            eyes.push(new cv.Rect(eye.x, eye.y, eye.width, eye.height))
          }
          eyeMat.delete()
          eyeVect.delete()
        }
      }
      self.canvasOutputCtx.drawImage(self.canvasInput, 0, 0, self.width, self.height)
      self.drawResults(self.canvasOutputCtx, faces, 'red', size)
      self.drawResults(self.canvasOutputCtx, eyes, 'yellow', size)
      requestAnimationFrame(this.processVideo)
    },
    drawResults(ctx, results, color, size) {
      for (let i = 0; i < results.length; ++i) {
        let rect = results[i];
        let xRatio = videoWidth / size.width;
        let yRatio = videoHeight / size.height;
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.strokeRect(rect.x * xRatio, rect.y * yRatio, rect.width * xRatio, rect.height * yRatio);
      }
    },
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
      this.videoTracks[this.videoTrackNo].stop()
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

#videoid {
  position: absolute;
}

#canvasid {
  position: absolute;
}
</style>
