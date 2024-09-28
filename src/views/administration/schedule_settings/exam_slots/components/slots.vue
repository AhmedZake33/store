<template>
  <DataTable
    :title="title"
    :total="total"
    :allowSearch="false"
    :filter="filter"
    :loading="load"
    @reset="reset"
    @Refresh="refresh"
    :paramsLoaded="paramsLoaded"
  >
    <template #action>
      <b-button
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
        @click="newslot()"
        v-if="hasPermission('add_examSlot')"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>
    <!-- <template #filter>
            <b-col cols="12" md="4">
                <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'" class="w-100 mb-2"
                    :reduce="(val) => val.id" />
            </b-col>
        </template> -->
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
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(title)="data">
          <div v-if="data.item.title">
            {{ data.item.title }}
          </div>
        </template>
        <template #cell(regular_time_start)="data">
          <div v-if="data.item.start">
            {{ data.item.start.substr("0", 5) }}
          </div>
        </template>
        <template #cell(regular_time_end)="data">
          <div v-if="data.item.end">
            {{ data.item.end.substr("0", 5) }}
          </div>
        </template>
        <template #cell(actions)="data">
          <div v-if="data">
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
            <feather-icon
              v-if="hasPermission('edit_examSlot')"
              v-b-tooltip.hover="$t('Global.edit')"
              icon="EditIcon"
              style="cursor: pointer"
              @click="open(data.item.id)"
              class="text-primary"
            />
            <feather-icon
              v-b-tooltip.hover="$t('Global.delete')"
              v-if="hasPermission('delete_examSlot')"
              icon="Trash2Icon"
              style="cursor: pointer"
              class="text-danger"
              @click="deleteSlot(data.item.id)"
            />
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>

<script>
import { mapGetters } from "vuex";
import DataTable from "@/views/components/table/DataTable";
import { BTable, BSpinner, BCol, BLink } from "bootstrap-vue";
import vSelect from "vue-select";
import { Trash2Icon, DeleteIcon } from "vue-feather-icons";
// import Ripple from "vue-ripple-directive"

export default {
  name: "slots",
  components: {
    DataTable,
    vSelect,
    Trash2Icon,
    BTable,
    BSpinner,
    BCol,
    BLink,
  },
  computed: {
    ...mapGetters({
      items: "examSlots/items",
      total: "examSlots/total",
      load: "examSlots/load",
      lookups: "examSlots/lookups",
      needDrop:'app/needDrop',
    }),
    fields: function () {
      return [
        {
          key: "title",
          sortable: true,
          label: this.$t("Global.title"),
          // thStyle: { width: "15%" },
        },
        {
          key: "regular_time_start",
          sortable: true,
          label: this.$t("Global.start_time"),
          thStyle: { width: "25%" },
        },
        {
          key: "regular_time_end",
          sortable: true,
          label: this.$t("Global.end_time"),
          // thStyle: { width: "15%" },
        },
        {
          key: "actions",
          // thStyle: { width: '12%' },
          thClass: "customAction",
          tdClass: "customWidth",
          label: this.$i18n.locale === "en" ? "Actions" : "الإجراءات",
        },
      ];
    },
  },
  data() {
    return {
      filter: {},
      paramsLoaded: true
    };
  },
  methods: {
    refresh(query) {
      this.$store.dispatch("examSlots/slots", { query: "" }).then(_=>{
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
    newslot() {
      this.$router.push({ name: "add_exam_slot" });
    },
    open(id) {
      this.$router.push({ name: "edit_exam_slot", params: { id } });
    },
    deleteSlot(id) {
      if (this.items) {
        this.$swal({
          title: `${this.$t("Global.deleteTitle")}`,
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
            this.popoverShow = false;
            this.$store
              .dispatch("examSlots/deleteSlot", id)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: this.$t("Global.Deleted"),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
</style>