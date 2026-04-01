<template>
    <div v-if="show" class="camera" >
        <div class="wrapper relative flex flex-wrap ">
            <div class="video-container w-full ">
                <video class="camera-video w-full mx-auto rounded-md border border-gray-300 " ref="camera" autoplay playsinline ></video>
                <canvas id="photoTaken" v-show="isPhotoTaken" class="canvas-photo mx-auto p-1 rounded-md my-2 w-full " :width="640" :height="480" ref="canvas" ></canvas>
            </div>
            <!-- Actions -->
            <div class="bg-white bg-opacity-90 p-2 rounded-tl-lg flex flex-wrap justify-center w-full hidden" >
                <n-tooltip trigger="hover" placement="top" >
                    <template #trigger>
                        <div class="" >
                            <svg 
                                class="w-6 h-6 text-gray-300 mx-2 my-1" 
                                @click="toggleCamera()" 
                                v-if="isCameraOpen" 
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3.502 4.209L2.146 2.854a.5.5 0 1 1 .708-.708l15 15a.5.5 0 0 1-.708.708l-.95-.95c-.22.062-.452.096-.691.096h-11a2.5 2.5 0 0 1-2.5-2.5v-8a2.5 2.5 0 0 1 1.497-2.291zM15.292 16l-2.84-2.84A4 4 0 0 1 6.84 7.547L4.306 5.013a1.5 1.5 0 0 0-1.3 1.486V14.5a1.5 1.5 0 0 0 1.5 1.5h10.788zm-3.554-3.555L7.555 8.262a3 3 0 0 0 4.184 4.184zm-3.3-6.128l.785.785a3.004 3.004 0 0 1 3.675 3.675l.785.785a4 4 0 0 0-5.246-5.246zm8.567 8.183c0 .118-.014.233-.04.344l.776.775a2.49 2.49 0 0 0 .264-1.119v-8a2.5 2.5 0 0 0-2.5-2.5h-1.69l-.585-1.17A1.5 1.5 0 0 0 11.888 2H8.124a1.5 1.5 0 0 0-1.34.826L6.194 4h-.073l.79.79a.5.5 0 0 0 .038-.065l.728-1.449A.5.5 0 0 1 8.124 3h3.764a.5.5 0 0 1 .447.276l.723 1.447a.5.5 0 0 0 .448.276h1.999a1.5 1.5 0 0 1 1.5 1.5V14.5z" fill="currentColor"></path></g></svg>
                            <svg 
                                class="w-6 h-6 text-gray-500 mx-2 my-1" 
                                @click="toggleCamera()" 
                                v-if="!isCameraOpen" 
                                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M10 6a4 4 0 1 0 0 8a4 4 0 0 0 0-8zm-3 4a3 3 0 1 1 6 0a3 3 0 0 1-6 0zm1.124-8a1.5 1.5 0 0 0-1.34.826L6.194 4h-1.69a2.5 2.5 0 0 0-2.5 2.5V14.5a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-8a2.5 2.5 0 0 0-2.5-2.5h-1.69l-.584-1.17A1.5 1.5 0 0 0 11.888 2H8.124zm-.447 1.275A.5.5 0 0 1 8.124 3h3.764a.5.5 0 0 1 .448.276l.723 1.447a.5.5 0 0 0 .447.276h1.999a1.5 1.5 0 0 1 1.5 1.5V14.5a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5v-8a1.5 1.5 0 0 1 1.5-1.5h1.998a.5.5 0 0 0 .446-.276l.728-1.449z" fill="currentColor"></path></g></svg>
                        </div>
                    </template> 
                    បើកកាំមេរ៉ា / បិទកាំមេរ៉ា  
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top" >
                    <template #trigger>
                        <svg 
                        class="w-6 h-6 text-green-500 mx-2 my-1" 
                        @click="takePhoto"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M9.4 10.5l4.77-8.26a9.984 9.984 0 0 0-8.49 2.01l3.66 6.35l.06-.1zM21.54 9c-.92-2.92-3.15-5.26-6-6.34L11.88 9h9.66zm.26 1h-7.49l.29.5l4.76 8.25A9.91 9.91 0 0 0 22 12c0-.69-.07-1.35-.2-2zM8.54 12l-3.9-6.75A9.958 9.958 0 0 0 2.2 14h7.49l-1.15-2zm-6.08 3c.92 2.92 3.15 5.26 6 6.34L12.12 15H2.46zm11.27 0l-3.9 6.76a9.984 9.984 0 0 0 8.49-2.01l-3.66-6.35l-.93 1.6z" fill="currentColor"></path></svg>
                    </template> 
                    ថតរូប  
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top" >
                    <template #trigger>
                        <svg 
                        class="w-6 h-6 text-blue-500 mx-2 my-1" 
                        @click="downloadImage"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2c-60 5.7-112 35.88-112 98.4S70 336 136 336h56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 400.1l64 63.9l64-63.9"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 224v224.03"></path></svg>
                    </template> 
                    ទាញយក  
                </n-tooltip>
            </div>
            <!-- End Actions -->
        </div>
    </div>
</template>
<script>
import { ref, reactive } from 'vue'
import { useRoute , useRouter } from 'vue-router'
export default {
    name: 'Camera' ,
    props: {
        getSnapshot: {
            type: Function
        },
        show: {
            type: Boolean ,
            default: true 
        }
    },
    setup(props){
        const isCameraOpen = ref(false)
        const isPhotoTaken = ref(false)
        const camera = ref(null)
        const canvas = ref(null)
        const photoDataUrlJpeg = ref(null)
        const photoDataUrlStream = ref(null)

        function createCameraElement () {
            const constraints = (window.constraints = {
                audio: false,
                video: true
            })

            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    // this.$refs.camera.srcObject = stream
                    camera.value.srcObject = stream
                })
                .catch(error => {
                    alert(error, "May the browser didn't support or there is some errors.")
                })
            }

        function stopCameraStream () {
            // const tracks = this.$refs.camera.srcObject.getTracks()
            const tracks = ref( camera.value.srcObject.getTracks() )
            tracks.value.forEach(track => {
                track.stop()
            })
            console.log('CameraClosed')
        }

        function toggleCamera () {
            if (isCameraOpen.value) {
                isCameraOpen.value = false
                isPhotoTaken.value = false
                stopCameraStream()
                console.log('closed')
            } else {
                isCameraOpen.value = true
                createCameraElement()
                console.log('open')
            }
        }
        
        function takePhoto () {
            
            // isPhotoTaken.value = !isPhotoTaken.value

            const context = canvas.value.getContext('2d')

            const photoFromVideo = camera.value
            context.drawImage(photoFromVideo, 0, 0, 640, 480)
            photoDataUrlJpeg.value = canvas.value.toDataURL("image/jpeg")
            photoDataUrlStream.value = photoDataUrlJpeg.value.replace("image/jpeg", "image/octet-stream")
            props.getSnapshot( photoDataUrlStream.value )  
            // const link = document.createElement("a")
            // link.href = photoDataUrlStream.value 
            // link.download = 'photo.jpeg'
            // link.click()          
        }

        function downloadImage() {
            // const download = document.getElementById("downloadPhoto");
            // const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
            // .replace("image/jpeg", "image/octet-stream")
            // const canvas = canvas.value.toDataURL("image/jpeg")
            // .replace("image/jpeg", "image/octet-stream")
            // console.log( canvas )
            // download.setAttribute("href", canvas);
            const link = document.createElement("a")
            link.href = photoDataUrlStream.value 
            link.download = 'photo.jpeg'
            link.click()
        }

        createCameraElement()

        return {
            isCameraOpen ,
            isPhotoTaken ,
            camera ,
            canvas ,
            createCameraElement ,
            stopCameraStream ,
            toggleCamera ,
            takePhoto ,
            downloadImage
        };
    }
}
</script>
<style scoped>

</style>