<template>
  <DataTable
      :title="title"
      :total="total"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @Export="Export"
      @reset="reset"
  >
    <template #filter v-if="lookups">


      <b-col cols="12" md="4">
        <v-select
            v-model="filter.status_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.status"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Transfer Status')"

        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong>{{ $i18n.locale == "ar" ? name_local : name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select
            v-model="filter.type_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.types"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Type')"
        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong>{{ $i18n.locale == "ar" ? name_local : name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>

    </template>
    <template #action>
      <b-button
          v-if="hasPermission('admin_system') || hasPermission('add_internalTransfer')"
          v-b-tooltip.hover="$t('Global.add')"
          class="btn-icon"
          variant="primary"
          @click="$router.push({ name: 'add_internal_transfer' })"
      >
        <feather-icon icon="PlusIcon"/>
      </b-button>
    </template>
    <template #customTable>
      <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
      >
        <template #cell(id)="data">
          <b-link v-if="hasPermission('show_internalTransfer')"
                  :to="{ name: 'equivalent-transfer', params: { student_id: data.item.student.id ,transfer_id:data.item.id} }"
          >
            {{ data.item.id }}
          </b-link>
          <span v-else> {{ data.item.id }}</span>
        </template>
        <template #cell(user)="data">
          <div v-if="data.item.student">
            {{ data.item.student.user.code }} :
            <b-link
                :to="{
                name: 'student-show',
                params: { id: data.item.user_id },
              }"
            >
              {{ getTranslatedName(data.item.student.user) }}
            </b-link>
          </div>
        </template>

        <template #cell(details)="data">
          <b-link
              :to="{ name: 'faculty', params: { id: data.item.program.faculty.id } }"
              class="font-weight-bold">
            {{ getTranslatedName(data.item.program.faculty) }}
          </b-link>
          <strong class="text-danger"> , </strong>
          <b-link :to="{ name: 'bylaw', params: { id: data.item.program.bylaw.id } }"
                  class="font-weight-bold">
            {{ getTranslatedName(data.item.program.bylaw) }}
          </b-link>
          <strong class="text-danger"> , </strong>
          <b-link :to="{ name: 'program', params: { id: data.item.program.id } }" class="font-weight-bold">
            {{ getTranslatedName(data.item.program) }}
          </b-link>
        </template>

        <template #cell(status)="data">
          <div v-if="data.item.status">
            <b-badge pill :variant="`light-primary`" v-if="data.item.status.id==1">
              {{ getTranslatedName(data.item.status) }}
            </b-badge>
            <b-badge pill :variant="`light-secondary`" v-else-if="data.item.status.id==2">
              {{ getTranslatedName(data.item.status) }}
            </b-badge>
            <b-badge pill :variant="`light-success`" v-else-if="data.item.status.id==3">
              {{ getTranslatedName(data.item.status) }}
            </b-badge>
            <b-badge
                v-b-tooltip.hover.top="data.item.reject_reason"
                pill :variant="`light-danger`" v-else-if="data.item.status.id==4">
              {{ getTranslatedName(data.item.status) }}
            </b-badge>
          </div>

        </template>
        <template #cell(type)="data">
          {{ getTranslatedName(data.item.type) }}
        </template>

        <template #cell(created_at)="data">
          {{ moment(data.item.created_at).utc().format('YYYY-MM-DD') }}
        </template>

        <template #cell(actions)="data">
          <div>
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
            <b-link
                v-if="hasPermission('show_internalTransfer')"
                :to="{ name: 'equivalent-transfer', params: { student_id: data.item.student.id ,transfer_id:data.item.id} }"
            >
              <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
              />
            </b-link>


            <b-link v-if="hasPermission('edit_internalTransfer')"
                    :to="{ name: 'edit-transfer', params: {student_id: data.item.student.id , transfer_id:data.item.id} }"
            >
              <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="text-primary"
              />
            </b-link>

          </div>

        </template>
      </b-table>
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
import {mapGetters, mapActions} from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

export default {
  name: "internal-transfer",
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
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
  },
  data() {
    return {
      filter: {
        type_id: null,
        status_id: null,
        removed: 0,
      },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "internalTransfer/items",
      total: "internalTransfer/total",
      needDrop: 'app/needDrop',
      load: "internalTransfer/load",
      lookups: "internalTransfer/lookups",
    }),

    fields: function () {
      return [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: true,
        },
        {
          key: "user",
          label: this.$t("Global.student"),
          sortable: false,
        },
        {
          key: "type",
          label: this.$t("type"),
          sortable: false,
        },
        {
          key: "details",
          label: this.$t("Transfer Details"),
          sortable: false,
        },
        {
          key: "status",
          label: this.$t("status"),
          sortable: false,
        },
        {
          key: "created_at",
          label: this.$t("created_at"),
          thStyle: {width: "12%"},
          sortable: false,
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    getEmptyListLabel() {
      return this.$i18n.locale == "en"
          ? "Sorry, No Matching Options."
          : "لاتوجد نتائج مطابقة للبحث.";
    },
  },
  methods: {
    ...mapActions({
      //   exportExcel: "registrations/export",
      list: "internalTransfer/listAllTransferRequests"
    }),
    refresh(query) {

      if (this.$route.query && this.$route.query.section_id) {
        query = {...query, section_id: this.$route.query.section_id};
      }

      this.list(query)
          .then((data) => {
            this.paramsLoaded = false;
          });
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
      let query = {...this.$route.query, ...{}};
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


    Export(query) {
      query = {...query, language: this.$i18n.locale};
      this.exportExcel(query);
      this.filter.export = 0;
    },
  },
  watch: {},
};
</script>
