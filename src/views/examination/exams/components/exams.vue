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
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.type_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.types"
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
        <template #cell(name)="data">
          <b-link
            :to="{ name: 'exam', params: { id: data.item.id } }"
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.name : "_" }}
          </b-link>
          <b-link
            :to="{ name: 'exam', params: { id: data.item.id } }"
            v-if="$i18n.locale == 'ar'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.name_local : "_" }}
          </b-link>
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
        <template #cell(exam_type)="data">
          <div v-if="data.item.type">
            {{
              $i18n.locale == "ar"
                ? data.item.type.name_local
                : data.item.type.name
            }}
          </div>
        </template>
        <template #cell(students_count)="data">
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.offering ? data.item.offering.students_count : "_" }}
          </span>
        </template>
        <template #cell(published)="data">
          <b-badge
            pill
            :variant="`light-${
              getStatus(data.item.published, 'published').color
            }`"
            class="text-capitalize"
          >
            {{ getStatus(data.item.published, "published").name }}
          </b-badge>
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
              v-if="hasPermission('show_exam')"
              :to="{ name: 'exam', params: { id: data.item.id } }"
            >
              <feather-icon icon="EyeIcon" v-b-tooltip.hover="$t('show')" />
            </b-link>
            <b-link
              :to="{
                name: 'exams_schedules',
                query: { exam_id: data.item.id },
              }"
            >
              <feather-icon
                v-b-tooltip.hover="$t('exam_schedules')"
                icon="CalendarIcon"
                style="cursor: pointer"
              />
            </b-link>
            <b-link
              v-if="hasPermission('edit_exam')"
              :to="{ name: 'edit_exam', params: { id: data.item.id }, query:{inline: true} }"
            >
              <feather-icon icon="EditIcon" v-b-tooltip.hover="$t('edit')" />
            </b-link>
            <b-link
              v-if="hasPermission('delete_exam') && data.item.canDelete"
              @click="remove(data.item.id)"
            >
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
        v-if="hasPermission('add_exam')"
        :to="{ name: 'add_exam' }"
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
  name: "exams",
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
      filter: { faculty_id: null, type_id: null },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "exams/items",
      total: "exams/total",
      needDrop:'app/needDrop',
      load: "exams/load",
      lookups: "exams/lookups",
    }),
    fields: function () {
      return [
        {
          key: "name",
          label: this.$t("name"),
          sortable: true,
        },
        {
          key: "semester",
          label: this.$t("Global.semester"),
          sortable: true,
        },
        {
          key: "exam_type",
          label: this.$t("Global.exam_type"),
          sortable: true,
        },
        {
          key: "preferences_start_date",
          label: this.$t("preferences_start_date"),
          sortable: true,
        },
        {
          key: "preferences_end_date",
          label: this.$t("preferences_end_date"),
          sortable: true,
        },
        {
          key: "proctoring_table_date",
          label: this.$t("proctoring_table_date"),
          sortable: true,
        },
        // {
        //   key: "published",
        //   label: this.$t("Global.Published"),
        // },
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
    refresh(query) {
      if (this.type_id) {
        query = { ...query, type_id: this.type_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.$route.query && this.$route.query.type_id) {
        query = { ...query, type_id: this.$route.query.type_id };
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = { ...query, faculty_id: this.$route.query.faculty_id };
      }
      this.$store.dispatch("exams/exams", { query: query }).then((data) => {
        this.paramsLoaded = false;
      });
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
          this.$store.dispatch('exams/remove', id).then(_ => {
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
@import "@core/scss/vue/libs/vue-select.scss";
</style>
