<template>
  <div class="row" v-if="player">
    <div class="col">
      <div class="table-responsive mb-0">
        <table class="table table-sm mb-0">
          <thead class="table-dark">
            <tr v-if="userPlayer && player != userPlayer">
              <th></th>
              <th></th>
              <th></th>
              <th class="text-end" title="Your number will be red if you are the lowest and green if you are the highest.">You</th>
            </tr>
          </thead>
          <tbody>
            <research-row
              v-if="isTechnologyEnabled('scanning')"
              research="scanning"
              iconClass="fa-satellite-dish"
              title="Scanning"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('hyperspace')"
              research="hyperspace"
              iconClass="fa-forward"
              title="Hyperspace Range"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('terraforming')"
              research="terraforming"
              iconClass="fa-globe"
              title="Terraforming"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('experimentation')"
              research="experimentation"
              iconClass="fa-atom"
              title="Experimentation"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('weapons')"
              research="weapons"
              iconClass="fa-crosshairs"
              title="Weapons"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('banking')"
              research="banking"
              iconClass="fa-coins"
              title="Banking"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('manufacturing')"
              research="manufacturing"
              iconClass="fa-wrench"
              title="Manufacturing"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
            <research-row
              v-if="isTechnologyEnabled('specialists')"
              research="specialists"
              iconClass="fa-microchip"
              title="Specialists"
              :player="player"
              :userPlayer="userPlayer"
            ></research-row>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import gameHelper from "../../../../services/gameHelper"
import TechnologyHelper from "../../../../services/technologyHelper"
import ResearchRow from "./ResearchRow"

export default {
  components: {
    "research-row": ResearchRow,
  },
  props: {
    playerId: String,
  },
  methods: {
    isTechnologyEnabled (technologyKey) {
      return TechnologyHelper.isTechnologyEnabled(this.$store.state.game, technologyKey)
    },
    isTechnologyResearchable (technologyKey) {
      return TechnologyHelper.isTechnologyResearchable(this.$store.state.game, technologyKey)
    }
  },
  computed: {
    player() {
      return gameHelper.getPlayerById(this.$store.state.game, this.playerId);
    },
    userPlayer() {
      return gameHelper.getUserPlayer(this.$store.state.game);
    },
  },
};
</script>

<style scoped>
.row-icon {
  width: 1%;
}
</style>
