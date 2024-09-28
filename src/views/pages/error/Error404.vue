<template  style="background-color: #fff">
  <div class="cont">
    <div >
      <div class="">
        <h2 class="brand-text text-primary ml-1">
          <router-link to="/">Octopi</router-link>
        </h2>
      </div>
      <div class="d-flex justify-content-center align-items-end text-center mt-2">
        <div>
          <h2 class="">
            Page Not Found 🕵🏻‍♀️
          </h2>
          <p class="">
            Oops! 😖 The requested URL was not found on this server.<router-link to="/" style="text-decoration: underline">Go to Home</router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="">
      <div class="img-cont">

      </div>
    </div>
    <div class="d-flex justify-content-center align-items-end">
      <p class="">
        Copyright © 2022 <a href="http://octopiems.com/" target="_blank">Octopi</a>, All rights Reserved
      </p>
    </div>
  </div>

</template>

<script>
/* eslint-disable global-require */
import { BLink, BImg, BButton } from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  components: {
    BLink, BImg, BButton, VuexyLogo,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/not-authorized-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
    returnUrl(){
      return this.loginRoute();
    }
  },
  methods: {
    loginRoute() {
      const user = JSON.parse(localStorage.getItem('userData'))
      return getHomeRouteForLoggedInUser(user ? user.role : null)
    },
  },
}
</script>

<style lang="scss" scoped>
//@import '@core/scss/vue/pages/page-misc.scss';
.cont{
  padding: 10px 15px;
  height: 100vh;
}
.cont > div{
  height: calc(100%/3);
}
.img-cont{
  height: 100%;
  width: 350px;
  margin: auto;
  background-image: url("../../../assets/images/logo/octopilogo.png");
  background-repeat: no-repeat;
}
</style>
