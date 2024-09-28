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
        <b-tab v-if="hasPermission('access_building')">
          <template #title>
            <feather-icon icon="HomeIcon" />
            <span> {{ $t("Buildings") }}</span>
          </template>
          <Buildings />
        </b-tab>

        <b-tab v-if="hasPermission('access_location')">
          <template #title
            ><feather-icon icon="LayersIcon" /><span>{{
              $t("Locations")
            }}</span></template
          >
          <Locations v-if="checkTabVisited(1)" :tabNum="1" :inline="true" />
        </b-tab>

        <b-tab v-if="hasPermission('access_slot')">
          <template #title>
            <feather-icon icon="ClockIcon" />
            <span>{{ $t("Time Slots") }}</span></template
          >
          <TimeSlots v-if="checkTabVisited(2)" :tabNum="2" :inline="true" />
        </b-tab>

        <b-tab v-if="hasPermission('access_examSlot')">
          <template #title>
            <feather-icon icon="ClockIcon" />
            <span>{{ $t("Exam Slots") }}</span></template
          >
          <ExamSlots v-if="checkTabVisited(3)" :tabNum="3" :inline="true" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BLink, BTab, BTabs, BCard } from "bootstrap-vue";
import Buildings from "@/views/administration/schedule_settings/buildings/index";
import Locations from "@/views/administration/schedule_settings/locations/index.vue";
import TimeSlots from "@/views/administration/schedule_settings/slots/index.vue";
import ExamSlots from "@/views/administration/schedule_settings/exam_slots/index.vue";

export default {
  name: "Show",
  components: {
    Buildings,
    Locations,
    TimeSlots,
    ExamSlots,
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

<style scoped></style>
