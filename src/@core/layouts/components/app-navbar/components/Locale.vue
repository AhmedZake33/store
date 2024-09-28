<template>
  <div id="dropdown-grouped" variant="link" class="dropdown-language" right>
    <span class="pointer mx-1"
          v-for="localeObj in locales"
          v-if="$i18n.locale != localeObj.locale"
          :key="localeObj.locale" @click="changeLocal(localeObj)">
      <span class="ml-50">{{ localeObj.name }}</span>
    </span>
  </div>
</template>

<script>
import { BNavItemDropdown, BDropdownItem, BImg } from 'bootstrap-vue';

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BImg,
  },
  // ! Need to move this computed property to comp function once we get to Vue 3
  computed: {
    currentLocale() {
      return this.locales.find(l => l.locale === this.$i18n.locale);
    },
  },
  mounted() {
    const lang=this.$cookie.get('language') || 'en';
    if(lang){
      this.$i18n.locale = lang;
      const local=this.locales.find(l => l.locale === this.$i18n.locale);
      this.$store.commit('appConfig/SET_RTL', local.RTL);
    }
  },
  setup() {
    const locales = [
      {
        locale: 'en',
        img: require('@/assets/images/flags/en.png'),
        name: 'English',
        RTL: false,
      },
      {
        locale: 'ar',
        img: require('@/assets/images/flags/fr.png'),
        name: 'عربى',
        RTL: true,
      },
    ];
    return {
      locales,
    };
  },
  methods: {
    changeLocal(localeObj) {
      this.$store.commit('appConfig/SET_RTL', localeObj.RTL);
      this.$i18n.locale = localeObj.locale;
      this.$cookie.set('language', localeObj.locale, 360)
    },
  },
};
</script>

<style></style>
