<template>
  <div>
    <edit :inline="true" v-if="params.status == 1 || params.status == 2" :params="params" @hide="hide()"></edit>
    <DataTable v-else importBtn apiLink="bylaws" :title="title" :tabNum="tabNum" :total="total" :allowSearch="true" :filter="filter" :loading="load['bylaws']" @Refresh="refresh" @reset="reset" @Export="Export" exportPermission="export_bylaw">
      <template #filter v-if="lookups['bylaws']">
        <b-col cols="12" md="3" v-if="!noFaculty">
          <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.faculty_id" :options="lookups['bylaws'] && lookups['bylaws'].faculties" label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.faculty')">
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
        </b-col>
        <b-col cols="12" md="3">
          <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.stage_id" :options="lookups['bylaws'] && lookups['bylaws'].stages" class="w-100" clearable label="name" :reduce="val => val.id" :placeholder="$t('Global.stage')">
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + ' )' }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="3">
          <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.type_id" :options="lookups['bylaws'] && lookups['bylaws'].types" class="w-100" clearable label="name" :reduce="val => val.id" :placeholder="$t('Global.type')">
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + ' )' }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="3" v-if="hasPermission('restore_bylaw') || hasPermission('delete_bylaw')">
          <v-select v-model="filter.removed" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="getStatusList(true)" class="w-100" :reduce="val => val.value" :placeholder="$t('Global.status')">
            <template slot="selected-option" slot-scope="option">
              <strong>
                {{ $t(`Global.${option.label}`) }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $t(`Global.${option.label}`) }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table @sort-changed="sortingChanged"
          no-local-sorting :items="items" responsive striped :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
          <template #cell(name)="data">
            <!-- @click.native="setMoreDetails({link:'/faculties'+data.item.faculty.id,id:data.item.faculty.id,name:data.item.faculty.name,name_local:data.item.faculty.name_local})" -->
            <b-link v-if="$i18n.locale == 'en' && data.item && data.item.id" :to="{ name: 'bylaw', params: { id: data.item.id } }" class="font-weight-bold d-block">
              {{ data.item ? (data.item.name ? data.item.name : data.item.name_local) : '_' }}
            </b-link>
            <b-link :to="{ name: 'bylaw', params: { id: data.item.id } }" v-if="$i18n.locale == 'ar' && data.item && data.item.id">
              {{ data.item ? (data.item.name_local ? shortMyText(data.item.name_local) : data.item.name) : '_' }}
            </b-link>
          </template>
          <template #cell(faculty)="data">
            <b-link v-if="$i18n.locale == 'en' && data.item.faculty && data.item.faculty.id" class="font-weight-bold" :to="{ name: 'faculty', params: { id: data.item.faculty.id } }">
              {{ data.item ? (data.item.faculty.name ? data.item.faculty.name : data.item.faculty.name_local) : '_' }}
            </b-link>
            <b-link v-if="$i18n.locale == 'ar' && data.item.faculty && data.item.faculty.id" class="font-weight-bold" :to="{ name: 'faculty', params: { id: data.item.faculty.id } }">
              {{ data.item ? (data.item.faculty.name_local ? data.item.faculty.name_local : data.item.faculty.name) : '_' }}
            </b-link>
            <small class="text-muted">{{ data.item && data.item.faculty && data.item.faculty.code }}</small>
          </template>
          <template #cell(stage_id)="data">
            <div v-if="data.item.stage">
              <span v-if="$i18n.locale == 'en'">
                {{ data.item.stage.code }}
              </span>
              <span v-else>
                {{ data.item.stage.name_local }}
              </span>
            </div>
          </template>
          <template #cell(type_id)="data">
            <div v-if="data.item.type">
              <span v-if="$i18n.locale == 'en'">
                {{ data.item.type.code }}
              </span>
              <span v-else>
                {{ data.item.type.name_local }}
              </span>
            </div>
          </template>
          <template #cell(status)="data">
            <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
              {{ getStatus(data.item.removed).name }}
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <div>
              <b-link :to="{ name: 'bylaw', params: { id: data.item.id }, query: { inline: true } }">
                <feather-icon v-if="hasPermission('edit_bylaw')" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer" />
              </b-link>
              <feather-icon v-if="hasPermission('delete_bylaw') && data.item.current_students_count == 0 && data.item.graduated_students_count == 0" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer; margin-top: 4.5px" class="text-danger" @click="remove(data.item.id)" />
              <!-- <feather-icon :class="loading_pdf ?'disabled_all':''" icon="LayoutIcon" class="text-primary" v-b-tooltip.hover="$t('Global.export')" @click="loading_pdf ? '':bylawPdf(data.item)" style="cursor: pointer; margin-top: 4.5px" /> -->
              <unicon v-b-tooltip.hover="$t('Global.export')" @click="loading_pdf ? '' : bylawPdf(data.item)" :class="loading_pdf ? 'disabled_all' : ''" name="file-export" fill="royalblue"></unicon>
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
            </div>

          </template>
        </b-table>
      </template>
      <template #action>
        <b-button v-if="faculty_id && inline && hasPermission('add_bylaw')" :to="{ name: 'bylaw_add', params: { faculty_id: faculty_id } }" v-b-tooltip.hover="$t('Global.add')" variant="primary" class="btn-icon">
          <feather-icon icon="PlusIcon" />
        </b-button>
        <b-button v-else-if="hasPermission('add_bylaw')" :to="{ name: 'bylaw_add' }" v-b-tooltip.hover="$t('Global.add')" variant="primary" class="btn-icon mr-1">
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
    </DataTable>
    <Modal :hint="$t('Global.importMigrationData')" :link="'/bylaws/import-migrated-bylaws'" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>
  </div>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover, BFormFile,
  BAlert,
  BForm,BFormGroup } from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable.vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Edit from '@/views/academic_settings/bylaws/edit';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { required } from '@validations';
import {getToken} from "@/utils/auth";
import Modal from "@/views/components/common/Modal.vue"

export default {
  name: 'bylaws',
  components: {
    DataTable,
    Modal,
    BCard,
    vSelect,
    BRow,
    Edit,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BForm,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BButton,
    BFormFile,
    BFormGroup,
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
    BAlert,
    BPopover,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    excel_name: null,
    faculty_id: null,
    noFaculty: Boolean,
    inline: false,
    tabNum: null,
  },
  data() {
    return {
      filter: {
        export: 0,
        removed: 0,
        faculty_id: this.faculty_id ? this.faculty_id : null,
        type: null,
        stage: null,
      },
      loading_pdf: false,
      params: {},
      paramsLoaded: true,
      exportQuery: null,
    };
  },
  computed: {
    ...mapGetters({
      items: 'bylaws/items',
      total: 'bylaws/total',
      load: 'app/generalLoad',
      lookups: 'app/stateLookups',
      options: 'lookups/lookups',
      needDrop:'app/needDrop',
    }),
    fields() {
      let fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        // {
        //   key: 'start_year',
        //   label: this.$t('Global.year_start'),
        //   sortable: true,
        // },
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
          sortable: true,
        },
        {
          key: 'stage_id',
          label: this.$t('Global.stage'),
          sortable: true,
        },
        {
          key: 'type_id',
          label: this.$t('Global.type'),
          sortable: true,
        },
        // {
        //   key: 'courses_count',
        //   label: this.$t('Global.courses'),
        //   sortable: true,
        // },
        // {
        //   key: 'programs_count',
        //   label: this.$t('Global.programs'),
        //   sortable: true,
        // },
        // {
        //   key: 'students_count',
        //   label: this.$t('Global.students'),
        //   sortable: true,
        // },
        // {
        //   key: 'graduated_students_count',
        //   label: this.$t('Global.graduated_count'),
        //   sortable: true,
        // },
        // {
        //   key: 'current_students_count',
        //   label: this.$t('Global.current_count'),
        //   sortable: true,
        // },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      if (this.noFaculty) {
        return fields.filter(function (obj) {
          return !['faculty'].includes(obj.key);
        });
      } else {
        return fields;
      }
    },
    list() {
      return [
        { label: this.$t('Global.UNDERGRADUATE'), value: 1 },
        { label: this.$t('Global.POSTGRADUATE'), value: 2 },
      ];
    },
  },
  methods: {
    ...mapActions({
      exportExcel: 'bylaws/export',
      exportPdf: 'bylaws/exportpdf',
    }),
    hide(){
      this.params['status'] = 3
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
    saveBread(index) {
      //   this.updateFilterQueryParams({ bread: index });
    },
    open(id) {
      window.open(this.$router.resolve({ name: 'bylaw_edit', params: { id: id } }).href, '_blank');
    },
    refresh(query) {

      query = { ...query };
      this.exportQuery = query;
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      // let payload = {
      //     lookups: [
      //         {
      //             table: 'faculties',
      //             query: 'removed = 0',
      //         },
      //     ],
      //     lookup_from: 'bylaws'
      // };
      // if (this.faculty_id) {
      //     this.filter.faculty_id = this.faculty_id;
      // }
      // this.getLookups(payload);
      this.$store.dispatch('bylaws/bylaws', { query: query })
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
          this.$store.dispatch('bylaws/remove', id).then(_ => {
            this.refresh(this.filter);
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
    lang(){
      return this.$i18n.locale == 'ar' ? 'ar' : 'en';
    },
    exportDataExcel(lang,type){
      let query = this.exportQuery;
      query.lang = this.lang
      this.$store.dispatch('bylaws/exportDataExcel', {
        query: query
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        let message = this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
            showConfirmButton: false,
            timer: 1500,
          });
      });
    },
    Export(query) {
      query = { ...query, language: this.$i18n.locale, excel_name: this.excel_name };
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (query.is_pdf) {
        this.exportPdf(query);
      } else {
        this.exportExcel(query);
      }
      // this.filter.export = 0;
    },

    bylawPdf(item) {
      let payload = { id: item.id, name: `${item.faculty ? item.faculty.name : ''} - ${item.name}` };
      this.$toast(
        {
          component: ToastificationContent,
          props: {
            icon: 'FileTextIcon',
            text: this.$t('Global.exporting_in_progress'),
            variant: 'info',
          },
        },
        {
          position: 'top-center',
          timeout: false,
          closeOnClick: false,
          draggable: false,
        }
      );
      this.loading_pdf = true;
      this.exportPdf(payload).then(_ => {
        document.querySelector('.toastification-close-icon').click();
        this.loading_pdf = false;
      });
    },
  },
  mounted() {
    if (this.$route.query.bread == 'add') {
      this.params = { status: 1, faculty_id: this.faculty_id };
    }
  },
  watch: {
    // 'filter.faculty_id'(val){
    //  let query = {faculty_id:val,record:'brief'}
    //   this.$store.dispatch('bylaws/bylaws', { query: query })
    // },
    '$route.query.tabNum'() {
      this.params.status = 3;
    },
    '$route.query.bread'(val) {
      if (val == 'add') {
        this.params = { status: 1, faculty_id: this.faculty_id };
      }
    },
  },
};
</script>

<style lang="scss">
.unicon {
  align-items: center;
  cursor: pointer;
  svg {
    fill: #054978;
    width: 15px;
    height: 15px;
    margin-top: 4px;
  }
}
.Vue-Toastification__container.top-center .Vue-Toastification__toast.Vue-Toastification__toast--default .Vue-Toastification__toast-component-body{
  .toastification small.text-body{
    color: darkred !important
  }
}
</style>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

.tab-content.col {
  overflow: auto;
}
.toastification-close-icon{
  visibility: hidden !important
}
</style>
