const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const cognitiveServices = require('cognitive-services')
const cognitiveConfig = {
  face: {
    endpoint: 'westcentralus.api.cognitive.microsoft.com',
    apiKey: '27d41fb26c384306b36f0a1133755f37'
  }
}
/*
var Kairos = require('kairos-api')
var client = new Kairos('60bb2ea7', '72f2ce0103471c4e4a838d443ffb6cee')

exports.enrollFace = functions.database.ref('/users/{uid}/profile/avatarURL')
  .onUpdate(event => {
    const original = event.data.val()
    const uid = event.params.uid
    var params = {
      image: original,
      subject_id: uid,
      gallery_name: 'gallerytest1',
      selector: 'SETPOSE'
    }
    console.log('enrollFace', event.params.uid, original)
    return client.enroll(params)
      .then(function (result) {
        console.log('enrollResult', result)
        return admin.database().ref('/users/' + uid + '/enroll/').push(result)
      })
  })
*/

// const gcs = require('@google-cloud/storage')({ keyFilename: './service-account.json' })
exports.cameraUpload = functions.storage.object().onChange(event => {
  const file = event.data // The Storage object.
  console.log(file)
  var filePath = file.name.split('/')[0]

  // const fileBucket = object.bucket // The Storage bucket that contains the file.
  // const filePath = object.name // File path in the bucket.
  const contentType = file.contentType // File content type.
  const resourceState = file.resourceState // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  // const metageneration = object.metageneration // Number of times metadata has been generated. New objects have a value of 1.

  if (!contentType.startsWith('image/')) {
    console.log('This is not image.')
    return false
  }
  if (resourceState === 'not_exists') {
    console.log('This is a deletion event.')
    return false
  }

  if (filePath === 'shop_outside' || filePath !== 'shop_instore') {

    const face = new cognitiveServices.face({
      apiKey: cognitiveConfig.face.apiKey,
      endpoint: cognitiveConfig.face.endpoint
    })
    const parameters = {
      returnFaceId: 'true',
      returnFaceLandmarks: 'false',
      returnFaceAttributes: 'age,gender,smile'
      // returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses'
    }
    const headers = {
      'Content-type': 'application/json'
    }
    const body = {
      url: file.mediaLink
    }

    var ts = Date.now()

    return face.detect({
      parameters,
      headers,
      body
    })
      .then((response) => {
        console.log(response)
        return admin.database().ref('shops/' + filePath).push({
          file: file,
          face: response,
          ts: -ts
        })
        // return event.data.ref.parent.child('detect').set(response)
      })
      .catch((err) => {
        return admin.database().ref('shops/' + filePath).push({
          file: file,
          error: err,
          ts: -ts
        })
      })
  } else {
    return Promise.reject('Invalid path: ' + filePath)
  }
})

exports.cashierUpload = functions.database.ref('/shops/recognize/{pushId}/uploaded_image_url')
  .onCreate(event => {
    // Grab the current value of what was written to the Realtime Database.
    var val = event.data.val()
    var photoURL = val
    if (val) {
      console.log('Cognitive detection', event.params.pushId, photoURL)

      const face = new cognitiveServices.face({
        apiKey: cognitiveConfig.face.apiKey,
        endpoint: cognitiveConfig.face.endpoint
      })

      const parameters = {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        returnFaceAttributes: 'age,gender,smile'
        // returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses'
      }
      const headers = {
        'Content-type': 'application/json'
      }
      const body = {
        url: photoURL
      }
      return face.detect({
        parameters,
        headers,
        body
      })
        .then((response) => {
          console.log(response)
          return event.data.ref.parent.child('face').set(response)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      return Promise.reject('no value')
    }
  })
