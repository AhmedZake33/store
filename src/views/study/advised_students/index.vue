<template>
  <div>
    <DataTable
        :total="total"
        :allow-search="true"
        :filter="filter"
        @reset="reset"
        @Refresh="refresh"
        @Export="Export"
        :paramsLoaded="paramsLoaded"
    >
      <template
          v-if="lookups"
          #filter
      >

        <b-col cols="6" md="4">
          <v-select
            v-model="filter.term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
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
        <b-col
            cols="6"
            md="4"
        >
          <v-select
              v-model="filter.faculty_id"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.faculties"
              class="w-100"
              :reduce="val => val.id"
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
        <b-col
            cols="6"
            md="4"
        >
          <v-select
              :disabled="!filter.faculty_id"
              v-model="filter.bylaw_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.bylaws"
              class="w-100"
              :reduce="val => val.id"
              :placeholder="$t('Global.bylaw')"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"

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
        <b-col
            cols="6"
            md="4"
        >
          <v-select
              :disabled="!filter.bylaw_id"
              v-model="filter.program_id"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.programs"
              class="w-100"
              :reduce="val => val.id"
              :placeholder="$t('Global.program')"
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
        <b-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="filter.stage"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.stages"
            class="w-100"
            clearable
            label="name"
            :reduce="val => val.id"
            :placeholder="$t('Global.stage')"
          >
            <template
              slot="selected-option"
              slot-scope="option"
            >
              <span v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
              </span>
              <span v-else>
                {{ option.name +' ( '+ option.code +' )' || option.name_local }}
              </span>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name +' ( '+ option.code +' )' }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>

          </v-select>
        </b-col>
        <b-col
            cols="6"
            md="4"
        >
          <v-select
              v-model="filter.level_id"
              :disabled="!filter.bylaw_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.levels"
              class="w-100"
              :reduce="val => val.id"
              :placeholder="$t('Global.level')"
          >
            <template v-slot:option="option">
<!--              {{ $i18n.locale == "ar" ? option.name_local : option.name }}-->
              {{ option.level_number }}
            </template>
            <template #selected-option="{ name, name_local,level_number }">
              <div style="display: flex; align-items: baseline">
<!--                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>-->
<!--                <strong v-else>{{ name }} </strong>-->
                <strong>{{ level_number }}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col
            cols="6"
            md="4"
            class="mt-1"
        >
          <v-select
              v-model="filter.status"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              class="w-100"
              :reduce="val => val.id"
              :placeholder="$t('Global.status')"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"

          />
        </b-col>
        <b-col
            cols="6"
            md="4"
            class="mt-1"
        >
          <v-select
              :disabled="!filter.faculty_id"
              v-model="filter.instructor_id"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.instructors"
              class="w-100"
              :reduce="val => val.id"
              :placeholder="$t('Advisor')"
          >
            <template v-slot:option="option">
              {{ getTranslatedName({name:option.name, name_local:option.name_local})}}
            </template>
            <template #selected-option="{name, name_local}">
              <div style="display: flex; align-items: baseline">
                <strong>{{ getTranslatedName({name: name, name_local: name_local})}}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table :busy="load"           @sort-changed="sortingChanged"
          no-local-sorting :items="items" responsive striped :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
          <template #head(code)="data">
            <div class="d-inline-flex align-items-center">
              <b-form-checkbox :disabled="!filter.faculty_id" v-b-tooltip.hover="filter.faculty_id ? '' : $t('Please Select Faculty To Assign Advisor')" @change="selectAllChanged" v-model="selectAll[$store.state.app.currentPaginationPage+'']" :value="true" style="margin-top: 6px" class="mt-0 custom-control-primary" />
              <span>{{ $t('Global.code') }}</span>
            </div>
          </template>
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle" />
            </div>
          </template>
          <!--     table columns     -->
          <template #cell(code)="data">
            <b-media v-if="data.item.user" vertical-align="center" class="d-inline-flex align-items-center">
              <template #aside>
                <b-form-checkbox v-if="hasPermission('add_advisedStudents')" :disabled="!filter.faculty_id" v-b-tooltip.hover="filter.faculty_id ? '' : $t('Please Select Faculty To Assign Advisor')" v-model="selected" style="margin-top: 6px" :value="data.item.user.id" class="d-flex align-items-center custom-control-primary" />
              </template>
              <span>
                {{ data.item.user.code}}
              </span>
            </b-media>
          </template>
          <template #cell(name)="data">
            <b-link class="font-weight-bold d-inline-block" :to="{ name: 'student-show', params: { id: data.item.user.id } }">
              {{ getTranslatedName({name:data.item.user.name, name_local:data.item.user.name_local})}}              </b-link>
          </template>
          <template #cell(stage)="data">
            <div v-if="data.item.stage">
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.stage.name_local }}
              </div>
              <div v-else>
                {{ data.item.stage.code }}
              </div>
            </div>
          </template>
          <template #cell(level)="data">
            <div v-if="data.item.level">
              <div v-if="data.item.program == 2">
                <div>
                  {{ $i18n.locale == 'ar' ? data.item.level.name_local : data.item.level.name }}
                </div>
              </div>
              <div v-else>
                <div>
                  {{ data.item.level.level_number }}
                </div>
              </div>
            </div>
          </template>
          
        <template #cell(program)="data">
          <span
            v-if="data.item.program"
            class=""
          >
            <span v-if="data.item && data.item.program && data.item.program.faculty && !faculty_id && !bylaw_id">
              <b-link
                :to="{name: 'faculty',params: { id: data.item.program.faculty.id }}"
                class="font-weight-bold"
              >
                {{ data.item && $i18n.locale == 'en' ? data.item.program.faculty.name || data.item.program.faculty.name_local : data.item.program.faculty.name_local || data.item.program.faculty.name }}
              </b-link>
            </span>
            <span
              v-if="data.item && data.item.program && data.item.program.faculty && !faculty_id && !bylaw_id"
              class="text-danger"
              style="margin: 0 4px !important;"
            >
              ,
            </span>
            <span v-if="data.item.program && data.item.program.bylaw && !bylaw_id">
              <b-link
                :to="{name: 'bylaw',params: { id: data.item.program.bylaw.id }}"
                class="font-weight-bold"
              >
                {{ data.item && $i18n.locale == 'en' ? data.item.program.bylaw.name || data.item.program.bylaw.name_local : data.item.program.bylaw.name_local || data.item.program.bylaw.name_ }}
              </b-link>
            </span>
            <span
              v-if="data.item && data.item.program && !bylaw_id"
              class="text-danger"
              style="margin: 0 4px !important;"
            >
              ,
            </span>
            <b-link
              :to="{name: 'program',params: { id: data.item.program.id }}"
              class="font-weight-bold"
            >
              {{ data.item && $i18n.locale == 'en' ? data.item.program.name || data.item.program.name_local : data.item.program.name_local || data.item.program.name_ }}
            </b-link>
          </span>
        </template>
        <template #cell(advisor)="data">
          <div v-if="data.item.advisor ">
            <b-link v-if="hasPermission('show_instructor')"  :to="{name: 'staff-show',params: { id: data.item.advisor.id }}"  class="font-weight-bold">
            {{ getTranslatedName({name:data.item.advisor.name, name_local:data.item.advisor.name_local})}}
            </b-link>
            <span v-else>
              {{ getTranslatedName({name:data.item.advisor.name, name_local:data.item.advisor.name_local})}}
            </span>
            <br/>
            {{data.item.advisor.email}}
          </div>
        </template>
          <template #cell(actions)="data">
            <div>
<!--              <a v-b-tooltip.hover="$t('Global.edit')" v-if="data.item.secret && hasPermission('edit_applicant')" :href="data.item.link" target="_blank">-->
<!--                <feather-icon icon="EditIcon" style="cursor: pointer" @click="$router.push({ name: 'bylaw_edit', params: { id: data.item.id } })" />-->
<!--              </a>-->
<!--              <a v-b-tooltip.hover="$t('Global.delete')">-->
<!--                <feather-icon v-if="hasPermission('delete_applicant')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="remove(data.item.id)" />-->
<!--              </a>-->
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
<!--        <b-button v-b-tooltip.hover="$t('Global.export_excel')" v-if="hasPermission('export_applicant')" class="btn-icon" variant="primary" @click="filter.export = 1">-->
<!--          <feather-icon icon="FileTextIcon" />-->
<!--        </b-button>-->
         <b-button v-b-tooltip.hover="$t('Global.export_excel')" class="btn-icon" :class="hasPermission('access_advisedStudents') ? 'mr-1' : ''" variant="primary" @click="filter.export = 1" v-if="hasPermission('access_advisedStudents')">
        <feather-icon icon="FileTextIcon" />
      </b-button>
        <b-button :disabled="!selected.length" v-if="hasPermission('add_advisedStudents')" @click="open()" v-b-tooltip.hover="$t('Assign Advisor')" variant="primary" class="btn-icon">
          <feather-icon icon="PlusIcon" />
           {{$t('Assign Advisor')}}
          <span
              style="background: gray;padding: 5px;border-radius: 10%"
              v-if="selected.length"
            >
            {{selected.length}}
          </span>
        </b-button>
      </template>
    </DataTable>
    <b-modal no-close-on-backdrop ref="my-modal" size="lg" v-model="selectAdvisorModel" hide-footer :title="$t('Assign Advisor')">
      <div class="demo-vertical-spacing">
        <b-form-group
            :label="$t('Assign Advisor To Selected Students')"
            label-for="mc-advisors"
        >
          <v-select
              id="mc-advisors"
              v-model="selectedAdvisor"
              :options="assignAdvisorsOptions"
              class="w-100"
              :reduce="val => val.id"
              clearable
              :filterable="true"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :filter="fuseSearch"
          >
            <template slot="no-options">
              <div v-if="loadingAssignAdvisorsOptions">
                {{ $t('Global.loading') }}
              </div>
              <div v-else>
                {{ $t('noMatching') }}
              </div>
            </template>
            <template
                slot="option"
                slot-scope="option"
            >
              <div>
                <span>
                  {{getTranslatedName({name:option.rank.name,name_local:option.rank.name_local})}}:
                  {{getTranslatedName({name:option.name,name_local:option.name_local})}}
                </span>
                 -
                <span>
                  {{getTranslatedName({name:option.department.name,name_local:option.department.name_local}).substring(0,40)}}
                </span>
                 -
                <b-badge
                    pill
                    class="float-right"
                >
                  {{$t('students count')}} : {{ option.students_count }}
                </b-badge>
              </div>
            </template>
            <template
                slot="selected-option"
                slot-scope="option"
            >
              <div>
                <span>
                  {{getTranslatedName({name:option.rank.name,name_local:option.rank.name_local})}}:
                  {{getTranslatedName({name:option.name,name_local:option.name_local})}}
                </span>
                -
                <span>
                  {{getTranslatedName({name:option.department.name,name_local:option.department.name_local})}}
                </span>
                -
                <b-badge
                    pill
                >
                  {{$t('students count')}}{{ option.students_count }}
                </b-badge>
              </div>
            </template>
          </v-select>
        </b-form-group>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button :disabled="!selectedAdvisor" type="submit" variant="primary" class="mr-1" @click="assignAdvisorAction">
              {{ $t('Global.save') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="hideModal">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BForm, BButton, BTable, BFormCheckbox, BFormCheckboxGroup, BMedia, BAvatar, BLink, BBadge, BDropdown, BSpinner, BFormTextarea, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BFormGroup, BModal, VBModal, BPopover } from 'bootstrap-vue';
import { mapGetters, mapActions } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { avatarText } from '@core/utils/filter';
import DataTable from '@/views/components/table/DataTable';
import Statistics from '@/views/components/info/statistics';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import academicAdvisors from "@/api/study/academic_advisors/academic_advisors";

const advisorRequest = new academicAdvisors();

export default {
  components: {
    Statistics,
    DataTable,
    BCard,
    vSelect,
    BRow,
    BForm,
    BFormTextarea,
    BSpinner,
    BFormGroup,
    BCol,
    BOverlay,
    BCardHeader,
    BFormCheckbox,
    BFormCheckboxGroup,
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
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      items: null,
      total: null,
      lookups: null,
      load: false,
      paramsLoaded: true,
      filter: {export:0, term_id:null, faculty_id:null, bylaw_id:null, program_id:null, level_id:null, instructor_id:null, status:null },
      selectAll: { '1':false },
      selected: [],
      selectAdvisorModel: false,
      statusOptions:[
        {id:2,name:'Advisor Unassigned',name_local:"بدون مرشد اكاديمى"},
        {id:1,name:'Advisor Assigned',name_local:"يمتلك مرشد اكاديمى"}
      ],
      selectedAdvisor: null,
      assignAdvisorsOptions: [],
      loadingAssignAdvisorsOptions: false,
      loadingSaveBulk: false
    };
  },
  computed: {
    fields() {
      const fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
          thStyle: { width: '10%' },
        },
        {
          key: 'name',
          sortable: true,
          label: this.$t('Global.name'),
        },
        {
          key: 'stage',
          label: this.$t('Global.stage'),
          sortable: false,
          thStyle: { width: '5%' },
        },
        {
          key: 'level',
          label: this.$t('Global.level'),
          sortable: false,
          thStyle: { width: '5%' },
        },       
        {
          key: 'program',
          label: this.$t('Global.program'),
        },
        {
          key: 'advisor',
          label: this.$t('advisor'),
        },
        // {
        //   key: 'actions',
        //   label: this.$t('Global.actions'),
        //   thClass: 'customAction',
        //   tdClass: 'customWidth',
        // },
      ];
      return fields;
    },
  },
  mounted() {
    if (this.$store.getters['app/filter']) this.filter = this.$store.getters['app/filter'];
  },
  methods: {
    ...mapActions({
      getAdvisingStudents: "academicAdvisors/advisedStudents",
      exportExcel: 'academicAdvisors/export',
    }),
    assignAdvisorAction(state) {
      if(this.selectedAdvisor){
        this.bulk();
      }
    },
    open() {
      this.fetchAssignAdvisors();
      this.selectAdvisorModel = true;
    },
    refresh(query) {
      // if (this.filter) {
      //   query = { ...query, ...this.filter}
      // }
      this.load = true;
      this.getAdvisingStudents(query).then(data => {
        this.items = data.data
        this.total = data.meta.count
        this.lookups = data.meta.lookup
        this.load = false

        this.paramsLoaded = false;
      });
    },
    hideModal() {
      this.selectAdvisorModel = false;
    },
    showModal() {
      this.selectAdvisorModel = true;
    },
    bulk() {
      this.loadingSaveBulk = true;
      let payload={
        selected_students:this.selected,
        selected_advisor_id:this.selectedAdvisor
      };
      advisorRequest.bulkAssignStudentsAdvisor(payload)
        .then(response => {
          this.selected = [];
          this.refresh();
          this.hideModal();
          this.$swal({
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            title: `${this.$t('Global.saved')}`,
          });
        }).catch(err => {
        }).finally(()=>{
          this.loadingSaveBulk = false;
        });
    },
    Export(query) {
      this.exportExcel({ ...query, language: this.$i18n.locale });
      this.filter.export = 0;
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
    fetchAssignAdvisorsSearch(search){
      if(search.length < 3) return;
      this.loadingAssignAdvisorsOptions = true;
      advisorRequest.searchInAdvisors({keywords:search})
          .then(response => {
            this.assignAdvisorsOptions = response.data;
          }).finally(() => {
            this.loadingAssignAdvisorsOptions = false;
          });
    },
    fetchAssignAdvisors(){
      this.assignAdvisorsOptions = [];
      this.selectedAdvisor = null;
      this.loadingAssignAdvisorsOptions = true;
      advisorRequest.findAdvisorsByFaculty({faculty_id: this.filter.faculty_id})
          .then(response => {
            this.assignAdvisorsOptions = response.data;
          }).finally(() => {
            this.loadingAssignAdvisorsOptions = false;
          });
    },
   
    selectAllChanged(){
      let filteredItems = this.items;
      let mappedItems = filteredItems.map(item => item.id);
      if (this.selectAll[this.$store.state.app.currentPaginationPage+''] == true) {
        this.selected = [...this.selected,...mappedItems];
      } else {
        this.selected = this.selected.filter(
          (x) => !mappedItems.find((x2) => x === x2)
        );
      }
    },
    checkAllItemsSelected(){
      let selectAllNewValue = true;
      this.items.forEach((item,key)=>{
        if (!this.selected.find((id) => item.id == id)){
          selectAllNewValue = false;
          return;
        }
      });
      this.selectAll[this.$store.state.app.currentPaginationPage+''] = selectAllNewValue;
    }
  },
  watch: {
    'filter.faculty_id'(){
      this.selectAll = {};
      this.selected = [];
    },

    'filter.bylaw_id'(){
      this.filter.level_id = null;
    },
    
    selected(){
      // check if all list items is selected or not
      this.checkAllItemsSelected();
    }
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
