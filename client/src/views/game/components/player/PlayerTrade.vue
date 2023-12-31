<template>
    <div v-if="isTradeAllowed">
      <reputation v-if="player.isAIControlled" :playerId="player._id"/>

      <div v-if="isTradePossibleByScanning && isTradePossibleByDiplomacy">
        <sendCredits v-if="tradeCreditsIsEnabled" :player="player" :userPlayer="userPlayer"/>
        <sendCreditsSpecialists v-if="tradeCreditsSpecialistsIsEnabled" :player="player" :userPlayer="userPlayer"/>
        <sendTechnology v-if="player && tradeTechnologyIsEnabled" :playerId="player._id"/>
      </div>

      <p v-if="!isTradePossibleByScanning" class="text-danger pt-2 pb-0 mb-0">You cannot trade with this player, they are not within scanning range.</p>
      <p v-if="!isTradePossibleByDiplomacy" class="text-danger pt-2 pb-0 mb-0">You cannot trade with this player, they are not an ally.</p>
      <br>
    

    <div class="col">
      <button class="btn btn-info me-1" @click="onOpenDiplomacyRequested" title="Open Diplomacy">
        <i class="fas fa-flag"></i> Diplomacy
      </button>
      <button class="btn btn-info me-1" @click="onOpenLedgerRequested" title="Open Ledger">
        <i class="fas fa-file-invoice-dollar"></i> Ledger
      </button>
      <!-- Remove comment if you want to add the compare intel button
         <button class="btn btn-info " @click="onViewCompareIntelRequested" title="Compare Intel">
        <i class="fas fa-chart-line"></i> Intel
      </button> -->
    </div>
    </div>
</template>

<script>
import SendTechnology from './SendTechnology'
import SendCredits from './SendCredits'
import SendCreditsSpecialists from './SendCreditsSpecialists'
import Reputation from './Reputation'
import GameHelper from '../../../../services/gameHelper'
import DiplomacyHelper from '../../../../services/diplomacyHelper'
import DiplomacyApiService from '../../../../services/api/diplomacy'
import eventBus from '../../../../eventBus'
import MENU_STATES from '../../../../services/data/menuStates'
import Statistics from './Statistics'
import PlayerTitleVue from './PlayerTitle'
import ConversationApiService from '../../../../services/api/conversation'

export default {
  components: {
    'sendTechnology': SendTechnology,
    'sendCredits': SendCredits,
    'sendCreditsSpecialists': SendCreditsSpecialists,
    'reputation': Reputation,
    'statistics': Statistics,
    'player-title': PlayerTitleVue
  },
  props: {
    playerId: String
  },
  data () {
    return {
      player: null,
      userPlayer: null,
      diplomaticStatus: null
    }
  },
  async mounted () {
    this.userPlayer = GameHelper.getUserPlayer(this.$store.state.game)
    this.player = GameHelper.getPlayerById(this.$store.state.game, this.playerId)


    await this.loadDiplomaticStatus()
  },
  methods: {
    onViewConversationRequested (e) {
      if (this.conversation) {
        eventBus.$emit('onViewConversationRequested', {
          conversationId: this.conversation._id
        })
      } else {
        eventBus.$emit('onViewConversationRequested', {
          participantIds: [
            this.userPlayer._id,
            this.player._id
          ]
        })
      }
    },
    onViewCompareIntelRequested (e) {
      this.$emit('onViewCompareIntelRequested', this.player._id)
    },
    onOpenTradeRequested (e) {
      this.$emit('onOpenTradeRequested', this.playerId)
    },
    onOpenDiplomacyRequested (e) {
      this.$store.commit('setMenuState', {
        state: MENU_STATES.DIPLOMACY
      })
    },
    onOpenLedgerRequested (e) {
      this.$store.commit('setMenuState', {
        state: MENU_STATES.LEDGER
      })
    },
    getAvatarImage () {
      try {
        return require(`../../../../assets/avatars/${this.player.avatar}`)
      } catch (err) {
        console.error(err)
        
        return null
      }
    },
    async loadDiplomaticStatus () {
      if (!DiplomacyHelper.isFormalAlliancesEnabled(this.$store.state.game) || !DiplomacyHelper.isTradeRestricted(this.$store.state.game)) {
        return
      }

      try {
        const response = await DiplomacyApiService.getDiplomaticStatusToPlayer(this.$store.state.game._id, this.player._id)

        if (response.status === 200) {
          this.diplomaticStatus = response.data
        }
      } catch (err) {
        console.error(err)
        this.diplomaticStatus = null
      }
    },
    onViewCompareIntelRequested (e) {
      this.$emit('onViewCompareIntelRequested', this.player._id)
    },
    onOpenTradeRequested (e) {
      this.$emit('onOpenTradeRequested', this.playerId)
    },
    onOpenDiplomacyRequested (e) {
      this.$store.commit('setMenuState', {
        state: MENU_STATES.DIPLOMACY
      })
    },
  },
  computed: {
    game () {
      return this.$store.state.game
    },
    isTradeAllowed () {
      return this.game.state.startDate 
        && this.userPlayer 
        && this.player != this.userPlayer 
        && !this.userPlayer.defeated 
        && !this.isGameFinished 
        && (this.tradeTechnologyIsEnabled || this.tradeCreditsIsEnabled || this.tradeCreditsSpecialistsIsEnabled)
    },
    isTradePossibleByScanning: function () {
      return this.player.stats.totalStars > 0 
        && (this.$store.state.game.settings.player.tradeScanning === 'all' || (this.player && this.player.isInScanningRange))
    },
    isTradePossibleByDiplomacy: function () {
      return !DiplomacyHelper.isFormalAlliancesEnabled(this.$store.state.game) || 
        !DiplomacyHelper.isTradeRestricted(this.$store.state.game) || 
        (this.diplomaticStatus && this.diplomaticStatus.actualStatus == 'allies')
    },
    isGameFinished: function () {
      return GameHelper.isGameFinished(this.$store.state.game)
    },
    tradeCreditsIsEnabled () {
      return this.game.settings.player.tradeCredits
    },
    tradeCreditsSpecialistsIsEnabled () {
      return this.game.settings.player.tradeCreditsSpecialists
        && this.game.settings.specialGalaxy.specialistsCurrency === 'creditsSpecialists'
    },
    tradeTechnologyIsEnabled () {
      return this.game.settings.player.tradeCost > 0
    },
    
  }
}
</script>

<style scoped>
</style>
