<template>
  <div id="header" class="app-header">
    <div class="brand">
      <a href="javascript:;" class="brand-logo" @click="goHome" title="Main Menu">
          <span class="brand-img"></span>
      </a>
    </div>

    <div class="menu" v-if="userId">
      <div class="menu-item dropdown dropdown-mobile-full">
        <router-link
          :to="{ name: 'administration' }"
          v-if="userHasAdminRole"
          class="menu-link"
        >
          <div class="menu-icon"><i class="fas fa-users-cog"></i></div>
          <div class="menu-text d-sm-block d-none ms-1">Admin</div>
        </router-link>
      </div>
      <div class="menu-item dropdown dropdown-mobile-full">
        <router-link
          :to="{ name: 'administration' }"
          v-if="userHasAdminRole"
          class="menu-link"
          title="Access administrator features."
        >
          <div class="menu-icon"><i class="fas fa-users-cog"></i></div>
          <div class="menu-text d-sm-block d-none ms-1">Admin</div>
        </router-link>
      </div>
      <div class="menu-item dropdown dropdown-mobile-full">
        <router-link :to="{ name: 'avatars' }" class="menu-link" title="View unlockable factions, symbols and colors to customize your play-style.">
          <div class="menu-icon"><i class="fas fa-pastafarianism"></i></div>
          <div class="menu-text d-sm-block d-none ms-1">Unlockables</div>
        </router-link>
      </div>
      <div class="menu-item dropdown dropdown-mobile-full">
        <a
          href="#"
          data-bs-toggle="dropdown"
          data-bs-display="static"
          class="menu-link"
          title="View your account settings, game-play statistics and achievements."
        >
          <!-- <div class="menu-img online">
          <img src="assets/img/user/profile.jpg" alt="Profile" height="60">
        </div> -->
          <div class="menu-icon"><i class="fas fa-user"></i></div>
          <div class="menu-text d-sm-block d-none ms-1">{{ username }}</div>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <router-link
            to="/account/settings"
            class="dropdown-item d-flex align-items-center"
          >
            ACCOUNT <i class="fas fa-user ms-auto text-theme fs-16px my-n1"></i>
          </router-link>
          <router-link
            :to="{ name: 'account-achievements', params: { userId: userId } }"
            class="dropdown-item d-flex align-items-center"
          >
            ACHIEVEMENTS
            <i class="fas fa-medal ms-auto text-theme fs-16px my-n1"></i>
          </router-link>
          <div class="dropdown-divider"></div>
          <a
            href="javascript:;"
            @click="logout"
            :disabled="isLoggingOut"
            class="dropdown-item d-flex align-items-center"
          >
            LOGOUT
            <i class="fas fa-sign-out-alt ms-auto text-theme fs-16px my-n1"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import authService from "../../services/api/auth";

export default {
  data() {
    return {
      isLoggingOut: false
    };
  },
  methods: {
    async logout() {
      this.isLoggingOut = true;

      await authService.logout();

      this.$store.commit("clearUserId");
      this.$store.commit("clearUsername");
      this.$store.commit("clearRoles");
      this.$store.commit("clearUserCredits");
      this.$store.commit("clearUserIsEstablishedPlayer");

      this.isLoggingOut = false;

      router.push({ name: "home" });
    },
    routeToPath(path) {
      router.push(path);
    },
    goHome() {
      router.push({ name: "home" });
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
    username() {
      return this.$store.state.username;
    },
    userCredits() {
      return this.$store.state.userCredits || 0;
    },
    userHasAdminRole() {
      return (
        this.$store.state.roles &&
        (this.$store.state.roles.administrator ||
          this.$store.state.roles.communityManager ||
          this.$store.state.roles.gameMaster)
      );
    }
  }
};
</script>

<style scoped>
.app-header {
  background-color: black !important;
}
.brand {
  justify-content: center;
  font-family: "Bangers", cursive;
}
.brand-logo {
  justify-content: center;
}
.brand-img {
  background-image: url("../../assets/CO_LOGO.png") !important;
  width: 10.625rem !important;
  height: 2.625rem !important;
}
.row {
  padding-bottom: 15px;
}

.container {
  font-size: 20px;
}
</style>
