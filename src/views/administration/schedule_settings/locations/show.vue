<template>
  <div>
    <b-card class="mb-0">
      <b-tabs vertical nav-wrapper-class="nav-hidden" align="left" lazy>
        <!-- basic info -->
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <Edit
            v-if="edit"
            :tabNumber="0"
            :data="
              id
                ? item
                : {
                    name: '',
                    name_local: '',
                    id: '',
                    building: '',
                    location_num: '',
                    type_obj: '',
                    floor: '',
                    floor_local: '',
                    test: '',
                    floor_code: '',
                    capacity: '',
                    exam_capacity: '',
                    faculties: '',
                    type: ''
                  }
            "
            @hide="cancel()"
            :inline="true"
            @refresh="init"
          >
          </Edit>
          <div v-if="item && !edit">
            <ShowComponent
              :loading="load"
              :data="item"
              :only="[
                'name',
                'name_local',
                'id',
                'building',
                'location_num',
                'type_obj',
                'floor',
                'floor_local',
                'floor_code',
                'capacity',
                'exam_capacity',
                'faculties',
                'type',
              ]"
            >
              <template #name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>
                <td>
                  {{ data.name }}
                </td>
              </template>
              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td>
                  {{ data.name_local }}
                </td>
              </template>
              <template #building="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.building`) }}
                </th>
                <td>
                  {{
                    $i18n.locale == "ar"
                      ? data.building.name_local
                      : data.building.name
                  }}
                </td>
              </template>
              <template #type_obj="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`type`) }}
                </th>
                <td>
                  {{
                    $i18n.locale == "ar"
                      ? data.type_obj.name_local
                      : data.type_obj.name
                  }}
                </td>
              </template>
              <template #floor="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.location_floor`) }}
                </th>
                <td>
                  {{ data.floor }}
                </td>
              </template>
              <template #floor_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.location_floor`) }}
                </th>
                <td>
                  {{ data.floor_local }}
                </td>
              </template>
              <template #faculties="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`faculties`) }}
                </th>
                <td>
                  <b-link
                    v-for="(faculty, index) in data.faculties"
                    :key="faculty.id"
                    :to="{
                      name: 'faculty',
                      params: { id: faculty.id },
                    }"
                    target="_blank"
                  >
                    {{
                      $i18n.locale == "en"
                        ? faculty.name || faculty.name_local
                        : faculty.name_local || faculty.name
                    }}
                    <span v-if="data.faculties.length != index + 1"
                      >, &nbsp;</span
                    >
                  </b-link>
                </td>
              </template>
              <template #type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t("Faculties during exams") }}
                </th>
                <td>
                  <b-link
                    v-for="(faculty, index) in data.faculties"
                    :key="faculty.id"
                    :to="{
                      name: 'faculty',
                      params: { id: faculty.id },
                    }"
                    target="_blank"
                  >
                    {{
                      $i18n.locale == "en"
                        ? faculty.name || faculty.name_local
                        : faculty.name_local || faculty.name
                    }}
                    <span v-if="data.faculties.length != index + 1"
                      >, &nbsp;</span
                    >
                  </b-link>
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <feather-icon
                    v-if="hasPermission('edit_location')"
                    @click="openEdit()"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    v-b-tooltip.hover="$t('Global.edit')"
                  />
                </div>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
        <!-- Study Schedule -->
        <b-tab>
          <template #title>
            <feather-icon icon="CalendarIcon" />
            <span>{{ $t("study_schedule") }}</span>
          </template>
          <StudySchedule v-if="renderStudyScheduleComponent" />
        </b-tab>
        <!-- Exam Schedule -->
        <b-tab>
          <template #title>
            <feather-icon icon="CalendarIcon" />
            <span id="exam_schedule">{{ $t("exam_schedule") }}</span>
          </template>
          <div>
            <ExamsSchedules />
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BBadge, BLink, BTab, BTabs, BCard } from "bootstrap-vue";
import Offerings from "@/views/study/offerings/components/offerings";
import ShowComponent from "@/views/components/info/show";
import Edit from "@/views/administration/schedule_settings/locations/edit.vue";
import StudySchedule from "@/views/study/schedule/locations/scheduling/calendar/Calendar.vue";
import ExamsSchedules from "@/views/administration/schedule_settings/locations/exams_schedules/components/exams_schedules.vue";

export default {
  name: "show",
  components: {
    mapGetters,
    Offerings,
    ShowComponent,
    StudySchedule,
    ExamsSchedules,
    Edit,
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard,
  },
  data() {
    return {
      edit: false,
      renderStudyScheduleComponent: true,
    };
  },
  watch: {
    localLang: function () {
      // remove the my-component component from the DOM
      this.renderStudyScheduleComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderStudyScheduleComponent = true;
      });
    },
  },
  computed: {
    ...mapGetters({
      item: "locations/item",
      load: "locations/load",
    }),
    localLang() {
      return this.$i18n.locale;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      if (this.id || id) {
        this.$store.dispatch("locations/get", this.id);
        this.edit =
          this.$route.query.inline == "false"
            ? false
            : this.$route.query.inline;
      } else {
        this.edit = true;
      }
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: true,
      });
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },
  },
};
</script>

<style scoped></style>
