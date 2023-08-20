<template>
  <div>
    <div class="full-container">
      <starfield :lightSpeed="lightSpeed"></starfield>
      <div class="top-logo">
        <img :src="require('../assets/CO_LOGO.jpg')" />
      </div>
      <div class="splash-text">
        WELCOME EXPLORER
        <div class="subtext">
          prepare to
          <span
            >{{ currentText }}<span class="cursor" v-if="showCursor"></span
          ></span>
        </div>
      </div>
      <div class="login-box">
        <h4>Login</h4>

        <loading-spinner :loading="isAutoLoggingIn" />

        <account-login
          v-if="!isAutoLoggingIn"
          @loginSuccess="login"
        ></account-login>
      </div>
      <div class="bottom-nav">
        <div class="bottom-left">
          <router-link
            :to="{ name: 'privacy-policy' }"
            class="me-2"
            title="Privacy Policy"
          >
            <i class="fas fa-file-alt"></i>
          </router-link>
          <a
            href="https://discord.gg/XfqPrSP8Q4"
            target="_blank"
            title="Discord"
            class="me-2"
          >
            <i class="fab fa-discord"></i>
          </a>
          <a
            href="https://www.buymeacoffee.com/gavinpierce"
            target="_blank"
            class="text-warning"
            ><i class="fas fa-coffee me-1"></i>Donate</a
          >
        </div>
        <a
          href="https://docs.cosmic-odyssey.io"
          target="_blank"
          class="bottom-right text-primary me-2"
        >
          <i class="fas fa-graduation-cap me-1"></i>Learn to Play
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Starfield from "./components/Starfield";
import AccountLoginVue from "./account/components/Login";
import ApiAuthService from "../services/api/auth";
import router from "../router";
import LoadingSpinnerVue from "./components/LoadingSpinner.vue";
import wooshAudio from "../assets/audio/woosh.mp3";

export default {
  components: {
    "account-login": AccountLoginVue,
    "loading-spinner": LoadingSpinnerVue,
    starfield: Starfield
  },
  data() {
    return {
      isAutoLoggingIn: false,
      words: ["BLAST-OFF", "EXPLORE", "CONQUER", "TEAM-UP", "ADAPT", "BUILD", "COMMUNICATE", "TRADE", "DISCOVER", "DEVELOP", "DECIMATE", "DEFEAT", "DETHRONE", "DRIFT", "DESTROY", "DEFEND", "DETECT", "TERRAFORM", "COLONIZE", "ADMINISTER", "ANTICIPATE", "ASCEND", "ATTACK", "ACHIEVE", "ACCOMPLISH", "ACTIVATE", "ACQUIRE", "ADVANCE", "AMAZE", "ASSIST", "AMBUSH", "ANALYZE"],
      wordIndex: 0,
      letterIndex: 0,
      currentText: "",
      typing: true,
      showCursor: true,
      lightSpeed: false,
      launchAudio: null
    };
  },
  async mounted() {
    this.isAutoLoggingIn = true;
    this.launchAudio = new Audio(wooshAudio);

    try {
      let response = await ApiAuthService.verify();

      if (response.status === 200) {
        if (response.data._id) {
          this.$store.commit("setUserId", response.data._id);
          this.$store.commit("setUsername", response.data.username);
          this.$store.commit("setRoles", response.data.roles);
          this.$store.commit("setUserCredits", response.data.credits);

          router.push({ name: "main-menu" });
        }
      }
    } catch (err) {
      console.error(err);
    }

    this.isAutoLoggingIn = false;
    this.typeEffect();
  },
  computed: {
    documentationUrl() {
      return process.env.VUE_APP_DOCUMENTATION_URL;
    }
  },
  methods: {
    login() {
      this.lightSpeed = true;
      this.launchAudio.play();
      setTimeout(() => {
        router.push({ name: "main-menu" });
      }, 1000);
    },
    typeEffect() {
      if (this.typing) {
        if (this.letterIndex < this.words[this.wordIndex].length) {
          this.currentText += this.words[this.wordIndex][this.letterIndex];
          this.letterIndex++;
        } else {
          this.typing = false;
          setTimeout(() => {
            this.typeEffect();
          }, 2000); // Wait for 2 seconds before starting to delete
          return;
        }
      } else {
        if (this.letterIndex > 0) {
          this.currentText = this.words[this.wordIndex].substring(
            0,
            this.letterIndex - 1
          );
          this.letterIndex--;
        } else {
          this.typing = true;
          this.wordIndex = (this.wordIndex + 1) % this.words.length; // Move to the next word or loop back to the start
          setTimeout(() => {
            this.typeEffect();
          }, 500); // Wait for 0.5 seconds before starting to type the next word
          return;
        }
      }
      setTimeout(this.typeEffect, this.typing ? 100 : 50);
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/anurati");

.top-logo {
  position: absolute;
  top: 0;
  width: 100%;
  height: 5em;
  background-color: transparent;
  margin-top: 2em;
}
@media (min-width: 622px) {
  .top-logo {
    height: 10em;
    margin-top: 2em;
  }
}
.top-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: transparent;
  color: #ffffff;
  text-align: center;
  font-family: "Chakra Petch", sans-serif;
  font-size: 20px;
  font-weight: 500;
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.splash-text {
  text-align: center;
  font-family: "Anurati", sans-serif;
  max-width: 13em;
  font-size: 50px; /* or whatever size you need */
  font-weight: bold; /* or whatever weight you need */
  height: min-content;
  /* Gradient properties */
  background-image: linear-gradient(
    to bottom right,
    rgb(175, 175, 174),
    rgb(161, 161, 161),
    #ffffff,
    #ffffff
  );

  /* Make the text transparent and clip the background to it */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.subtext {
  font-weight: 500;
  font-family: "Chakra Petch", sans-serif;
  font-size: 30px; /* or whatever size you need */
}
.subtext span {
  color: rgb(249, 219, 52);
}
.cursor {
  border-right: 2px solid white; /* Cursor effect */
  padding-right: 5px;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.login-box {
  height: min-content;
  padding-top: 2em;
}
.full-container {
  background-color: transparent;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: center;
}
</style>
