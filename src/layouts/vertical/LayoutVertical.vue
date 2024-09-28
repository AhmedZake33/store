<template>
  <layout-vertical>
    <router-view class="zoom-out" />
    <app-customizer v-if="showCustomizer" slot="customizer" />
  </layout-vertical>
</template>

<script>
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue';
import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue';
import { $themeConfig } from '@themeConfig';

export default {
  components: {
    AppCustomizer,
    LayoutVertical,
  },
  data() {
    return {
      showCustomizer: $themeConfig.layout.customizer,
    };
  },
  watch: {
    $route(to, from) {
      if (this.authUser() && this.authUser().id) {
        // this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id);
        if (to.name && to.name != from.name) {
          this.$store.commit('app/UPDATE_PAGE_DETAILS', null, { root: true });
        }
      }
    },
  },
  methods: {
    hideEmptyTab() {
      const tabs = document.querySelectorAll('.main-menu-content .navigation.navigation-main .nav-item.has-sub');
      const menuHeaders = document.querySelectorAll('.navigation.navigation-main .navigation-header');
      tabs.forEach(element => {
        if (element.querySelectorAll('.menu-content.collapse li').length == 0) {
          element.style.display = 'none';
        } else {
          element.style.display = 'list-item';
        }
      });
      menuHeaders.forEach(el => {
        if ((el.nextElementSibling && el.nextElementSibling.classList.contains('navigation-header')) || (el.nextElementSibling && el.nextElementSibling.style.display == 'none')) {
          el.style.display = 'none';
        } else {
          el.style.display = 'list-item';
        }
      });
    },
  },
  mounted() {
    if (this.authUser() && this.authUser().id) {
      this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id).then(_ => {
        setTimeout(() => {
            this.hideEmptyTab();
        }, 100);
      });
    }
  },
};
</script>

<style>
/* .zoom-out{
        zoom: 85%;
    } */
.main-menu.menu-light .navigation .navigation-header span {
  font-weight: 700;
  font-size: 1rem;
  color: #054978;
}
.main-menu.menu-light .navigation > li ul {
  position: relative;
}
</style>
