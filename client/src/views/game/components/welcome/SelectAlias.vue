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
                  >Join or Create Team</label
                >
                <select
                  class="form-control"
                  id="team"
                  v-model="team"
                  @change="onTeamChanged($event)"
                >
                  <option
                    style="height:3em;"
                    v-for="team in teamList"
                    :key="team._id"
                    :value="team"
                  >
                    {{ team.teamName }}
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

            <team-details
              v-if="showTeamDetails"
              :team="team"
              @invite-team-member="inviteTeamMember"
              @join-team="joinTeam"
              @delete-team-invitee="removeInviteeFromTeam"
            ></team-details>
            <team-create
              v-if="creatingTeam"
              @create-team="createTeam"
            ></team-create>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "../../../../services/api/user";
import TeamService from "../../../../services/api/team";
import SelectAvatarVue from "./SelectAvatar.vue";
import GameApiService from "../../../../services/api/game";
import TeamCreate from "./TeamCreate.vue";
import TeamDetails from "./TeamDetails.vue";
export default {
  components: {
    "select-avatar": SelectAvatarVue,
    "team-create": TeamCreate,
    "team-details": TeamDetails
  },
  data() {
    return {
      alias: null,
      myId: null,
      avatar: null,
      isTeamGame: false,
      team: null,
      teamList: null,
      creatingTeam: false,
      showTeamDetails: false
    };
  },
  async mounted() {
    try {
      let response = await UserService.getMyUserInfo();
      let settings = await GameApiService.getGameInfo(this.$route.query.id);
      this.teamList = this.$store.state.game.galaxy.teams;

      if (response.status === 200) {
        this.alias = response.data.username;
        this.myId = response.data._id;
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
    },
    onTeamChanged(e) {
      var selectedTeam = event.target.value;
      if (selectedTeam == "Create Team") {
        this.creatingTeam = true;
        this.showTeamDetails = false;
      } else {
        this.creatingTeam = false;
        this.showTeamDetails = true;
      }
    },
    async createTeam(e) {
      let response = await TeamService.createTeam(
        this.$route.query.id,
        e.teamName,
        e.logo
      );
    },
    async inviteTeamMember(e) {
      console.log("Inviting...");
      let response = await TeamService.inviteTeamMember(
        this.$route.query.id,
        this.team._id,
        e.member._id
      );
    },
    async joinTeam() {
      let response = await TeamService.joinTeam(
        this.$route.query.id,
        this.team._id,
        this.myId
      );
    },
    async removeInviteeFromTeam(e) {
      console.log("Removing Invite...", e);
      let response = await TeamService.removeInviteeFromTeam(
        this.$route.query.id,
        this.team._id,
        e
      );
    }
  }
};
</script>

<style scoped>
.linebreaks {
  white-space: break-spaces;
}
</style>
