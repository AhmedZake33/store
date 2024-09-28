<template>
  <DataTable
    :total="total"
    :allow-search="true"
    :filter="filter"
    @Refresh="refresh"
  >
    <template v-if="lookups" #filter>
      <b-col cols="12" md="4">
        <v-select
          v-model="filter.status"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.status"
          label="name"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.status')"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.faculty_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.faculties"
          label="name"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.faculty')"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.bylaw_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.bylaws"
          label="name"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.bylaw')"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.program_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.programs"
          label="name"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.program')"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.applicant_type_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.admission_types"
          label="name"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.admission_type')"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList()"
          class="w-100"
          :reduce="val => val.value"
          placeholder="Status"
        />
      </b-col>
    </template>
    <template #customTable>
      <b-table
        :busy="load"
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
            <b-spinner class="align-middle" />
          </div>
        </template>
        <template #cell(name)="data">
            <b-link v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item && data.item.name ? data.item.name_local : '-'"
              class="font-weight-bold d-inline-block text-nowrap"
              :to="{ name: 'applicant', params: { id: data.item.id } }"
            >
              {{data.item && data.item.name_local ? data.item.name_local : '-'}}
            </b-link>
            <b-link v-if="$i18n.locale == 'en'" v-b-tooltip.hover=" data.item && data.item.name ? data.item.name : '-' "
              class="font-weight-bold d-inline-block text-nowrap"
              :to="{ name: 'admission-show', params: { id: data.item.id } }">
              {{ data.item && data.item.name ? data.item.name : '-' }}
            </b-link>
        </template>
        <template #cell(bylaw)="data">
          <b-link v-if="$i18n.locale == 'en' && data.item.bylaw" v-b-tooltip.hover="data.item.bylaw.name"
            :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }" class="font-weight-bold d-block text-nowrap text-truncate">
            {{ data.item ? shortMyText(data.item.bylaw.name, 20) : '_' }}
          </b-link>
          <b-link v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.bylaw.name_local" :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }">
            {{data.bylaw.item ? shortMyText(data.item.bylaw.name_local, 20) : '_'}}
          </b-link>
        </template>
        <template #cell(faculty)="data">
          <b-link v-if="$i18n.locale == 'en' && data.item.faculty" v-b-tooltip.hover="data.item.faculty.name"
            :to="{ name: 'faculty', params: { id: data.item.id } }" class="font-weight-bold d-block text-nowrap text-truncate">
            {{ data.item.faculty ? data.item.faculty.name : '_' }}
          </b-link>
          <b-link v-if="$i18n.locale == 'ar' && data.item.faculty"
            v-b-tooltip.hover="data.item.faculty.name_local" :to="{ name: 'faculty', params: { id: data.item.id } }">
            {{ data.item.faculty ? data.item.faculty.name_local : '_' }}
          </b-link>
        </template>
        <template #cell(program)="data">
          <b-link v-if="$i18n.locale == 'en' && data.item.program" v-b-tooltip.hover="data.item.name"
            :to="{ name: 'program', params: { id: data.item.id } }" class="font-weight-bold d-block text-nowrap text-truncate">
            {{ data.item.program ? data.item.program.name : '_' }}
          </b-link>
          <b-link v-if="$i18n.locale == 'ar' && data.item.program" v-b-tooltip.hover="data.item.name_local" :to="{ name: 'program', params: { id: data.item.id } }">
            {{ data.item.program ? data.item.program.name_local : '_' }}
          </b-link>
        </template>
        <template #cell(term)="data">
          <b-link v-if="$i18n.locale == 'en' && data.item.term" v-b-tooltip.hover="data.item.name"
                  :to="{ name: 'term', params: { id: data.item.id } }" class="font-weight-bold d-block text-nowrap text-truncate">
            {{ data.item.term ? data.item.term.name : '_' }}
          </b-link>
          <b-link v-if="$i18n.locale == 'ar' && data.item.term" v-b-tooltip.hover="data.item.name_local"
            :to="{ name: 'term', params: { id: data.item.id } }">
            {{ data.item.term ? data.item.term.name_local : '_' }}
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
            <feather-icon class="pointer" icon="EditIcon" @click=" $router.push({ name: 'settings-edit', params: { id: data.item.id },  })"/>

            <feather-icon icon="Trash2Icon" class="text-danger pointer" @click="remove(data.item.id)"/>
          </div>
        </template>
      </b-table>
    </template>
    <template #action>
      <b-dropdown :right="$store.state.appConfig.layout.isRTL" variant="primary">
            <template #button-content> Action</template>
            <b-dropdown-item @click="$router.push({ name: 'settings-add'})">
                <feather-icon icon="PlusIcon" v-b-tooltip.hover="$t('Global.add')"/>
                <span class="align-middle ml-50">{{$t('Global.add')}}</span>
            </b-dropdown-item>
        </b-dropdown>
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
  BSpinner,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter'
import DataTable from '@/views/components/table/DataTable'

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
      link: '',
      filter: { export: 0 },
      fields: [
        {key: 'year', sortable: true, thStyle: { width: '5%' },},
        {key: 'name', sortable: true, thStyle: { width: '5%' },},
        {
          key: 'bylaw',
          sortable: true,
        },
        {
          key: 'faculty',
          sortable: true,
        },
        {
          key: 'program',
          sortable: true,
        },
        {
          key: 'term',
          sortable: true,
        },

        {
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      items: 'settings/items',
      total: 'settings/total',
      load: 'settings/load',
      lookups: 'settings/lookups',
      needDrop:'app/needDrop',
    }),
  },
  methods: {
    refresh(query) {
      this.$store.dispatch('settings/settings', { query })
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
