<template>
  <DataTable
    :total="total"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
    :paramsLoaded="paramsLoaded"
    :allowFilterWithoutSearch="false"
    :resetMargin="false"
  >
    <template #filter v-if="lookups" >
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.faculty_id"
            :options="lookups.faculties"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('faculties')"
            :clearable="true"
        >
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.bylaw_id"
            :options="lookups.bylaws"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.bylaws')"
            :clearable="true"
            :disabled="filter.faculty_id == null"
        >
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.program_id"
            :options="lookups.programs"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.programs')"
            :clearable="true"
            :disabled="filter.bylaw_id == null"
        >
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.type_id"
            :options="lookups.types"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.types')"
            :clearable="true"
        >
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.status_id"
            :options="lookups.statusList"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.status')"
            :clearable="true"
        >
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
    </template>
    <template  #studentSerach>
      <b-col class="CustomBtn w-100" v-if="!user_id" cols="12" md="6"   style="padding: 0 !important;">
        <v-select
            class="CustomBtn"
            v-model="filter.student_id"
            :dir="$i18n.locale=='en' ? 'ltr' : 'rtl'"
            :placeholder="$i18n.locale=='en'?'Search For a Student':'ابحث عن طالب'"
            @search="fetchOptions"
            :options="studentData"
            :filterable="false"
            :reduce="(val) => val.id"
            :label="$i18n.locale=='en'?'name':'name_local'"
        >
          <template slot="no-options">
            {{$i18n.locale == 'en' ? 'Type Student Code or Name to Search' : 'أكتب كود الطالب او اسمه للبحث'}}
          </template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ $i18n.locale == 'en' ? (option.name ? option.name :option.name_local) : (option.name_local ? option.name_local : option.name )}}
            </div>
          </template>
         <template #no-options>
                            {{ $t("search_input_text") }}
                          </template>
        </v-select>
      </b-col>
      <span v-else></span>
    </template>
    <template #action>

<!--        <b-button-->
<!--          v-b-tooltip.hover="$t('Global.add')"-->
<!--          class="btn-icon"-->
<!--          variant="primary"-->
<!--          @click="$router.push({ name: 'add_correction_request' })"-->
<!--          v-if="adminAdd"-->
<!--      >-->
<!--        <feather-icon icon="PlusIcon" />-->
<!--      </b-button>-->

    </template>
    <template #customTable>
      <b-table
        class="position-relative"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(type)="data">
          {{ $i18n.locale == "ar" ? data.item.field.type.name_local : data.item.field.type.name }}
        </template>
        <template #cell(student)="data">
          <b-link
              class="font-weight-bold d-inline-block text-nowrap"
              :to="{ name: 'student-show', params: { id: data.item.student_id } }"
          >
          {{ $i18n.locale == "ar" ? data.item.student.user_name_local : data.item.student.user_name }}
          </b-link>
        </template>
        <template #cell(field)="data">
          {{ $i18n.locale == "ar" ?data.item.field.name_local : data.item.field.name }}
        </template>
     
        <template #cell(description)="data">
          {{ getDescription(data.item.description) }}
        </template>
        <template  #cell(original_data)="data">
          {{ getDescription(data.item.original_data) }}
        </template>
        <template #cell(reason)="data">
          {{ getDescription(data.item.reason) }}
        </template>
        <template #cell(status)="data">
          <b-badge
              v-if="status=getStatusBadge(data.item.status)"
              :variant="status.class"
          >
            {{ status.label }}
          </b-badge>
        </template>
        <template #cell(action)="data">
              <div>
                <span
                  @click="open(data.item.id)"
                  class="mx-1 text-primary"
                  style="cursor: pointer"
                  v-if="hasPermission('show_correctionRequests')"
                >
                  <feather-icon icon="EditIcon" />
                </span>
              </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>
<script>
import {
  VBModal,
  BTable,
  BBadge,
  BCol,
  BLink,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

import CorrectionRequest from '@/api/student/correciton_requests/correction_request'
import { mapActions } from 'vuex'

const correctionRequest = new CorrectionRequest()

export default {
  name: 'CorrectionRequests',
  components: {
    DataTable,
    BTable,
    vSelect,
    BBadge,
    BCol,
    BLink
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      filter: { faculty_id: null, bylaw_id: null, program_id: null },
      items: [],
      total: 0,
      lookup: [],
      load: false,
      paramsLoaded: true,
      studentsOptions: [],
      adminAdd: true,

    }
  },
  computed: {
    fields() {
      const fieldsData = [
        {
          key: 'student',
          label: this.$t('student'),
        },
        {
          key: 'type',
          label: this.$t('Correction Type'),
        },
        {
          key: 'field',
          label: this.$t('Correction Field'),
        },
        {
          key: 'description',
          label: this.$t('Description'),
        },
        {
          key: 'original_data',
          label: this.$t('original_data'),
        },
        {
          key: 'reason',
          label: this.$t('reject_reason'),
        },
        {
          key: 'status',
          label: this.$t('Status'),
        },
        {
          key: 'action',
          label: this.$t('actions'),
        }]
      return fieldsData
    },
    lookups() {
      return this.lookup
    },
    studentData: function (){
      return this.studentsOptions;
    },

  },
  watch: {
  },
  methods: {
      ...mapActions({
        getStudentLookup:'students/lookup'
      }),
    refresh(query = null) {
      this.load = true
      correctionRequest.list(query).then(response => {
        this.items = response.data
        this.total = response.meta.count
        this.lookup = response.meta.lookup
        this.load = false

      }).then(()=>{
        this.paramsLoaded =false
      }).catch(error => {
        this.load = false
      })
    },
    getStatusBadge(status){
      let className = ''
      if (status.id == 1) className = 'secondary';
      else if (status.id == 2) className = 'success';
      else if (status.id == 3) className = 'danger';
      else className = 'warning';

      return {
        label: this.getTranslatedName(status),
        class: className,
      };
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
    open(id) {
      window.open(this.$router.resolve({ name: 'show_correction_requests', params: { id: id } }).href, '_blank');
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query={
        studentQuery:search
      }

      if(search.length > 1){
        loading(true)
        this.getStudentLookup(query).then((res)=>{
          this.studentsOptions=res.success.students
          loading(false)
        }).catch((err)=>{
          loading(false)
        })
      }
    },
    getDescription(value){
      if(typeof value === 'object' && value !== null){
        return this.getTranslatedName(value)
      }else{
        return value;
      }
    }
  },


}
</script>
