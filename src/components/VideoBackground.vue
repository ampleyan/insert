<template>
  <div class="video-container">
    <!-- YouTube Player -->
    <iframe
      v-if="isYoutubeVideo"
      :src="youtubeEmbedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="background-video"
    ></iframe>
    <!-- Local Video Player -->
    <video v-else id="background-video" autoplay loop playsinline ref="videoElement">
      <source :src="videoSource" type="video/mp4" />
    </video>
  </div>
</template>

<script>
  export default {
    name: 'VideoBackground',
    props: {
      file: {
        type: Object,
        default: () => {},
      },
      isMute: {
        type: Boolean,
        default: false,
      },
      inputUrl: {
        type: String,
      },
      isPlaying: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isMuted: false,
        isPlayingVar: this.isPlaying,

        videoSource: require('@/assets/video/back.mp4'),
        videoUrl: this.inputUrl,
        isYoutubeVideo: false,
        youtubeEmbedUrl: '',
        fileSource: this.file,
      };
    },
    watch: {
      isPlaying(newValue) {
        this.isPlayingVar = newValue;
        this.startVideo();
      },
      inputUrl(newValue) {
        this.videoUrl = newValue;
        this.handleUrlInput();
      },
      isMute(newValue) {
        this.isMuted = newValue;
        this.handleMuteChange();
      },
      file(newValue) {
        this.fileSource = newValue;
        this.handleFileUpload();
      },
    },
    methods: {
      handleMuteChange() {
        if (this.$refs.videoElement) {
          this.$refs.videoElement.muted = this.isMuted;
        }
      },
      handleFileUpload(event) {
        const file = this.fileSource ? this.fileSource : event.target.files[0];
        if (file) {
          this.isYoutubeVideo = false;
          this.videoSource = URL.createObjectURL(file);
          this.$nextTick(() => {
            if (this.$refs.videoElement) {
              this.$refs.videoElement.load();
              this.$refs.videoElement.play().catch((error) => {
                console.log('Video playback failed:', error);
              });
            }
          });
        }
      },
      getYoutubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      },
      startVideo() {
        if (this.$refs.videoElement) {
          this.$refs.videoElement
            .play()
            .then(() => {
              this.isPlayingVar = true;
            })
            .catch((error) => {
              console.log('Video playback failed:', error);
            });
        }
      },
      handleUrlInput() {
        if (!this.videoUrl) return;

        const youtubeId = this.getYoutubeVideoId(this.videoUrl);

        if (youtubeId) {
          this.isYoutubeVideo = true;
          this.youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&mute=1`;
        } else {
          // Handle as direct video URL
          this.isYoutubeVideo = false;
          this.videoSource = this.videoUrl;
          this.$nextTick(() => {
            if (this.$refs.videoElement) {
              this.$refs.videoElement.load();
              this.$refs.videoElement.play().catch((error) => {
                console.log('Video playback failed:', error);
              });
            }
          });
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        if (this.$refs.videoElement) {
          this.startVideo();
        }
      });
    },
    beforeUnmount() {
      if (this.videoSource && this.videoSource.startsWith('blob:')) {
        URL.revokeObjectURL(this.videoSource);
      }
    },
  };
</script>

<style scoped>
  .play-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    z-index: 2;
  }

  .background-video,
  #background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }

  .controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 5px;
    color: white;
  }

  .source-control {
    margin-bottom: 10px;
    display: flex;
    gap: 5px;
  }

  .source-control input[type='text'] {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    flex-grow: 1;
  }

  .source-control button {
    padding: 5px 10px;
    border-radius: 3px;
    border: none;
    background: white;
    cursor: pointer;
  }

  .mute-control {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
  }

  .upload-control {
    margin: 10px 0;
  }

  input[type='file'] {
    color: white;
  }

  input[type='file']::-webkit-file-upload-button {
    background: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }

  .play-button {
    padding: 15px 30px;
    font-size: 1.2em;
    background-color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .play-button:hover {
    transform: scale(1.1);
  }
</style>
