<template>
  <div>
    <b-card class="mb-0">
      <b-tabs
        v-model="tabIndex"
        vertical
        nav-wrapper-class="nav-hidden"
        align="left"
      >
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <Training />
        </b-tab>

        <b-tab v-if="hasPermission('access_location')">
          <template #title
            ><feather-icon icon="UsersIcon" /><span>{{
              $t("students")
            }}</span></template
          >
          <Students />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { BLink, BTab, BTabs, BCard } from "bootstrap-vue";
import Training from "@/views/student_activities/trainings/components/training";
import Students from "@/views/student_activities/trainings/components/students";

export default {
  name: "show",
  components: {
    Training,
    Students,
    BLink,
    BTab,
    BTabs,
    BCard,
  },
  data() {
    return {
      edit: false,
      tabIndex: 0,
      visitedTabs: [],
      index: 0,
    };
  },
};
</script>

<style scoped></style>
