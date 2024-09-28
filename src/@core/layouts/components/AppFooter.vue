<template>
  <p class=" mb-0 d-flex justify-content-between w-100">
    <span class="float-md-left d-block d-md-inline-block mt-25">
      {{$t('Copyright')}}  © {{ new Date().getFullYear() }}
      <b-link
        class="ml-25"
        href="https://elnadycompany.com"
        target="_blank"
      >{{$t('Elnady Engineering')}}</b-link>
      <span class="d-none d-sm-inline-block">. {{$t('All rights reserved')}}. {{ $store.getters.appVersion }}</span>
    </span>
    <b-link
        class="ml-25"
        :href="universityData && universityData.footer_link"
        target="_blank"
      >{{universityData && universityData.footer}}</b-link>

    <!-- <span class="float-md-right d-none d-md-block">Hand-crafted &amp; Made with
      <feather-icon
        icon="HeartIcon"
        size="21"
        class="text-danger stroke-current"
      />
    </span> -->
  </p>
</template>

<script>
import { BLink } from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    BLink,
  },
  computed:{
    ...mapGetters({
      universityData: 'app/universityData'
    }),
  }
}
</script>
