<template>

          <div>
            <DataTable
    :total="total"
    :allow-search="true"
    :filter="filter"
    @Refresh="refresh"
    @reset="reset"
    :params-loaded="paramsLoaded"
  >
    <template v-if="lookups" #filter>
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.faculty_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.faculties"
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
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
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.bylaw')"
          :disabled="!filter.faculty_id"
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
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
          class="w-100 mb-2"
          :reduce="val => val.id"
          :placeholder="$t('Global.program')"
          :disabled="!filter.bylaw_id"
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
          <b-link
            class="font-weight-bold d-inline-block text-nowrap"
            :to="{ name: 'ticket_group_show', params: { id: data.item.id } }"
          >
            {{ getTranslatedNameFromObject(data.item) }}
          </b-link>
        </template>
        <template #cell(faculty)="data">
          {{ getTranslatedNameFromObject(data.item.faculty) }}
        </template>
        <template #cell(bylaw)="data">
          {{ getTranslatedNameFromObject(data.item.bylaw) }}
        </template>
        <template #cell(program)="data">
          {{ getTranslatedNameFromObject(data.item.program) }}
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
            <feather-icon
                    v-if="hasPermission('edit_ticketGroup')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    @click="openEdit(data.item)"
                  />
                
            <feather-icon
            v-if="hasPermission('delete_ticketGroup')"
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="remove(data.item)"
            />
            
          </div>
        </template>
      </b-table>
    </template>
    <template #action>
      <b-button
        :to="{ name: 'ticket_group_add'}"
        class="btn-icon "
        variant="primary"
        v-if="hasPermission('edit_ticketGroup')"
      >
        <feather-icon
          icon="PlusIcon"
        />
      </b-button>
    </template>
  </DataTable>
          </div>
  
</template>

<script>
import {
  BCol,
  BButton,
  BTable,
  BLink,
  BSpinner,
  VBModal,
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import Edit from '@/views/administration/management/ticket_groups/components/edit'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

export default {
  components: {
    Edit,
    DataTable,
    vSelect,
    BSpinner,
    BCol,
    BButton,
    BTable,
    BLink,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      edit:false,
      link: '',
      editItem:null,
      filter: { faculty_id:null, bylaw_id:null, program_id:null },
      paramsLoaded: true,
    }
  },
  computed: {
    ...mapGetters({
      items: 'ticketGroups/items',
      total: 'ticketGroups/total',
      load: 'ticketGroups/load',
      lookups: 'ticketGroups/lookups',
      needDrop:'app/needDrop',
    }),
    fields() {
      return [
        {
          label: this.$t('name'),
          key: 'name',
          sortable: false,
        },
        {
          label: this.$t('bylaw'),
          key: 'bylaw',
          sortable: false,
        },
        {
          label: this.$t('faculty'),
          key: 'faculty',
          sortable: false,
        },
        {
          label: this.$t('program'),
          key: 'program',
          sortable: false,
        },
        {
          label: this.$t('actions'),
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    }
  },
  methods: {
    ...mapActions({
      getItem: 'ticketGroups/list',
      removeItem: 'ticketGroups/remove',
    }),
    openEdit(item) {
      // this.edit = true
      // this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true })
      // let currentPath = this.$route.path;
      //         let queryParams = { ...this.$route.query };

      //         // Remove "perPage" query parameter
      //         delete queryParams.perPage;

      //         // Construct new URL without "perPage" query parameter
      //         let query = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
      //         let newUrl = `${currentPath}?${query}`;
      this.$router.push({ 
        path: 'ticket-groups/' + item.id,
        query: { inline: true }
      });
      // this.edit=true;
      // this.editItem=item;

    },
    refresh(query) {
      this.$store.dispatch('ticketGroups/list', { query }).then((res)=>{
        this.paramsLoaded = false;
      })
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
    remove(item) {
      this.deleteConfirmPopup(() => {
        this.removeItem(item.id).then(response => {
          this.refresh()
          this.successDeleteAlert()
        }).catch(error => {
          this.errorDeleteAlert(10000,this.$t(error.errors[0]["title"]))
        })
      })
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
