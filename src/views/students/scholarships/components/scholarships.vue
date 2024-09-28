<template>
  <DataTable
    :title="title"
    :total="total"
    :allowSearch="true"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
    :paramsLoaded="paramsLoaded"
  >


    <template #filter v-if="lookups">
      
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.faculty_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.faculties"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculties')"
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
        <b-col cols="6" md="4">
          <b-overlay :show="load" style="width: 100% !important">
              <v-select
                v-model="filter.bylaw_id"
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.bylaws"
                :disabled="filter.faculty_id == null"
                :label="getSelectLabel()"
                class="w-100 mb-2"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.bylaws')"
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
          </b-overlay>
        </b-col>
        <b-col cols="6" md="4">
          <b-overlay :show="load" style="width: 100% !important">
            <v-select
              v-model="filter.program_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.programs"
              :disabled="filter.bylaw_id == null"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.programs')"
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
          </b-overlay>
        </b-col>
        <b-col cols="6" md="4">
          
          <v-select
            v-model="filter.scholarship_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.scholarship_id"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.scholarship')"
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
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.year_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.year_id"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.year')"
          >
            <template v-slot:option="option">
                {{  option.start_year && option.end_year ? option.start_year +' / ' + option.end_year : ''}}
            </template>
            <template #selected-option="{ start_year , end_year}">
              <strong>
                {{  start_year && end_year ? start_year +' / ' + end_year : '' }}
              </strong>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.by_someone"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.by_someone"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('By Someone')"
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
    </template>
    <template #customTable>
      <b-table
        :sort-desc.sync="filter.order_direction"
        :sort-by.sync="filter.order_by"
        class="position-relative"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(student_name)="data">
          <b-link
            :to="{ name: data.item.user_type == 4 ? 'applicant' : 'student-show', params: data.item.user_type == 4 ? { id: data.item.applicant_id } : { id: data.item.student_id }  }"
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.student_name : "_" }}
          </b-link>
          <b-link
            :to="{ name: data.item.user_type == 4 ? 'applicant' : 'student-show', params: data.item.user_type == 4 ? { id: data.item.applicant_id } : { id: data.item.student_id } }"
            v-if="$i18n.locale == 'ar'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.student_name_local : "_" }}
          </b-link>
        </template>
        <template #cell(name)="data">
            <div v-if="$i18n.locale == 'ar'">
              {{ data.item ? data.item.name_local : "_" }}
            </div>
            <div v-else>
              {{ data.item ? data.item.name : "_" }}
            </div>
        </template>
        <template #cell(by_someone)="data">
            <div v-if="$i18n.locale == 'ar'">
              <div v-if="data.item">
                {{ data.item.by_someone == 1 ? "نعم" : "لا" }}
              </div>
            </div>
            <div v-else>
              <div v-if="data.item">
                {{ data.item.by_someone == 1 ? "Yes" :  "No" }}
              </div>
            </div>
        </template>
      </b-table>
    </template>
    <template #action>
      <b-button
        v-b-tooltip.hover="$t('Global.export_excel')"
        class="btn-icon mr-1"
        variant="primary"
        :disabled="load"
        @click="exportDataExcel()"
      >
        <feather-icon icon="FileTextIcon" />
      </b-button>
    </template>
  </DataTable>
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
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import faculty from '@/api/academic_settings/faculities/faculty';

export default {
  name: "scholarships",
  components: {
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
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      filter: { 
        scholarship_id: null, 
        year_id: null, 
        by_someone: null, 
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
      },
      exportQuery: null,
      paramsLoaded: true,
    };
  },
  watch:{
    'filter.faculty_id'(){
      this.filter.bylaw_id = null
      this.filter.program_id = null
    },
    'filter.bylaw_id'(){
      this.filter.program_id = null
    }
  },
  computed: {
    ...mapGetters({
      items: "scholarships/items",
      total: "scholarships/total",
      load: "scholarships/load",
      lookups: "scholarships/lookups",
    }),
    lang(){
      return this.$i18n.locale == 'ar' ? 'ar' : 'en';
    },
    fields: function () {
      return [
        {
          key: "student_code",
          label: this.$t("student_code"),
          sortable: true,
        },
        {
          key: "student_name",
          label: this.$t("student"),
          sortable: true,
        },
        {
          key: "name",
          label: this.$t("scholarship"),
          sortable: true,
        },
        {
          key: "percentage_administrative",
          label: this.$t("Percentage Administrative"),
          sortable: true,
        },
        {
          key: "percentage_other_fees",
          label: this.$t("Percentage Other Fees"),
          sortable: true,
        },
        {
          key: "by_someone",
          label: this.$t("By Someone"),
          sortable: true,
        },
      ];
    },
  },
  methods: {
    refresh(query) {
      this.exportQuery = query;
      this.$store.dispatch("scholarships/scholarships", { query: query }).then((data) => {
        this.paramsLoaded = false;
      });
    },
    reset(){
      this.filter= { scholarship_id: null, year_id: null, by_someone: null }
    },
    remove(id){
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
          this.$store.dispatch('scholarships/remove', id).then(_ => {
                  this.refresh()
                  this.$swal({
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false,
                      title: this.$t('Global.deleted'),
                  })
              })
          }
      })
    },
    exportDataExcel(lang,type){
      let query = this.exportQuery;
      query.lang = this.lang
      this.$store.dispatch('scholarships/exportDataExcel', { 
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
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
