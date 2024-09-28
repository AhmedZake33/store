<template>
  <!-- :key="$route.fullPath" -->
  <DataTable 
    :title="title" 
    :total="total" 
    :allow-search="true" 
    :filter="filter" 
    :loading="load" 
    :paramsLoaded="paramsLoaded" 
    @Refresh="refresh" 
    @reset="reset" 
    @Export="Export"
  >
    <template #action>
      <b-button v-if="hasPermission('access_advisedStudents')" v-b-tooltip.hover="$t('Global.export_excel')" class="btn-icon" :class="hasPermission('access_advisedStudents') ? 'mr-1' : ''" variant="primary" @click="filter.export = 1">
        <feather-icon icon="FileTextIcon" />
      </b-button>
    </template>
    <template v-if="lookups" #filter>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.advisor_id"
          :options="searchAdvisors"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :placeholder="$t('searchInAdvisors')"
          :filterable="false"
          clearable
          :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
          :reduce="(val) => val.id"
          @search="fetchAdvisors"
        >
          <!-- <template
            v-slot:option="option"
            v-if="$i18n.locale == 'ar'"
          >
            {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)
          </template>
          <template v-slot:option="option" v-else>
            {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
          </template>

          <template slot="selected-option" slot-scope="option">
            <span 
              v-if="$i18n.locale == 'ar'"
            >
              {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)</span
            >
            <span 
              v-else
            >
              {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
            </span>
          </template> -->
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select v-model="filter.faculty_id" :label="$i18n.locale == 'en' ? 'name' : 'name_local'" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.faculties" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.faculty')">
          <template v-slot:option="option">
            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select v-model="filter.bylaw_id" :disabled="!filter.faculty_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.bylaws" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.bylaw')" :label="$i18n.locale == 'en' ? 'name' : 'name_local'">
          <template v-slot:option="option">
            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select v-model="filter.program_id" :disabled="!filter.bylaw_id" :label="$i18n.locale == 'en' ? 'name' : 'name_local'" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.programs" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.program')">
          <template v-slot:option="option">
            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="3">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.level_id"
            :options="lookups.levels"
            :disabled="filter.bylaw_id == null"
            :label="'name'.replaceAll('_', ' ')"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.levels')"
          >
          <template v-slot:option="option">
            {{
            $i18n.locale == "ar"
                ? option.name_local
                : option.name
            }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
            <strong v-if="$i18n.locale == 'ar'"
                >{{ name_local }}
            </strong>
            <strong v-else>{{ name }}</strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
          </v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select v-model="filter.registraion_status_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="registrationOptions" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.status')" :label="'name'" />
      </b-col>
    </template>
    <template #customTable>
      <b-table           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative font-small-2" :items="items" responsive :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
        <template #cell(code)="data">
          <b-link v-if="data.item.user" class="font-weight-bold d-block" :to="{ name: 'advising_registration', params: { id: data.item.user && data.item.user.id ? data.item.user.id : 0 } }">
            {{ data.item.user.code }}
          </b-link>
        </template>
        <template #cell(name)="data">
          <span v-if="data.item.user">
            {{ getTranslated(data.item.user.name, data.item.user.name_local) }}
          </span>
        </template>
        <template #cell(program)="data">
          <span>
            <b v-if="data.item.program.faculty">
              {{ getTranslated(data.item.program.faculty.name, data.item.program.faculty.name_local) }}
              <br />
            </b>
            {{ getTranslated(data.item.program.name, data.item.program.name_local) }}
          </span>
        </template>
        <template #cell(status)="data">
          <b-badge v-if="(status = getOfferingStatus(data.item.requested_offerings_count, data.item.approved_offerings_count))" :variant="status.class">
            {{ status.label }}
          </b-badge>
        </template>
        <template #cell(actions)="data">
          <div v-if="data.item.user">
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
            <b-link :to="{ name: 'global-chat', params: { chat_id: 'chat-advisor', user_id: data.item.user && data.item.user.id ? data.item.user.id : 0 } }">
              <feather-icon v-b-tooltip.hover="$t('chat with student')" class="font-medium-5" icon="MessageCircleIcon" />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover } from 'bootstrap-vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import DataTable from '@/views/components/table/DataTable';

export default {
  name: 'AdvisingStudents',
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
  props: {
    title: String,
    all_advising: { type: Boolean, default: true },
  },
  data() {
    return {
      searchAdvisors: [],
      waitFAdvisors: false,
      filter: {
        removed: 0,
        export: 0,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        registraion_status_id: null,
        advisor_id: null
      },
      items: null,
      total: null,
      lookups: null,
      paramsLoaded: true,
    };
  },
  mounted() {
  },
  watch:{
    'filter.bylaw_id': function (newValue) {
      if(this.filter.level_id)
      {
        this.filter.level_id = null
      }
    },
  },
  computed: {
    ...mapGetters({
      options: 'offerings/lookups',
      load:'offeringsRegistrations/load',
      needDrop:'app/needDrop',
    }),
    fields() {
      return [
        // {
        //   key: 'id',
        //   sortable: true,
        // },
        {
          key: 'code',
          label: this.$t('code'),
          sortable: true,
        },
        {
          key: 'name',
          sortable: true,
          label: this.$t('name'),
        },
        {
          key: 'program',
          sortable: false,
          label: this.$t('program'),
        },
        {
          key: 'status',
          sortable: false,
          label: this.$t('status'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
    registrationOptions() {
      return [
        { id: 1, name: this.$t('Not Registered') },
        { id: 2, name: this.$t('Requested') },
        { id: 3, name: this.$t('Pending') },
        { id: 4, name: this.$t('Registered') },
      ];
    },
  },
  methods: {
    ...mapActions({
      getAdvisingStudents: 'offeringsRegistrations/getAdvisingStudents',
      exportExcel: 'academicAdvisors/export',
      getLookups: 'app/GET_LOOKUPS',
    }),
    Export(query) {
      this.exportExcel({ ...query, language: this.$i18n.locale });
      this.filter.export = 0;
    },
    refresh(query) {
      query = { ...query, all_advising: this.all_advising };
      this.getAdvisingStudents(query).then(data => {
        this.paramsLoaded = false;
        this.items = data.data;
        this.total = data.meta.count;
        this.lookups = data.meta.lookup;
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
    getTranslated(english, arabic) {
      if (this.$i18n.locale == 'en') {
        return english;
      }
      return arabic;
    },
    getOfferingStatus(requested, approved) {
      let statusMessage = {
        label: null,
        class: null,
      };
      if (requested == 0 && approved == 0) {
        statusMessage = {
          label: this.$t('Not Registered'),
          class: 'danger',
        };
      } else if (requested > 0 && approved > 0) {
        statusMessage = {
          label: this.$t('Pending'),
          class: 'warning',
        };
      } else if (requested == 0 && approved > 0) {
        statusMessage = {
          label: this.$t('Registered'),
          class: 'success',
        };
      } else if (requested > 0 && approved == 0) {
        statusMessage = {
          label: this.$t('Requested'),
          class: 'warning',
        };
      }
      return statusMessage;
    },
    fetchAdvisors(search, load) {
      if (search.length >= 3 && !this.waitFAdvisors) {
        this.waitFAdvisors = true;
        load(true)
        const query = {
          search_all_advisors_keyword: search,
        }
        this.getLookups(query).then(response => {
          this.searchAdvisors = response.success.all_advisors
          load(false)
          this.waitFAdvisors = false;
        })
      }
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
