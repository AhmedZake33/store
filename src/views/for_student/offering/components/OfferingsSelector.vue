<template>
  <div class="col-12">
    <b-overlay
          :show="selectorLoading == true"
          rounded="sm"
          v-if="(selectorLoading != -1 || hasPermission('overrideRules_registration')) && hasPermission('show_registration')"
    >
        <b-col
            cols="12"
            class="mt-1"
            v-if="selectorLoading == false || hasPermission('overrideRules_registration')"
        >
          <DataTable
              :title="$t('Course Selector')"
              :total="totalAvailableCourses"
              :allow-search="true"
              :filter="availableCoursesFilter"
              :loading="availableCoursesLoad"
              @Refresh="refreshAvailableCourses"
              :card-style="'padding:10px'"
          >
            <template
                v-if="lookups"
                #filter
            >
              <b-col cols="6" md="4">
                <v-select
                    v-model="availableCoursesFilter.course_status"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.course_status"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Course Status')"
                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                >
                </v-select>
              </b-col>
              <b-col cols="6" md="4">
                <v-select
                    v-model="availableCoursesFilter.allowed_courses"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.allowed_courses"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Course Allow Status')"
                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                >
                </v-select>
              </b-col>
            </template>
            <template #customTable>
              <b-table
                  class="position-relative font-small-2"
                  :items="selectorItems"
                  responsive
                  :fields="selectorFields"
                  show-empty
                  :empty-text="$t('No Offerings Founded')"
                  :sort-desc.sync="availableCoursesFilter.order_direction"
                  :sort-by.sync="availableCoursesFilter.order_by"
                  :no-local-sorting="true"
              >
                <template #cell(code)="data">
                  <b-link
                      :to="{ name: 'offering', params: { id: data.item.id } }"
                  >
                    {{ data.item.code }}
                  </b-link>
                </template>
                <template #cell(name)="data">
                  {{ $i18n.locale=='en'?data.item.name:data.item.name_local }}
                  <div v-if="data.item.corequisite_courses">
                    <b-badge variant="light-dark">
                      {{$t('Co-Requisite Course')}}:
                      <b-badge variant="secondary" style="margin: 0 2px; font-size: 1.1em" v-for="offering in data.item.corequisite_courses" :key="offering.offering_id">
                        {{offering.code}}
                      </b-badge>
                    </b-badge>
                  </div>
                </template>
                <template #cell(credit_hours)="data">
                  {{ data.item.credit_hours }}
                </template>
                <template #cell(max)="data">
                  {{ data.item.max_total }}
                </template>
                <template #cell(status)="data">
                  <b-badge v-for="status in data.item.allStatus" :key="status"
                           :variant="getRegistrationStatusBadgeColor(status.id)"
                           pill
                           style="margin-left: 2px"
                  >
                    {{ getTranslatedNameFromObject(status) }}
                    <span v-if="status.data">
                      ({{status.data}})
                    </span>
                  </b-badge>
                </template>
                <template #cell(actions)="data">
                  <div style="flex-direction: column;gap: 0em">
                    <!-- button -->
                    <div
                        v-if="data.item.warnings"
                        style="width: 300px;display: block"
                    >
                      <b-alert
                          v-for="warning in data.item.warnings"
                          :key="warning.message"
                          variant="warning"
                          show
                      >
                        <div class="alert-body text-center">
                          <span>{{$t(warning.message,{data: warning.data})}}</span>
                        </div>
                      </b-alert>
                    </div>
                    <div
                        v-if="data.item.prerequisite_courses"
                        style="width: 300px;display: block"
                    >
                      <b-alert
                          variant="danger"
                          show
                      >
                        <div class="alert-body text-center">
                          <span>{{$t('Pre Requisites')}}: {{ data.item.prerequisite_courses }}</span>
                        </div>
                      </b-alert>
                    </div>
                    <div
                        v-else-if="data.item.exposerequisite_courses"
                        style="width: 300px;display: block"
                    >
                      <b-alert
                          variant="danger"
                          show
                      >
                        <div class="alert-body text-center">
                          <span>{{$t('Expose Requisite')}}: {{ data.item.exposerequisite_courses }}</span>
                        </div>
                      </b-alert>
                    </div>
                    <div
                        v-if="hasPermission('add_registration' || 'adddrop_registration' )"
                    >
                      <b-button
                          v-if="(!data.item.prerequisite_courses && !data.item.exposerequisite_courses && !data.item.warnings) || hasPermission('overrideRules_registration' )"
                          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                          v-b-modal.modal-prevent-closing
                          variant="outline-primary"
                          size="sm"
                          @click="getOfferingSections({id:data.item.id, name:data.item.name, name_local:data.item.name_local, code:data.item.code})"
                      >
                        {{ $t('Select') }}
                      </b-button>
                    </div>
                  </div>
                </template>
              </b-table>
            </template>
          </DataTable>
        </b-col>
      </b-overlay>
    <div class="all-modals">
      <!-- modal -->
      <b-modal
          id="modal-prevent-closing"
          ref="my-modal"
          size="lg"
          :title="$t('Please Select Offering Section')"
          @show="resetModal"
          @hidden="resetModal"
          no-close-on-backdrop
          hide-footer
      >
        <div id="first-course">
          <b-form-group
              :label="$t('select section for')+': ('+getTranslatedNameFromObject(selectedOffering_1)+')'"
              label-for="mc-sections"
          >
            <v-select
                id="mc-sections"
                v-model="selectedSection_1"
                :options="offeringSectionsOptions"
                class="w-100"
                :reduce="val => val"
                required
                :selectable="val => checkSelected(val)"
            >
                <!-- :selectable="(option) => option.quota > option.section_count" -->
              <template
                  slot="option"
                  slot-scope="option"
              >
                <div>
                  <span v-if="option.group  && option.section == null">
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
          </b-form-group>
        </div>
        <div id="second-course" v-if="offeringCoRequisiteSectionsArr">
          <hr />
          <b-form-group
              v-for="coRequisiteOffering in offeringCoRequisiteSectionsArr"
              :key="coRequisiteOffering.id"
              :label="$t('select core requisite offering section for')+': ('+getTranslatedNameFromObject(coRequisiteOffering.course)+')'"
          >
            <v-select
                v-model="coRequisiteOfferingsSelectedSection[coRequisiteOffering.id]"
                :options="coRequisiteOffering.sections"
                class="w-100"
                :reduce="val => val.id"
                required
            >
              <template
                  slot="option"
                  slot-scope="option"
              >
                <div>
                  <span v-if="option.group">
                    {{ $t('group') }}({{ getTranslatedName({name:option.group.name,name_local:option.group.name_local}) }})
                </span>
                  <span>
                  - {{ $t('section') }}({{ getTranslatedName({name:option.name,name_local:option.name_local}) }})
                </span>
                  <b-badge pill>
                    {{option.section_count}}/{{option.section_quota}}
                  </b-badge>
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
                  <span v-if="option.group">
                    {{ $t('group') }}({{ getTranslatedName({name:option.group.name,name_local:option.group.name_local}) }})
                </span>
                  <span>
                  - {{ $t('section') }}({{ getTranslatedName({name:option.name,name_local:option.name_local}) }})
                </span>
                  <b-badge pill>
                    {{option.section_count}}/{{option.section_quota}}
                  </b-badge>
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
                :disabled="addButtonLoading"
                @click="addNewOfferingBtn()"
            >
              <b-spinner small v-if="addButtonLoading"></b-spinner>
              {{$t('Add')}}
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
  BCol,
  BLink,
  BModal,
  BOverlay,
  BTable,
  VBModal,
  BFormGroup,
  BAlert,
  BSpinner,
  BRow,
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import DataTable from "@/views/components/table/DataTable";

export default {
  name: 'OfferingsSelector',
  components: {
    DataTable,
    vSelect,
    BCol,
    BOverlay,
    BButton,
    BTable,
    BLink,
    BModal,
    BBadge,
    BFormGroup,
    BAlert,
    BSpinner,
    BRow,
  },
  directives: {
    Ripple,
    'b-modal': VBModal,
  },
  props: {
    studentId: {
      type: String,
      default: null,
    },
    termId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      filter: { removed: 0, course_status: null },
      selectorItems: [],
      selectorLoading: true,
      selectedSection_1: null,
      coRequisiteOfferingsSelectedSection: {},
      selectedOffering_1: { id: null } ,
      offeringSectionsOptions: [],
      offeringCoRequisiteSectionsArr: [],
      currentTermStage: {
        stage_code_id: null,
      },
      totalAvailableCourses: null,
      availableCoursesLoad: null,
      availableCoursesFilter: { removed: 0, course_status: null, allowed_courses: null },
      availableCoursesQuery: null,
      studyingStudentStatus: true,
      addButtonLoading: false,
      lookups: null,
    }
  },
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    ...mapGetters({
      needDrop:'app/needDrop',
    }),
    selectorFields() {
      return [
        {
          key: 'code',
          label: this.$t('code'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('course'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: true,
        },
        {
          key: 'credit_hours',
          label: this.$t('credit_hours'),
          sortable: true,
        },
        {
          key: 'Max',
          label: this.$t('max'),
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
  },
  mounted() {
    this.studentId = this.studentId ? this.studentId : this.id
    this.init()
  },
  methods: {
    ...mapActions({
      getCurrenStudentTermStage: 'offeringsRegistrations/getCurrentTermStage',
      getAvailableCourses: 'offeringsRegistrations/getAvailableCourses',
      requestNewOffering: 'offeringsRegistrations/requestNewOffering',
      offeringSections: 'offeringsRegistrations/offeringSections',
    }),
    init() {
      this.loading = true

      // get current term stage for this student
      this.getCurrenStudentTermStage({ id: this.studentId }).then(data => {
        this.currentTermStage = data
        // (show selector data only if) get available courses if term stage => stage code =1 (registration only) or term stage =3 add_drop
        if (this.currentTermStage && (this.currentTermStage.stage_code_id === 1 || this.currentTermStage.stage_code_id === 3)) {
          this.selectorLoading = false
        } else {
          this.selectorLoading = -1
        }
      }).catch( error => {
        this.errorToast(error.title);
        this.selectorLoading = -1
      });
    },
    updateTables(internalRefresh = true, termId = null) {
      if (termId) this.termId = termId
      if (this.termId){
        this.availableCoursesQuery.changed_term_id = this.termId
        this.availableCoursesFilter.changed_term_id = this.termId
      }

      // get current term stage for this student
      const payload = { id: this.studentId, payload: this.availableCoursesQuery }

      if (this.studyingStudentStatus) {
        this.getAvailableCourses(payload).then(data => {
          this.selectorItems = data.data
          this.totalAvailableCourses = data.meta.count
          this.lookups = data.meta.lookup
        })
      }
      // if external refresh not emit
      if (internalRefresh){
        this.$emit('refreshSelected')
      }
    },
    addNewOffering() {
      this.addButtonLoading = true
      const query = {
        student_id: this.studentId,
        offering_id: this.selectedOffering_1.id,
        section_id: this.selectedSection_1.section ? this.selectedSection_1.section.id : null,
        group_id: this.selectedSection_1.group ? this.selectedSection_1.group.id : null,
        co_requisite_offerings: this.coRequisiteOfferingsSelectedSection,
      };
      this.requestNewOffering(query).then(data => {
        if (data.status == 'success') {
          this.$nextTick(() => {
            this.$refs['my-modal'].toggle('#toggle-btn')
          })
          this.successToast(data.message)
          // refresh all courses again
          this.updateTables()
        }
      }).catch(errors => {
        let error = ''
        if (Array.isArray(errors)) {
          error = errors[0]
        } else {
          error = errors
        }
        this.errorToast(error.title)
      }).finally(() => {
        this.addButtonLoading = false
      })
    },
    addNewOfferingBtn(bvModalEvt) {
      // Prevent modal from closing
      //bvModalEvt.preventDefault()
      // check co-requisite validation
      let checkCoRequisiteValidate = true;
      if (this.selectedSection_1 > 0 && Object.keys(this.coRequisiteOfferingsSelectedSection).length === this.offeringCoRequisiteSectionsArr.length) {
        for (const prop in this.coRequisiteOfferingsSelectedSection) {
          if (!this.coRequisiteOfferingsSelectedSection[prop]) {
            checkCoRequisiteValidate = false
            break
          }
        }
      } else {
        checkCoRequisiteValidate = false
      }
      // to check if no error
      if (checkCoRequisiteValidate === false &&  !this.hasPermission('overrideRules_registration')) {
        this.errorToast(this.$t("Sorry Must Select Offering Section"))
      } else {
        this.addNewOffering();
      }
    },
    resetModal() {
      this.selectedSection_1 = null
      this.offeringSectionsOptions = [];
    },
    getOfferingSections(offering) {
      this.offeringSectionsOptions = []
      this.offeringCoRequisiteSectionsArr = []
      this.selectedOffering_1 = offering;
      this.offeringCoRequisiteSectionsArr = [];
      this.coRequisiteOfferingsSelectedSection = {};
      /* may be used to live section read updated quota */
      this.offeringSections({ offering_id: offering.id, student_id: this.studentId }).then(data => {
        this.offeringSectionsOptions = data.offering_sections
        if (data.offering_co_requisite_sections) {
          this.offeringCoRequisiteSectionsArr = data.offering_co_requisite_sections
        }
      })
    },
    refreshAvailableCourses(query){
      if (this.availableCoursesFilter) {
        query = { ...query, ...this.availableCoursesFilter}
      }
      // to store query and use it again after update table in add and drop
      this.availableCoursesQuery = query

      this.availableCoursesLoad = true

      this.studentId = this.studentId ? this.studentId : this.id

      this.getAvailableCourses({ id: this.studentId, payload: this.availableCoursesQuery }).then(data => {
        this.selectorItems = data.data
        this.totalAvailableCourses = data.meta.count
        this.lookups = data.meta.lookup

        this.availableCoursesLoad = false
      })
    },
    checkSelected(item){
      if((!item.flag || this.hasPermission('overrideRules_registration')) && ((item.section && item.section_quota > item.section_count) || item.group_quota > item.group_count )){
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
.card .card-header{
  padding-top: 5px !important;
}
.customAction {
  text-align: center;
}
.alert{
  margin-bottom: 4px !important;
}
</style>
