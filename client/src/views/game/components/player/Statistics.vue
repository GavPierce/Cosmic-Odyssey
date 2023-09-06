<template>
<div class="table-responsive mb-0" v-if="player">
  <table class="table table-sm  mb-1">
      <thead class="table-dark">
          <tr>
              <th></th>
              <th v-if="!isUserPlayer()"></th>
              <th v-if="userIsInGame()" class="text-end">You</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td title="Total number of stars controlled in the galaxy."><i class="fas fa-star" title="Stars"></i> Stars</td>
              <td class="text-end" :title="playerTotalStarsDescription">{{player.stats.totalStars}}</td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerTotalStarsDescription" 
                  :class="{'text-danger': player.stats.totalStars > userPlayer.stats.totalStars,
                          'text-success': player.stats.totalStars < userPlayer.stats.totalStars}">{{userPlayer.stats.totalStars}}</td>
          </tr>
          <tr v-if="isConquestHomeStars">
              <td title="Number of capital stars controlled.">Capitals</td>
              <td class="text-end">{{player.stats.totalHomeStars}}</td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()"
                :class="{'text-danger': player.stats.totalHomeStars > userPlayer.stats.totalHomeStars,
                          'text-success': player.stats.totalHomeStars < userPlayer.stats.totalHomeStars}">{{userPlayer.stats.totalHomeStars}}</td>
          </tr>
          <tr>
              <td title="Total number of carriers currently in operation."><i class="fas fa-shuttle-space" title="Carriers"></i> Carriers</td>
              <td class="text-end" :title="playerTotalCarriersDescription">{{player.stats.totalCarriers}}</td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerTotalCarriersDescription"
                  :class="{'text-danger': player.stats.totalCarriers > userPlayer.stats.totalCarriers,
                          'text-success': player.stats.totalCarriers < userPlayer.stats.totalCarriers}">{{userPlayer.stats.totalCarriers}}</td>
          </tr>
          <tr v-if="isSpecialistsEnabled">
            <td title="Total specialists controlled"><i class="fas fa-microchip" title="Specialists"></i> Specialists</td>
              <td class="text-end" :title="playerTotalSpecialistsDescription">{{player.stats.totalSpecialists}}</td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerTotalSpecialistsDescription"
                  :class="{'text-danger': player.stats.totalSpecialists > userPlayer.stats.totalSpecialists,
                          'text-success': player.stats.totalSpecialists < userPlayer.stats.totalSpecialists}">{{userPlayer.stats.totalSpecialists}}</td>
          </tr>
          <tr>
              <td title="Total number of ships currently in operation."><i class="fas fa-rocket" title="Ships"></i> Ships</td>
              <td class="text-end" :title="playerTotalShipsDescription">{{player.stats.totalShips}}<span v-if="player.stats.totalShipsMax">/{{player.stats.totalShipsMax}}</span></td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerTotalShipsDescription"
                  :class="{'text-danger': player.stats.totalShips > userPlayer.stats.totalShips,
                          'text-success': player.stats.totalShips < userPlayer.stats.totalShips}">{{userPlayer.stats.totalShips}}<span v-if="userPlayer.stats.totalShipsMax">/{{userPlayer.stats.totalShipsMax}}</span></td>
          </tr>
          <tr>
              <td title="Total new ships being produced from industry infrastructure and manufacturing technology in the current galactic cycle."><i class="fas fa-wrench" title="New Ships"></i> New Ships</td>
              <td class="text-end" :title="playerNewShipsDescription">{{player.stats.newShips}}</td>
              <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerNewShipsDescription"
                  :class="{'text-danger': player.stats.newShips > userPlayer.stats.newShips,
                          'text-success': player.stats.newShips < userPlayer.stats.newShips}">{{userPlayer.stats.newShips}}</td>
          </tr>
          <tr>
            <td title="Total income generated per galactic cycle combined from your economic infrastructure and banking technology."><i class="fas fa-arrows-rotate" title="Galactic Cycle Income"></i> Cycle Income</td>
            <td class="text-end" :title="playerIncomeDescription">${{playerIncome}}</td>
            <td class="text-end" v-if="userIsInGame() && !isUserPlayer()" :title="userPlayerIncomeDescription" 
                :class="{'text-danger': playerIncome > userPlayerIncome,
                        'text-success': playerIncome < userPlayerIncome}">${{userPlayerIncome}}</td>
                  </tr>
      </tbody>
  </table>

  <p class="text-warning text-center mb-2" v-if="isDarkModeExtra && userIsInGame() && !isUserPlayer()"><small>Based on your scanning range.</small></p>
</div>
</template>

<script>
import GameHelper from '../../../../services/gameHelper'

export default {
  props: {
    playerId: String
  },
  methods: {
    isUserPlayer () {
      return this.userPlayer && this.userPlayer._id === this.player._id
    },
    getUserPlayer () {
      return GameHelper.getUserPlayer(this.$store.state.game)
    },
    userIsInGame () {
      return this.userPlayer != null
    }
  },
  computed: {
    player () {
        return GameHelper.getPlayerById(this.$store.state.game, this.playerId)
    },
    userPlayer () {
        return GameHelper.getUserPlayer(this.$store.state.game)
    },
    isSpecialistsEnabled () {
      return GameHelper.isSpecialistsEnabled(this.$store.state.game)
    },
    isDarkModeExtra () {
      return GameHelper.isDarkModeExtra(this.$store.state.game)
    },
    isConquestHomeStars () {
      return GameHelper.isConquestHomeStars(this.$store.state.game)
    },
    playerIncome () {
      return GameHelper.calculateIncome(this.$store.state.game, this.player)
    },
    userPlayerIncome () {
      return GameHelper.calculateIncome(this.$store.state.game, this.userPlayer)
    },
    userPlayerTotalStarsDescription() {
        return `You control ${this.userPlayer.stats.totalStars} stars in the galaxy.`;
    },
    playerTotalStarsDescription() {
        return `Player controls ${this.player.stats.totalStars} stars in the galaxy.`;
    },
    userPlayerTotalCarriersDescription() {
        return `You currently have ${this.userPlayer.stats.totalCarriers} carriers at your command.`;
    },
    playerTotalCarriersDescription() {
        return `Player current commands ${this.player.stats.totalCarriers} carriers.`;
    },
    userPlayerTotalSpecialistsDescription() {
        return `You have ${this.userPlayer.stats.totalSpecialists} carrier and star specialists combined currently.`;
    },
    playerTotalSpecialistsDescription() {
        return `Player has ${this.player.stats.totalSpecialists} specialists in operation currently.`;
    },
    userPlayerTotalShipsDescription() {
        let description = `You have ${this.userPlayer.stats.totalShips} ships at your command.`;
        if (this.userPlayer.stats.totalShipsMax) {
            description += ` Maximum capacity is ${this.userPlayer.stats.totalShipsMax} ships.`;
        }
        return description;
    },
    playerTotalShipsDescription() {
        let description = `Player has ${this.player.stats.totalShips} ships at their command.`;
        if (this.player.stats.totalShipsMax) {
            description += ` Maximum capacity is ${this.player.stats.totalShipsMax} ships.`;
        }
        return description;
    },
    userPlayerNewShipsDescription() {
        return `You have will produce ${this.userPlayer.stats.newShips} new ships this galactic cycle.`;
    },
    playerNewShipsDescription() {
        return `Player will produce ${this.player.stats.newShips} new ships this galactic cycle.`;
    },
    userPlayerIncomeDescription() {
        return `Your income generated every galactic cycle from economic infrastructure and banking tech combined is $${this.userPlayerIncome}.`;
    },
    playerIncomeDescription() {
        return `Player's income generated every galactic cycle from economic infrastructure and banking tech combined is $${this.playerIncome}.`;
    }
  }
}
</script>

<style scoped>
.table-sm td, .table-sm th {
  padding: 0;
}
</style>
