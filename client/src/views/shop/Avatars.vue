<template>
  <view-container>
    <view-title title="Faction Collection" />

    <p>
      In the vast expanse of the cosmos, unveil hidden factions and enigmatic species using the coveted <strong class="text-warning">Galactic Credits</strong>. Amass these stellar tokens by triumphing in interstellar galactic domination.
    </p>
    <h5 v-if="userCredits">
      You have
      <span class="text-warning"
        ><strong>{{ userCredits.credits }}</strong> Galactic Credits</span
      >.
    </h5>

    <hr />

    <loading-spinner v-if="isLoading" />

    <div v-if="avatars">
      <div class="row mb-4" v-for="avatar in sortedAvatars" :key="avatar.id" :class="{ 'hovering-avatar': hovering === avatar.id }">
        <div class="col-auto">
          <img :src="getAvatarImage(avatar)" width="128" height="128" class="avatar-border"
              @mouseover="hovering = avatar.id"
              @mouseleave="hovering = null" />
        </div>
        <div class="col">
          <div class="row">
            <div class="col">
              <h5 class="faction-name">
                {{ avatar.name
                }}<span
                  class="badge bg-success ms-2"
                  v-if="avatar.isPatronAvatar"
                  ><i class="fas fa-handshake"></i> Patron Avatar</span
                >
              </h5>
            </div>
            <div class="col-auto">
              <button
                class="btn btn-sm btn-success"
                v-if="!avatar.purchased && userCredits.credits >= avatar.price"
                @click="purchaseAvatar(avatar)"
              >
                <i class="fas fa-shopping-basket"></i>
                {{ avatar.price }} Credit<span v-if="avatar.price > 1">s</span>
              </button>
              <router-link
                :to="{ name: 'galactic-credits-shop' }"
                class="btn btn-sm btn-outline-danger"
                v-if="!avatar.purchased && userCredits.credits < avatar.price"
              >
                <i class="fas fa-coins"></i> {{ avatar.price }} Credit<span
                  v-if="avatar.price > 1"
                  >s</span
                >
              </router-link>
              <h5>
                <span class="badge bg-primary" v-if="avatar.purchased"
                  ><i class="fas fa-check"></i> Unlocked</span
                >
              </h5>
            </div>
            <div class="col-12">
              <p>
                <small class="linebreaks">{{ avatar.description }}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </view-container>
</template>

<script>
import ViewTitle from "../components/ViewTitle";
import ViewContainer from "../components/ViewContainer";
import UserApiService from "../../services/api/user";
import LoadingSpinnerVue from "../components/LoadingSpinner";

export default {
  components: {
    "view-container": ViewContainer,
    "view-title": ViewTitle,
    "loading-spinner": LoadingSpinnerVue
  },
  data() {
    return {
      isLoading: false,
      userCredits: null,
      avatars: [],
      hovering: null
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.loadGalacticCredits();
    await this.loadAvatars();
    this.isLoading = false;
  },
  methods: {
    async loadGalacticCredits() {
      try {
        let response = await UserApiService.getUserCredits();

        if (response.status === 200) {
          this.userCredits = response.data;

          this.$store.commit("setUserCredits", response.data.credits);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async loadAvatars() {
      try {
        let response = await UserApiService.getUserAvatars();

        if (response.status === 200) {
          this.avatars = response.data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async purchaseAvatar(avatar) {
      if (avatar.purchased) {
        return;
      }

      if (
        !(await this.$confirm(
          `Purchase Faction`,
          `Are you sure you want to purchase this faction for ${avatar.price} credits?`
        ))
      ) {
        return;
      }

      avatar.isLoading = true;

      try {
        let response = await UserApiService.purchaseAvatar(avatar.id);

        if (response.status === 200) {
          avatar.purchased = true;
          this.userCredits.credits -= avatar.price;

          this.$store.commit("setUserCredits", this.userCredits.credits);
        }
      } catch (err) {
        console.error(err);
      }

      avatar.isLoading = false;
    },
    getAvatarImage(avatar) {
      try {
        return require("../../assets/avatars/" + avatar.file);
      } catch (err) {
        console.error(err);

        return null;
      }
    }
  },
  computed: {
    sortedAvatars: function() {
      return this.avatars.sort((a, b) => a.isPatronAvatar - b.isPatronAvatar);
    }
  }
};
</script>

<style scoped>

.linebreaks {
  white-space: break-spaces;
}

.avatar-border {
    border-radius: 50% !important;
    border: 3px solid #000000 !important;
    box-shadow: 0 4px 8px rgba(230, 230, 234, 0.1) !important;
    overflow: hidden !important;
}

.faction-name {
    font-family: 'Orbitron', sans-serif;
    background-color: #000;
    padding: 10px;
    border-radius: 8px;
    color: #fff;
}

.row.mb-4 {
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;                
}

button:hover, .btn:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease-in-out;
}

button:disabled {
    opacity: 0.6;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.avatar-border:hover {
  animation: pulse 1.5s infinite;
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 4px #FF0000,
      0 0 11px #FF0000,
      0 0 19px #FF7F00,
      0 0 40px #FF7F00,
      0 0 80px #FF7F00,
      0 0 90px #FF7F00,
      0 0 100px #FF7F00,
      0 0 150px #FF7F00;
  }
  
  20%, 24%, 55% {
    text-shadow: none;
  }
}

.faction-name {
    font-family: 'Orbitron', sans-serif;
    background-color: #000;              
    padding: 10px;
    border-radius: 8px;
    color: #FF7F00;
    transition: 0.5s;
}

.avatar-border:hover ~ .col .row .faction-name,
.row.mb-4:hover .faction-name {
    animation: neonFlicker 3.5s infinite alternate;
}

button:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 2px;
  background-color: #FFD700;
  opacity: 0;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: opacity 0.3s, width 0.3s;
  z-index: -1;
}

button:hover:before {
  opacity: 1;
  width: 100%;
}

.text-warning {
  animation: glow 3s infinite alternate;
  color: #000000;
  text-shadow: 0 0 5px #FFD700, 0 0 5px #FFD700;
}

@keyframes glow {
  0% {
    text-shadow: 0 0 5px #000000, 0 0 5px #000000;
  }
  100% {
    text-shadow: 0 0 15px #FFD700, 0 0 10px #FFD700, 0 0 25px #FFA500;
  }
}
</style>
