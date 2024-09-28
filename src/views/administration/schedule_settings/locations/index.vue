<template>
    <locations :list="true"/>
</template>

<script>
  import locations from '@/views/administration/schedule_settings/locations/components/locations'

  export default {
    name: 'index',
    components: { locations }
  }
</script>

<style scoped>

</style>