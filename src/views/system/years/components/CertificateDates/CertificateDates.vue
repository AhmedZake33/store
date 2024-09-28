<template>
  <div>
    <DataTable
      :total="total"
      :title="$t('Certificate Dates Setting')"
      :allowSearch="false"
      :allowFilterWithoutSearch="true"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @reset="reset"
      :paramsLoaded="paramsLoaded"
    >
      <template #filter>
        <b-col cols="6" md="4">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
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
          <template #cell(faculty)="data">
            <div v-if="data.item.faculty">
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                :target="'_blank'"
                class="font-weight-bold d-block text-nowrap"
              >
                {{ data.item.faculty ? data.item.faculty.name : "_" }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                :target="'_blank'"
                class="font-weight-bold d-block text-nowrap"
              >
                {{ data.item.faculty ? data.item.faculty.name_local : "_" }}
              </b-link>
            </div>
          </template>
          <template #cell(certificate)="data">
            <div v-if="data.item.certificate">
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item ? data.item.certificate.name_local : "_" }}
              </div>
              <div v-else>
                {{ data.item ? data.item.certificate.name : "_" }}
              </div>
            </div>
          </template>
          <template #cell(semester)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
              :target="'_blank'"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.term ? data.item.term.name : "_" }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              :to="{ name: 'term', params: { id: data.item.term.id } }"
              :target="'_blank'"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.term ? data.item.term.name_local : "_" }}
            </b-link>
          </template>
          <template #cell(actions)="data">
            <div>
              <b-link>
                <feather-icon icon="EyeIcon" v-b-tooltip.hover="$t('show')" @click="openShowModal(data.item)"/>
              </b-link>
              <b-link>
                <feather-icon icon="EditIcon" v-b-tooltip.hover="$t('edit')" @click="openEditModal(data.item)"/>
              </b-link>
              <b-link @click="remove(data.item.id)">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.delete')"
                  icon="Trash2Icon"
                  class="text-danger"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
          @click="openAddModal()"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
    </DataTable>
    <div class="all-modals">
      <b-modal
        ref="certificatesDates_modal"
        size="lg"
        :title="modal_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
        v-model="modal"
      >
        <edit-certificate-dates
          v-if="editCertificateDatesFlag"
          :data="certificateDatesData"
          :year-id="yearId"
          :inline="true"
          :customQuery="customQuery"
          :loading="modal_loading"
          @hideModal="hideModal"
          @refresh="refresh"
          @hide="cancelEdit()"
        />
        <show-certificate-dates
          v-else
          :data="certificateDatesData"
          :loading="modal_loading"
          @hideModal="hideModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit()"
              />
            </div>
          </template>
        </show-certificate-dates>
      </b-modal>
    </div>
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
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import ShowCertificateDates from "@/views/system/years/components/CertificateDates/ShowCertificateDates";
import EditCertificateDates from "@/views/system/years/components/CertificateDates/EditCertificatDates";

export default {
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
    ShowCertificateDates,
    EditCertificateDates,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
    yearId: null,
  },
  data() {
    return {
      filter: {},
      paramsLoaded: true,
      modal: false,
      customQuery: null,
      modal_loading: true,
      certificateDatesData: {},
      editCertificateDatesFlag: false,
      modal_title: ''
    };
  },
  computed: {
    ...mapGetters({
      items: "certificatesDates/items",
      total: "certificatesDates/total",
      load: "certificatesDates/load",
      lookups: "certificatesDates/lookups",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields: function () {
      return [
        {
          key: "faculty",
          label: this.$t("faculty"),
          sortable: true,
        },
                {
          key: "semester",
          label: this.$t("Global.term"),
          sortable: true,
        },
        {
          key: "certificate",
          label: this.$t("certificate"),
          sortable: true,
        },
        {
          key: "UG_date",
          label: this.$t("Global.UG_date"),
          sortable: true,
        },
        {
          key: "PG_date",
          label: this.$t("Global.PG_date"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.action"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      getLookups: "certificatesDates/getLookups",
    }),
    reset() {
      this.filter = {};
    },
    refresh(query) {
      query.year_id = this.yearId;
      this.customQuery = query
      this.$store
        .dispatch("certificatesDates/certificatesDates", { query: query })
        .then((data) => {
          this.paramsLoaded = false;
        });
    },
    openAddModal() {
      this.modal_title = this.$t("Add Certificates Dates");
      this.editCertificateDatesFlag = true
      this.certificateDatesData = null
      this.modal = true;
    },
    openEditModal(item) {
      this.modal_title = this.$t("Edit Certificates Dates");
      this.editCertificateDatesFlag = true
      this.certificateDatesData = item
      this.modal = true;
    },
    openShowModal(item){
      this.modal_title = this.$t("Certificates Dates Details");
      this.editCertificateDatesFlag = false
      this.certificateDatesData = item
      this.modal = true;
    },  
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("certificatesDates/remove", id).then((_) => {
            this.refresh(this.customQuery);
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    openEdit() {
      this.editCertificateDatesFlag = true;
    },
    cancelEdit() {
      this.editCertificateDatesFlag = false;
    },
    resetModal() {},
    hideModal() {
      this.modal = false;
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
