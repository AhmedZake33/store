<template>
  <div>
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
      <!-- <template
        v-if="lookups && !listed_only"
        #filter
      >
        <b-col cols="6" md="4" >
          <v-select
            v-model="filter.exam_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.exams"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.exam')"
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
            {{ $t('noMatching') }}
          </template>
          </v-select>
        </b-col>
      </template> -->
      <template #customTable>
        <b-table
                    @sort-changed="sortingChanged"
          no-local-sorting
          class="position-relative font-small-2"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
              <div class="text-center text-black my-2">
                  <b-spinner class="align-middle"></b-spinner>
              </div>
          </template>
          <template #cell(exam)="data">
              <div v-if="data.item.exam">
                  <div class="d-flex">
                      {{ $i18n.locale == 'ar' ? data.item.exam.name_local : data.item.exam.name}}
                  </div>
              </div>
          </template>
          <template #cell(exam_type)="data">
              <div v-if="data.item.exam.type">
                  <div class="d-flex">
                      {{ $i18n.locale == 'ar' ? data.item.exam.type.name_local : data.item.exam.type.name}}
                  </div>
              </div>
          </template>
          <template #cell(date)="data">
              <div v-if="data.item.exam_date">
                  <div class="d-flex">
                      {{data.item.exam_date}}
                  </div>
              </div>
          </template>
          <template #cell(slots)="data">
              <div v-if="data.item.slots">
                  <div class="d-flex">
                      <div 
                        v-if="data.item.slots"
                      >
                        <span class="font-weight-bold "
                          v-for="(slot, i) in data.item.slots"
                          :key="slot.id"
                        >
                          <small>
                            <strong class="d-block">
                                {{ $i18n.locale == 'ar' ?  slot.title  :  slot.title  }}
                            </strong>
                          </small>
                        </span>
                      </div>
                  </div>
              </div>
          </template>
          <template #cell(locations)="data">
            <div class="d-flex flex-wrap">
              <div 
                v-if="data.item.locations"
                
              >
                <span class="font-weight-bold d-block"
                  v-for="location in data.item.locations"
                  :key="location.id"
                >
                  <small>
                    <strong>
                        {{ $i18n.locale == 'ar' ?  location.name_local  : location.name }}
                    </strong>
                  </small>
                </span>
              </div>
            </div>
          </template>
          <template #cell(paper_types)="data">
              <div v-if="data.item.paper_types">
                  <div class="d-flex">
                      <div 
                        v-if="data.item.paper_types"
                      >
                        <span class="font-weight-bold "
                          v-for="(type, i) in data.item.paper_types"
                          :key="type.id"
                        >
                          <small>
                            <strong class="d-block">
                                {{ $i18n.locale == 'ar' ?  type.name_local  :  type.name  }}
                            </strong>
                          </small>
                        </span>
                      </div>
                  </div>
              </div>
          </template>
          <!-- <template #cell(actions)="data">
              <div v-if="data">
                  <feather-icon v-b-tooltip.hover="$t('Global.exam_specifications')" v-if="hasPermission('edit_exam')"
                      icon="FileTextIcon" style="cursor: pointer" class="text-primary"
                      @click="examSpecifications(data.item)" />
                  <feather-icon v-if="hasPermission('edit_exam')" v-b-tooltip.hover="$t('Global.edit')"
                      icon="EditIcon" style="cursor: pointer" @click="open( data.item.exam.id , data.item.id)" class="text-primary"/>
                  <feather-icon v-b-tooltip.hover="$t('Global.delete')" v-if="hasPermission('delete_exam')"
                      icon="Trash2Icon" style="cursor: pointer" class="text-danger"
                      @click="deleteExam(data.item.id)" />
              </div>
          </template> -->
        </b-table>
      </template>
      <!-- <template #action v-if="!listed_only">
        <b-button
          v-if="hasPermission('add_exam')"
          v-b-tooltip.hover="$t('Global.add')"
          :to="{ name: 'add_offering_exam_schedule' , query: { offering_id : offering_id_param} }"
          class="btn-icon "
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template> -->
    </DataTable>
    <b-modal id="exam_specifications_modal" ref="exam_specifications_modal" no-close-on-backdrop size="lg" centered :title="$t('Global.exam_specifications')" @ok="submit">
      <validation-observer ref="simpleRules">
        <form ref="specifications_form" >
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                class="left_right"
                :label="$t('paper_types')"
                label-for="paper-types-input"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  v-if="lookups"
                >
                  <v-select
                    v-model="specifications_form.paper_types"
                    :label="getSelectLabel()"
                    :options="lookups.paper_types"
                    multiple
                    :reduce="(val) => val.id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'paper_types')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
            
          </div>
          <div class="row">
            <div class="col">
              <b-form-group 
                :label="$t('Global.minutes')" 
                label-for="minutes"
              >
                  <validation-provider 
                    :name="''" 
                    #default="{ errors }" 
                    rules="required"
                  >
                    <b-form-input 
                      id="minutes"
                      v-model="specifications_form.minutes" 
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors 
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'minutes')
                      "
                    />
                  </validation-provider>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                class="left_right"
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  name="local-name"
                  rules="required"
                >
                  <b-form-textarea
                    id="notes"
                    v-model="specifications_form.notes"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'notes')"
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
      </validation-observer>
    </b-modal>
  </div>
</template>

<script>
import ValidationErrors from "@/views/components/common/ValidationErrors"
import { ValidationProvider, ValidationObserver, localize } from "vee-validate"
import { required } from "@validations"
import {
  BCard, BFormGroup, BRow, BCol, BFormTextarea, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover,
} from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

export default {
  name: 'Offerings',
  components: {
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
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
    BFormTextarea,
    BPopover,
    BFormGroup
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: {type:Boolean , default:false},
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    return {
      errorsdata: {},
      schedule_id: null,
      specifications_form:{
        paper_types: [],
        minutes: null,
        notes: null
      },
      filter: {  
        offering_id: null,
        term_id:null,
        faculty_id:null, 
        bylaw_id:null, 
        program_id: null, 
        status: null,
        exam_id: null,
        location_id: null,
        slot_id: null
      },
      fields: [
          {
              key: "exam",
              sortable: true,
              label: this.$t("Global.exam"),
              // thStyle: { width: "15%" },
          },
          {
              key: "exam_type",
              sortable: true,
              label: this.$t("Global.type"),
              // thStyle: { width: "15%" },
          },
          {
              key: "date",
              sortable: true,
              label: this.$t("Global.date"),
              // thStyle: { width: "15%" },
          },
          {
              key: "slots",
              sortable: true,
              label: this.$t("Global.slots"),
              // thStyle: { width: "15%" },
          },
          {
            key: "locations",
            sortable: true,
            label: this.$t("Global.locations"),
            // thStyle: { width: "15%" },
          },
          {
            key: "paper_types",
            sortable: true,
            label: this.$t("Global.paper_types"),
            // thStyle: { width: "15%" },
          },
          {
            key: "minutes",
            sortable: true,
            label: this.$t("Global.minutes"),
            // thStyle: { width: "15%" },
          },
          {
            key: "notes",
            sortable: true,
            label: this.$t("Global.notes"),
            // thStyle: { width: "15%" },
          },
          // {
          //     key: 'actions',
          //     // thStyle: { width: '12%' },
          //     thClass: 'customAction',
          //     tdClass: 'customWidth',
          //     label: this.$i18n.locale === 'en' ? 'Actions' : 'الإجراءات',
          // },
      ],
      paramsLoaded: true,
    }
  },
  computed: {
    ...mapGetters({
      items: 'examsSchedules/items',
      total: 'examsSchedules/total',
      load: 'examsSchedules/load',
      lookups: 'examsSchedules/lookups',
      needDrop:'app/needDrop',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : this.user_id;
    },
    getEmptyListLabel() {
      return this.$i18n.locale === 'en' ? 'Sorry, No Matching Options.' : 'لاتوجد نتائج مطابقة للبحث.'
    },
    fieldsData() {
      let fields = [
        {
            key: "exam",
            sortable: true,
            label: this.$t("Global.exam"),
            // thStyle: { width: "15%" },
        },
        {
            key: "exam_type",
            sortable: true,
            label: this.$t("Global.type"),
            // thStyle: { width: "15%" },
        },
        {
            key: "date",
            sortable: true,
            label: this.$t("date"),
            // thStyle: { width: "15%" },
        },
        {
            key: "slots",
            sortable: true,
            label: this.$t("Global.slots"),
            // thStyle: { width: "15%" },
        },
        {
          key: "locations",
          sortable: true,
          label: this.$t("Global.locations"),
          // thStyle: { width: "15%" },
        },
        {
          key: "paper_types",
          sortable: true,
          label: this.$t("Global.paper_types"),
          // thStyle: { width: "15%" },
        },
        {
          key: "minutes",
          sortable: true,
          label: this.$t("Global.minutes"),
          // thStyle: { width: "15%" },
        },
        {
          key: "notes",
          sortable: true,
          label: this.$t("Global.notes"),
          // thStyle: { width: "15%" },
        },
        // {
        //     key: 'actions',
        //     // thStyle: { width: '12%' },
        //     thClass: 'customAction',
        //     tdClass: 'customWidth',
        //     label: this.$i18n.locale === 'en' ? 'Actions' : 'الإجراءات',
        // },
      ]
      return fields;
      
     
    },
    language:function(){
      localStorage.setItem("mylang", this.$i18n.locale);
      return this.$i18n.locale
    },
    header:function(){
      localStorage.setItem("headers",false);
      return false;
    }
  },
   watch: {
    'filter.bylaw_id': function (newValue) {
      if(this.filter.program_id)
      {
        this.filter.program_id = null
      }
    },
    'filter.faculty_id': function (newValue) {
      if(this.filter.bylaw_id)
      {
        this.filter.bylaw_id = null
      }
    },
    language :function (val) {
      this.language = val;
    },
    header:function (val) {
      this.header = val;
    }
   },
  methods: {
    editTab(offering_id){
      this.$router.push({name:'offering',params:{id: offering_id}, query: { inline : true}})
      this.updateFilterQueryParams({ tabNum: 1 });
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
        return data.filter(el => el.role.name == 'Coordinator')
      }
    },
    externalCommittee(data) {
      if (data) {
        return data.filter(el => el.role.name == 'External Committee')
      }
    },
    teacher(data) {
      if (data) {
        return data.filter(el => el.role.name == 'Teacher')
      }
    },
    teachingAssistant(data) {
      if (data) {
        return data.filter(el => el.role.name == 'Teaching Assistant')
      }
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id }
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id }
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id }
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program }
      }
      if (this.status) {
        query = { ...query, status: this.status } 
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
      this.$store.dispatch('examsSchedules/locationExamsSchedules',  { query : query , id: this.id} )
      .then((data) => {
          this.paramsLoaded = false;
        });
    },
    deleteExam(id) {
        if (this.items) {
            this.$swal({
                title: `${this.$t('Global.deleteTitle')}`,
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: `${this.$t('Global.cancel')}`,
                confirmButtonText: 'Yes, delete slot!',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-danger ml-1',
                },
                buttonsStyling: false,
            }).then(result => {
                if (result.value) {
                    this.popoverShow = false;
                    this.$store.dispatch('examsSchedules/remove', id).then(response => {
                        this.$swal({
                            icon: 'success',
                            title: this.$t('Global.Deleted'),
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
                    this.refresh()
                    this.reset()
                } else{
                  this.$swal({
                    icon: 'error',
                    title: this.$i18n.locale=='en'? 'Error!' : 'خطا',
                    text: this.$i18n.locale=='en'? 'You Cannot Delete This Exam Schedule': 'لا يمكنك مسح جدول الامتحان',
                    customClass: {
                      confirmButton: 'btn btn-danger',
                    },
                  })
                }
            });
        }
    },
    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local'
    },
    getColor(status)
    {
      if(status == "Draft")
      {
        return 'light-warning'
      }
      else if(status == "Submitted")
      {
        return 'light-success'
      }
      else if(status == "Accepted")
      {
        return 'light-info'
      }
      else if(status == "Approved")
      {
        return 'light-dark'
      }
      else if(status == "Published")
      {
        return 'light-primary'
      }


    },
    open(examId,id){
      this.$router.push({
          name: "edit_offering_exam_schedule",
          query: {exam_id : examId ,id : id, offering_id: this.id}
          // params: { examId : examId , id : id},
      });
    },
    openCalendar(id) {
      if(this.$route.name == "offerings")
      {
        this.$router.push({
            name: "offering-schedule",
            params: {
                id,
            },
        });
      }else{
        this.$router.push({
            name: "course-schedule",
            params: {
                id,
            },
        });
      }
    },
    examSpecifications(item){
      this.specifications_form.paper_types = []
      if(item.paper_types){
        item.paper_types.forEach((el)=>{
          this.specifications_form.paper_types.push(el.id)
        })
      }else{
        this.specifications_form.paper_types = []
      }
      this.specifications_form.minutes = item.minutes ? item.minutes : null
      this.specifications_form.notes = item.notes ? item.notes : null

      this.schedule_id = item.id
      this.$refs.exam_specifications_modal.show();
    },
    submit(e) {
      // this.$refs.exam_specifications_modal.hide();
      e.preventDefault();
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = {id: this.schedule_id, query: this.specifications_form };
          this.$store.dispatch("examsSchedules/specifications", payload)
          .then((response) => {
              this.$swal({
                icon: "success",
                text: `${this.$t("successMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$refs.exam_specifications_modal.hide();
              this.reset()
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          });
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
