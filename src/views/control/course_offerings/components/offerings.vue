<template>
  <div>
    <statistics
        :loading="load"
        v-if="statistics"
        :items="statistics"
        :widths="[2, 2, 2, 2, 2, 2, 6, 6]"
        :only="[
        'Frozen',
        'Draft',
        'Submitted',
        'Accepted',
        'Approved',
        'Published',
        'total',
        'submitted_midterm',
        'submitted_student_activites',
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
        :default-filter="'control_term_id'"
    >
      <template v-if="lookups && !listed_only" #filter>
        <b-col cols="6" md="4">
          <v-select
              v-model="filter.control_term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.offering_terms"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.term')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
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
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.bylaw_id"
              :disabled="!filter.faculty_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.bylaws"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.bylaw')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.program_id"
              :disabled="!filter.bylaw_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.programs"
              :label="getSelectLabel()"
              class="w-100"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.program')"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.status"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="customLookups.offering_status_control"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id.toString()"
              :placeholder="$t('Global.control_status')"
          >

            <template v-slot:option="option">

              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}

            </template>

            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table @sort-changed="sortingChanged"
                 no-local-sorting
                 class="position-relative font-small-2" :items="items" responsive :fields="fieldsData" primary-key="id"
                 show-empty :empty-text="$t('Global.empty_text')"
        >
          <template #cell(checkbox)="data">
            <div class="d-flex">
              <b-form-group>
                <b-form-checkbox
                    :key="data.item.id"
                    :id="'check-offering-' + data.item.id"
                    v-model="selectedItems"
                    :value="data.item.id"
                >
                </b-form-checkbox>
              </b-form-group>
            </div>
          </template>
          <template #cell(id)="data">
            <div class="d-flex">
              <b-link :to="{ name: 'offering', params: { id: data.item.id } }">
                {{ data.item.id }}
              </b-link>
            </div>
          </template>
          <template #cell(registrations_count)="data">
            <div class="d-flex">
              <strong>
                {{ data.item.students_count ? data.item.students_count : 0 }}
              </strong>
            </div>
          </template>

          <template #cell(term)="data">
            <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-block"
                :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{ data.item.term ? data.item.term.name : '-' }}
            </b-link>
            <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-small-4"
                :to="{ name: 'term', params: { id: data.item.term.id } }"
            >
              {{
                data.item.term && $i18n.locale == 'ar'
                    ? data.item.term.name_local
                    : '-'
              }}
            </b-link>
          </template>
          <template #cell(status)="data">
            <b-badge
                pill
                :variant="getColor(data.item.status.name)"
                class="text-capitalize"
                v-if="$i18n.locale == 'en' && data.item.status"
            >
              {{ data.item.status.name }}
            </b-badge>
            <b-badge
                pill
                :variant="getColor(data.item.status.name)"
                class="text-capitalize"
                v-if="$i18n.locale == 'ar' && data.item.status"
            >
              {{ data.item.status.name_local }}
            </b-badge>
          </template>
          <template #cell(instructors_count)="data">
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
              >{{ $t('Global.coordinator') }}: &nbsp;
              </strong>
              <div
                  v-for="(coordinator, i) in (arrLength = coordinator(
                  data.item.instructors
                ))"
                  :key="i"
              >
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'en'"
                    :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >
                  {{ coordinator.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1">
                    , &nbsp;</small
                  >
                </b-link>
                <!--  <b-link
                v-if="$i18n.locale == 'en'"
                class="custom_link"
                :to="{ name: 'user-show', params: { id: coordinator.id } }"
              >

              </b-link> -->
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'ar'"
                    :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >
                  {{ coordinator.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.teacher') }}: &nbsp;</strong>
              <div
                  v-for="(teacher, i) in (arrLength = teacher(
                  data.item.instructors
                ))"
                  :key="i"
              >
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'en'"
                    :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'ar'"
                    :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.TeachingAssistantEdit') }}: &nbsp;</strong>
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
              <strong>{{ $t('Global.TeachingAssistantView') }}: &nbsp;</strong>
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
              <strong>{{ $t('Global.externalCommittee') }}: &nbsp;</strong>
              <div
                  v-for="(externalCommittee, i) in (arrLength = externalCommittee(
                  data.item.instructors
                ))"
                  :key="i"
              >
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'en'"
                    :to="
                    examinationCommittee && examinationCommittee.id
                      ? {
                          name: 'user-show',
                          params: { id: examinationCommittee.id },
                        }
                      : ''
                  "
                >
                  {{ externalCommittee.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
                <!--  <b-link
                v-if="$i18n.locale == 'en'"
                class="custom_link"
              >

              </b-link> -->
                <!--  <b-link
                v-if="$i18n.locale == 'ar'"
                class="custom_link"
                :to="{ name: 'user-show', params: { id: externalCommittee.id } }"
              >
              </b-link> -->
                <b-link
                    class="font-weight-bold custom_link"
                    v-if="$i18n.locale == 'ar'"
                    :to="
                    examinationCommittee && examinationCommittee.id
                      ? {
                          name: 'user-show',
                          params: { id: examinationCommittee.id },
                        }
                      : ''
                  "
                >
                  {{ externalCommittee.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
          </template>

          <template #cell(exams)="data">
            <div v-for="(exam, i) in data.item.exams" :key="i">
              <div v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                <span class="font-weight-bold">{{
                    $t('Global.exam_date')
                  }}</span>
                : {{ exam.exam_date }}
                <br/>
                <span class="font-weight-bold">{{ $t('Global.period') }}</span>
                : {{ exam.period }}
                <br/>
                <span class="font-weight-bold">{{
                    $t('Global.extended_periods')
                  }}</span>
                : {{ exam.extended_periods }}
                <br/>
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                      $t('Global.location')
                    }}</span>
                  :
                  {{
                    location
                        ? `${location.name}
                                    (${location.building.name})`
                        : '-'
                  }}
                </div>
              </div>
              <div v-if="$i18n.locale == 'ar'" class="d-block">
                <span class="font-weight-bold">{{
                    $t('Global.exam_date')
                  }}</span>
                : {{ exam.exam_date }}
                <br/>
                <span class="font-weight-bold">{{ $t('Global.period') }}</span>
                : {{ exam.period }}
                <br/>
                <span class="font-weight-bold">{{
                    $t('Global.extended_periods')
                  }}</span>
                : {{ exam.extended_periods }}
                <br/>
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                      $t('Global.location')
                    }}</span>
                  :
                  {{
                    location
                        ? `${location.name}
                                    (${location.building.name})`
                        : '-'
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
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name}`
                      : '-'
                }}
              </b-link>
              <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold custom_link h5"
                  :to="{ name: 'course', params: { id: data.item.course.id } }"
              >
                {{
                  data.item.course
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name_local}`
                      : '-'
                }}
              </b-link>
            </div>
            <!-- <div class="d-flex">
            <strong>
              {{
                `${$t("Global.students")} : ${
                  data.item.students_count ? data.item.students_count : "_"
                }`
              }}
            </strong>
          </div> -->
            <!--  <div class="d-flex flex-wrap">
            <strong> {{ $t("Global.programs") }} : </strong>
            <div
              v-if="data.item.programs"
              v-for="(program, i) in data.item.programs"
              :key="i"
            >
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-block"
                 :to="{ name: 'program', params: { id: program.id } }"
              >
                {{
                  ` ${program.name}  (${
                    program.bylaw ? `${program.bylaw.name} ` : "_"
                  })`
                }}
                <small class="text-danger" v-if="i < data.item.programs.length-1">,</small>
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold d-block"
                 :to="{ name: 'program', params: { id: program.id } }"
              >
                {{
                  ` ${program.name_local} (${
                    program.bylaw ? `${program.bylaw.code} ` : "_"
                  })`
                }}
                <small class="text-danger" v-if="i < data.item.programs.length-1">,</small>
              </b-link>
            </div>
          </div> -->
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
              <b-link :to="{ name: 'offering', params: { id: data.item.id } }">
                <feather-icon v-b-tooltip.hover="$t('Global.show')" icon="EyeIcon" class="text-primary"/>

              </b-link>
              <b-link>
                <feather-icon
                    v-if="hasPermission('export_offering')"
                    v-b-tooltip.hover="$t('Global.tr_sheet')"
                    icon="FileIcon"
                    class="text-primary"
                    @click="exportPDF(data.item.id)"
                />
              </b-link>

              <b-link>
                <feather-icon
                    v-b-tooltip.hover="$t('Global.qr_code')"
                    icon="AlignJustifyIcon"
                    class="text-primary"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="!listed_only">
        <b-button
            v-if="hasPermission('bulk_update_offering_control')"
            :disabled="selectedItems.length === 0"
            v-b-tooltip.hover="$t('Global.change_status')"
            class="btn-icon mr-1"
            variant="primary"
            @click="updateStatusToggle"
        >
          <b-badge variant="light-success" class="m-0 p-0">{{ selectedItems.length }}</b-badge>
          {{ $t('Global.change_status') }}
        </b-button>
        <!-- <b-button
            v-b-tooltip.hover="$t('Global.publish')"
            class="btn-icon"
            variant="primary"
        > -->
        <!--       {{$t('Global.publish')}}
-->
        <!-- <feather-icon icon="AwardIcon"/>
      </b-button> -->
      </template>
    </DataTable>

    <b-modal
        id="modal"
        v-model="updateStatusModal"
        no-close-on-backdrop
        :title="$t('Global.update_offerings_status')"
    >
      <validation-observer ref="simpleForm">
        <b-form ref="simpleForm" @keydown.enter="submitStatus">
          <div class="row">
            <b-col md="12">
              <b-form-group>
                <validation-provider
                    #default="{ errors }"
                    name="mark"
                    rules="integer|positive"
                >
                  <v-select
                      v-model="statusId"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="customLookups.bulk_offering_status_control"
                      :label="getSelectLabel()"
                      class="w-100 mb-2"
                      :reduce="(val) => val.id.toString()"
                      :placeholder="$t('Global.control_status')"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                        <strong v-else>{{ name }} </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
          <b-col md="12">
            <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitStatus"
            >
              {{ $t('Global.save') }}
            </b-button>

            <b-button
                type="reset"
                variant="outline-secondary"
                @click="updateStatusModal = false"
            >
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
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
  BPopover, BFormCheckbox, BFormGroup, BForm,
} from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'
import Statistics from '@/views/components/info/statistics'
import { ValidationProvider } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors.vue'

export default {
  name: 'Offerings',
  components: {
    ValidationErrors,
    ValidationProvider,
    BForm,
    BFormGroup,
    BFormCheckbox,
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
    Statistics,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: {
      type: Boolean,
      default: false
    },
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    return {
      filter: {
        control_term_id: this.currentControlTerm || null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
      },
      paramsLoaded: true,
      selectedItems: [],
      updateStatusModal: false,
      statusId: null,
      customLookups: {
        offering_status_control: [
          {
            id: 0,
            name: 'Draft',
            name_local: 'مسودة'
          },
          {
            id: 1,
            name: 'Submitted',
            name_local: 'تحت المراجعة'
          },
          {
            id: 2,
            name: 'Accepted',
            name_local: 'تمت المراجعة'
          },
          {
            id: 3,
            name: 'Approved',
            name_local: 'تم القبول'
          },
          {
            id: 4,
            name: 'Published',
            name_local: 'تم القبول'
          },
          {
            id: 11,
            name: 'Frozen',
            name_local: 'موقوف'
          },
          // Add other statuses here
        ],
        bulk_offering_status_control: [
          {
            id: 0,
            name: 'Draft',
            name_local: 'مسودة'
          },
          {
            id: 1,
            name: 'Submitted',
            name_local: 'تحت المراجعة'
          },
          {
            id: 2,
            name: 'Accepted',
            name_local: 'تمت المراجعة'
          },
          {
            id: 3,
            name: 'Approved',
            name_local: 'تم القبول'
          },
          {
            id: 11,
            name: 'Frozen',
            name_local: 'موقوف'
          },
        ]

      }
    }
  },
  // beforeMount() {
  //   this.filter = {control_term_id:this.currentControlTerm||null, faculty_id:null, bylaw_id:null, program_id: null, status: null}
  // },
  computed: {
    ...mapGetters({
      items: 'courseOfferings/items',
      total: 'courseOfferings/total',
      load: 'courseOfferings/load',
      lookups: 'courseOfferings/lookups',
      statistics: 'courseOfferings/statistics',
      currentControlTerm: 'app/currentControlTerm',
      needDrop: 'app/needDrop',
      filteredOptions() {
        return this.customLookups.offering_status_control.filter(option => option.id !== 4)
      }
    }),
    getEmptyListLabel() {
      return this.$i18n.locale === 'en'
          ? 'Sorry, No Matching Options.'
          : 'لاتوجد نتائج مطابقة للبحث.'
    },
    fieldsData() {
      let fields = [
        {
          key: 'checkbox',
          label: '',
          sortable: false,
        },
        {
          key: 'id',
          label: this.$t('Global.id'),
          sortable: true,
        },
        {
          key: 'course',
          label: this.$t('Global.course'),
          thStyle: { width: '35%' },
          sortable: false,
        },
        {
          key: 'instructors_count',
          label: this.$t('Global.instructors'),
          thStyle: { width: '30%' },
          sortable: false,
        },

        /*  {
           key: 'instructors',
           label: this.$t('Global.instructors'),
           thStyle: { width: '30%' },
           sortable: true,
         }, */
        {
          key: 'term',
          label: this.$t('Global.term'),
          thStyle: { width: '1%' },
          sortable: true,
        },
        {
          key: 'registrations_count',
          label: this.$t('Global.students_count'),
          thStyle: { width: '1%' },
          sortable: false,
        },
        {
          key: 'status',
          label: this.$t('Global.control_status'),
          thStyle: { width: '1%' },
          sortable: false,
        },
        {
          key: 'exams',
          label: this.$t('Global.exam'),
          thStyle: { width: '40%' },
          sortable: false,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
      return fields
    },
    language: function () {
      localStorage.setItem('mylang', this.$i18n.locale)
      return this.$i18n.locale
    },
    header: function () {
      localStorage.setItem('headers', false)
      return false
    },
  },
  watch: {
    'filter.control_term_id'(value) {
      if (!value) {
        this.refresh()
      }
    },
    'filter.bylaw_id': function (newValue) {
      if (this.filter.program_id) {
        this.filter.program_id = null
      }
    },
    'filter.faculty_id': function (newValue) {
      if (this.filter.bylaw_id) {
        this.filter.bylaw_id = null
      }
    },
    language: function (val) {
      this.language = val
    },
    header: function (val) {
      this.header = val
    },
  },
  methods: {
    ...mapActions({
      exportStudentGradesPDF: 'courseOfferings/exportPDF', // pdf
    }),
    reset() {
      let terms = [
        'term_id',
        'admission_term_id',
        'admission_term_PG_id',
        'admission_term_UG_id',
        'control_term_id',
        'exam_term_id',
        'transfer_term_id',
      ]
      let query = { ...this.$route.query, ...{} }
      let currentTerm = terms.find((el) => {
        return Object.keys(query)
            .some((qu) => {
              return el == qu
            })
      })
      Object.keys(query)
          .forEach((key) => {
            if (key != currentTerm && key != 'removed' && key != 'export') {
              this.filter[key] = null
            }
          })
      this.resetFilterQueryParams(terms)
    },
    coordinator(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Course Coordinator'
        )
      }
    },
    externalCommittee(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Examination Committee')
      }
    },
    teacher(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Teacher')
      }
    },
    TeachingAssistantEdit(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Teaching Assistant (Editor)'
        )
      }
    },
    TeachingAssistantView(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Teaching Assistant (Viewer)'
        )
      }
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = {
          ...query,
          bylaw_id: this.bylaw_id
        }
      }
      if (this.course_id) {
        query = {
          ...query,
          course_id: this.course_id
        }
      }
      if (this.term_id) {
        query = {
          ...query,
          term_id: this.term_id
        }
      }
      if (this.program_id) {
        query = {
          ...query,
          program_id: this.program
        }
      }
      if (this.status) {
        query = {
          ...query,
          status: this.status
        }
      }

      if (this.$route.query && this.$route.query.term_id) {
        query = {
          ...query,
          term_id: this.$route.query.term_id
        }
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = {
          ...query,
          faculty_id: this.$route.query.faculty_id
        }
      }
      if (this.$route.query && this.$route.query.bylaw_id) {
        query = {
          ...query,
          bylaw_id: this.$route.query.bylaw_id
        }
      }
      if (this.$route.query && this.$route.query.program_id) {
        query = {
          ...query,
          program_id: this.$route.query.program_id
        }
      }
      this.$store.dispatch('courseOfferings/offerings', { query })
    },

    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local'
    },

    getColor(status) {
      if (status == 'Draft') {
        return 'light-warning'
      } else if (status == 'Submitted') {
        return 'light-success'
      } else if (status == 'Accepted') {
        return 'light-info'
      } else if (status == 'Approved') {
        return 'light-dark'
      } else if (status == 'Published') {
        return 'light-primary'
      }
    },
    exportPDF(id) {
      this.exportStudentGradesPDF({
        lang: this.$i18n.locale == 'en' ? 1 : 2,
        id: id,
      })
      // let url=`${process.env.VUE_APP_BASE_URL}/control/offerings/students-grades-pdf/${id}/${this.language=='en'?1:2}`
      // window.open(url, '_blank');
    },
    updateStatusToggle() {
      this.updateStatusModal = !this.updateStatusModal
    },
    submitStatus() {
      let payload = {
        status_id: this.statusId,
        offerings_ids: this.selectedItems
      }

      this.$store.dispatch('offerings/updateStatusBulk', payload)
          .then((_) => {
            this.statusId = null
            this.selectedItems = []
            this.updateStatusModal = false
            this.refresh()
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.offerings_status_updated_successfully'),
            })
          })
          .catch((error) => {
            this.$swal({
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.invalid_inputs'),
            })
          })
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
