<template>
  <div>
    <DataTable
      :total="total"
      :allow-search="true"
      :filter="filter"
      :params-loaded="paramsLoaded"
      @reset="reset"
      @Refresh="refresh"
    >
      <template #action>
       <!-- <b-button
          v-b-tooltip.hover="$t('Global.export_excel')"
          class="btn-icon"
          variant="primary"
          @click="Export(filter)"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button> -->
        <b-button
          v-b-tooltip.hover="$t('Global.print')"
          class="btn-icon"
          variant="primary"
          @click="print(filter)"
        >
          <feather-icon icon="PrinterIcon" />
        </b-button>
      </template>

      <template v-if="lookups" #filter>
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
        <b-col cols="6" md="4">
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
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :busy="load"
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          :items="items"
          :fields="fields"
          responsive
          striped
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle" />
            </div>
          </template>
          <template #cell(name)="data">
            <div>
              {{ data.item.name ? ($i18n.locale == 'ar' ? data.item.name_local : data.item.name ) : '_' }}
            </div>
          </template>
          <template #cell(pre_university_certificate)="data">
            <div>
              {{ data.item.pre_university_certificate ? ($i18n.locale == 'ar' ? data.item.pre_university_certificate.name_local : data.item.pre_university_certificate.name ) : '_' }}
            </div>
          </template>
          <template #cell(birth_country)="data">
            <div>
              {{ data.item.birth_country ? ($i18n.locale == 'ar' ? data.item.birth_country.name_local : data.item.birth_country.name ) : '_' }}
            </div>
          </template>
          <template #cell(user)="data">
            <div>
              {{ data.item.user ? ($i18n.locale == 'ar' ? data.item.user.national_num : data.item.user.national_num ) : '_' }}
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
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
  BSpinner,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import { getToken } from "@/utils/auth";

export default {
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BSpinner,
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
      filter:{
        term_id: null,
        faculty_id: null
      },
      paramsLoaded: true,

    };
  },
  props:{
    type: Number
  },
  computed: {
    ...mapGetters({
      items: "equivalentReport/items",
      total: "equivalentReport/total",
      load: "equivalentReport/load",
      lookups: "equivalentReport/lookups",
      needDrop:'app/needDrop',
    }),
    fields() {
      let fields = [
        {
          key: "name",
          label: this.$t("Global.name"),
          sortable: false,
        },
        {
          key: "pre_university_certificate",
          label: this.$t("Global.qualification"),
          sortable: false,
        },
        {
          key: "birth_country",
          label: this.$t("Global.nationality"),
          sortable: false,
        },
        {
          key: "total_marks",
          label: this.$t("Global.total_degree"),
          sortable: false,
        },
        {
          key: "certificate_degree",
          label: this.$t("Global.percentage"),
          sortable: false,
        },
        {
          key: "qualification_date",
          label: this.$t("Global.qualification_date"),
          sortable: false,
        },
        {
          key: "user",
          label: this.$t("Global.nationalId"),
          sortable: false,
        },
      ];
      return fields;
    },
  },
  watch: {
     'type'(newVal){
        this.filter = {
          term_id: null,
          faculty_id: null
        }
        this.refresh()
     }
  },
  methods: {
    ...mapActions({
      exportExcel: "equivalentReport/export",
      getTerms: "app/getTerms"
    }),
    refresh(query){
      this.getTerms().then(_=>{
        this.filter.term_id = this.currentAdmissionTerm
        this.$store.dispatch('equivalentReport/equivalents', {type: this.type  , query: query}).then(_=>{
        })
      })
    },
    reset(){
      this.filter = {
        term_id: null,
        faculty_id: null
      }
    },
    Export(query){
      this.$store.dispatch("equivalentReport/export", {type: this.type  , query: query})
      .then((response) => {
        this.$swal({
          icon: "success",
          title: `${this.$t("Done")}`,
          showConfirmButton: false,
          timer: 1500,
        });
          this.refresh();
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
    },
    print(query){
      this.$store.dispatch("equivalentReport/print", {type: this.type  , query: query})
      .then((response) => {
        this.$swal({
          icon: "success",
          title: `${this.$t("Done")}`,
          showConfirmButton: false,
          timer: 1500,
        });
          this.refresh();
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
  }
 
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
