<template>
  <DataTable
    :total="total"
    :allow-search="true"
    :params-loaded="paramsLoaded"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
  >
    <template #filter v-if="lookup">
      <!--Table Name-->
      <b-col cols="12" md="3">
        <b-form-group>
          <v-select
            v-model="filter.table_name"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookup.tables"
            :get-option-key="(option) => option.table_name"
            :get-option-label="(option) => option.table_name"
            class="w-100 mb-2"
            :clearable="true"
            :reduce="(val) => val.table_name"
            :placeholder="$t('Global.table')"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <!--Action-->
      <b-col cols="12" md="3">
        <b-form-group>
          <v-select
            v-model="filter.action"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookup.actions"
            class="w-100 mb-2"
            :clearable="true"
            :reduce="(val) => val"
            :placeholder="$t('Global.action')"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <!--Created by-->
      <b-col cols="12" md="3">
        <b-form-group>
          <v-select
            id="mc-members"
            v-model="filter.created_by"
            :filter="fuseSearch"
            :options="createdByUsers"
            :label="getSelectLabel()"
            class="w-100"
            :placeholder="$t('Global.created_by')"
            :filterable="false"
            clearable
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :reduce="(val) => val.id"
            @search="fetchCreatedBy"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
            <template
              #selected-option-container="{
                option,
                deselect,
                multiple,
                disabled,
              }"
            >
              <div class="vs__selected">
                {{
                  $i18n.locale == 'ar'
                    ? wrapText(option.name_local)
                    : wrapText(option.name)
                }}
              </div>
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <!--Model-->
      <b-col cols="12" md="3">
        <b-form-group>
          <v-select
            v-model="filter.model"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookup.models"
            class="w-100 mb-2"
            :clearable="true"
            :reduce="(val) => val"
            :placeholder="$t('Global.applied_to')"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
            <template
              #selected-option-container="{
                option,
                deselect,
                multiple,
                disabled,
              }"
            >
              <div class="vs__selected">{{ wrapText(option.label) }}</div>
            </template>
          </v-select>
        </b-form-group>
      </b-col>

      <!--Model ID-->
      <b-col cols="12" md="3" v-if="isUser">
        <b-form-group>
          <v-select
            id="mc-affected-id"
            v-model="filter.affected_id"
            :filter="fuseSearch"
            :options="affectedUsers"
            :label="getSelectLabel()"
            class="w-100"
            :placeholder="$t('Global.affected_user')"
            :filterable="false"
            clearable
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :reduce="(val) => val.id"
            @search="fetchAffectedUsers"
          >
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
            <template
              #selected-option-container="{
                option,
                deselect,
                multiple,
                disabled,
              }"
            >
              <div class="vs__selected">
                {{
                  $i18n.locale == 'ar'
                    ? wrapText(option.name_local)
                    : wrapText(option.name)
                }}
              </div>
            </template>
          </v-select>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="3" v-else>
        <b-form-group>
          <b-form-input
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="affected_id" :placeholder="$t('Global.affected_id')"
              @keydown.enter.native="applyFilter"
              @keypress="sanitizeArabic($event); sanitizeEnglish($event);"
          />
        </b-form-group>
      </b-col>

      <b-col md="3">
        <b-form-group>
          <flat-pickr
            :placeholder="$t('Global.from_date')"
            v-model="filter.from_date"
            class="form-control"
          />
        </b-form-group>
      </b-col>

      <b-col md="3">
        <b-form-group>
          <flat-pickr
            :placeholder="$t('Global.to_date')"
            v-model="filter.to_date"
            class="form-control"
          />
        </b-form-group>
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
        <template #cell(created_at)="data">
          <span class="text-nowrap">{{
            toLocalDatetime(data.item.created_at, 'EN', true)
          }}</span>
        </template>

        <template #cell(action)="data">
          <span class="text-nowrap">{{ data.item.action }}</span>
        </template>

        <template #cell(name)="data">
          <b-media
            vertical-align="center"
            v-if="data.item.user"
            class="d-flex align-items-center"
          >
            <template #aside>
              <b-avatar size="32" :text="avatarText(data.item.user.name)" />
            </template>
            <b-link
              class="font-weight-bold d-block text-nowrap"
              :to="{ name: 'user-show', params: { id: data.item.user.id } }"
            >
              {{ data.item.user.name }}
            </b-link>
            <small class="text-muted">{{ data.item.user.name_local }}</small>
          </b-media>
        </template>

        <template #cell(model)="data">
          <span class="text-nowrap">{{ data.item.model }}</span>
        </template>

        <template #cell(affected_user)="data">
          <span class="text-nowrap">{{
            data.item.affected_user
              ? getTranslatedName(data.item.affected_user)
              : '-'
          }}</span>
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
                name: 'log',
                params: { id: data.item.id, tableName: filter.table_name },
              }"
            >
              <feather-icon icon="EyeIcon" />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>

<script>
import {
  BCard,
  BFormGroup,
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
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import DataTable from '@/views/components/table/DataTable';
import flatPickr from 'vue-flatpickr-component';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    BCard,
    flatPickr,
    BRow,
    BFormGroup,
    DataTable,
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

    vSelect,
  },
  data() {
    return {
      isUser: false,
      affected_id: null,
      filter: {
        removed: 0,
        table_name: 'logs',
        action: 0,
        model: 0,
        created_by: null,
        affected_id: null,
        order_direction: true,
      },
      paramsLoaded: true,
      createdByUsers: [],
      affectedUsers: [],
    };
  },
  beforeMount() {
    this.filter = {
      removed: 0,
      table_name: 'logs',
      action: 0,
      model: 0,
      created_by: null,
      affected_id: null,
      order_direction: true
    };
  },
  computed: {
    ...mapGetters({
      items: 'log/items',
      total: 'log/total',
      load: 'log/load',
      lookup: 'log/lookup',
      users: 'users/items',
      needDrop: 'app/needDrop',
    }),
    fields() {
      return [
        {
          key: 'created_at',
          label: this.$t('Global.date'),
          sortable: true,
        },
        {
          key: 'action',
          label: this.$t('Global.action'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        {
          key: 'model',
          label: this.$t('Global.applied_to'),
          sortable: true,
        },
        {
          key: 'affected_user',
          label: this.$t('Global.affected_name'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
  },
  watch: {
    filter: {
      handler: function (newValue) {
        if (newValue.model) {
          if (
            newValue.model.includes('User') ||
            newValue.model.includes('Employee') ||
            newValue.model.includes('Student') ||
            newValue.model.includes('Instructor')
          )
            this.isUser = true;
          else this.isUser = false;
        } else {
          this.isUser = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
    }),
    refresh(query) {
      this.$store.dispatch('log/getLogs', { query: query }).then((res) => {
        this.paramsLoaded = false;
      });
    },
    fetchCreatedBy(search, load) {
      this.fetchUsers(search, load, 'created_by');
    },
    fetchAffectedUsers(search, load) {
      this.fetchUsers(search, load, 'affected_users');
    },
    reset() {
      let terms = [
        'term_id',
        'admission_term_id',
        'admission_term_PG_id',
        'admission_term_UG_id',
        'control_term_id',
        'exam_term_id',
        'transfer_term_id',
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != 'removed' && key != 'export') {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    fetchUsers(search, load, from) {
      if (search.length >= 3 && !this.waitFetchUsers) {
        this.waitFetchUsers = true;
        load(true);
        const query = {
          search_all_users_keyword: search,
        };

        this.getLookups(query).then((response) => {
          if (from == 'created_by')
            this.createdByUsers = response.success.all_users;
          else this.affectedUsers = response.success.all_users;

          load(false);
          this.waitFetchUsers = false;
        });
      }
    },
    applyFilter() {
      this.filter.affected_id = this.affected_id;
    }
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
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
