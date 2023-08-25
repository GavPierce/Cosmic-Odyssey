<template>
<div>
  <p>
    Your galactic researchers have achieved a quantum leap in the field of <span class="text-warning">{{getTechnologyFriendlyName(event.data.technologyKey)}} Level {{event.data.technologyLevel}}</span>.
  </p>
  <p>
    Your cosmic scholars are now experimenting into the mysteries of  <span class="text-info">{{getTechnologyFriendlyName(event.data.technologyKeyNext)}} Level {{event.data.technologyLevelNext}}</span>.
  </p>
</div>
</template>

<script>
import TechnologyHelper from '../../../../../services/technologyHelper'

export default {
  components: {

  },
  props: {
    event: Object
  },
  methods: {
    getTechnologyFriendlyName (key) {
      return TechnologyHelper.getFriendlyName(key)
    }
  }
}
</script>

<style scoped>
</style>
