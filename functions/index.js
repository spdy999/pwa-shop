const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

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
