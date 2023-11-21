<template>
  <div class="center">
    <h1>Create a Team</h1>
    <p>Choose a logo:</p>

    <div class="logo-selection">
      <div
        class="logo-option"
        v-for="(logoOption, index) in logos"
        :key="index"
        @click="logo = logoOption"
        :class="{ 'logo-selected': logo === logoOption }"
      >
        <input
          type="radio"
          :id="logoOption"
          :value="logoOption"
          v-model="logo"
          class="hidden-radio"
        />
        <label :for="logoOption">
          <img
            :src="require(`@/assets/specialists/SVG Library/${logoOption}`)"
            alt="logo"
            class="logo-img"
          />
        </label>
      </div>
    </div>
    <div>
      <label for="teamName">Team Name:</label>
      <input type="text" id="teamName" v-model="teamName" />
    </div>
    <button @click="createTeam">Create Team</button>
  </div>
</template>

<script>
export default {
  name: "CreateTeam",
  data() {
    return {
      logo: "",
      teamName: "",
      logos: [
        "abstract-001.svg",
        "abstract-002.svg",
        "abstract-003.svg",
        "abstract-004.svg",
        "abstract-005.svg",
        "abstract-008-svgrepo-com.svg",
        "abstract-009-svgrepo-com.svg",
        "abstract-011-svgrepo-com.svg",
        "abstract-013-svgrepo-com.svg",
        "abstract-014-svgrepo-com.svg",
        "abstract-016-svgrepo-com.svg",
        "abstract-017-svgrepo-com.svg"
      ]
    };
  },
  methods: {
    createTeam() {
      if (this.logo && this.teamName) {
        //console.log({ logo: this.logo, teamName: this.teamName });
        this.$emit("create-team", { logo: this.logo, teamName: this.teamName });
      }
    }
  }
};
</script>

<style scoped>
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

.logo-option {
  width: 70px;
  height: 70px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-option:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.logo-selected {
  border: 3px solid #4caf50;
  border-radius: 10px;
}

.hidden-radio {
  display: none;
}

.logo-img {
  width: 100%;
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
