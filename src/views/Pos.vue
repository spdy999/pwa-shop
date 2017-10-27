<template>
  <div id="mainview">
    <mu-row gutter>
      <mu-col width="100" tablet="50" desktop="33">
        <div id="viewarea">
          <video ref="video" id="videoel" autoplay="true" playsinline preload="auto" :width="vdoWidth" :height="vdoHeight"></video>
          <canvas ref="overlay" id="overlay" :width="vdoWidth" :height="vdoHeight"></canvas>
        </div>
      </mu-col>
      <mu-col width="100" tablet="50" desktop="33">
        <mu-text-field hintText="Fullname" type="text" icon="account_circle" />
        <mu-text-field hintText="Age" type="text" icon="phone" />
        <mu-text-field hintText="Gender" type="text" icon="phone" />
      </mu-col>
      <mu-col width="100" tablet="50" desktop="33">
        {{happyIndex}}
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      imageCapture: null,
      videoTracks: [],
      videoTrackNo: 0,
      ctracker: null,
      overlayCC: null,
      vdoWidth: 300,
      vdoHeight: 225,
      ec: null,
      happyIndex: 0
    }
  },
  methods: {
    positionLoop() {
      requestAnimationFrame(this.positionLoop)
      this.overlayCC.clearRect(0, 0, this.vdoWidth, this.vdoHeight)
      if (this.ctracker.getCurrentPosition()) {
        this.ctracker.draw(this.$refs.overlay)
        // console.log(positions)
      }

      var cp = this.ctracker.getCurrentParameters()
      var er = this.ec.meanPredict(cp)
      if (er) {
        if (er[0].value > 0.5) {
          this.happyIndex = this.getHappy(er[0].value)
        } else {
          this.happyIndex = 0
        }
        console.log(er[0])
      }
    },
    getHappy(val) {
      return val
    }
  },
  beforeDestroy() {
    var tracks = this.$refs.video.srcObject.getVideoTracks()
    tracks[0].stop()
  },
  created() {
    var self = this
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    }

    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.')
    }

    navigator.mediaDevices.getUserMedia({
      video: true,
      /*
      video: {
        optional: [
          { minWidth: 320 },
          { minWidth: 640 },
          { minWidth: 1024 },
          { minWidth: 1280 },
          { minWidth: 1920 },
          { minWidth: 2560 }
        ]
      }, */
      audio: false
    })
      .then(mediaStream => {
        self.$refs.video.srcObject = mediaStream
        // document.querySelector('video').srcObject = mediaStream
        self.videoTracks = mediaStream.getVideoTracks()
        self.imageCapture = new window.ImageCapture(this.videoTracks[this.videoTrackNo])

        // var videoInput = document.getElementById('inputVideo')
        pModel.shapeModel.nonRegularizedVectors.push(9)
        pModel.shapeModel.nonRegularizedVectors.push(11)

        // console.log(pModel)
        var videoInput = self.$refs.video
        // self.vdoWidth = videoInput.width
        // self.vdoHeight = videoInput.height
        self.ctracker = new clm.tracker({ useWebGL: true })
        self.ctracker.init(pModel);
        self.ctracker.start(videoInput)

        delete emotionModel['disgusted']
        delete emotionModel['fear']
        delete emotionModel['angry']
        delete emotionModel['sad']
        delete emotionModel['surprised']
        self.ec = new emotionClassifier()
        self.ec.init(emotionModel)
        // console.log(self.ec)
        // console.log(self.ctracker)
        // console.log(self.ctracker.getCurrentPosition())
        self.overlayCC = self.$refs.overlay.getContext('2d')
        self.positionLoop()
      })
      .catch(error => console.log(error))
  }
}
</script>
<style scoped>
#viewarea {
  position: relative;
}
#overlay {
  position: absolute;
  top: 0px;
  left: 0px;
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}
#videoel {
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  -ms-filter: fliph; /*IE*/
  filter: fliph; /*IE*/
}
#mainview {
}
</style>
