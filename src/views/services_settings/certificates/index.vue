<template>
  <Certificates :yearId="yearId"/>
</template>

<script>
// eslint-disable-next-line import/extensions
import Certificates from '@/views/services_settings/certificates/certificates'

export default {
  name: 'Index',
  components: { Certificates },
  props: {
    yearId: { default: null, type: Number },
  },
}
</script>

<style scoped>

</style>
