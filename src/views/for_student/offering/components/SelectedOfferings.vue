<template>
  <div class="col-12">
    <b-overlay
        v-if="loading != -1"
        :show="loading"
        rounded="sm"
    >
      <div v-if="!loading">
        <b-col cols="12">
          <b-card
              class="mb-0 pt-1"
          >
            <template #header>
              <div>
                <h2 class="mb-0 d-inline">
                  {{ $t('courses')+' - '+ ($i18n.locale == 'en' ? student.student_term.name:student.student_term.name_local) }}
                </h2>
                <b-badge variant="warning" v-if="student.student_term.id != student.student_term.current_term_id">
                  {{$t('Not Current Term')}}
                </b-badge>
              </div>
            </template>
            <div class="custom_actions">
              <b-dropdown
                  v-if="hasPermission('access_control') || hasPermission('changeTerm_registration')"
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  :text="$t('Global.more')"
                  right
                  size="sm"
                  variant="outline-primary"
              >
                <b-dropdown-item
                    :to="{
                  name: 'students_view',
                  params: {
                    student_id: studentId,
                    term_id: termId
                  },
                }"
                >
                  {{ $t('control') }}
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item
                    v-if="hasPermission('changeTerm_registration')"
                    v-b-modal.modal-change-term
                >
                  {{ $t('Change Registration Term') }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <b-row>
              <b-col
                  class="p-1"
                  cols="8"
              >
                <b-link
                    :to="{name:'student-show',id:student.id}"
                >
                  {{ student.student_code }} :

                  {{ ($i18n.locale == 'en' ? student.student_name.name : student.student_name.name_local) }}
                </b-link>
              </b-col>
              <b-col>
                <b>{{ $t('Hours') }}: </b>
                <b-badge
                    variant="primary"
                    cols="2"
                    style="padding: 10px"
                >
                  {{ student.courses_hours }} / {{ student.max_courses_hours }}
                </b-badge>
              </b-col>
              <b-col>
                <b>{{ $t('courses') }}: </b>
                <b-badge
                    variant="primary"
                    style="padding: 10px"
                    cols="2"
                >
                  {{ student.count_courses }}
                </b-badge>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                {{ getTranslatedNameFromObject(student.student_faculty) }},
                <b>{{ $t('bylaw') }}: </b>{{ getTranslatedNameFromObject(student.student_bylaw) }},
                <b>{{ $t('program') }}: </b>{{ getTranslatedNameFromObject(student.student_program) }},
                <b>{{ $t('Level') }}: </b> {{ student.student_level_number }},
                <b>{{ $t('Passed Hours') }}: </b> {{ student.student_passed_hours }}
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col
            v-if="student.advisor"
            cols="12"
            class="mt-1"
        >
          <b-card
              class="mb-0"
          >
            <b-row>
              <b-col
                  cols="8"
              >
                <b>{{ $t('Advisor') }} : </b>
                <b-link
                    v-if="hasPermission('show_instructor')"
                    class="font-weight-bold d-inline-block"
                    :to="{ name: 'staff-show', params: { id: student.advisor.id } }"
                >
                  <span> {{ getTranslatedNameFromObject(student.advisor) }}</span>
                  <i v-if="student.advisor.email"> , {{ student.advisor.email }}</i>
                </b-link>
                <div v-else>
                  <span> {{ getTranslatedNameFromObject(student.advisor) }}</span>
                  <i v-if="student.advisor.email"> , {{ student.advisor.email }}</i>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col
            cols="12"
            class="mt-1"
        >
          <b-card
              class="mb-0"
          >
            <b-card-header
                style="padding: 0.3rem; margin-top: -8px"
            >
              <b-col
                  cols="12"
                  md="6"
                  style="padding: 0px 0px 5px 0px;"
              >
                <h3 class="m-0">
                  {{ $t('Selected Courses') }}
                </h3>
              </b-col>
              <b-col
                  cols="4"
                  style="text-align:end;padding-left: 0px;padding-right: 0px;"
              >
                <b-button
                    v-if="hasPermission('accept_registration')"
                    variant="outline-success"
                    class="btn-icon"
                    @click="acceptAllRequests($event)"
                    :disabled="!requestsCount"
                >
                  {{ $t('accept_all') }}
                  <b-badge pill variant="success" v-if="requestsCount">{{ requestsCount }}</b-badge>
                </b-button>
                <b-button
                    v-if="hasPermission('print_student_registration')"
                    v-b-tooltip.hover="$t('Print')"
                    variant="primary"
                    class="btn-icon ml-1"
                    @click="printData"
                    :disabled = "printLoading"
                >
                  <b-spinner v-if="printLoading" class="mr-1" small></b-spinner>
                  <feather-icon icon="PrinterIcon" />
                </b-button>
              </b-col>
            </b-card-header>
            <b-row>
              <b-table
                  class="position-relative font-small-2"
                  style="overflow-x: unset !important;"
                  :items="items"
                  responsive
                  :fields="fields"
                  primary-key="id"
                  show-empty
                  :empty-text="$t('no offerings selected')"
              >
                <template #cell(code)="data">
                  <b-link
                      :to="{ name: 'offering', params: { id: data.item.id } }"
                  >
                    {{ data.item.course_code }}
                  </b-link>
                </template>
                <template #cell(course)="data">
                  <b>{{ $i18n.locale == 'en' ? data.item.course_en_name : data.item.course_ar_name }}</b>
                  <div v-if="data.item.corequisite_courses">
                    <b-badge variant="light-dark">
                      {{ $t('Co-Requisite Course') }}:
                      <b-badge
                          v-for="offering in data.item.corequisite_courses"
                          :key="offering.offering_id"
                          variant="secondary"
                          style="margin: 0 2px;font-size: 1.1em"
                      >
                        {{ offering.code }}
                      </b-badge>
                    </b-badge>
                  </div>
                </template>
                <template #cell(credit_hours)="data">
                  {{ data.item.credit_hours }}
                </template>
                <template #cell(max)="data">
                  {{ data.item.total }}
                </template>
                <template #cell(status)="data">
                  <b-badge
                      v-for="status in data.item.allStatus"
                      :key="status.id"
                      :variant="getRegistrationStatusBadgeColor(status.id)"
                      pill
                      style="margin: 2px"
                  >
                    {{ getTranslatedNameFromObject(status) }}
                    <span v-if="status.data">
                    ({{ status.data }})
                  </span>
                  </b-badge>
                </template>
                <template #cell(section)="data">
                  {{ $t('group') }} {{
                    getTranslatedNameFromObject({
                      name: data.item.group_name,
                      name_local: data.item.group_name_local
                    })
                  }} - {{ $t('section') }} {{
                    getTranslatedNameFromObject({
                      name: data.item.section_name,
                      name_local: data.item.section_name_local
                    })
                  }}
                </template>
                <template #cell(actions)="data">
                  <!--                <b-overlay :show="true" rounded="sm">-->
                  <b-button-group
                      size="sm"
                      style="height: 35px;"
                      :disabled="true"
                  >
                    <b-button
                        v-if="!getRequestsStatusIds.includes(data.item.status) && hasPermission('removeRegistered_registration')"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-danger"
                        @click="removeRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('remove') }}
                    </b-button>
                    <b-button
                        v-if="(data.item.status == 2 && hasPermission('withdraw_admin_registration')) || (data.item.status == 2 && currentTermStage && currentTermStage.stage_code_id == 2 && hasPermission('withdraw_registration'))"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-warning"
                        @click="withdrawRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('withdraw') }}
                    </b-button>
                    <b-button
                        v-if="data.item.status == 2 && currentTermStage && currentTermStage.stage_code_id == 3 && hasPermission('adddrop_registration')"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-warning"
                        @click="addDropRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('Drop') }}
                    </b-button>
                    <b-button
                        v-if="data.item.status == 2 && currentTermStage && currentTermStage.stage_code_id == 4 && hasPermission('drop_registration')"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-warning"
                        @click="addDropRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('Drop') }}
                    </b-button>
                    <!--         for advisor actions             -->
                    <b-button
                        v-if="[1,3,4,9].includes(data.item.status) && hasPermission('accept_registration')"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-success"
                        @click="acceptRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('Accept') }}
                    </b-button>
                    <b-button
                        v-if="[1,3,4,9].includes(data.item.status) && hasPermission('reject_registration')"
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-warning"
                        @click="rejectRequestedOfferingBTN(data.item.id,$event)"
                        :disabled="actionButtonLoading"
                    >
                      {{ $t('Reject') }}
                    </b-button>
                    <b-dropdown
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        right
                        variant="outline-primary"
                        v-if="
                    (
                    hasPermission('undoStatusRegistered_registration')
                    || hasPermission('updateStatusAU_registration')
                    || hasPermission('updateStatusDS_registration')
                    || hasPermission('updateStatusDN_registration')
                    || hasPermission('updateStatusIC_registration')
                    || hasPermission('changeSection_registration')
                    )
                    &&
                    (
                      ![1,3,4].includes(data.item.status)
                    )
                    "
                        :disabled="actionButtonLoading"
                        class="more-status-button"
                    >
                      <template #button-content>
                        {{ $t('Global.more') }}
                      </template>
                      <b-dropdown-item
                          v-if="hasPermission('updateStatusDN_registration')"
                          :disabled="[13].includes(data.item.status) && data.item.banned_reason==1"
                          @click="updateStatusOfferingBtn('dn',data.item.id,$event)"
                      >
                        {{ $t('registration_banned_absence') }}
                      </b-dropdown-item>
                      <b-dropdown-item
                          v-if="hasPermission('updateStatusDS_registration')"
                          :disabled="[13].includes(data.item.status) && data.item.banned_reason==2"
                          @click="updateStatusOfferingBtn('ds',data.item.id,$event)"
                      >
                        {{ $t('registration_banned_misconduct') }}
                      </b-dropdown-item>
                      <b-dropdown-item
                          v-if="hasPermission('updateStatusAU_registration')"
                          :disabled="[12].includes(data.item.status)"
                          @click="updateStatusOfferingBtn('au',data.item.id,$event)"
                      >
                        {{ $t('registration_au') }}
                      </b-dropdown-item>
                      <b-dropdown-item
                          v-if="hasPermission('updateStatusIC_registration')"
                          :disabled="[8].includes(data.item.status)"
                          @click="updateStatusOfferingBtn('ic',data.item.id,$event)"
                      >
                        {{ $t('registration_ic') }}
                      </b-dropdown-item>
                      <b-dropdown-divider />
                      <b-dropdown-item
                          v-if="hasPermission('undoStatusRegistered_registration')"
                          :disabled="[1,3,4,2].includes(data.item.status)"
                          @click="undoToRegisteredOfferingBTN(data.item.id,$event)"
                      >
                        {{ $t('undo_to_registered') }}
                      </b-dropdown-item>
                      <b-dropdown-divider />
                      <b-dropdown-item
                          v-if="hasPermission('changeSection_registration')"
                          v-b-modal.modal-select-section
                          @click="getOfferingSections({id:data.item.id, name:data.item.name, name_local:data.item.name_local, code:data.item.code})"
                      >
                        {{ $t('Change Section') }}
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-button-group>
                  <!--                </b-overlay>-->
                </template>
              </b-table>
            </b-row>
          </b-card>
        </b-col>
      </div>
    </b-overlay>
    <div class="all-modals">
      <!-- modal -->
      <b-modal
          id="modal-select-section"
          ref="my-modal"
          size="lg"
          :title="$t('Please Select Offering Section')"
          @show="resetModal"
          @hidden="resetModal"
          no-close-on-backdrop
          hide-footer
      >
        <div>
          <b-form-group
              :label="$t('select section for')+': ('+getTranslatedNameFromObject(selectedOffering)+')'"
              label-for="mc-sections"
          >
            <v-select
                id="mc-sections"
                v-model="selectedSection"
                :options="offeringSectionsOptions"
                class="w-100"
                :reduce="val => val"
                required
                :selectable="val => checkSelected(val)"
            >
              <template
                  slot="option"
                  slot-scope="option"
              >
                <div>
                  <span v-if="option.group && option.section == null">
                    {{ $t('group') }}({{ getTranslatedName({name:option.group.name,name_local:option.group.name_local}) }}) -
                  </span>
                  <span v-if="option.section && option.section.group">
                    {{ $t('group') }}({{ getTranslatedName({name:option.section.group.name,name_local:option.section.group.name_local}) }}) -
                  </span>
                  <span v-if="option.section">
                    {{ $t('section') }}({{ getTranslatedName({name:option.section.name,name_local:option.section.name_local}) }})
                  </span>
                  <b-badge pill v-if="option.section">
                    {{option.section_count}}/{{option.section_quota}}
                  </b-badge>
                  <b-badge pill v-if="option.group">
                    {{option.group_count}}/{{option.group_quota}}
                  </b-badge>
                  <b-badge pill v-if="option.group && !option.section">
                    {{option.group_count}}/{{option.group_quota}}
                  </b-badge>
                  <span v-if="option.flag" class="text-danger">
                    {{$i18n.locale == 'en' ? '( Schedule Conflict )':'( تعارض الجدول )'}}
                  </span>
                  <div class="schedules_slots" v-if="option.group && option.group.offering_schedules && (option.offering.programs.length == 0 || option.offering.programs[0].via_schedule == 1)">
                    <!-- Lec slots -->
                    <span>
                    <span
                        v-for="group_schedule in option.group.offering_schedules"
                        :key="group_schedule.id"
                    >
                      - {{ group_schedule.type_in_letters }}:
                      {{ group_schedule.day }}:
                      {{ group_schedule.slot_from.regular_time_start }} to
                      {{ group_schedule.slot_to.regular_time_end }}
                      <br />
                    </span>
                  </span>
                    <!-- lab and tut slots -->
                    <span v-if="option.offering_schedules">
                    <span
                        v-for="section_schedule in option.offering_schedules"
                        :key="section_schedule.id"
                    >
                      - {{ section_schedule.type_in_letters }}:
                      {{ section_schedule.day }}:
                      {{ section_schedule.slot_from.regular_time_start }} to
                      {{ section_schedule.slot_to.regular_time_end }}
                      <br />
                    </span>
                  </span>
                  </div>
                </div>
              </template>
              <template
                  slot="selected-option"
                  slot-scope="option"
              >
                <div>
                  <span v-if="option.group && option.section == null">
                    {{ $t('group') }}({{ getTranslatedName({name:option.group.name,name_local:option.group.name_local}) }}) -
                  </span>
                  <span v-if="option.section && option.section.group">
                    {{ $t('group') }}({{ getTranslatedName({name:option.section.group.name,name_local:option.section.group.name_local}) }}) -
                  </span>
                  <span v-if="option.section">
                    {{ $t('section') }}({{ getTranslatedName({name:option.section.name,name_local:option.section.name_local}) }})
                  </span>
                  <b-badge pill v-if="option.section">
                    {{option.section_count}}/{{option.section_quota}}
                  </b-badge>
                  <b-badge pill v-if="option.group">
                    {{option.group_count}}/{{option.group_quota}}
                  </b-badge>
                  <b-badge pill v-if="option.group && !option.section">
                    {{option.group_count}}/{{option.group_quota}}
                  </b-badge>
                  <span v-if="option.flag" class="text-danger">
                    {{$i18n.locale == 'en' ? '( Schedule Conflict )':'( تعارض الجدول )'}}
                  </span>
                  <div class="schedules_slots" v-if="option.group && option.group.offering_schedules && (option.offering.programs.length == 0 || option.offering.programs[0].via_schedule == 1)">
                    <!-- Lec slots -->
                    <span>
                    <span
                        v-for="group_schedule in option.group.offering_schedules"
                        :key="group_schedule.id"
                    >
                      - {{ group_schedule.type_in_letters }}:
                      {{ group_schedule.day }}:
                      {{ group_schedule.slot_from.regular_time_start }} to
                      {{ group_schedule.slot_to.regular_time_end }}
                      <br />
                    </span>
                  </span>
                    <!-- lab and tut slots -->
                    <span v-if="option.offering_schedules">
                    <span
                        v-for="section_schedule in option.offering_schedules"
                        :key="section_schedule.id"
                    >
                      - {{ section_schedule.type_in_letters }}:
                      {{ section_schedule.day }}:
                      {{ section_schedule.slot_from.regular_time_start }} to
                      {{ section_schedule.slot_to.regular_time_end }}
                      <br />
                    </span>
                  </span>
                  </div>
                </div>
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>
            <br/>
          </b-form-group>
        </div>
        <b-row>
          <!-- submit and cancel -->
          <b-col md="12" style="text-align:end">
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                class="mr-1"
                @click="$refs['my-modal'].toggle('#toggle-btn')"
            >
              {{ $t('Global.cancel') }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                :disabled="changeSectionLoading"
                @click="changeSectionBtn()"
            >
              <b-spinner small v-if="changeSectionLoading"></b-spinner>
              {{$t('Change')}}
            </b-button>
          </b-col>
        </b-row>
      </b-modal>
      <b-modal
          id="modal-change-term"
          ref="change-term-modal"
          size="lg"
          :title="$t('Change Student Registration Term')"
          hide-footer
          @show="loadStudentTerms()"
          no-close-on-backdrop
      >
        <div>
          <b-form-group
              :label="$t('Please Select Registration Term')"
              label-for="mc-sections"
          >
            <v-select
                id="mc-terms"
                v-model="studentSelectedTerm"
                :options="studentTermOptions"
                class="w-100"
                :filter="fuseSearch"
                :reduce="val => val.id"
                required
            >
              <template
                  slot="option"
                  slot-scope="option"
              >
                <div>
                  {{ getTranslatedName(option) }}
                  <b-badge variant="info" v-if="student.student_term.current_term_id == option.id">
                    {{$t('Student Current Term')}}
                  </b-badge>
                </div>
              </template>
              <template
                  slot="selected-option"
                  slot-scope="option"
              >
                <div>
                  {{ getTranslatedName(option) }}
                  <b-badge variant="info" v-if="student.student_term.current_term_id == option.id">
                    {{$t('Student Current Term')}}
                  </b-badge>
                </div>
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>
            <br/>
          </b-form-group>
        </div>
        <b-row>
          <!-- submit and cancel -->
          <b-col md="12" style="text-align:end">
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                class="mr-1"
                @click="$refs['change-term-modal'].toggle('#toggle-btn')"
            >
              {{ $t('Global.cancel') }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                @click="changeRegistrationTerm()"
            >
              {{$t('Change')}}
            </b-button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
  </div>
</template>

<script>
import {
  BBadge,
  BButton,
  BButtonGroup,
  BCard,
  BCardHeader,
  BCol,
  BLink,
  BOverlay,
  BRow,
  BTable,
  VBModal,
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
  BSpinner,
  BThead,
  BTh,
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from "vue-select";
import { RegistrationRequestStatus } from "@/mixins/enums";

export default {
  name: 'SelectedOfferings',
  components: {
    BCard,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BButton,
    BTable,
    BLink,
    BBadge,
    BButtonGroup,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
    BSpinner,
    BThead,
    BTh,
    vSelect,
  },
  directives: {
    Ripple,
    'b-modal': VBModal,
  },
  data() {
    return {
      items: [],
      loading: true,
      student: {},
      studentId: null,
      studyingStudentStatus: true,
      currentTermStage: {
        stage_code_id: null,
      },
      actionButtonLoading: false,
      moreActionsPermissions: null,
      printLoading: false,

      selectorLoading: true,
      selectedSection: null,
      selectedOffering: { id: null },
      offeringSectionsOptions: [],
      changeSectionLoading: false,

      studentTermOptions: [],
      studentSelectedTerm: null,
      updatedTermId: null,
    }
  },
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    termId() {
      if (this.student.student_term) {
        return this.student.student_term.id
      }
    },
    ...mapGetters({}),
    fields() {
      return [
        {
          key: 'code',
          label: this.$t('code'),
          sortable: false,
        },
        {
          key: 'course',
          label: this.$t('course'),
          sortable: false,
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: false,
        },
        {
          key: 'credit_hours',
          label: this.$t('credit_hours'),
          sortable: false,
        },
        {
          key: 'Max',
          label: this.$t('max'),
          sortable: false,
        },
        {
          key: 'section',
          label: this.$t('section'),
          sortable: false,
        },
        {
          key: 'actions',
          label: this.$t('actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    requestsCount() {
      return this.items.filter((v) => ([1, 3, 4].includes(v.status))).length
      //return this.items.length
    },
    getRequestsStatusIds() {
      return [
        RegistrationRequestStatus.STATUS_REGISTER_REQUEST,
        RegistrationRequestStatus.STATUS_ADD_REQUEST,
        RegistrationRequestStatus.STATUS_WITHDRAW_REQUEST,
        RegistrationRequestStatus.STATUS_DROP_REQUEST,
      ]
    }
  },
  mounted() {
    this.studentId = this.id
    this.init()
  },
  methods: {
    ...mapActions({
      getSelectedCoursesDetails: 'offeringsRegistrations/getSelectedCourseDetails',
      removeRequestedOffering: 'offeringsRegistrations/removeRequestedOffering',
      acceptRequestedOffering: 'offeringsRegistrations/acceptRequestedOffering',
      acceptAllRequestedOfferings: 'offeringsRegistrations/acceptAllRequestedOfferings',
      rejectRequestedOffering: 'offeringsRegistrations/rejectRequestedOffering',
      withdrawRequestedOffering: 'offeringsRegistrations/withdrawRequestedOffering',
      addDropRequestedOffering: 'offeringsRegistrations/addDropRequestedOffering',
      updateStatusOffering: 'offeringsRegistrations/updateStatusOffering',
      undoToRegisteredOffering: 'offeringsRegistrations/undoToRegisteredOffering',
      printExcel: 'offeringsRegistrations/printRegistrationData',
      getCurrenStudentTermStage: 'offeringsRegistrations/getCurrentTermStage',

      changeOfferingSection: 'offeringsRegistrations/changeOfferingSection',
      offeringSections: 'offeringsRegistrations/offeringSections',

      getStudentTerms: 'offeringsRegistrations/getStudentTerms',
    }),
    init() {
      this.loading = true
      this.getSelectedCoursesDetails({ id: this.studentId }).then(data => {
        this.student = data.details
        this.items = data.requested_courses

        // to load breadcrump student code
        if (this.id) {
          this.$store.commit('app/UPDATE_PAGE_DETAILS', { ...this.student.student_name }, { root: true })
        }

        this.loading = false
      }).catch(error => {
        if (error.code == 1006) {
          this.studyingStudentStatus = false
          // for update studying status
          this.$emit('checkStudentStudyingStatus', this.studyingStudentStatus)
          this.errorPopupWithBack(error.title)
        } else {
          this.loading = -1
          this.errorToast(error.title)
        }
      }).finally(() => {

      })
      // get current term stage for this student
      this.getCurrenStudentTermStage({ id: this.studentId }).then(data => {
        this.currentTermStage = data
      }).catch(error => {
        this.errorToast(error.title)
      })
    },
    updateTables(internalRefresh = true, buttonReset = true, withLoading = false) {
      if (withLoading) this.loading = true

      const payload = { id: this.studentId }
      if (this.updatedTermId) payload.changed_term_id = this.updatedTermId

      this.getSelectedCoursesDetails(payload).then(data => {
        this.student = data.details
        this.items = data.requested_courses
      }).finally(() => {
        if (buttonReset) this.loadingButtonReset()
        this.loading = false
      })
      // if external refresh
      if (internalRefresh) {
        this.$emit('refreshSelector', this.updatedTermId)
      }
    },
    loadingButtonActive(event = null) {
      //this.actionButtonLoading = true

      if (event && event.target){
        if (event.target.classList.contains('disabled')) return false
        event.target.classList.add("button-loading")
        event.target.classList.add("disabled")
      } else if (event){
        if (event.classList.contains('disabled')) return false
        event.classList.add("button-loading")
        event.classList.add("disabled")
      }
      return true;
    },
    loadingButtonReset(event = null) {
      //this.actionButtonLoading = false
      if (event && event.target){
        event.target.classList.remove("button-loading")
        event.target.classList.remove("disabled")
      } else if (event){
        event.classList.remove("button-loading")
        event.classList.remove("disabled")
      }
    },
    getOfferingStatus(status,banned_reason) {
      let statusMessage = {
        label: null,
        class: null,
      }
      switch (status) {
        case 1:
          statusMessage = {
            label: this.$t('Requested'),
            class: 'warning',
          }
          break
        case 22:
          statusMessage = {
            label: this.$t('Registered'),
            class: 'success',
          }
          break
          // withdraw request
        case 3:
          statusMessage = {
            label: this.$t('Withdraw Request'),
            class: 'warning',
          }
          break
        case 4:
          statusMessage = {
            label: this.$t('Drop Request'),
            class: 'warning',
          }
          break
        case 5:
          statusMessage = {
            label: this.$t('Withdrawn'),
            class: 'danger',
          }
          break
        case 6:
          statusMessage = {
            label: this.$t('Dropped'),
            class: 'danger',
          }
          break
        case 7:
          statusMessage = {
            label: this.$t('Excused'),
            class: 'danger',
          }
          break
        case 8:
          statusMessage = {
            label: this.$t('registration_ic'),
            class: 'danger',
          }
          break
        case 9:
          statusMessage = {
            label: this.$t('Add Request'),
            class: 'warning',
          }
          break
        case 10:
          statusMessage = {
            label: this.$t('registration_dn'),
            class: 'danger',
          }
          break
        case 11:
          statusMessage = {
            label: this.$t('registration_ds'),
            class: 'danger',
          }
          break
        case 12:
          statusMessage = {
            label: this.$t('registration_au'),
            class: 'danger',
          }
          break
        case 13:
          statusMessage = {
            label: banned_reason == 1 ?  this.$t('registration_banned_absence') : this.$t('registration_banned_misconduct') ,
            class: 'danger',
          }
          break
        case 2:
          statusMessage = {
            label: this.$t('registration_fw'),
            class: 'danger',
          }
          break
        default:
          statusMessage = {
            label: status,
            class: 'dark',
          }
          break
      }
      return statusMessage
    },
    removeRequestedOfferingBTN(offeringId, event) {
      if (!this.loadingButtonActive(event)) return
      this.removeRequestedOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    acceptRequestedOfferingBTN(offeringId, event) {
      if (!this.loadingButtonActive(event)) return
      this.acceptRequestedOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    rejectRequestedOfferingBTN(offeringId, event) {
      if (!this.loadingButtonActive(event)) return
      this.rejectRequestedOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    withdrawRequestedOfferingBTN(offeringId, event) {
      if (!this.loadingButtonActive(event)) return
      this.withdrawRequestedOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    addDropRequestedOfferingBTN(offeringId, event) {
      if (!this.loadingButtonActive(event)) return
      this.addDropRequestedOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    undoToRegisteredOfferingBTN(offeringId, evt) {
      const event = evt.target.parentElement.parentElement.parentElement;
      if (!this.loadingButtonActive(event)) return
      this.undoToRegisteredOffering({ offering_id: offeringId, student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    updateStatusOfferingBtn(status, offeringId, evt) {
      const event = evt.target.parentElement.parentElement.parentElement;
      if (!this.loadingButtonActive(event)) return
      const payload = {
        status,
        payload: {
          offering_id: offeringId,
          student_id: this.studentId,
        },
      }
      this.updateStatusOffering(payload).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    acceptAllRequests(event) {
      if (!this.loadingButtonActive(event)) return
      this.acceptAllRequestedOfferings({ student_id: this.studentId }).then(data => {
        if (data.status === 'success') {
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
          this.loadingButtonReset(event)
        }
      }).catch(error => {
        this.errorToast(error.title)
        this.loadingButtonReset(event)
      }).finally(() => {
      })
    },
    loadStudentTerms() {
      this.getStudentTerms(this.studentId).then(data => {
        this.studentTermOptions = data;
      }).catch(error => {}).finally(() => {})
    },
    checkMoreActionPermission() {
      if (this.moreActionsPermissions === null) {
        this.moreActionsPermissions = this.hasPermission('undoStatusRegistered_registration')
            || this.hasPermission('updateStatusAU_registration')
            || this.hasPermission('updateStatusDS_registration')
            || this.hasPermission('updateStatusDN_registration')
            || this.hasPermission('updateStatusIC_registration');
      }
      return this.moreActionsPermissions;
    },
    printData() {
      this.printLoading = true
      const student = {
        name: this.getTranslatedNameFromObject(this.student.student_name),
        code: this.student.student_code,
        label: this.$t('Student Registrations')
      }
      this.printExcel({ lang: this.$i18n.locale == 'en' ? 1 : 0, student_id: this.studentId, student})
        .then((data) => {})
        .finally(() => {
          this.printLoading = false
        })
    },

    resetModal() {
      this.selectedSection = null
    },
    getOfferingSections(offering) {
      this.selectedOffering = offering
      /* may be used to live section read updated quota */
      this.offeringSections({ offering_id: offering.id, student_id: this.studentId }).then(data => {
        this.offeringSectionsOptions = data.offering_sections
      })
    },
    changeRegistrationTerm() {
      this.updatedTermId = this.studentSelectedTerm
      this.updateTables(true, false, true)
      this.$refs['change-term-modal'].toggle('#toggle-btn')
    },
    changeSectionBtn() {
      this.changeSectionLoading = true
      const query = {
        student_id: this.studentId,
        offering_id: this.selectedOffering.id,
        section_id: this.selectedSection.section ? this.selectedSection.section.id : null,
        group_id: this.selectedSection.group ? this.selectedSection.group.id : null,
      };
      this.changeOfferingSection(query).then(data => {
        if (data.status == 'success') {
          this.$nextTick(() => {
            this.$refs['my-modal'].toggle('#toggle-btn')
          })
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables(false)
        }
      }).catch(error => {
        this.errorToast(error.title)
      }).finally(() => {
        this.changeSectionLoading = false
      })
    },
    checkSelected(item){
      if((!item.flag || this.hasPermission('overrideRules_registration')) && ( (item.section && item.section_quota > item.section_count) || item.group_quota > item.group_count )){
        return true
      }else{
        return false
      }
    }
  },
}
</script>

<style>
.alert .alert-body {
  padding: 5px;
}

.card .card-header {
  padding-top: 5px !important;
}

.customAction {
  text-align: center;
}
</style>
