<template>
  <div>
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
      <template #action>
        <b-button
          v-if="hasPermission('add_excuse') && user_id"
          :to="{ name: 'add_excuse' }"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>

      <template #filter>
        <!-- excuse types -->
        <b-col cols="12" md="4" v-if="lookups">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.excuse_type_id"
            :options="lookups.types"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.excuse_type')"
          />
        </b-col>
        <!-- Statuses -->
        <b-col cols="12" md="4" v-if="lookups">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.status"
            :options="lookups.statuses"
            :label="'name'.replaceAll('_', ' ')"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.status')"
          >
            <template v-slot:option="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local.replaceAll("_", " ")
                  : option.name.replaceAll("_", " ")
              }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'"
                  >{{ name_local.replaceAll("_", " ") }}
                </strong>
                <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
              </div>
            </template>
          </v-select>
        </b-col>
        <!-- Years -->
        <b-col cols="12" md="4" v-if="lookups">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.year_id"
            :options="lookups.years"
            label="name_local"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.year')"
          >
            <template v-slot:option="option">
              {{ option.start_year + "/" + option.end_year }}
            </template>
            <template #selected-option="{ start_year, end_year }">
              {{ start_year + "/" + end_year }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <!-- terms -->
        <b-col cols="12" md="4" v-if="lookups">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.term_id"
            :options="lookups.terms"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
          />
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
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(user)="data">
            <div v-if="data && data.item && data.item.user">
              <b-media
                vertical-align="center"
                class="d-inline-flex align-items-center"
                v-if="data.item.user || data.item.external_data"
              >
                <template #aside v-if="data.item.user">
                  <b-avatar size="32" :text="avatarText(data.item.user.name)" />
                </template>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold d-inline-block text-nowrap"
                  :to="{
                    name: 'student-show',
                    params: { id: data.item.user.id },
                  }"
                >
                  {{
                    data.item.user
                      ? data.item.user.name_local
                        ? data.item.user.name_local
                        : data.item.user.name
                      : "_"
                  }}
                </b-link>
                <b-link
                  class="font-weight-bold d-inline-block text-nowrap"
                  :to="{
                    name: 'student-show',
                    params: { id: data.item.user.id },
                  }"
                  v-if="$i18n.locale == 'en'"
                >
                  {{
                    data.item.user
                      ? data.item.user.name
                        ? data.item.user.name
                        : data.item.user.name_local
                      : "_"
                  }}
                </b-link>
              </b-media>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(excuse_type)="data">
            <div v-if="data && data.item && data.item.excuse_type">
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.excuse_type.name }}
              </div>
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.excuse_type.name_local }}
              </div>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(term)="data">
            <div v-if="data && data.item && data.item.term">
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.term.name }}
              </div>
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.term.name_local }}
              </div>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(year_id)="data">
            <div v-if="data && data.item && data.item.year">
              {{ data.item.year.start_year }}/{{ data.item.year.end_year }}
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(status)="data">
            <div v-if="data && data.item.status">
              <b-badge
                pill
                :variant="`${getExcuseStatus(data.item.status.id).color}`"
                class="text-capitalize"
              >
                {{ data.item.status.name }}
              </b-badge>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(courses)="data">
            <div v-if="data && data.item && data.item.offerings && data.item.offerings.length > 0">
              <span v-for="(item, index) in data.item.offerings" :key="index">
                <b-badge
                  v-if="item.course"
                  pill
                  :variant="`primary`"
                  class="text-capitalize"
                >
                  <feather-icon icon="FileTextIcon" class="text-whight" />
                  <span v-if="$i18n.locale == 'en'">
                    {{ item.course.code }} : {{ item.course.name }}
                  </span>
                  <span v-if="$i18n.locale == 'ar'">
                    {{ item.course.code }} : {{ item.course.name_local }}
                  </span>
                </b-badge>
              </span>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(reason)="data">
            <div v-if="data && data.item.reason">
              {{ data.item.reason }}
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(feadback)="data">
            <div v-if="data && data.item.feadback">
              {{ data.item.feadback }}
            </div>
            <div v-else>_</div>
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
                v-if="hasPermission('edit_excuse')"
                :to="{ name: 'edit_excuse', params: { id: data.item.id }, query:{inline: true} }"
              >
                <feather-icon icon="EditIcon" v-b-tooltip.hover="$t('edit')" />
              </b-link>

              <b-link
                v-if="
                  data.item.status == 1 &&
                  hasPermission('edit_excuse') &&
                  authUser().type.type == 3
                "
              >
                <feather-icon
                  icon="XSquareIcon"
                  v-b-tooltip.hover="$t('Global.cancel')"
                  class="text-danger"
                  @click="cancel(6, data.item.id)"
                />
              </b-link>
              <b-link
                :to="{ name: 'excuse-show', params: { id: data.item.id } }"
                v-if="hasPermission('edit_excuse')"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
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
    user_id: null,
    title: String,
  },
  data() {
    return {
      filter: {
        excuse_type_id: null,
        term_id: null,
        status: null,
        year_id: null,
      },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "excuses/items",
      total: "excuses/total",
      load: "excuses/load",
      needDrop:'app/needDrop',
      lookups: "excuses/lookups",
    }),
    fields: function () {
      return [
        {
          key: "user",
          sortable: false,
          label: this.$t("Global.student_name"),
          thStyle: { width: "15%" },
        },
        {
          key: "excuse_type",
          sortable: false,
          label: this.$t("Global.excuse_type"),
          thStyle: { width: "8%" },
        },
        {
          key: "term",
          label: this.$t("Global.term"),
          sortable: false,
        },
        {
          key: "year_id",
          label: this.$t("Global.year"),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: false,
        },
        {
          key: "courses",
          label: this.$t("Global.courses"),
          sortable: false,
        },
        {
          key: "reason",
          label: this.$t("Global.reason"),
          sortable: false,
        },
        {
          key: "feadback",
          label: this.$t("Global.feadback"),
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
      if (this.excuse_type_id) {
        query = { ...query, excuse_type_id: this.excuse_type_id };
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id };
      }
      if (this.status) {
        query = { ...query, status: this.status };
      }
      if (this.year_id) {
        query = { ...query, year_id: this.year_id };
      }

      if (this.$route.query && this.$route.query.excuse_type_id) {
        query = { ...query, excuse_type_id: this.$route.query.excuse_type_id };
      }
      if (this.$route.query && this.$route.query.term_id) {
        query = { ...query, term_id: this.$route.query.term_id };
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = { ...query, faculty_id: this.$route.query.faculty_id };
      }
      if (this.$route.query && this.$route.query.year_id) {
        query = { ...query, year_id: this.$route.query.year_id };
      }
      if(this.user_id){
        query = { ...query, user_id: this.user_id };
      }
      this.$store.dispatch("excuses/excuses", { query: query }).then((data) => {
        this.paramsLoaded = false;
      });
    },

    cancel(status_id, excuse_id) {
      this.$store
        .dispatch("excuses/updateStatus", {
          query: { status: status_id },
          id: excuse_id,
        })
        .then((_) => {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.refresh();
        });
    },

    getExcuseStatus(id){
        if(id == 1){
            return{
                color: 'primary',
                name: 'New'
            }
        }else if(id == 3){
            return{
                color: 'warning',
                name: 'Accepted'
            }
        }else if(id == 4){
            return{
                color: 'success',
                name: 'Approved'
            }
        }else if(id == 5){
            return{
                color: 'danger',
                name: 'Rejected'
            }
        }else if(id == 6){
            return{
                color: 'danger',
                name: 'Canceled'
            }
        }
    },
  },
};
</script>

<style scoped>
.text-capitalize {
  margin-right: 5px;
}
</style>
