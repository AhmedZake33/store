<template>
  <div>
    <statistics
      :loading="load"
      v-if="statistics"
      :items="statistics"
      :widths="[3, 3, 3, 3, 3, 3, 3, 3]"
      :only="[
        'total',
        'remaining',
        'Submitted',
        'Accepted',
        'Not_Accepted',
        'Approved',
        'Not_Approved',
        'Hold',
      ]"
      :icon="'TrendingUpIcon'"
    ></statistics>
    <DataTable
      :title="title"
      :total="total"
      :allow-search="true"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @reset="reset"
      :paramsLoaded="paramsLoaded"
    >
      <template v-if="lookups && !listed_only" #filter>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.offering_terms"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
            v-model="filter.faculty_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.faculties"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
            v-model="filter.bylaw_id"
            :disabled="filter.faculty_id == null"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.bylaws"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.bylaw')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ getEmptyListLabel }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
            v-model="filter.program_id"
            :disabled="filter.bylaw_id == null"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.programs"
            :label="getSelectLabel()"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.program')"
          >
            <template #no-options>
              {{ getEmptyListLabel }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <!--<b-col cols="6" md="4">
         <v-select
          v-model="filter.status"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.offering_status_control"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.control_status')"
        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select> -->
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.quality_status"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.offering_status_control"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.quality_control_status')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.stages"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.stages"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.stage')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <!-- <b-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList()"
          class="w-100"
          :reduce="val => val.value"
          placeholder="Users Status"
        />
      </b-col> -->
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative font-small-2"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <!--   <template #cell(max_total)="data">
          <span>
            {{ data.item.max_total || '-' }}
          </span>
        </template> -->
          <template #cell(term_id)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold d-block"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{ data.item.term ? data.item.term.name : "-" }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              class="font-small-4"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{
                data.item.term && $i18n.locale == "ar"
                  ? data.item.term.name_local
                  : "-"
              }}
            </b-link>
          </template>

          <template #cell(quality_status)="data">
            <b-badge
              pill
              :variant="getColor(data.item.quality_status.name)"
              class="text-capitalize"
              v-if="$i18n.locale == 'en' && data.item.quality_status"
            >
              {{ data.item.quality_status.name }}
            </b-badge>
            <b-badge
              pill
              :variant="getColor(data.item.quality_status.name)"
              class="text-capitalize"
              v-if="$i18n.locale == 'ar' && data.item.quality_status"
            >
              {{ data.item.quality_status.name_local }}
            </b-badge>
          </template>

          <template #cell(registrations_count)="data">
            <div class="d-flex">
              <strong>
                {{ data.item.students_count ? data.item.students_count : 0 }}
              </strong>
            </div>
          </template>

          <template #cell(instructors_count)="data">
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
                >{{ $t("Global.coordinator") }}: &nbsp;
              </strong>
              <div
                v-for="(coordinator, i) in (arrLength = coordinator(
                  data.item.instructors
                ))"
                :key="i"
              >
                <!-- <small style="font-weight-bold;" v-if="$i18n.locale == 'en'"
              :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >{{ data.item.instructors_count }}
                <small class="text-danger" v-if="i < arrLength.length-1"> , &nbsp;</small></small
              >-->
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t("Global.teacher") }}: &nbsp;</strong>
              <div
                v-for="(teacher, i) in (arrLength = teacher(
                  data.item.instructors
                ))"
                :key="i"
              >
                <!-- <b-link class="font-weight-bold" v-if="$i18n.locale == 'en'"
               :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ data.item.instructors_count}}
                <small class="text-danger" v-if="i < arrLength.length-1">, &nbsp;</small></b-link
              >
              <b-link class="font-weight-bold" v-if="$i18n.locale == 'ar'"
               :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name_local }}
                <small class="text-danger" v-if="i < arrLength.length-1">, &nbsp;</small></b-link
              > -->
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t("Global.TeachingAssistantEdit") }}: &nbsp;</strong>
              <div
                v-for="(TeachingAssistantEdit, i) in (arrLength =
                  TeachingAssistantEdit(data.item.instructors))"
                :key="i"
              >
                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'en'"
                  :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantEdit.id },
                  }"
                  >{{ TeachingAssistantEdit.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >
                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'ar'"
                  :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantEdit.id },
                  }"
                  >{{ TeachingAssistantEdit.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t("Global.TeachingAssistantView") }}: &nbsp;</strong>
              <div
                v-for="(TeachingAssistantView, i) in (arrLength =
                  TeachingAssistantView(data.item.instructors))"
                :key="i"
              >
                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'en'"
                  :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantView.id },
                  }"
                  >{{ TeachingAssistantView.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >
                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'ar'"
                  :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantView.id },
                  }"
                  >{{ TeachingAssistantView.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t("Global.examinerCommittee") }}: &nbsp;</strong>
              <div
                v-for="(examinationCommittee, i) in (arrLength =
                  examinationCommittee(data.item.instructors))"
                :key="i"
              >
                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'en'"
                  :to="{
                    name: 'user-show',
                    params: { id: examinationCommittee.id },
                  }"
                  >{{ examinationCommittee.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >

                <b-link
                  class="font-weight-bold"
                  v-if="$i18n.locale == 'ar'"
                  :to="{
                    name: 'user-show',
                    params: { id: examinationCommittee.id },
                  }"
                  >{{ examinationCommittee.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                    >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
          </template>

          <template #cell(exams)="data">
            <div v-for="(exam, i) in data.item.exams" :key="i">
              <div v-if="$i18n.locale == 'en'" class="d-block">
                <span class="font-weight-bold">{{
                  $t("Global.exam_date")
                }}</span>
                : {{ exam.exam_date }}
                <br />
                <span class="font-weight-bold">{{ $t("Global.period") }}</span>
                :
                {{ exam.period }}
                <br />
                <span class="font-weight-bold">{{
                  $t("Global.extended_periods")
                }}</span>
                : {{ exam.extended_periods }}
                <br />
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                    $t("Global.location")
                  }}</span>
                  :
                  {{
                    location
                      ? `${location.name} (${location.building.name})`
                      : "-"
                  }}
                </div>
              </div>
              <div v-if="$i18n.locale == 'ar'" class="d-block">
                <span class="font-weight-bold">{{
                  $t("Global.exam_date")
                }}</span>
                : {{ exam.exam_date }}
                <br />
                <span class="font-weight-bold">{{ $t("Global.period") }}</span>
                :
                {{ exam.period }}
                <br />
                <span class="font-weight-bold">{{
                  $t("Global.extended_periods")
                }}</span>
                : {{ exam.extended_periods }}
                <br />
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                    $t("Global.location")
                  }}</span>
                  :
                  {{
                    location
                      ? `${location.name} (${location.building.name})`
                      : "-"
                  }}
                </div>
              </div>
            </div>
          </template>

          <template #cell(course)="data">
            <div class="d-flex">
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold custom_link h5"
                :to="{ name: 'course', params: { id: data.item.course.id } }"
              >
                {{
                  data.item.course
                    ? `${data.item.course.code}  &nbsp; ${data.item.course.name}`
                    : "-"
                }}
              </b-link>

              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold custom_link h5"
                :to="{ name: 'course', params: { id: data.item.course.id } }"
              >
                {{
                  data.item.course
                    ? `${data.item.course.code}  &nbsp; ${data.item.course.name_local}`
                    : "-"
                }}
              </b-link>
            </div>

            <div class="d-flex flex-wrap">
              <!--             <strong> {{ $t("Global.faculty") }} : </strong>
 -->
              <div v-if="data.item.course.faculty">
                <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold d-block"
                  :to="{
                    name: 'faculty',
                    params: { id: data.item.course.faculty.id },
                  }"
                >
                  {{ data.item.course.faculty.name }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold d-block"
                  :to="{
                    name: 'faculty',
                    params: { id: data.item.course.faculty.id },
                  }"
                >
                  {{ data.item.course.faculty.name_local }}
                </b-link>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <!--             <strong> {{ $t("Global.faculty") }} : </strong>
 -->
              <div v-if="data.item.course.bylaw">
                <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold d-block"
                  :to="{
                    name: 'bylaw',
                    params: { id: data.item.course.bylaw.id },
                  }"
                >
                  {{ data.item.course.bylaw.name }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold d-block"
                  :to="{
                    name: 'bylaw',
                    params: { id: data.item.course.bylaw.id },
                  }"
                >
                  {{ data.item.course.bylaw.name_local }}
                </b-link>
              </div>
            </div>
            <div>
              <strong>
                {{
                  `${$t("Global.students")} : ${
                    data.item.students_count ? data.item.students_count : "0"
                  }`
                }}
              </strong>
            </div>
            <div>
              <strong>{{ $t("Global.teacher") }}: &nbsp;</strong>
              <span>{{ data.item.instructors_count }}</span>
            </div>
            <!-- <div
              v-for="(teacher, i) in arrLength=teacher(data.item.instructors)"
              :key="i"
            >

              <b-link class="font-weight-bold" v-if="$i18n.locale == 'en'"
               :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name }}
                <small class="text-danger" v-if="i < arrLength.length-1">, &nbsp;</small></b-link
              >
              <b-link class="font-weight-bold" v-if="$i18n.locale == 'ar'"
               :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name_local }}
                <small class="text-danger" v-if="i < arrLength.length-1">, &nbsp;</small></b-link
              >
            </div> -->

            <!-- <small class="text-danger" v-if="i < arrLength.length-1">, &nbsp;</small> </b-link>-->
            <b-link
              v-if="$i18n.locale == 'en'"
              class="font-small-4"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{ data.item.term ? data.item.term.name : "-" }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              class="font-small-4"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{
                data.item.term && $i18n.locale == "ar"
                  ? data.item.term.name_local
                  : "-"
              }}
            </b-link>
          </template>

          <template #cell(id)="data">
            <div class="d-flex">
              <b-link
                :to="{ name: 'courseFiles', params: { id: data.item.id } }"
              >
                {{ data.item.id }}
              </b-link>
            </div>
          </template>
          <template #cell(actions)="data" v-if="!listed_only">
            <div>
              <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
              <b-link
                :to="{ name: 'courseFiles', params: { id: data.item.id } }"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
            </div>
          </template>
          <template #cell(stage)="data">
            <div class="d-flex">
              <span
                v-if="
                  data.item.course &&
                  data.item.course.bylaw &&
                  data.item.course.bylaw.stage
                "
              >
                {{
                  data.item.course.bylaw.stage.code
                    ? data.item.course.bylaw.stage.code
                    : "-"
                }}
              </span>
            </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="!listed_only">
        <b-button
          v-if="hasPermission('export_offering')"
          v-b-tooltip.hover="$t('Global.export_excel')"
          class="btn-icon ml-0"
          variant="primary"
          @click="exportData"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button>
        <b-button
          v-else
          v-b-tooltip.hover="$t('Global.export_excel')"
          class="btn-icon ml-0 disabled_all"
          variant="primary"
          style="cursor: not-allowed"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button>
      </template>
    </DataTable>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import { EventBus } from "@/main";
import Statistics from "@/views/components/info/statistics";
import { mdiDataMatrix, mdiBarcode } from "@mdi/js";
import SvgIcon from "@jamescoyle/vue-icon";

export default {
  name: "courseFile",
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
    SvgIcon,
    Statistics,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: { type: Boolean, default: false },
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    return {
      loaded: false,
      oldTerm: false,
      filter: {
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        stages: null,
      },
      path: mdiBarcode,
      paramsLoaded: true,
    };
  },

  beforeMount() {
    this.filter = {
      term_id: this.currentTerm || null,
      faculty_id: null,
      bylaw_id: null,
      program_id: null,
      status: null,
    };
    this.$store.dispatch("courseFile/FileCount", {}).then((data) => {
      this.paramsLoaded = false;
    });
  },

  computed: {
    ...mapGetters({
      items: "courseFile/items",
      statistics: "courseFile/statistics",
      total: "courseFile/total",
      count: "courseFile/count",
      load: "courseFile/load",
      needDrop:'app/needDrop',
      lookups: "courseFile/lookups",
      currentTerm: "app/currentTerm",
    }),

    getEmptyListLabel() {
      return this.$i18n.locale === "en"
        ? "Sorry, No Matching Options."
        : "لاتوجد نتائج مطابقة للبحث.";
    },
    fieldsData() {
      let fields = [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: true,
        },
        {
          key: "course",
          label: this.$t("Global.course"),
          //thStyle: { width: "35%" },
          sortable: false,
        },

        // {
        //   key: "stage",
        //   label: this.$t("Global.stage"),
        //   sortable: false,
        // },

        // {
        //   key: "instructors_count",
        //   label: this.$t("Global.instructors"),
        //   thStyle: { width: "30%" },
        //   sortable: false,
        // },
        //  {
        //   key: "term_id",
        //   label: this.$t("Global.semester"),
        //   thStyle: { width: "10%" },

        //   sortable: false,
        // },
        //  {
        //     key: "students_count",
        //     label: this.$t("Global.students_count"),
        //     thStyle: { width: "5%" },
        //     sortable: true,
        //   },
        // {
        //   key: "registrations_count",
        //   label: this.$t("Global.students_count"),
        //   thStyle: { width: "5%" },
        //   sortable: true,
        // },
        // {
        //   key: "instructors_count",
        //   label: this.$t("Global.instructors_count"),
        //   thStyle: { width: "5%" },
        //   sortable: true,
        // },
        {
          key: "quality_status",
          label: this.$t("Global.status"),
          thStyle: { width: "5%" },
          sortable: false,
        },
        {
          key: "last_update",
          label: this.$t("Global.lastupdated"),
          thStyle: { width: "5%" },
          sortable: false,
        },
        // {
        //   key: "exams",
        //   label: this.$t("Global.exam"),
        //   thStyle: { width: "30%" },
        //   sortable: false,
        // },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      return fields;
    },
    language: function () {
      localStorage.setItem("mylang", this.$i18n.locale);
      return this.$i18n.locale;
    },
    header: function () {
      localStorage.setItem("headers", false);
      return false;
    },
  },
  watch: {
    /*   "filter.bylaw_id": function (newValue) {
      if (this.filter.program_id) {
        this.filter.program_id = null;
      }
    },
    "filter.faculty_id": function (newValue) {
      if (this.filter.bylaw_id) {
        this.filter.bylaw_id = null;
      }
    }, */
    language: function (val) {
      this.language = val;
    },
    header: function (val) {
      this.header = val;
    },
    currentTerm: function () {
      alert();
    },
    lookups: function () {
      // alert();
      // handler(newVal , oldVal){
      //   if(newVal.current_term != this.filter.term_id){
      //     if(newVal.current_term != this.oldTerm){
      //       this.filter.term_id = newVal.current_term;
      //     }
      //   }
      // },
      // deep: true,
    },
    "filter.term_id": function (val, old) {
      if (old && val) {
        this.loaded = false;
        this.oldTerm = false;
      }

      if (!val) {
        this.loaded = false;
        this.oldTerm = true;
      }

      if (!old && val) {
        this.loaded = false;
        this.oldTerm = false;
      }
    },
  },
  mounted() {
    this.loaded = true;
  },
  methods: {
    ...mapActions({
      exportExcel: "courseFile/exportData",
      fileCount: "courseFile/FileCount",
    }),
    emit_edit(offering_id) {
      /*this.$router.push({
        name: "offering",
        params: { id: offering_id },
        query: { inline: true },
      });
      this.updateFilterQueryParams({ tabNum: 1 }); */
      let changeName = "edit_course_offering";
      EventBus.$emit("changeIt", changeName);
    },
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    coordinator(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Course Coordinator"
        );
      }
    },
    examinationCommittee(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Examination Committee"
        );
      }
    },
    teacher(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == "Teacher");
      }
    },
    TeachingAssistantEdit(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Teaching Assistant (Editor)"
        );
      }
    },
    TeachingAssistantView(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Teaching Assistant (Viewer)"
        );
      }
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program };
      }
      if (this.status) {
        query = { ...query, status: this.status };
      }
      if (this.quality_status) {
        query = { ...query, quality_status: this.quality_status };
      }
      if (this.stages) {
        query = { ...query, stages: this.stages };
      }

      if (this.$route.query && this.$route.query.term_id) {
        query = { ...query, term_id: this.$route.query.term_id };
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = { ...query, faculty_id: this.$route.query.faculty_id };
      }
      if (this.$route.query && this.$route.query.bylaw_id) {
        query = { ...query, bylaw_id: this.$route.query.bylaw_id };
      }
      if (this.$route.query && this.$route.query.program_id) {
        query = { ...query, program_id: this.$route.query.program_id };
      }
      if (this.$route.query && this.$route.query.status) {
        query = { ...query, status: this.$route.query.status };
      }
      if (this.$route.query && this.$route.query.quality_status) {
        query = { ...query, quality_status: this.$route.query.quality_status };
      }
      if (this.$route.query && this.$route.query.stages) {
        query = { ...query, stages: this.$route.query.stages };
      }
      this.$store.dispatch("courseFile/courseFile", { query }).then((data) => {
        this.paramsLoaded = false;
        this.filter.term_id = this.loaded
          ? this.lookups.current_term
          : !this.oldTerm
          ? this.filter.term_id
          : null;
      });
    },
    deleteOffering(id, student_count) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value && student_count == 0) {
          this.$store.dispatch("offerings/remove", id).then((response) => {
            if (response.status == "success") {
              this.refresh();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              this.$swal({
                icon: "error",
                title: this.$i18n.locale == "en" ? "Error!" : "خطا",
                text:
                  this.$i18n.locale == "en"
                    ? "You Cannot Delete This Offering"
                    : "لا يمكنك مسح هذا المقرر",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              });
            }
          });
        }
      });
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    exportData() {
      this.exportExcel({ lang: this.$i18n.locale, query: this.filter });
    },

    getColor(status) {
      if (status == "New") {
        return "info";
      } else if (status == "Submitted") {
        return "light-warning";
      } else if (status == "Accepted") {
        return "light-success";
      } else if (status == "Not Accepted") {
        return "light-danger";
      } else if (status == "Approved") {
        return "success";
      } else if (status == "Not Approved") {
        return "danger";
      } else if (status == "Updated") {
        return "warning";
      }
    },
    openCalendar(id) {
      this.$router.push({
        name: "courseFile-Schedule",
        params: {
          id,
        },
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
@import "@core/scss/vue/libs/vue-select.scss";
</style>
