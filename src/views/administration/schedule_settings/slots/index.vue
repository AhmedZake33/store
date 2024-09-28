<template>
    <slots :list="true"/>
</template>

<script>
  import slots from '@/views/administration/schedule_settings/slots/components/slots'

  export default {
    name: 'index',
    components: { slots }
  }
</script>

<style scoped>

</style>