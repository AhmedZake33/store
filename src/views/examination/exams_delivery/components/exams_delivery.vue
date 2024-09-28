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
      <template
        v-if="lookups && !listed_only"
        #filter
      >
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.offering_id"
            :options="searchOfferings"
            :label="getSelectLabel()"
            class="w-100"
            :placeholder="$t('offerings')"
            :filterable="false"
            clearable
            :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
            :reduce="(val) => val.id"
            @search="fetchOfferings"

          >
            <template
              v-slot:option="option"
              v-if="$i18n.locale == 'ar'"
            >
              {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)
            </template>
            <template v-slot:option="option" v-else>
              {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
            </template>

            <template slot="selected-option" slot-scope="option">
              <span 
                v-if="$i18n.locale == 'ar'"
              >
                {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)</span
              >
              <span 
                v-else
              >
                {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
              </span>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="val => val.id"
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
            {{ $t('noMatching') }}
          </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4" >
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
            {{ $t('noMatching') }}
          </template>
          </v-select>
        </b-col>
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
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.location_id"
            multiple
            :label="getSelectLabel()"
            :options="lookups.locations"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.location')"
            :filter="locationsSearch"
          >
            <template slot="option" slot-scope="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local 
                  : option.name 
              }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local 
                  : option.name
              }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4" >
          <v-select
            v-model="filter.slot_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.slots"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.slot')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.title : option.title }}
            </template>
            <template #selected-option="{ title }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ title }} </strong>
                <strong v-else>{{ title }} </strong>
              </div>
            </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
          </v-select>
        </b-col>
      </template>
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
          <template #cell(course)="data">
              <div v-if="data.item.course">
                  <div class="d-flex">
                    <b-link
                      v-if="$i18n.locale == 'en'"
                      class="font-weight-bold custom_link h5"
                      :to="{ name: 'offering', params: { id: data.item.offering_id } }"
                    >
                      {{ data.item.course ? `${data.item.course.code}: ${data.item.course.name}` : '-' }}
                    </b-link>
                    <b-link
                      v-if="$i18n.locale == 'ar'"
                      class="font-weight-bold custom_link h5"
                      :to="{ name: 'offering', params: { id: data.item.offering_id } }"
                    >
                      {{ data.item.course ? `${data.item.course.code}: ${data.item.course.name_local}` : '-' }}
                    </b-link>
                  </div>
                  <div class="d-flex">
                    <strong>
                      {{
                        `${$t("Global.students")} : ${
                          data.item.students_per_offering ? data.item.students_per_offering : "_"
                        }`
                      }}
                    </strong>
                  </div>
                  <div class="d-flex flex-wrap">
                    <strong class="font-weight-bold">
                      {{ $t("Global.faculty") }}: &nbsp;
                    </strong>
                    <div v-if="data.item.offering.course.faculty">
                      <span
                        v-if="$i18n.locale == 'en'"
                        class="font-weight-bold d-block"
                      >
                        {{ data.item.offering.course.faculty.name }}
                      </span>
                      <span
                        v-if="$i18n.locale == 'ar'"
                        class="font-weight-bold d-block"
                      >
                        {{ data.item.offering.course.faculty.name_local }}
                      </span>
                    </div>
                    <div v-else>
                      _
                    </div>
                  </div>
              </div>
          </template>
          <template #cell(exam)="data">
              <div v-if="data.item.exam">
                  <div class="d-flex">
                      {{ $i18n.locale == 'ar' ? data.item.exam.name_local : data.item.exam.name}}
                  </div>
              </div>
          </template>
          <template #cell(locations)="data">
            <div class="d-flex flex-wrap">
              <div v-if="data.item.locations" class="with-comma">
                <span
                  class="font-weight-bold d-block"
                  v-for="location in data.item.locations"
                  :key="location.id"
                >
                  {{
                    $i18n.locale == "ar" ? location.name_local : location.name
                  }}
                </span>
              </div>
            </div>
          </template>
          <template #cell(delivery)="data">
              <div v-if="data.item.delivery">
                  <div class="d-flex flex-column" v-if="$i18n.locale == 'ar'">
                    <span> <strong>بواسطة:</strong> {{data.item.delivery.exam_delivered_by ? data.item.delivery.exam_delivered_by.name_local : '_'}} </span>
                    <span> <strong>إلى:</strong> {{data.item.delivery.exam_delivered_to ? data.item.delivery.exam_delivered_to.name_local : '_'}} </span>
                    <span> <strong>في:</strong> {{data.item.delivery.exam_delivered_at ? data.item.delivery.exam_delivered_at : '_'}} </span>
                    <span> <strong>ملاحظة:</strong> {{data.item.delivery.exam_delivery_notes ? data.item.delivery.exam_delivery_notes : '_'}} </span>
                      <!-- {{ $i18n.locale == 'ar' ? data.item.exam.name_local : data.item.exam.name}} -->
                  </div>
                  <div class="d-flex flex-column" v-else>
                    <span> <strong>By:</strong> {{data.item.delivery.exam_delivered_by ? data.item.delivery.exam_delivered_by.name : '_'}} </span>
                    <span> <strong>To:</strong> {{data.item.delivery.exam_delivered_to ? data.item.delivery.exam_delivered_to.name : '_'}} </span>
                    <span> <strong>At:</strong> {{data.item.delivery.exam_delivered_at ? data.item.delivery.exam_delivered_at : '_'}} </span>
                    <span> <strong>Notes:</strong> {{data.item.delivery.exam_delivery_notes ? data.item.delivery.exam_delivery_notes : '_'}} </span>
                      <!-- {{ $i18n.locale == 'ar' ? data.item.exam.name_local : data.item.exam.name}} -->
                  </div>
              </div>
          </template>
          <template #cell(papers_taken)="data">
              <div v-if="data.item.papers_taken">
                  <div class="d-flex flex-column" v-if="$i18n.locale == 'ar'">
                    <span> <strong>بواسطة:</strong>  {{data.item.papers_taken.papers_taken_by ? data.item.papers_taken.papers_taken_by.name_local : '_'}} </span>
                    <span> <strong>إلى:</strong> {{data.item.papers_taken.papers_taken_to ? data.item.papers_taken.papers_taken_to.name_local : '_'}} </span>
                    <span> <strong>في:</strong> {{data.item.papers_taken.papers_taken_at ? data.item.papers_taken.papers_taken_at : '_'}} </span>
                    <span> <strong>عدد أوراق الاجابة: {{data.item.total_answers_sheets ? data.item.total_answers_sheets : '_'}} </strong></span>
                    <span> <strong>عدد الطلاب الغائبين : {{data.item.total_absences_students ? data.item.total_absences_students : '_'}}</strong> </span>
                    <span> <strong>عدد طلاب التحقيقات : {{data.item.total_investigations_students ? data.item.total_investigations_students : '_'}} </strong></span>
                  </div>
                  <div class="d-flex flex-column" v-else>
                    <span> <strong>By:</strong> {{data.item.papers_taken.papers_taken_to ? data.item.papers_taken.papers_taken_to.name : '_'}} </span>
                    <span> <strong>To:</strong> {{data.item.papers_taken.papers_taken_by ? data.item.papers_taken.papers_taken_by.name : '_'}} </span>
                    <span> <strong>At:</strong> {{data.item.papers_taken.papers_taken_at ? data.item.papers_taken.papers_taken_at : '_'}} </span>
                    <span> <strong>Number of Answers Sheets: {{data.item.total_answers_sheets ? data.item.total_answers_sheets : '_'}} </strong></span>
                    <span> <strong>Number of Absences Students: {{data.item.total_absences_students ? data.item.total_absences_students : '_'}} </strong></span>
                    <span> <strong>Number of Investigations Students: {{data.item.total_investigations_students ? data.item.total_investigations_students : '_'}} </strong></span>
                  </div>
              </div>
          </template>
          <template #cell(papers_returned)="data">
              <div v-if="data.item.papers_returned">
                  <div class="d-flex flex-column" v-if="$i18n.locale == 'ar'">
                    <span> <strong>بواسطة:</strong> {{data.item.papers_returned.papers_returned_by ? data.item.papers_returned.papers_returned_by.name_local : '_'}} </span>
                    <span> <strong>إلى:</strong> {{data.item.papers_returned.papers_returned_to ? data.item.papers_returned.papers_returned_to.name_local : '_'}} </span>
                    <span> <strong>في:</strong> {{data.item.papers_returned.papers_returned_at ? data.item.papers_returned.papers_returned_at : '_'}} </span>
                  </div>
                  <div class="d-flex flex-column" v-else>
                    <span> <strong>By:</strong> {{data.item.papers_returned.papers_returned_by ? data.item.papers_returned.papers_returned_by.name : '_'}} </span>
                    <span> <strong>To:</strong> {{data.item.papers_returned.papers_returned_to ? data.item.papers_returned.papers_returned_to.name : '_'}} </span>
                    <span> <strong>At:</strong> {{data.item.papers_returned.papers_returned_at ? data.item.papers_returned.papers_returned_at : '_'}} </span>
                  </div>
              </div>
          </template>
          <template #cell(actions)="data">
              <div v-if="data">
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
                  <feather-icon v-b-tooltip.hover="$t('Global.deliver_exam_papers')" v-if="hasPermission('edit_examDeliver')"
                      icon="LayersIcon" style="cursor: pointer" class="text-primary"
                      @click="deliverExamPapers(data.item)" />
                  <feather-icon v-b-tooltip.hover="$t('Global.provide_answer_sheets')" v-if="hasPermission('edit_examTakePapers')"
                      icon="LayoutIcon" style="cursor: pointer" class="text-primary"
                      @click="provideAnswerSheets(data.item)" />
                  <feather-icon v-b-tooltip.hover="$t('Global.return_answer_sheets')" v-if="hasPermission('edit_examReturnPapers')"
                      icon="CalendarIcon" style="cursor: pointer" class="text-primary"
                      @click="returnAnswerSheets(data.item)" />
                  <!-- <feather-icon v-b-tooltip.hover="$t('Global.delete')" v-if="hasPermission('delete_exam')"
                      icon="Trash2Icon" style="cursor: pointer" class="text-danger"
                      @click="deleteExam(data.item.id)" /> -->
              </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="!listed_only">
      </template>
    </DataTable>
    <b-modal id="modal" ref="modal" no-close-on-backdrop size="lg" centered :title="modalTitle">
      <validation-observer ref="simpleRules"  >
        <form ref="deliver_exam_papers" v-if="formType == 1">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                class="left_right"
                :label="$t('Global.delivered_by')"
                label-for="exam_delivered_by"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="delivered by"
                  v-if="lookups"
                >
                  <v-select
                    v-model="deliver_exam_papers.exam_delivered_by"
                    :label="getSelectLabel()"
                    :options="lookups.instructors"
                    :reduce="(val) => val.id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
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
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == 'ar' ? `حقل ${$t('Global.delivered_by')} مطلوب` : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  name="notes"
                  rules="required"
                >
                  <b-form-textarea
                    id="notes"
                    v-model="deliver_exam_papers.notes"
                  />
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == 'ar' ? `حقل ${$t('Global.notes')} مطلوب` : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
        <form ref="provide_answer_sheets" v-if="formType == 2">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                class="left_right"
                :label="$t('Global.taken_by')"
                label-for="papers_taken_by"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Taken By"
                  v-if="lookups"
                >
                  <v-select
                    v-model="provide_answer_sheets.papers_taken_by"
                    :label="getSelectLabel()"
                    :options="lookups.instructors"
                    :reduce="(val) => val.id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
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
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == 'ar' ? `حقل ${$t('Global.taken_by')} مطلوب` : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
        <form ref="return_answer_sheets" v-if="formType == 3">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                class="left_right"
                :label="$t('Global.returned_by')"
                label-for="papers_returned_by"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  name="Returned By"
                  v-if="lookups"
                >
                  <v-select
                    v-model="return_answer_sheets.papers_returned_by"
                    :label="getSelectLabel()"
                    :options="lookups.instructors"
                    :reduce="(val) => val.id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
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
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == 'ar' ? `حقل ${$t('Global.returned_by')} مطلوب` : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
            <b-col md="12">
                <b-button type="submit" variant="primary" class="mr-1" @click="submit()">
                    {{ $t('Global.save') }}
                </b-button>
                <b-button type="reset" variant="outline-secondary" @click="$refs.modal.hide();">
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
  BPopover,
  BFormGroup,
  BFormTextarea,
  BFormDatepicker,
} from 'bootstrap-vue'
import ValidationErrors from "@/views/components/common/ValidationErrors"
import { ValidationProvider, ValidationObserver, localize } from "vee-validate"
import { required } from "@validations"
import { mapActions, mapGetters } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'
import Fuse from 'fuse.js'

export default {
  name: 'Offerings',
  components: {
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize,
    required,
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
    BFormGroup,
    BFormTextarea,
    BFormDatepicker,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: {type:Boolean , default:false},
    exam_id: null,
    course_id: null,
    term_id: null,
    status: null,
  },
  data() {
    return {
      schedule_id: null,
      typeAPI: null,
      errorsdata:{},
      formType: null,
      modalTitle: null,
      searchOfferings: [],
      waitFetchOfferings: false,
      deliver_exam_papers:{
        exam_delivered_by: null,
        notes: null,
      },
      provide_answer_sheets:{
        papers_taken_by: null,
      },
      return_answer_sheets:{
        papers_returned_by: null
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
        slot_id: null,
        order_direction: true
      },
      fields: [
         {
              key: "course",
              sortable: true,
              label: this.$t("Global.course"),
              // thStyle: { width: "15%" },
          },
          {
              key: "exam",
              sortable: true,
              label: this.$t("Global.exam"),
              // thStyle: { width: "15%" },
          },
          {
              key: 'actions',
              // thStyle: { width: '12%' },
              thClass: 'customAction',
              tdClass: 'customWidth',
              label: this.$i18n.locale === 'en' ? 'Actions' : 'الإجراءات',
          },
      ],
      paramsLoaded: true,
    }
  },
  computed: {
    ...mapGetters({
      items: 'examsDelivery/items',
      total: 'examsDelivery/total',
      load: 'examsDelivery/load',
      needDrop:'app/needDrop',
      lookups: 'examsDelivery/lookups',
    }),
    exam_id_param() {
      return this.$route.query.exam_id ? this.$route.query.exam_id : null;
    },
    fieldsData() {
      let fields = [
        {
            key: "course",
            sortable: true,
            label: this.$t("Global.course"),
            thStyle: { width: "30%" },
        },
        {
            key: "exam",
            sortable: true,
            label: this.$t("Global.exam"),
            // thStyle: { width: "15%" },
        },
        {
          key: "locations",
          sortable: true,
          label: this.$t("Global.locations"),
          // thStyle: { width: "15%" },
        },
        {
            key: "delivery",
            sortable: true,
            label: this.$t("Global.deliver_exam_papers"),
            // thStyle: { width: "15%" },
        },
        {
            key: "papers_taken",
            sortable: true,
            label: this.$t("Global.provide_answer_sheets"),
            // thStyle: { width: "15%" },
        },
        {
            key: "papers_returned",
            sortable: true,
            label: this.$t("Global.return_answer_sheets"),
            // thStyle: { width: "15%" },
        },
        {
            key: 'actions',
            // thStyle: { width: '12%' },
            thClass: 'customAction',
            tdClass: 'customWidth',
            label: this.$i18n.locale === 'en' ? 'Actions' : 'الإجراءات',
        },
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
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
    }),
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
    refresh(query) {
      if(this.filter.exam_id == null){
        this.$store.dispatch("examsDelivery/lookups", {
            query: { exams: "exams", faculties: "faculties", locations: "locations" , instructors: "instructors", terms: "terms", slots: "slots"},
          }).then(_=>{
            this.filter.exam_id = this.lookups.exams[0].id
          });
        }else{
          // this.$store.state.examsDelivery.load = true
          this.$store
            .dispatch("examsDelivery/examsDelivery", {
              query: query,
              id: this.exam_id_param 
            })
            .then((data) => {
              this.paramsLoaded = false;
          });
      }
      // this.$store.dispatch('examsDelivery/examsDelivery',  { query : query , id: this.exam_id_param } )
      // .then((data) => {
      //     this.paramsLoaded = false;
      //     this.$route.query.exam_id == null ? this.filter.exam_id = this.lookups.exams[0].id : false;
      //   });
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
                    this.$store.dispatch('examsDelivery/remove', id).then(response => {
                        this.$swal({
                            icon: 'success',
                            title: this.$t('Global.Deleted'),
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        this.refresh()
                    });
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
    deliverExamPapers(item){
      this.deliver_exam_papers.exam_delivered_by = item.delivery.exam_delivered_by != null ? item.delivery.exam_delivered_by.id : null
      this.deliver_exam_papers.notes = item.delivery.exam_delivery_notes != null ? item.delivery.exam_delivery_notes : null
      this.schedule_id = item.id
      this.formType = 1
      this.typeAPI = 'deliver'
      this.modalTitle = this.$t("Global.deliver_exam_papers")
      this.$refs.modal.show()
    },
    provideAnswerSheets(item){
      this.provide_answer_sheets.papers_taken_by = item.papers_taken.papers_taken_by != null ? item.papers_taken.papers_taken_by.id :null
      this.schedule_id = item.id
      this.formType = 2
      this.typeAPI = 'take_papers'
      this.modalTitle = this.$t("Global.provide_answer_sheets")
      this.$refs.modal.show()
    },
    returnAnswerSheets(item){
      this.return_answer_sheets.papers_returned_by = item.papers_returned.papers_returned_by != null ? item.papers_returned.papers_returned_by.id : null
      this.schedule_id = item.id
      this.formType = 3
      this.typeAPI = 'return_papers'
      this.modalTitle = this.$t("Global.return_answer_sheets")
      this.$refs.modal.show()
    },
    fetchOfferings(search, load) {
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true;
        load(true)
        const query = {
          search_all_offerings_keyword: search,
        }

        this.getLookups(query).then(response => {
          this.searchOfferings = response.success.all_offerings
          load(false)
          this.waitFetchOfferings = false;
        })
      }
    },
    submit() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = {id: this.schedule_id, query: (this.formType == 1 ? this.deliver_exam_papers : this.formType == 2 ? this.provide_answer_sheets : this.return_answer_sheets) , apiCallingParameter: this.typeAPI};
          this.$store.dispatch("examsDelivery/put", payload )
          .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$refs.modal.hide();
              this.refresh()
            })
            .catch((error) => {
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
    offeringsSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['students_per_offering', 'course.code', 'course.name', 'course.name_local'],
        shouldSort: true,
      })
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list
    },
    locationsSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['name', 'name_local'],
        shouldSort: true,
      })
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
