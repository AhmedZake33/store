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
        <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.term_id" :options="lookups.terms" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.term')" />
      </b-col>
      <b-col cols="12" md="4">
        <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.first_term_id" :options="lookups.terms" label="name" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.first_term')" />
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
            <b-link v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item && data.item.name ? data.item.name_local : '-'" class="font-weight-bold d-inline-block text-nowrap" :to="{ name: 'form', params: { id: data.item.id } }">
              {{ data.item && data.item.name_local ? data.item.name_local : '-' }}
            </b-link>
            <b-link class="font-weight-bold d-inline-block text-nowrap" :to="{ name: 'form', params: { id: data.item.id } }" v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item && data.item.name ? data.item.name : '-'">
              {{ data.item && data.item.name ? data.item.name : '-' }}
            </b-link>
          </b-media>
        </template>
        <template #cell(status)="data">
          <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
            {{ getStatus(data.item.removed).name }}
          </b-badge>
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
            <!-- <b-link :to="{ name: 'form', params: { id: data.item.id } }">
              <feather-icon icon="EyeIcon" />
            </b-link> -->
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
          label: '#',
          key: 'id',
          sortable: true,
          thStyle: { width: '5%' },
        },
        {
          label: 'Name',
          key: 'name',
          sortable: true,
          thStyle: { width: '30%' },
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
      items: 'forms/items',
      total: 'forms/total',
      load: 'forms/load',
      needDrop:'app/needDrop',
      lookups: 'forms/lookups',
    }),
  },
  methods: {
    refresh(query) {
      query = { ...query, type: this.type };
      this.$store.dispatch('forms/forms', { query: query });
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
