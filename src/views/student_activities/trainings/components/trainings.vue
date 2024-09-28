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
      <!-- Training types -->
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.training_type_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.trainings_types"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.type')"
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
      <!-- Terms -->
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.term_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.terms"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
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
            {{ $t("noMatching") }}
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
      <!-- Bylaws -->
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.bylaw_id"
          :filter="fuseSearch"
          :disabled="filter.faculty_id == null"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.bylaws"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.bylaw')"
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
      <!-- Programs -->
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.program_id"
          :filter="fuseSearch"
          :disabled="filter.bylaw_id == null"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.programs"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.program')"
        >
          <template v-slot:option="option">
            <span v-if="$i18n.locale == 'en'">
              <!-- {{ option.faculty_name }}: {{ option.bylaw_name }}: -->
              {{ option.name }}
            </span>
            <span v-if="$i18n.locale == 'ar'">
              <!-- {{ option.faculty_name_local }}: {{ option.bylaw_name_local }}: -->
              {{ option.name_local }}:
            </span>
          </template>
          <template
            #selected-option="{
              name,
              name_local,
              faculty_name,
              faculty_name_local,
              bylaw_name,
              bylaw_name_local,
            }"
          >
            <span v-if="$i18n.locale == 'en'">
              {{ faculty_name }}: {{ bylaw_name }}:
              {{ name }}
            </span>
            <span v-if="$i18n.locale == 'ar'">
              {{ faculty_name_local }}: {{ bylaw_name_local }}:
              {{ name_local }}:
            </span>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>
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
        <!-- Training ID -->
        <template #cell(title)="data">
          <b-link
            :to="{ name: 'show_training', params: { id: data.item.id } }"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.title : "_" }}
          </b-link>
        </template>
        <!-- Training Type -->
        <template #cell(training_type_id)="data">
          {{
            $i18n.locale == "ar"
              ? data.item.training_type_name_local
              : data.item.training_type_name
          }}
        </template>
        <!-- Training Details -->
        <template #cell(term_id)="data">
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.term") }}: &nbsp;
            </strong>
            {{
              $i18n.locale == "ar"
                ? data.item.term_name_local
                : data.item.term_name
            }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.created_by") }}: &nbsp;
            </strong>
            {{
              $i18n.locale == "ar"
                ? data.item.created_user_name_local
                : data.item.created_user_name
            }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px">{{ $t("Source") }}: &nbsp; </strong>
            {{ $t(`${data.item.source}`) }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.weeks") }}: &nbsp;
            </strong>
            {{ data.item.num_of_weeks }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.students") }}: &nbsp;
            </strong>
            {{ data.item.num_of_students }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px">{{ $t("Global.CV") }}: &nbsp; </strong>
            <span v-if="data.item.cv_required == 1">
              {{ $t("Global.Required") }}
            </span>
            <span v-if="data.item.cv_required == 0">
              {{ $t("Global.Not required") }}
            </span>
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.Interview") }}: &nbsp;
            </strong>
            <span v-if="data.item.cv_required == 1">
              {{ $t("Global.Required") }}
            </span>
            <span v-if="data.item.cv_required == 0">
              {{ $t("Global.Not required") }}
            </span>
          </div>
        </template>
        <!-- Training Dates -->
        <template #cell(start_at)="data">
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.admission_start_at") }}: &nbsp;
            </strong>
            {{ data.item.admission_start_at }}
          </div>

          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.admission_end_at") }}: &nbsp;
            </strong>
            {{ data.item.admission_end_at }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.start_date") }}: &nbsp;
            </strong>
            {{ data.item.start_at }}
          </div>
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.end_date") }}: &nbsp;
            </strong>
            {{ data.item.end_at }}
          </div>
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
              v-if="hasPermission('edit_training')"
              :to="{
                name: 'show_training',
                params: { id: data.item.id },
                query: { inline: true },
              }"
            >
              <feather-icon icon="EditIcon" v-b-tooltip.hover="$t('edit')" />
            </b-link>
            <b-link>
              <feather-icon
                v-if="
                  data.item.removed == 0 &&
                  hasPermission('delete_training') &&
                  data.item.students_count == 0
                "
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                class="text-danger"
                @click="deleteItem(data.item.id)"
              />
              <feather-icon
                v-else
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                class="text-secondary"
                style="cursor: not-allowed"
              />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
    <template #action>
      <b-button
        v-if="hasPermission('add_training')"
        :to="{ name: 'add_training' }"
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
      >
        <feather-icon icon="PlusIcon" />
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

export default {
  name: "trainings",
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
  },
  data() {
    return {
      filter: {
        term_id: null,
        bylaw_id: null,
        program_id: null,
        training_type_id: null,
        source: null,
      },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "trainings/items",
      total: "trainings/total",
      load: "trainings/load",
      lookups: "trainings/lookups",
      needDrop:'app/needDrop',
    }),
    fields: function () {
      return [
        {
          key: "title",
          label: this.$t("Global.title"),
          sortable: true,
        },
        {
          key: "training_type_id",
          label: this.$t("Global.type"),
          sortable: true,
        },
        {
          key: "term_id",
          label: this.$t("Global.details"),
          sortable: true,
        },
        {
          key: "start_at",
          label: this.$t("Dates"),
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
    deleteItem(id) {
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
          this.$store.dispatch("trainings/remove", id).then((response) => {
            if (response.status == "success") {
              this.refresh();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.deleted")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              this.$swal({
                icon: "error",
                title: this.$i18n.locale == "en" ? "Error!" : "خطا",
                text:
                  this.$i18n.locale == "en"
                    ? "You Cannot Delete This Training"
                    : "لا يمكنك مسح هذا التدريب",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              });
            }
          });
        }
      });
    },
    refresh(query) {
      //from the filter
      if (this.term_id) {
        query = { ...query, term_id: this.term_id };
      }
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.training_type_id) {
        query = { ...query, training_type_id: this.training_type_id };
      }
      if (this.source) {
        query = { ...query, source: this.source };
      }

      //from the url query
      if (this.$route.query && this.$route.query.term_id) {
        query = { ...query, term_id: this.$route.query.term_id };
      }
      if (this.$route.query && this.$route.query.bylaw_id) {
        query = { ...query, bylaw_id: this.$route.query.bylaw_id };
      }
      if (this.$route.query && this.$route.query.program_id) {
        query = { ...query, program_id: this.$route.query.program_id };
      }
      if (this.$route.query && this.$route.query.training_type_id) {
        query = {
          ...query,
          training_type_id: this.$route.query.training_type_id,
        };
      }
      if (this.$route.query && this.$route.query.source) {
        query = { ...query, source: this.$route.query.source };
      }
      this.$store
        .dispatch("trainings/trainings", { query: query })
        .then((data) => {
          this.paramsLoaded = false;
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
