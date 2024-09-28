<template>
  <DataTable
      :total="total"
      :allowSearch="true"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @reset="reset"
    >
      <template #action>
        <b-button
          v-if="hasPermission('add_thesis')"
          :to="{ name: 'add_thesis' }"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>

      <template v-if="lookups" #filter>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.faculty_id"
            :options="lookups.faculties"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col v-if="!bylaw_id" cols="12" md="4">
          <v-select
            v-model="filter.bylaw_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.bylaws"
            class="w-100 mb-2"
            :clearable="true"
            :reduce="val => val.id"
            :placeholder="$t('Global.bylaw')"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                <strong v-else>{{ name }}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select 
            v-model="filter.research_plan_id" 
            :filter="fuseSearch" 
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" 
            :options="lookups.research_plans" 
            class="w-100" 
            clearable 
            label="name" 
            :reduce="val => val.id" 
            :placeholder="$t('Global.research_plan')"
          >
            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">
                {{ option.name_local }}
              </span>
              <span v-else>
                {{ option.name }}
              </span>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select v-model="filter.status" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.status" :label="$i18n.locale == 'en' ? 'name' : 'name_local'" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.status')">
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                <strong v-else>{{ name }}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
      </template>

      <template #customTable>
        <b-table
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
          <template #cell(id)="data">
            <div v-if="data && data.item && data.item.id">
              <div>
                <b-link
                  class="font-weight-bold d-inline-block text-nowrap"
                  :to="{
                    name: 'thesis',
                    params: { id: data.item.id },
                  }"
                >
                  {{ data.item.id }}
                </b-link>
              </div>
            </div>
          </template>
          <template #cell(title)="data">
            <div v-if="data && data.item && data.item.title">
              <div v-if="$i18n.locale == 'en'">
                {{ data.item && data.item.title ? data.item.title : '' }}
              </div>
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.title_local }}
              </div>
            </div>
          </template>
          <template #cell(plan)="data">
            <div v-if="data && data.item && data.item.plan">
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.plan.name }}
              </div>
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.plan.name_local }}
              </div>
            </div>
          </template>
          <template #cell(student)="data">
            <div v-if="data && data.item && data.item.student">
              <b-link
                class="font-weight-bold d-inline-block"
                :to="{ name: 'student-show', params: { id: data.item.student.id } }"
              >
                <div v-if="$i18n.locale == 'en'">
                  {{ data.item.student.name }}
                </div>
                <div v-if="$i18n.locale == 'ar'">
                  {{ data.item.student.name_local }}
                </div>
              </b-link>
            </div>
          </template>
          <template #cell(status)="data">
            <div v-if="data && data.item && data.item.status">
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.status.name }}
              </div>
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.status.name_local }}
              </div>
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
                :to="{ name: 'thesis', params: { id: data.item.id } }"
              >
                <feather-icon
                  v-if="hasPermission('show_student_thesis')"
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
              <b-link>
                <feather-icon
                  v-if="hasPermission('edit_student_thesis')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="text-primary"
                  @click="open(data.item.id)"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover } from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable';
import { mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';

export default {
  name: 'theses',
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
    'b-modal': VBModal,
    Ripple,
  },
  props:{
    bylaw_id:Number
  },
  data() {
    return {
      filter: {
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        research_plan_id: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: 'theses/items',
      total: 'theses/total',
      load: 'theses/load',
      lookups: 'theses/lookups',
      needDrop:'app/needDrop',
    }),
    fields: function () {
      return [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: false,
        },
        {
          key: "student",
          label: this.$t("Global.student"),
          sortable: false,
        },
        {
          key: "plan",
          label: this.$t("Global.research_plan"),
          sortable: false,
        },
        {
          key: 'title',
          label: this.$t("Global.title"),
          sortable: true,
        },
        {
          key: "status",
          sortable: false,
          label: this.$t("Global.status"),
        },
        {
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
          label: this.$t("Global.action"),
        },
      ];
    },
  },
  methods: {
    refresh(query) {
      if(this.$route.name == 'my_theses'){
        this.$store.dispatch('theses/myTheses', { query: query });
      }else{
        this.$store.dispatch('theses/theses', { query: query });
      }
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
    open(id){
      this.$router.push({ name: "thesis", params: { id : id }, query: { inline: "true" } });
    },
  },
  mounted(){
    // this.$router.beforeEach((to,from,next)=>{
    //   if(from.my_theses){

    //   }
    // })
  }
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
