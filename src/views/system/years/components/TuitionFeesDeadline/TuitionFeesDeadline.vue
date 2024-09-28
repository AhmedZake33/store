<template>
  <DataTable 
    :total="total" 
    :filter="filter"
    :allow-search="true" 
    @Refresh="refresh" 
    @reset="reset"
    :paramsLoaded="paramsLoaded"
  >
    <!-- <template #action>
      <b-button
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
        @click="newLocation()"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template> -->
    <template #customTable>
      <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
        :busy="load"
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
              :to="{
                name: 'edit_location',
                params: { id: data.item.id },
                query: { inline: true },
              }"
            >
              <feather-icon
                icon="EditIcon"
                v-b-tooltip.hover="$t('edit')"
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
import { mapGetters } from "vuex";
import DataTable from "@/views/components/table/DataTable";
import { BTable, BSpinner, BCol, BLink } from "bootstrap-vue";
import vSelect from "vue-select";
import { Trash2Icon, DeleteIcon } from "vue-feather-icons";
// import Ripple from "vue-ripple-directive"

export default {
  name: "locations",
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
      items: "locations/items",
      total: "locations/total",
      load: "locations/load",
      lookups: "locations/lookups",
    }),
    fields: function () {
      return [
        {
          key: "actions",
          thClass: "customAction",
          tdClass: "customWidth",
          label: this.$i18n.locale === "en" ? "Actions" : "الإجراءات",
        },
      ];
    },
  },
  data() {
    return {
      filter: { order_direction: true },
      paramsLoaded: true,
    };
  },
  methods: {
    refresh(query) {
      // this.$store.dispatch("locations/locations", { query: query }).then((data) => {
      //   this.paramsLoaded = false;
      // });
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
  },
};
</script>

<style scoped></style>
