<template>
  <div>
    <div>
      <b-card class="mb-0">
        <Edit
          v-if="edit"
          :tabNumber="0"
          :form="item"
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
              'title',
              'trainingType',
              'term',
              'organization',
              'source',
              'description',
              'acceptance_criteria',
              'faculties',
              'programs',
              'num_of_weeks',
              'admission_start_at',
              'admission_end_at',
              'start_at',
              'end_at',
              'cv_required',
              'interview_required',
              'free_of_charge',
              'documents',
            ]"
          >
            <!-- Title -->
            <template #title="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.title`) }}
              </th>
              <td>
                {{ data.title }}
              </td>
            </template>
            <!-- training Type -->
            <template #trainingType="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.type`) }}
              </th>
              <td>
                <span v-if="data.trainingType && $i18n.locale == 'en'">
                  {{ data.trainingType.name }}
                </span>
                <span v-if="data.trainingType && $i18n.locale == 'ar'">
                  {{ data.trainingType.name_local }}
                </span>
              </td>
            </template>
            <!-- Semester -->
            <template #term="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.term`) }}
              </th>
              <td>
                <span v-if="data.term && $i18n.locale == 'en'">
                  {{ data.term.name }}
                </span>
                <span v-if="data.term && $i18n.locale == 'ar'">
                  {{ data.term.name_local }}
                </span>
              </td>
            </template>
            <!-- Organization -->
            <template #organization="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.Organization`) }}
              </th>
              <td>
                <span v-if="data.organization && $i18n.locale == 'en'">
                  {{ data.organization.name }}
                </span>
                <span v-if="data.organization && $i18n.locale == 'ar'">
                  {{ data.organization.name_local }}
                </span>
                <span v-if="data.organization_other && !data.organization">
                  {{ data.organization_other }}
                </span>
              </td>
            </template>
            <!-- Source -->
            <!-- Title -->
            <template #source="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Source`) }}
              </th>
              <td>
               
                {{ $t(`${data.source}`) }}
              </td>
            </template>
            <!-- Description -->
            <template #description="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.description`) }}
              </th>
              <td>
                {{ data.description }}
              </td>
            </template>
            <!-- Acceptance Criteria -->
            <template #acceptance_criteria="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Acceptance Criteria`) }}
              </th>
              <td>
                {{ data.acceptance_criteria }}
              </td>
            </template>
            <!-- faculties -->
            <template #faculties="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`faculties`) }}
              </th>
              <td v-if="data.faculties && data.faculties.length > 0">
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
              <td v-else>{{ $t(`All`) }}</td>
            </template>
            <!-- programs -->
            <template #programs="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.programs`) }}
              </th>
              <td v-if="data.programs && data.programs.length > 0">
                <b-link
                  v-for="(program, index) in data.programs"
                  :key="program.id"
                  :to="{
                    name: 'program',
                    params: { id: program.id },
                  }"
                  target="_blank"
                >
                  {{
                    $i18n.locale == "en"
                      ? program.name || program.name_local
                      : program.name_local || program.name
                  }}
                  <span v-if="data.programs.length != index + 1">, &nbsp;</span>
                </b-link>
              </td>
              <td v-else>{{ $t(`All`) }}</td>
            </template>
            <!-- number of weeks -->
            <template #num_of_weeks="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`number of weeks`) }}
              </th>
              <td>
                {{ data.num_of_weeks }}
              </td>
            </template>
            <!-- CV is required -->
            <template #cv_required="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`CV is required`) }}
              </th>
              <td>
                {{ data.cv_required == 1 ? $t(`Global.yes`) : $t(`Global.no`) }}
              </td>
            </template>
            <!-- Interview is required -->
            <template #interview_required="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Interview is required`) }}
              </th>
              <td>
                {{
                  data.interview_required == 1
                    ? $t(`Global.yes`)
                    : $t(`Global.no`)
                }}
              </td>
            </template>
            <!-- Free of charge -->
            <template #free_of_charge="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Free of charge`) }}
              </th>
              <td>
                {{
                  data.free_of_charge == 1 ? $t(`Global.yes`) : $t(`Global.no`)
                }}
              </td>
            </template>
            <!-- Training Overview Document -->
            <template #documents="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Training Overview Document`) }}
              </th>
              <td>
                <span v-for="document in data.documents" :key="document.id">
                  <a
                    class="text-capitalize"
                    style="cursor: pointer"
                    target="_blank"
                    :href="document.url"
                  >
                    <feather-icon
                      icon="FileIcon"
                      size="18"
                      class="align-middle text-body"
                    />
                    {{ document.title }}
                  </a>
                </span>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon
                  v-if="hasPermission('edit_training')"
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
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BLink, BTab, BTabs, BCard } from "bootstrap-vue";
import ShowComponent from "@/views/components/info/show";
import Edit from "@/views/student_activities/trainings/edit";

export default {
  name: "show",
  components: {
    ShowComponent,
    Edit,
    BLink,
    BTab,
    BTabs,
    BCard,
  },
  data() {
    return {
      edit: false,
      tabIndex: 0,
    };
  },
  computed: {
    ...mapGetters({
      item: "trainings/item",
      load: "trainings/load",
    }),
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
        this.$store.dispatch("trainings/get", this.id);
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
