<template>
  <div class="center">
    <h1>{{ team.teamName }}</h1>
    <img
      max-width="20"
      :src="require(`@/assets/specialists/SVG Library/${team.teamAvatar}`)"
      alt="logo"
      class="logo-img"
    />
    <h4>Team Members</h4>
    <div v-for="member in teamMembers" :key="member._id">
      <router-link
        style="text-decoration: none;"
        :to="{ name: 'account-achievements', params: { userId: member._id } }"
      >
        <h5 class="teamMember">
          <img
            class="user-level-icon"
            style="height: 24px;"
            :src="
              require(`../../../../assets/levels/${member.achievements.level}.png`)
            "
          />
          {{ member.username }}
          <i
            v-if="member._id == team.teamCaptain"
            class="fas fa-star text-info me-2"
          ></i>
        </h5>
      </router-link>
    </div>
    <button
      style="background-color: #4caf50;"
      @click="joinTeam()"
      v-if="!isInTeam && isInvited"
    >
      Join
    </button>
    <span
      v-if="!isInTeam && !isInvited"
      style="
    background-color: red;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
  "
    >
      Not Invited
    </span>
    <div v-if="isTeamCaptain" class="center" style="padding-top: 2em;">
      <h4>Invite a Friend</h4>
      <input
        v-model="searchText"
        @input="filterUsers"
        placeholder="Type to search"
      />

      <ul v-if="filteredUsers.length">
        <li
          v-for="user in filteredUsers"
          :key="user._id"
          @click="selectUser(user)"
        >
          {{ user.username }}
        </li>
      </ul>
      <button
        style="background-color: #4caf50;"
        @click="inviteMember()"
        v-if="searchText"
      >
        Invite
      </button>
      <h4 style="padding-top: 2em;">Invited</h4>
      <div
        v-for="member in invitedMembers"
        :key="member._id"
        style="display: flex;"
      >
        <router-link
          style="text-decoration: none;"
          :to="{ name: 'account-achievements', params: { userId: member._id } }"
        >
          <h5 class="teamMember">
            <img
              class="user-level-icon"
              style="height: 24px;"
              :src="
                require(`../../../../assets/levels/${member.achievements.level}.png`)
              "
            />
            {{ member.username }}
            <i
              v-if="member._id == team.teamCaptain"
              class="fas fa-star text-info me-2"
            ></i>
          </h5>
        </router-link>
        <span
          class="remove-invitee"
          style="color: red; cursor: pointer; margin-left: 5px;"
          @click="removeInviteeFromTeam(member._id)"
        >
          <i class="fas fa-times"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "../../../../services/api/user";

export default {
  name: "CreateTeam",
  data() {
    return {
      teamMembers: [],
      isTeamCaptain: false,
      isInTeam: false,
      isInvited: false,
      users: [],
      searchText: "",
      filteredUsers: [],
      invitedMembers: [],
      selectedMember: null
    };
  },
  props: {
    team: {
      type: Object,
      required: true
    }
  },
  methods: {
    filterUsers() {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchText.toLowerCase())
      );
      // only show the first 10 results
      this.filteredUsers = this.filteredUsers.slice(0, 10);
    },
    selectUser(user) {
      this.searchText = user.username;
      this.selectedMember = user;
      this.filteredUsers = [];
    },
    inviteMember() {
      this.searchText = "";
      this.$emit("invite-team-member", { member: this.selectedMember });
    },
    removeInviteeFromTeam(e) {
      this.invitedMembers.forEach((invitee, index) => {
        if (invitee._id == e) {
          this.invitedMembers.splice(index, 1);
        }
      });
      this.$emit("delete-team-invitee", e);
    },
    joinTeam() {
      this.$emit("join-team");
    }
  },
  async mounted() {
    // We're gonna want to fix this in the future for scaling, but for now it works
    const response = await userService.getLeaderboard(999, "Rank", 0);
    this.users = response.data.leaderboard;

    let myUserData = await userService.getMyUserInfo();
    if (this.team.teamCaptain == myUserData.data._id) {
      this.isTeamCaptain = true;
    }
    this.isInTeam = this.team.members.some(
      member => member === myUserData.data._id
    );
    this.isInvited = this.team.invited.some(
      member => member === myUserData.data._id
    );
    for (let i = 0; i < this.team.members.length; i++) {
      let response = await userService.getUserAchievements(
        this.team.members[i]
      );

      let teamMember = {
        _id: this.team.members[i],
        username: response.data.username,
        achievements: response.data.achievements
      };
      this.teamMembers.push(teamMember);
    }
    for (let i = 0; i < this.team.invited.length; i++) {
      let response = await userService.getUserAchievements(
        this.team.invited[i]
      );
      console.log(this.team.invited);

      let invitedMember = {
        _id: this.team.invited[i],
        username: response.data.username,
        achievements: response.data.achievements
      };
      this.invitedMembers.push(invitedMember);
    }
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
}

li {
  padding: 8px;
  cursor: pointer;
}

li:hover {
  background-color: #f0f0f0;
  color: black;
}
.teamMember:hover {
  color: #4caf50;
  cursor: pointer;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  margin: 0 auto;
}

.logo-selection {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.logo-img {
  width: 10em;
  height: auto;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
}

button {
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #4caf50;
  border: none;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
