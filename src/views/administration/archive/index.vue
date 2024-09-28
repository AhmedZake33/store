<template>
    <archive :list="true"/>
</template>

<script>
  import Archive from '@/views/administration/archive/components/archive'

  export default {
    name: 'index',
    components: { Archive }
  }
</script>

<style scoped>

</style>