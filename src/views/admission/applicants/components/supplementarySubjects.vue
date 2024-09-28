<template>
  <div>
    <div class="my-1 d-flex justify-content-end">
      <b-button v-if="hasPermission('add_applicant')" @click="openDialog(null)" v-b-tooltip.hover="$t('Global.add')" variant="primary" class="mr-1 btn-icon">
        <feather-icon icon="PlusIcon" />
      </b-button>
    </div>
    <b-table :items="tempData" :fields="fields" striped responsive class="position-relative" primary-key="id" show-empty :empty-text="$t('Global.empty_text')" :per-page="perPage" :current-page="currentPage">
      <template #cell(document)="row">
        <b-link :to="document || ''" class="font-weight-bold">
          {{ row.item.document || '-' }}
        </b-link>
      </template>
      <template #cell(name)="row">
        <span class="font-weight-bold d-block text-nowrap">
          {{ $i18n.locale == 'en' ? row.item.name : row.item.name_local }}
        </span>
      </template>
      <template #cell(status)="row">
        <!-- <b-button size="sm" @click="changeStatus(row.item)" v-b-tooltip.hover="$t('Global.add')" :variant="!row.item.status ? 'success' : 'danger'" class="btn-icon">
            {{!row.item.status ? $t('Global.approve') : $t('Global.reject')}}
            </b-button> -->
        <b-badge :variant="!row.item.status ? 'success' : 'danger'">
          {{ !row.item.status ? $t('Global.approve') : $t('Global.reject') }}
        </b-badge>
      </template>
      <template #cell(actions)="row">
        <div class="align-items-center">
          <feather-icon @click="openDialog(row.item)" v-b-tooltip.hover="$t('Global.edit')" class="pointer text-primary" icon="EditIcon" />
          <feather-icon @click="remove(row.item.id)" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" />
        </div>
      </template>
    </b-table>
    <b-col cols="12">
      <div class="mx-2 mb-2">
        <b-row>
          <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-start">
            <div class="mx-1">
              <label>{{ $t('Global.Showing') }}</label>
              <v-select :searchable="false" v-model="perPage" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="pageOptions" :clearable="false" class="per-page-selector d-inline-block mx-50 pointer" /> <label>{{ $t('Global.entries') }} </label>
              <label class="mx-05"
                >{{ $t('Global.from') }} {{ meta.from + 1 }}
                {{ $t('Global.to') }}
                {{ perPage >= meta.of ? meta.of.toString().replace(/^0+/, '') : meta.to.toString().replace(/^0+/, '') }}
                {{ $t('Global.of') }} {{ meta.of }}
              </label>
            </div>
            <div></div>
          </b-col>
          <!-- Pagination -->
          <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-end">
            <b-pagination v-if="data" :total-rows="data.length" v-model="currentPage" :per-page="perPage" first-number last-number class="mb-0 mt-1 mt-sm-0" prev-class="prev-item" next-class="next-item">
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-col>

    <b-modal no-close-on-backdrop ref="my-modal" v-model="dialog" hide-footer :title="$t('Global.supplementary_subjects')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="ruleForm">
          <b-form>
            <b-col md="12">
              <b-form-group label="subject">
                <validation-provider #default="{ errors }" :rules="validation(null, 0).rule" name="subject">
                  <v-select v-model="ruleForm.subject_id" :class="errors.length > 0 ? 'custom_invalid' : ''" multiple :label="$t('Global.subject_id')" :reduce="val => val.id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="supplementary_subjects" :clearable="false">
                    <template slot="selected-option" slot-scope="option">
                      <strong v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </strong>
                      <strong v-else>
                        {{ option.name || option.name_local }}
                      </strong>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group class="left_right" :label="$t('Global.Subject Document')">
                <validation-provider #default="{ errors }">
                  <b-form-file accept=".jpg, .jpeg, .png, .pdf" v-model="ruleForm.file" :placeholder="$t('Global.upload_file')" :drop-placeholder="$t('Global.upload_file')" />
                  <ValidationErrors :default-message="true" :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'file')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group label="status">
                <validation-provider #default="{ errors }" :rules="validation(null, 0).rule" name="status">
                  <v-select v-model="ruleForm.status_id" :class="errors.length > 0 ? 'custom_invalid' : ''" multiple :label="$t('Global.status')" :reduce="val => val.id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="statusOptions" :clearable="false">
                    <template slot="selected-option" slot-scope="option">
                      <strong v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </strong>
                      <strong v-else>
                        {{ option.name || option.name_local }}
                      </strong>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="save()">
              {{ $t('Global.send') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="dialog = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormFile,
  BFormInput,
  BForm,
  BButton,
  BTable,
  BFormCheckbox,
  BFormCheckboxGroup,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BSpinner,
  BFormTextarea,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BFormGroup,
  BModal,
  VBModal,
  BPopover,
} from 'bootstrap-vue';
import { mapGetters, mapActions } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { avatarText } from '@core/utils/filter';
import DataTable from '@/views/components/table/DataTable';
import Statistics from '@/views/components/info/statistics';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  props: { data: Array },
  components: {
    Statistics,
    ValidationErrors,
    DataTable,
    BCard,
    BFormFile,
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
      dialog: false,
      link: '',
      perPage: 10,
      pageOptions: [5, 10, 20, 25, 50, 100],
      totalRows: 1,
      statusOptions: [
        { id: 1, name: 'Approve', name_local: 'موافقة' },
        { id: 2, name: 'reject', name_local: 'رفض' },
      ],
      currentPage: 1,
      ruleForm: {
        file: null,
        subject_id: null,
        status_id: null,
      },
      tempData: [
        { id: 1, name: 'arabic',document: '/google', status: 1 },
        { id: 1, name: 'math',document: null, status: 2 },
      ],
      filter: { removed: 0, status: null, export: 0, admission_term_id: this.currentAdmissionTerm || null, pre_university_certificate_groupe: null, faculty_reference_id: null, year: null, country_id: null, pre_university_certificate_type: null, pre_university_certificate: null },
      enterFilter: {},
      selectAll: false,
      status_form: { type: null, message: null },
      selected: [],
      statusModal: false,
      pre_university_certificate_groupe: null,
      pre_university_certificate: null,
      pre_university_certificate_type: null,
      pre_university_certificate_types: [],
      appLookups: null,
      baseURL: process.env.VUE_APP_WEB_BASE_URL,
      baseURLPRODUCTION: process.env.VUE_APP_WEB_BASE_URL_PRODACTION,
      paramsLoaded: true,
      lookupModules: {
        countries: true,
        pre_certificates: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: 'applicants/items',
      total: 'applicants/total',
      load: 'applicants/load',
      lookups: 'applicants/lookups',
      details: 'applicants/details',
      currentAdmissionTerm: 'app/currentAdmissionTerm',
    }),
    meta() {
      return {
        from: this.perPage * (this.currentPage - 1),
        to: this.perPage * (this.currentPage - 1) + this.perPage,
        of: this.data ? this.data.length : '',
      };
    },
    status() {
      return [
        { id: 1, name: this.$t('Global.reset') },
        { id: 2, name: this.$t('Global.on_hold') },
        { id: 3, name: this.$t('Global.feedback') },
      ];
    },
    admission_years() {
      let current_year = new Date().getFullYear();
      let pre_year = Number(current_year) - 1;
      return [
        { id: current_year, name: current_year },
        { id: pre_year, name: pre_year },
      ];
    },
    certificate_sections() {
      if (this.appLookups && this.appLookups.certificates) {
        return this.appLookups.certificates;
      }
      return false;
    },
    certificates() {
      if (this.appLookups && this.appLookups.certificates && this.filter.pre_university_certificate_groupe) {
        this.certificatesArray = this.appLookups.certificates.find(el => el.id == this.filter.pre_university_certificate_groupe);
        return this.certificatesArray ? this.certificatesArray.pre_university_certificate : [];
      }
    },
    certificate_types() {
      if (this.appLookups && this.appLookups.certificates && this.filter.pre_university_certificate && this.certificatesArray) {
        const certificateTypeArray = this.certificates ? this.certificates.find(el => el.id == this.filter.pre_university_certificate) : {};
        return certificateTypeArray ? certificateTypeArray.pre_university_certificate_type : [];
      }
    },
    fields() {
      const fields = [
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
          thStyle: { width: '20%' },
        },
        {
          key: 'document',
          label: this.$t('Global.Subject Document'),
          sortable: true,
        },
        {
          label: this.$t('Global.status'),
          key: 'status',
          sortable: true,
        },

        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      return fields;
    },
  },
  beforeMount() {
    this.filter = { removed: 0, status: null, export: 0, admission_term_id: this.currentAdmissionTerm || null, pre_university_certificate_groupe: null, faculty_reference_id: null, year: null, country_id: null, pre_university_certificate_type: null, pre_university_certificate: null };
  },
  mounted() {
    if (this.$store.getters['app/filter']) this.filter = this.$store.getters['app/filter'];
  },
  methods: {
    ...mapActions({
      removeSubject: 'applicants/removeSubject',
      exportExcel: 'applicants/export',
      getLookups: 'app/GET_LOOKUPS',
    }),

    openDialog(item) {
      if (item) {
        this.id = item.id;
        this.ruleForm.subject_id = item.subject_id || null;
        this.ruleForm.status_id = item.status_id || null;
        this.ruleForm.file = item.file || null;
      } else {
        this.id = null;
      }
      this.dialog = true;
    },
    changeStatus(state) {
      this.status_form = {};
      this.status_form.type = state.id;
      if (state.id == 3 || state.id == 2) {
        this.statusModal = true;
      } else {
        this.bulk();
      }
    },
    setFilter() {
      if ((this.enterFilter.from && this.enterFilter.to) || (!this.enterFilter.from && !this.enterFilter.to)) {
        if (Number(this.enterFilter.from) > Number(this.enterFilter.to)) {
          this.enterFilter.to = null;
        } else {
          this.filter.from = Number(this.enterFilter.from);
          this.filter.to = Number(this.enterFilter.to);
          let query = this.clean(this.filter);
          this.refresh(query);
        }
      }
    },
    getLink(item) {
      if (item.admission_type && item.admission_type.id >= 4) {
        let text = item.link;
        let link = text.replace('admissionForm', 'admissionForm');
        if(this.$store.state.appConfig.layout.isRTL){
          link = text.replace('/en', '/ar');
        }
        return link;
      } else {
        let text = item.link;
        if(this.$store.state.appConfig.layout.isRTL){
          text = text.replace('/en', '/ar');
        }
        if(item && item.status && item.status.key == 'SUBMITTED'){
          return text+'?staff='+Date.now();
        }else{
          return text;
        }
      }
    },
    getSelectLabel() {
      return this.$i18n.locale == 'en' ? 'name' : 'name_local';
    },
    save() {
      this.$refs.ruleForm.validate().then(success => {
        if (success) {
          const formData = new FormData();
          if (this.ruleForm.subject_id) formData.append('subject_id', this.ruleForm.subject_id);
          if (this.ruleForm.status_id) formData.append('status_id', this.ruleForm.status_id);
          if (this.ruleForm.file) formData.append('file', this.ruleForm.file);
          formData.append('_method', 'PUT');
          const payload = {};
          if (this.id) {
            payload = { id: this.id, query: formData };
          } else {
            payload = { id: null, query: formData };
          }
          this.$store
            .dispatch('settings/supplementarySubjectsSave', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                text: `${this.$t('Global.successMessage')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$emit('refresh');
            })
            .catch(error => {
              //   const errors = [error.response.data.errors];
              //   errors.forEach((error) => {
              //     this.errorsdata = error;
              //   });
            });
        }
      });
    },
    refresh(query) {
      if (this.appLookups) {
        query = { ...query, type: this.type };
        let payload = {
          query: query,
        };
        this.$store.dispatch('applicants/applicants', { payload }).then(_ => {
          this.paramsLoaded = false;
        });
      } else {
        this.getLookups(this.lookupModules).then(data => {
          this.appLookups = data.success;
          query = { ...query, type: this.type };
          let payload = {
            query: query,
          };
          this.$store.dispatch('applicants/applicants', { payload }).then(_ => {
            this.paramsLoaded = false;
          });
        });
      }
    },

    hideModal() {
      this.statusModal = false;
    },
    showModal() {
      this.statusModal = true;
    },

    remove(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.removeSubject(id).then(_ => {
            this.$emit('refresh');
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    },
    bulk() {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.ok')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.$store
            .dispatch('applicants/bulkChangeStatus', {
              ...this.status_form,
              applicant_ids: this.selected,
            })
            .then(_ => {
              this.selected = [];
              this.selectAll = false;
              this.refresh();
              this.hideModal();
              this.$swal({
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                title: `${this.$t('Global.saved')}`,
              });
            });
        }
      });
    },

    upload(e) {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      this.$store.dispatch('applicants/upload', { resource: data }).then(_ => {
        this.refresh();
      });
    },

    Export(query) {
      this.exportExcel({ ...query, language: this.$i18n.locale });
      this.filter.export = 0;
    },
  },
  watch: {
    selectAll(val) {
      if (val) {
        let filteredItems = this.items.filter(item => item.status.id != 11);
        let mappedItems = filteredItems.map(item => item.id);
        this.selected = mappedItems;
      } else {
        this.selected = [];
      }
    },
    'enterFilter.from'(val, old) {
      if (!val) {
        this.enterFilter.to = null;
      }
      if (val > 100) {
        this.enterFilter.from = null;
      }
    },
    'enterFilter.to'(val) {
      if (val > 100) {
        this.enterFilter.to = null;
      }
    },
    'filter.pre_university_certificate_groupe': function (newVal, oldVal) {
      if (oldVal) {
        this.pre_university_certificate = null;
        this.pre_university_certificate_type = null;
      }
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
