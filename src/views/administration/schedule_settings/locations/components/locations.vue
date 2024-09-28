<template>
  <DataTable 
    :total="total" 
    :filter="filter"
    :allow-search="true" 
    @Refresh="refresh" 
    @reset="reset"
  >
    <template #action>
      <b-button
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
        @click="newLocation()"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>
    <!-- <template #filter v-if="lookups">
      <b-col cols="6" md="4" v-if="lookups.types">
        <v-select
          v-model="filter.type"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.types"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.types')"
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
      <b-col cols="6" md="4" v-if="lookups.buildings">
        <v-select
          v-model="filter.building_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.buildings"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Buildings')"
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
        <template #cell(name)="data">
          <b-link :to="{ name: 'location', params: { id: data.item.id } }">
            {{ $i18n.locale == "ar" ? data.item.name_local : data.item.name }}
          </b-link>
        </template>
        <template #cell(building)="data">
          <div v-if="data">
            {{ data.item.building.name }}
          </div>
        </template>
        <template #cell(type)="data">
          <div v-if="data.item.type_obj">
            {{
              data.item.type_obj && $i18n.locale == "en"
                ? data.item.type_obj.name
                : data.item.type_obj.name_local
            }}
          </div>
        </template>
        <template #cell(floor)="data">
          <div v-if="data.item.floor">
            {{ $i18n.locale == "en" ? data.item.floor : data.item.floor_local }}
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
              v-if="
                hasPermission('access_offeringSchedule') &&
                $route.name == 'schedules'
              "
              @click="openCalendar(data.item.id)"
            >
              <i class="fa-solid fa-calendar-days"></i>
              <feather-icon
                v-b-tooltip.hover="$t('Global.show')"
                icon="EyeIcon"
                class="text-primary"
              />
            </b-link>

            <b-link
              v-if="
                hasPermission('edit_location') && $route.name != 'schedules'
              "
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

            <b-link>
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                v-if="
                  hasPermission('delete_location') && $route.name != 'schedules'
                "
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="deleteLocation(data.item.id)"
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
      needDrop:'app/needDrop',
    }),
    fields: function () {
      return [
        {
          key: "name",
          sortable: true,
          label: this.$t("Global.locations"),
          // thStyle: { width: "15%" },
        },
        {
          key: "type",
          sortable: true,
          label: this.$t("Global.type"),
          // thStyle: { width: "15%" },
        },
        {
          key: "building",
          sortable: true,
          label: this.$t("Global.building"),
          // thStyle: { width: "15%" },
        },
        {
          key: "location_num",
          sortable: true,
          label: this.$t("Global.location_num"),
          // thStyle: { width: "15%" },
        },
        {
          key: "floor_code",
          sortable: true,
          label: this.$t("Global.floor_code"),
          // thStyle: { width: "15%" },
        },
        {
          key: "floor",
          sortable: true,
          label: this.$t("Global.location_floor"),
          // thStyle: { width: "15%" },
        },
        {
          key: "capacity",
          sortable: true,
          label: this.$t("Global.location_capacity"),
          // thStyle: { width: "15%" },
        },
        {
          key: "exam_capacity",
          sortable: true,
          label: this.$t("Global.exam_capacity"),
          // thStyle: { width: "15%" },
        },
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
      this.$store.dispatch("locations/locations", { query: query })
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
    newLocation() {
      this.$router.push({
        name: "add_location",
      });
    },
    open(id) {
      this.$router.push({
        name: "edit_location",
        params: {
          id,
        },
      });
    },
    openCalendar(id) {
      this.$router.push({
        name: "location-schedule",
        params: {
          id,
        },
      });
    },
    deleteLocation(id) {
      if (this.items) {
        this.$swal({
          title: `${this.$t("Global.deleteTitle")}`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: `${this.$t("Global.cancel")}`,
          confirmButtonText: "Yes, delete location!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.popoverShow = false;
            this.$store
              .dispatch("locations/deleteLocation", id)
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

<style scoped></style>
