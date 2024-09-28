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
            :to="{ name: 'papers_type', params: { id: data.item.id } }"
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.name : "_" }}
          </b-link>
          <b-link
            :to="{ name: 'papers_type', params: { id: data.item.id } }"
            v-if="$i18n.locale == 'ar'"
            class="font-weight-bold d-block text-nowrap"
          >
            {{ data.item ? data.item.name_local : "_" }}
          </b-link>
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
              v-if="hasPermission('show_examPapersType')"
              :to="{ name: 'papers_type', params: { id: data.item.id } }"
            >
              <feather-icon icon="EyeIcon" v-b-tooltip.hover="$t('show')" />
            </b-link>
            <b-link
              v-if="hasPermission('edit_examPapersType')"
              :to="{ name: 'edit_papers_type', params: { id: data.item.id }, query:{inline: true} }"
            >
              <feather-icon icon="EditIcon" v-b-tooltip.hover="$t('edit')" />
            </b-link>
            <b-link
              v-if="hasPermission('delete_examPapersType')"
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
        v-if="hasPermission('add_examSchedule')"
        :to="{ name: 'add_papers_type' }"
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
  name: "PapersTypes",
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
      filter: { order_direction: true },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "papersTypes/items",
      total: "papersTypes/total",
      load: "papersTypes/load",
      needDrop:'app/needDrop',
      lookups: "papersTypes/lookups",
    }),
    fields: function () {
      return [
        {
          key: "name",
          label: this.$t("name"),
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
      this.$store.dispatch("papersTypes/papersTypes", { query: query }).then((data) => {
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
          this.$store.dispatch('papersTypes/remove', id).then(_ => {
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
