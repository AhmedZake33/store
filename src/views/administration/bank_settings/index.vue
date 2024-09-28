<template>
    <div>
      <!-- <statistics :items="item" :only="['courses_count', 'staff_count']" /> -->
      <b-card class="mb-0">
        <b-tabs
          v-model="tabIndex"
          @input="saveStatus"
          vertical
          nav-wrapper-class="nav-hidden"
          align="left"
        >
        <b-tab v-if="hasPermission('access_bank')">
          <template #title>
            <feather-icon icon="HomeIcon" />
            <span> {{ $t("Global.banks") }}</span>
          </template>
          <BankName />
        </b-tab>
  
          <b-tab v-if="hasPermission('access_currency_bank')">
            <template #title
              ><feather-icon icon="DollarSignIcon" /><span>{{
                $t("currencies")
              }}</span></template
            >
            <currencies v-if="checkTabVisited(1)" :tabNum="1" :inline="true" />
          </b-tab>
  
          <b-tab v-if="hasPermission('access_bankInfo_bank')">
            <template #title>
              <feather-icon icon="InfoIcon" />
              <span>{{ $t("Global.bankInfo") }}</span></template
            >
            <BankInfos v-if="checkTabVisited(2)" :tabNum="2" :inline="true" />
          </b-tab>
  
          <b-tab v-if="hasPermission('access_note_bank')">
            <template #title>
              <feather-icon icon="Edit3Icon" />
              <span>{{ $t("Global.Payment Slip Notes") }}</span></template
            >
            <notes v-if="checkTabVisited(3)" :tabNum="3" :inline="true" />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { BLink, BTab, BTabs, BCard } from "bootstrap-vue";
  import BankName from "@/views/administration/bank_settings/bank_name/bank_name.vue";
  import currencies from "@/views/administration/bank_settings/currency/index.vue";
  import BankInfos from "@/views/administration/bank_settings/bank_info/bank_info.vue";
  import notes from "@/views/administration/bank_settings/note/note.vue";
  
  export default {
    name: "Show",
    components: {
      notes,
      BankName,
      currencies,
      BankInfos,
      BLink,
      BTab,
      BTabs,
      BCard,
    },
    computed: {
      ...mapGetters({
        item: "departments/item",
        load: "departments/load",
      }),
    },
  
    data() {
      return {
        edit: false,
        visitedTabs: [],
        tabIndex: 0,
        index: 0,
      };
    },
    beforeMount() {
      if (this.$route.query) {
        this.tabIndex = Number(this.$route.query.tabNum);
        this.visitedTabs.push(this.tabIndex);
      }
    },
    destroyed() {
      //to reset tab filter data
      this.$store.dispatch("app/resetTabsFilter");
    },
    methods: {
      checkTabVisited(index) {
        return this.visitedTabs.includes(index);
      },
      saveStatus(index) {
        this.visitedTabs.push(index);
        this.edit = false;
        this.resetFilterQueryParams(null);
        this.updateFilterQueryParams({
          tabNum: index,
          ...this.getTabFilterData(index),
        });
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .per-page-selector {
    width: 90px;
  }
  </style>
  
  <style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  </style>
  