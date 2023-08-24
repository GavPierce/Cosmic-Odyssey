<template>
<span>
  <i :class="getStatusIcon(statusFrom)" :title="statusFrom"></i> (<i :class="getStatusIcon(actualStatus)" :title="actualStatus"></i>) <i :class="getStatusIcon(statusTo)" :title="statusTo"></i>
</span>
</template>

<script>
export default {
  props: {
    'statusFrom': String,
    'statusTo': String,
    'actualStatus': String
  },
  methods: {
    getStatusIcon (status) {
      switch (status) {
        case 'allies':
          return 'fas fa-face-smile-beam text-success'
        case 'neutral':
          return 'fas fa-face-meh text-info'
        case 'enemies':
          return 'fas fa-face-angry text-danger'
      }
    }
  }
}
</script>

<style scoped>
</style>
