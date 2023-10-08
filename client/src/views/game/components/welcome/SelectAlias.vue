<template>
  <div>
    <div class="row text-center bg-primary mb-2">
      <div class="col">
        <p class="mb-0 mt-2 mb-2">
          Select a race and an alias for your commander.
        </p>
      </div>
    </div>

    <div class="row bg-dark p-2">
      <div class="col">
        <form @submit.prevent>
          <div class="row">
            <div class="col-auto bg-dark">
              <select-avatar v-on:onAvatarChanged="onAvatarChanged" />
            </div>
            <div class="col pt-0">
              <p v-if="!avatar">
                Every great story needs both heroes and villians. Which will you
                be?
              </p>

              <h5 v-if="avatar">{{ avatar.name }}</h5>
              <p v-if="avatar">
                <small class="linebreaks">{{ avatar.description }}</small>
              </p>

              <div class="mb-2">
                <input
                  name="alias"
                  class="form-control"
                  required="required"
                  placeholder="Enter your alias here"
                  type="text"
                  minlength="3"
                  maxlength="24"
                  v-model="alias"
                  v-on:keyup="onAliasChanged"
                />
              </div>

              <div class="mb-2">
                <label for="playerType" class="col-form-label"
                  >Join Team
                  <help-tooltip
                    tooltip="Determines what type of players can join the game"
                /></label>
                <select
                  class="form-control"
                  id="team"
                  v-model="teamList"
                  @change="teamChanged"
                >
                  <option
                    v-for="team in teamList"
                    v-bind:key="team.value"
                    v-bind:value="team.value"
                  >
                    {{ team.text }}
                  </option>
                  <option class="bg-success" style="height:3em;">
                    Create Team
                  </option>
                </select>
              </div>
              <!-- <div class="mb-2 text-center small">
                        <p>Your alias must be between 3 and 24 characters.</p>
                    </div> -->
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../../../../services/api/user";
import SelectAvatarVue from "./SelectAvatar.vue";
import GameApiService from "../../../../services/api/game";
export default {
  components: {
    "select-avatar": SelectAvatarVue
  },
  data() {
    return {
      alias: null,
      avatar: null,
      isTeamGame: false,
      team: null,
      teamList: null
    };
  },
  async mounted() {
    try {
      let response = await UserService.getMyUserInfo();
      let settings = await GameApiService.getGameInfo(this.$route.query.id);

      if (response.status === 200) {
        this.alias = response.data.username;
        this.onAliasChanged(this.alias);
      }
      if (settings.status === 200) {
        if (settings.data.settings.general.teamGame == "enabled") {
          this.isTeamGame = true;
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    onAliasChanged(e) {
      this.$emit("onAliasChanged", this.alias);
    },
    onAvatarChanged(e) {
      this.avatar = e;

      this.$emit("onAvatarChanged", e);
    }
  }
};
</script>

<style scoped>
.linebreaks {
  white-space: break-spaces;
}
</style>
