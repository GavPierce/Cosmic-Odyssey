<template>
  <div>
    <div class="full-container">
      <starfield :lightSpeed="lightSpeed"></starfield>
      <div class="top-logo">
        <img :src="require('../assets/CO_LOGO.png')" />
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
        <!-- Add the "Forgot Password/Username?" placeholder here. -->
        <div class="forgot-credentials">
        </div>
        <div class="volume-controls" v-if="!isFirefox">
            <a v-if="isMusicPlaying" @click="toggleBackgroundMusic" title="Music">
              <i class="fas fa-volume-up"></i>
            </a>
            <a v-else @click="toggleBackgroundMusic" title="Music">
              <i class="fas fa-volume-mute"></i>
            </a>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" v-model="volume" @input="adjustVolume" :style="{'background': sliderThumbPosition}">


        </div>
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
            <i class="fa-brands fa-discord"></i>
          </a>
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
      words: [
        "EMBARK ON A COSMIC ODYSSEY",
        "PLAN FOR THE UNEXPECTED",
        "ADMINISTER AN EMPIRE",
        "ANTICIPATE INCOMING THREATS",
        "ASCEND TO THE THRONE",
        "ACHIEVE GREATNESS",
        "ACCOMPLISH THE IMPOSSIBLE",
        "ACTIVATE DEFENSES",
        "ACQUIRE HIDDEN KNOWLEDGE",
        "ADVANCE YOUR CIVILIZATION",
        "AMAZE YOURSELF",
        "ASSIST THE HELPLESS",
        "AMBUSH INVADERS",
        "ANALYZE WARP SIGNATURES",
        "ALLY WITH FORMER ENEMIES",
        "ASSEMBLE MEGASTRUCTURES",
        "BLAST-OFF",
        "BUILD A GALACTIC EMPIRE",
        "BATTLE SPACE PIRATES",
        "BRIBE OFFICIALS",
        "BOMBARD PLANETARY INFRASTRUCTURE",
        "BLOCKADE TRADE ROUTES",
        "BOUNTY HUNT",
        "BYPASS THE COMPRESSOR",
        "CONQUER YOUR ENEMIES",
        "COMMUNICATE WITH ALIEN LIFEFORMS",
        "COLONIZE PLANETS",
        "COMMAND YOUR ARMADA",
        "CAPTURE TREASURE",
        "CHART NEW STAR SYSTEMS",
        "CALCULATE JUMP COORDINATES",
        "CAPTAIN YOUR DREADNOUGHT",
        "CALIBRATE SHIP SYSTEMS",
        "DISCOVER WHAT IS BEYOND",
        "DEVELOP STRATEGIES",
        "DECIMATE ENEMY FLEETS",
        "DEFEAT EVIL",
        "DETHRONE EMPERORS",
        "DRIFT THROUGH ASTROID FIELDS",
        "DESTROY STARBASES",
        "DEFEND FROM PIRATES",
        "DETECT INCOMING THREATS",
        "DISENGAGE THE EXTERNAL INERTIAL DAMPENER",
        "DOMINATE THE GALAXY",
        "DEMOLISH YOUR ENEMY'S ECONOMY",
        "EXPLORE ANCIENT RUINS",
        "ELIMINATE THREATS",
        "ENJOY YOUR ACCOMPLISHMENTS",
        "EXTRACT MINERALS",
        "EXPECT THE UNEXPECTED",
        "EXPERIMENT WITH TECHNOLOGIES",
        "EXPLOIT RESOURCES",
        "ENFORCE YOUR RULE",
        "EXPERIENCE GRAND STRATEGY",
        "FIGHT FOR JUSTICE",
        "FEDERATE WITH YOUR ALLIES",
        "FIND THE TRUTH THAT IS OUT THERE",
        "FIRE ALL TORPEDOES",
        "FORGE FRIENDSHIPS",
        "GRANT SAFE PASSAGE",
        "GUIDE YOUR PEOPLE",
        "GAIN RICHES",
        "GATHER RESOURCES",
        "GENERATE NUCLEAR ENERGY",
        "HAVE A BAD FEELING ABOUT THIS",
        "HUNT GIANT CREATURES",
        "HACK MAINFRAMES",
        "HI-JACK TRADE SHIPS",
        "INVESTIGATE ANOMALIES",
        "INVADE PLANETS",
        "INFILTRATE ENEMY LEADERSHIP",
        "JAM ENEMY COMMS",
        "JOURNEY THROUGH THE UNKNOWN",
        "JUMP THROUGH WORMHOLES",
        "JOIN FORCES",
        "KINDLE A REBELLION",
        "LEAD YOUR EMPIRE",
        "LAUNCH ALL SQUADRONS",
        "LIVE LONG AND PROSPER",
        "MAKE IT SO",
        "MARAUDE RICH TRADE WORDS",
        "MANUFACTURE YOUR FLEET",
        "MINE ASTEROIDS",
        "MUTATE APPENDAGES",
        "NAVIGATE UNCHARTED STAR",
        "NEGOTIATE DIPLOMACY",
        "OPERATE SUPERWEAPONS",
        "OBTAIN PRESTIGE",
        "OVERWHELM ENEMY DEFENSES",
        "OVERCOME NEW CHALLENGES",
        "OUTLAW CORRUPTION",
        "OPPOSE TYRANNY",
        "PILOT YOUR SHIP",
        "PILLAGE CORPORATE COFFERS",
        "PROTECT YOUR CAPITAL",
        "PROBE ENEMY DEFENSES",
        "PLOT IN SECRECY",
        "QUIET DISSENTERS",
        "QUASH REBELLIONS",
        "RECRUIT MERCENARIES",
        "RAID COLONIES",
        "REALIGN THE MULTIMODAL FLUX RELAY",
        "RESEARCH NEW TECHNOLOGIES",
        "REPAIR DAMAGED INFRASTRUCTURE",
        "REVERSE THE POLARITY",
        "RULE WITH AN IRONFIST",
        "REBEL AGAINST OPPRESSION",
        "SABOTAGE ENEMY REACTORS",
        "SET PHASERS TO STUN",
        "SYNCHRONIZE ATTACKS",
        "SYNERGIZE TECHNOLOGIES",
        "SWARM SECTORS",
        "SIEGE PLANETARY DEFENSES",
        "SPY ON TOP SECRET PROJECTS",
        "SALVAGE WRECKAGE",
        "SMUGGLE CONTRABAND",
        "STRATEGIZE VICTORY",
        "SUBJUGATE LESSER LIFEFORMS",
        "SEIZE YOUR DESTINY",
        "SPREAD PROPAGANDA",
        "TRANSMIT STAR CHARTS",
        "TRANSPORT CARGO",
        "TEAM-UP WITH NEW FRIENDS",
        "TRADE GOODS",
        "TERRAFORM BARREN SYSTEMS",
        "TERMINATE THE CHOSEN ONE",
        "TARGET ENEMY ENGINES",
        "TRAVEL THROUGH ION STORMS",
        "TRANSFORM REALITY",
        "TRAVERSE NEBULA",
        "THRIVE AS A CIVILIZATION",
        "TELEPORT IN ONE PIECE",
        "UNITE THE OPPRESSED",
        "UNLOAD CARGO CONTAINERS",
        "UNRAVEL ANCIENT MYSTERIES",
        "UNDERTAKE STELLAR PROJECTS",
        "VOYAGE INTO THE UNKNOWN",
        "VENTURE THROUGH NEW WORLDS",
        "VISIT SHADOW PORTS",
        "VINDICATE YOUR SOVEREIGNTY",
        "VIOLATE THE RULES OF PHYSICS",
        "VETO BILLS IN THE SENATE",
        "WATCH THE FALL OF EMPIRES",
        "WAIT FOR THE RIGHT MOMENT",
        "WARP THROUGH STARGATES",
        "WAKE THE ANCIENTS",
        "WEIGH RISKS",
        "WATCH STARS COLLAPSE",
        "WHISPER IN THE SHADOWS",
        "WITHDRAW FROM THE ENEMY SECTOR",
        "WITNESS A SAGA",
        "WRITE PEACE TREATIES",
        "YIELD RESOURCES",
        "ZOOM THROUGH HYPERSPACE"
      ],
      wordIndex: 0,
      letterIndex: 0,
      currentText: "",
      typing: true,
      showCursor: true,
      lightSpeed: false,
      launchAudio: null,
      backgroundMusic: null,
      isMusicPlaying: false,
      volume: 0,
      userInteracted: false,
      isFirefox: false
    };
  },
  async mounted() {
    this.isAutoLoggingIn = true;
    this.launchAudio = new Audio(wooshAudio);
    this.backgroundMusic = new Audio(require("../assets/audio/backgroundMusic.mp3"));
    this.backgroundMusic.loop = true;
    this.isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
    

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
    },
    sliderThumbPosition() {
    const gradient = `linear-gradient(to right, blue ${this.volume * 100}%, gray ${this.volume * 100}%)`;
    return gradient;
}

  },
  methods: {
    adjustVolume() {
      this.backgroundMusic.volume = this.volume;
      
        if (this.volume > 0 && !this.userInteracted) {
            this.backgroundMusic.play().catch(error => {
                console.error("Playback failed:", error);
            });
            this.isMusicPlaying = true;
            this.userInteracted = true; // Set userInteracted flag to true
        } 
        else if (this.volume === 0 && this.userInteracted) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
        }
    },

    toggleBackgroundMusic() {
      if (this.isMusicPlaying) {
        this.backgroundMusic.pause();
        this.isMusicPlaying = false;
      } else {
        if (!this.userInteracted) {
          this.volume = 0.5;  // Set volume to 50% when played for the first time
          this.backgroundMusic.volume = this.volume;
          this.backgroundMusic.play().catch(error => {
            console.error("Playback failed:", error);
          });
          this.userInteracted = true;
          this.isMusicPlaying = true;
        } else {
          this.backgroundMusic.play().catch(error => {
            console.error("Playback failed:", error);
          });
          this.isMusicPlaying = true;
        }
      }
    },
    beforeDestroy() {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    },
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
          this.wordIndex = Math.floor(Math.random() * this.words.length); // Randomly select a word from the list
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
  height: 3em;
  background-color: transparent;
  margin-top: 2em;
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
  align-items: center;
}

.splash-text {
  text-align: center;
  font-family: "Anurati", sans-serif;
  max-width: 12em;
  font-size: 25px;
  font-weight: bold;
  height: min-content;
  background-image: linear-gradient(
    to bottom right,
    rgb(175, 175, 174),
    rgb(161, 161, 161),
    #ffffff,
    #ffffff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtext {
  font-weight: 500;
  font-family: "Chakra Petch", sans-serif;
  font-size: 12px;
}

.subtext span {
  color: rgb(249, 219, 52);
}

.cursor {
  border-right: 2px solid white;
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

/* Styles for the input range on large screens (622px and above) */
@media (min-width: 622px) {
  .splash-text {
    text-align: center;
    font-family: "Anurati", sans-serif;
    max-width: 12em;
    font-size: 50px;
  }
  .subtext {
    font-weight: 500;
    font-family: "Chakra Petch", sans-serif;
    font-size: 20px;
  }
  .top-logo {
    height: 5em;
    margin-top: 2em;
  }
  .discord-icon {
    color: #5865F2;
  }
  input[type="range"] {
    width: 100%;
    margin: 0 auto;
  }
  .volume-controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  /* Adjusted styles for the range input */
  /* Base styles for the range input */
/* Base styles for the range input */
input[type="range"] {
    width: 100%;
    margin: 0 auto;
    -webkit-appearance: none;
    appearance: none;
    height: 3px;
    outline: none; 
    border-radius: 5px;
    cursor: pointer;
}

/* Webkit specific styles for the slider thumb */
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px; 
    height: 15px; 
    background: rgb(254, 254, 255); 
    cursor: pointer; 
    border-radius: 50%;
    transition: background 0.3s;
}

/* Firefox specific styles for the slider thumb */
input[type="range"]::-moz-range-thumb {
    width: 15px; 
    height: 15px; 
    background: rgb(254, 254, 255);
    cursor: pointer;
    border-radius: 50%;
}

/* Firefox styles for the filled portion of the range to the left of the thumb */
input[type="range"]::-moz-range-progress {
    background: blue;
    border-radius: 5px;
}

/* Firefox styles for the track of the range */
input[type="range"]::-moz-range-track {
    background: gray;
    border-radius: 5px;
}

/* Webkit styles for the track of the range */
input[type="range"]::-webkit-slider-runnable-track {
    border-radius: 5px;
    background: inherit; /* Inherit the gradient background from the main input element */
}

}
</style>

