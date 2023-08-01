<template>
  <div
    class="full-container parallax"
    :style="{
      backgroundImage: `url(${require('@/assets/pics/' + backgroundImage)})`
    }"
  >
    <view-container :hideTopBar="true">
      <view-title
        title="Welcome to Cosmic Odyssey"
        :hideHomeButton="true"
        :showSocialLinks="true"
      />

      <div class="row">
        <div class="col-sm-12 col-md-6 pb-3">
          <p>
            Discover a space strategy game filled with
            <span class="text-warning">conquest</span>,
            <span class="text-warning">betrayal</span> and
            <span class="text-warning">subterfuge</span>.
          </p>
          <p>
            Build alliances, <strong>backstab Spencer,</strong> make enemies and
            fight your way to victory to
            <span class="text-danger">galactic domination.</span>
          </p>
          <p>Will <strong>you</strong> conquer the galaxy?</p>
          <a :href="documentationUrl" target="_blank">Learn more...</a>
        </div>
        <div class="col-sm-12 col-md-6">
          <h4>Login</h4>

          <loading-spinner :loading="isAutoLoggingIn" />

          <account-login v-if="!isAutoLoggingIn"></account-login>
        </div>
      </div>

      <div class="row bg-dark">
        <div class="col text-center">
          <p class="mb-2 mt-2">
            Play <span class="text-warning">Cosmic Odyssey</span> on
            <a href="https://solaris.games" target="_blank" title="Web"
              ><i class="fab fa-chrome me-1"></i>Web</a
            >
          </p>
        </div>
      </div>
    </view-container>
  </div>
</template>

<script>
import ViewContainer from "./components/ViewContainer";
import ViewTitle from "./components/ViewTitle";
import AccountLoginVue from "./account/components/Login";
import ApiAuthService from "../services/api/auth";
import router from "../router";
import LoadingSpinnerVue from "./components/LoadingSpinner.vue";
import ParallaxVue from "./components/Parallax";

export default {
  components: {
    "view-container": ViewContainer,
    "view-title": ViewTitle,
    "account-login": AccountLoginVue,
    "loading-spinner": LoadingSpinnerVue,
    parallax: ParallaxVue
  },
  data() {
    return {
      isAutoLoggingIn: false,
      backgroundImage: "art-2.jpg"
    };
  },
  async mounted() {
    // change backgroundImage to a random image every 15 seconds,
    setInterval(() => {
      this.backgroundImage = `art-${Math.floor(Math.random() * 2) + 1}.jpg`;
    }, 15000);
    this.isAutoLoggingIn = true;

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
  },
  computed: {
    documentationUrl() {
      return process.env.VUE_APP_DOCUMENTATION_URL;
    }
  }
};
</script>

<style scoped>
.parallax {
  position: absolute;
  left: 0;
  top: 0%;
  width: 100%;
  height: 100%;
  background-color: black;
  background-repeat: no-repeat;
  background-position: center;
  background-position: 50% 50%;
  z-index: -1;
}
.full-container {
  background-color: black !important;
}
</style>
