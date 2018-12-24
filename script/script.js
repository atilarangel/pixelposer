const video = document.getElementsByTagName('video')
const vd = document.getElementById('video')
const canvas = document.getElementsByTagName('canvas')
const cv = document.getElementById('canvas')
let ctx = cv.getContext('2d')

const w = window.innerWidth
const h = window.innerHeight

canvas[0].setAttribute('height', h)
canvas[0].setAttribute('width', w)
video[0].setAttribute('height', h)
video[0].setAttribute('width', w)

var imageScaleFactor = 0.5
var outputStride = 16
var flipHorizontal = false

const pose = (imageElement) => posenet.load()
.then((net) => {
  return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
})
.then((pose) => {
  ctx.clearRect(0, 0, w, h)
  ctx.beginPath()
  ctx.drawImage(imageElement, 0, 0, w, h)
  ctx.closePath()
  pose.keypoints.forEach(elm => {
    let x = elm['position'].x
    let y = elm['position'].y
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI, true)
    ctx.fillStyle = 'green'
    ctx.fill()
    ctx.closePath()
  })
  console.log(pose.keypoints)
})

const webcam = () => navigator.mediaDevices
.getUserMedia({
  audio: false,
  video: {
    mirrored: false,
    facingMode: "user",
    width: w,
    height: h
  }
})
.then(stream => {
  vd.srcObject = stream
  vd.onloadedmetadata = () => {
    vd.play()
  }
})

const detectFrame = () =>
  requestAnimationFrame(() => {
    return pose(vd)
    .then(()=>{
      // ctx.restore()
      return detectFrame()
    })
  })


webcam()
.then(()=>
  detectFrame()
)
