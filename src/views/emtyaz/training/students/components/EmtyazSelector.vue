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
                :title="$t('Global.emtyaz_selector')"
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
                  <!-- <template #cell(name)="data">
                    {{ $i18n.locale=='en'?data.item.name:data.item.name_local }}
                    <div v-if="data.item.corequisite_courses">
                      <b-badge variant="light-dark">
                        {{$t('Co-Requisite Course')}}:
                        <b-badge variant="secondary" style="margin: 0 2px; font-size: 1.1em" v-for="offering in data.item.corequisite_courses" :key="offering.offering_id">
                          {{offering.code}}
                        </b-badge>
                      </b-badge>
                    </div>
                  </template> -->
                  <template #cell(weeks)="data">
                    {{ data.item.weeks }}
                  </template>
                  <template #cell(count)="data">
                    {{data.item.registration_count}}/{{ data.item.capacity }}
                  </template>
                  <!-- <template #cell(status)="data">
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
                  </template> -->
                  <template #cell(actions)="data">
                    <div style="flex-direction: column;gap: 0em">
                      <!-- button -->
                      <div
                          v-if="hasPermission('add_registration' || 'adddrop_registration' )"
                      >
                        <b-button
                            v-if="(!data.item.prerequisite_courses && !data.item.exposerequisite_courses && !data.item.warnings) || hasPermission('overrideRules_registration' )"
                            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                            v-b-modal.modal-prevent-closing
                            variant="outline-primary"
                            size="sm"
                            @click="addTraining(data.item.id)"
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
      }),
      selectorFields() {
        return [
          {
            key: 'name',
            label: this.$t('course'),
            sortable: true,
          },
          {
            key: 'starts_at',
            label: this.$t('Global.start_at'),
            sortable: true,
          },
          {
            key: 'ends_at',
            label: this.$t('Global.end_at'),
            sortable: true,
          },
          {
            key: 'weeks',
            label: this.$t('weeks'),
            sortable: true,
          },
          {
            key: 'count',
            label: this.$t('count'),
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
        getAvailableCourses: 'Emtyaz/getAvailableTrainings',
        requestNewOffering: 'offeringsRegistrations/requestNewOffering',
        addTrainingEmtyaz: 'Emtyaz/addTrainingEmtyaz',
        offeringSections: 'offeringsRegistrations/offeringSections',
      }),
      init(query) {
        this.loading = true
        // this.updateTables();
        const payload = { id: this.studentId, query: query }
        this.getAvailableCourses(payload).then(data => {
            this.selectorItems = data.data
            this.totalAvailableCourses = data.meta.count
            this.lookups = data.meta.lookup
          })
  
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
        const payload = { id: this.studentId}
  
        // if (this.studyingStudentStatus) {
          this.getAvailableCourses(payload).then(data => {
            this.selectorItems = data.data
            this.totalAvailableCourses = data.meta.count
            this.lookups = data.meta.lookup
          })
        // }
        // if external refresh not emit
        // if (internalRefresh){
        //   this.$emit('refreshSelected')
        // }
      },
      addNewOffering() {
        this.addButtonLoading = true
        const query = {
          student_id: this.studentId,
          offering_id: this.selectedOffering_1.id,
          section_id: this.selectedSection_1,
          co_requisite_offerings: this.coRequisiteOfferingsSelectedSection,
        };
        this.requestNewOffering(query).then(data => {
          if (data.status == 'success') {
            // this.$emit('refresh');
            this.$emit('refreshSelected');
            // this.$emit('refreshSelector', this.updatedTermId);
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
      },
      // getOfferingSections(offering) {
      //   this.selectedOffering_1 = offering;
      //   this.offeringCoRequisiteSectionsArr = [];
      //   this.coRequisiteOfferingsSelectedSection = {};
      //   /* may be used to live section read updated quota */
      //   this.offeringSections({ offering_id: offering.id, student_id: this.studentId }).then(data => {
      //     this.offeringSectionsOptions = data.offering_sections
      //     if (data.offering_co_requisite_sections) {
      //       this.offeringCoRequisiteSectionsArr = data.offering_co_requisite_sections
      //     }
      //   })
      // },
      addTraining(training_id){
        const query = {id:training_id , student_id : this.studentId};
        this.addTrainingEmtyaz(query).then(()=> {
          this.$emit('refreshSelected');
          this.$swal({
                icon: "success",
                title:
                  this.$i18n.locale == "en"
                    ? "success update course"
                    : "تم التعديل بنجاح",
                showConfirmButton: false,
                timer: 1500,
              });
                // this.$router.go(-1);
                this.init();
                this.dueDateModel = false;
              }).catch((error)=>{
                this.$swal({
                icon: "error",
                title:
                  this.$t('Global.errorMessage'),
                showConfirmButton: false,
                timer: 1500,
                });
              });
        
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
  