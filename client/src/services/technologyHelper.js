class TechnologyHelper {
    FRIENDLY_NAMES = {
      scanning: 'Scanning',
      hyperspace: 'Hyperspace Range',
      terraforming: 'Terraforming',
      experimentation: 'Experimentation',
      weapons: 'Weapons',
      banking: 'Banking',
      manufacturing: 'Manufacturing',
      specialists: 'Specialists'
    }

    getFriendlyName (technologyKey) {
      return this.FRIENDLY_NAMES[technologyKey]
    }

    isTechnologyEnabled (game, technologyKey) {
      return game.settings.technology.startingTechnologyLevel[technologyKey] > 0
    }

    isTechnologyResearchable (game, technologyKey) {
      return game.settings.technology.researchCosts[technologyKey] !== 'none'
    }

    getRequiredResearchProgress (game, technologyKey, technologyLevel) {
      const researchCostConfig = game.settings.technology.researchCosts[technologyKey]
      const expenseCostConfig = game.constants.star.infrastructureExpenseMultipliers[researchCostConfig]
      const progressMultiplierConfig = expenseCostConfig * game.constants.research.progressMultiplier

      return technologyLevel * progressMultiplierConfig
    }

    getIcon (technologyKey) {
      switch (technologyKey) {
        case 'scanning':
          return 'satellite'
        case 'hyperspace':
          return 'forward'
        case 'terraforming':
          return 'globe'
        case 'experimentation':
          return 'atom'
        case 'weapons':
          return 'crosshairs'
        case 'banking':
          return 'coins'
        case 'manufacturing':
          return 'gears'
        case 'specialists':
          return 'user-astronaut'
      }

      return 'question'
    }
}

export default new TechnologyHelper()
