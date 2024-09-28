<template>
  <DataTable :total="total" :allowSearch="true" :filter="filter" @Refresh="refresh">
    <template #filter v-if="lookups">
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.bylaw_id" :options="lookups.bylaws" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.bylaws')" />
      </b-col>
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.program_id" :options="lookups.programs" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.programs')" />
      </b-col>
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.level_id" :options="lookups.levels" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.level')" />
      </b-col>
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.term_id" :options="lookups.terms" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.term')" />
      </b-col>
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.first_term_id" :options="lookups.terms" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.first_term')" />
      </b-col>
    </template>
    <template #customTable>
      <b-table :busy="load"           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative" :items="items" responsive :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(name)="data">
          <b-media vertical-align="center" class="d-inline-flex align-items-center">
            <template #aside>
              <b-avatar size="32" :text="avatarText(data.item.student.name)" />
            </template>
            <b-link v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.student && data.item.student.name ? data.item.student.name_local : '-'" class="font-weight-bold d-inline-block text-nowrap" :to="{ name: 'student-show', params: { id: data.item.id } }">
              {{ data.item.student && data.item.student.name_local ? shortMyText(data.item.student.name_local) : '-' }}
            </b-link>
            <b-link class="font-weight-bold d-inline-block text-nowrap" :to="{ name: 'student-show', params: { id: data.item.id } }" v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item.student && data.item.student.name ? data.item.student.name : '-'">
              {{ data.item.student && data.item.student.name ? shortMyText(data.item.student.name) : '-' }}
            </b-link>
          </b-media>
        </template>
        <template #cell(code)="data">
          <div>
            {{ data.item.student && data.item.student.code ? data.item.student.code : '-' }}
          </div>
        </template>
        <template #cell(term)="data">
          <div>
            <b-link v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item.term.name" class="font-weight-bold d-block text-nowrap">
              {{ data.item.term ? shortMyText(data.item.term.name) : '_' }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.term.name_local">
              {{ data.item.term ? shortMyText(data.item.term.name_local) : '_' }}
            </span>
          </div>
        </template>
        <template #cell(level)="data">
          <div>
            <b-link v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item.level.name" class="font-weight-bold d-block text-nowrap">
              {{ data.item.level ? shortMyText(data.item.level.name) : '_' }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.level.name_local">
              {{ data.item.level ? shortMyText(data.item.level.name_local) : '_' }}
            </span>
          </div>
        </template>
        <template #cell(program)="data">
          <div>
            <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
              {{ data.item.program && data.item.program.bylaw ? data.item.program.bylaw.name : '-' }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'">
              {{ data.item.program && data.item.program.bylaw ? data.item.program.bylaw.name_local : '-' }}
            </span>
            <br v-if="$i18n.locale == 'ar'" />
            <b-link v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item.program && data.item.program ? data.item.program.name : '-'" class="font-weight-bold d-block text-nowrap">
              {{ data.item.program && data.item.program ? shortMyText(data.item.program.name, 65) : '-' }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.program && data.item.program ? data.item.program.name_local : '-'">
              {{ data.item.program && data.item.program ? shortMyText(data.item.program.name_local, 65) : '-' }}
            </span>
          </div>
        </template>
        <template #cell(actions)="data">
          <div >
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
            <b-link :to="{ name: 'student-show', params: { id: data.item.id } }">
              <feather-icon icon="EyeIcon" />
            </b-link>
            <b-link :to="{ name: 'users-edit', params: { id: data.item.id } }" class="mx-1">
              <feather-icon icon="EditIcon" />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BSpinner, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover } from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable';
import { mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { avatarText } from '@core/utils/filter';

export default {
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BSpinner,
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
  data() {
    return {
      filter: {},
      fields: [
        {
          key: 'term',
          sortable: true,
          thStyle: { width: '5%' },
        },
        {
          key: 'student',
          sortable: true,
          thStyle: { width: '10%' },
        },
        {
          key: 'count',
          sortable: true,
          thStyle: { width: '10%' },
        },
        {
          key: 'score',
          sortable: true,
        },
        {
          key: 'STD',
          sortable: true,
        },
        {
          key: 'comments',
          sortable: true,
        },
        {
          key: 'status',
          sortable: true,
        },
        {
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      items: 'graduate_questionnaires/items',
      total: 'graduate_questionnaires/total',
      load: 'graduate_questionnaires/load',
      needDrop:'app/needDrop',
      lookups: 'graduate_questionnaires/lookups',
    }),
  },
  methods: {
    refresh(query) {
      query = { ...query, type: this.type };
      this.$store.dispatch('graduate_questionnaires/questionnaires', { query: query });
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
