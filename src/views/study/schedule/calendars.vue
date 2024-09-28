<template>
  <div>
    <b-card class="mb-0">
      <b-tabs
        v-model="tabIndex"
        @input="saveStatus"
        vertical
        nav-wrapper-class="nav-hidden"
        align="left"
      >
        <b-tab>
          <template #title>
            <feather-icon icon="UsersIcon" />
            <span> {{ $t("instructors") }}</span>
          </template>
          <Instructors v-if="checkTabVisited(0)" :tabNum="0" :inline="true" />
        </b-tab>

        <b-tab>
          <template #title>
            <feather-icon icon="BookIcon" />
            <span>{{ $t("offerings") }}</span>
          </template>
          <Courses v-if="checkTabVisited(1)" :tabNum="1" :inline="true" />
        </b-tab>

        <b-tab>
          <template #title>
            <feather-icon icon="UsersIcon" />
            <span>{{ $t("students") }}</span>
          </template>
          <Students v-if="checkTabVisited(2)" :tabNum="2" :inline="true" :schedule="true"/>
        </b-tab>

        <b-tab>
          <template #title>
            <feather-icon icon="LayersIcon" />
            <span>{{ $t("locations") }}</span>
          </template>
            <Locations v-if="checkTabVisited(3)" :tabNum="3" :inline="true" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BLink, BTab, BTabs, BCard } from "bootstrap-vue";
import Instructors from "@/views/user_settings/staff/components/instructors";
import Locations from '@/views/administration/schedule_settings/locations/components/locations'
import Students from "@/views/students/student/components/students";
import Courses from "@/views/study/offerings/components/offerings.vue";

export default {
  name: "Show",
  components: {
    BLink,
    BTab,
    BTabs,
    BCard,
    Instructors,
    Students,
    Locations,
    Courses
  },
  watch: {
    tabIndex(newVal){
    }
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
      this.edit = false;
      this.resetFilterQueryParams({});
      this.updateFilterQueryParams({
        tabNum: index,
        ...this.getTabFilterData(index),
      });
      this.visitedTabs.push(index);
    },
  },
};
</script>

<style scoped>
</style>
