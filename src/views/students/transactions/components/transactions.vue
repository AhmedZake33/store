<template>
  <div>
    <template v-if="!payment_id">
      <b-overlay :show="load" rounded="sm">
        <b-row v-if="details">
          <b-col
            v-for="(item) in details.EGP " :key="item"
            class="m-0 w-100 "
            md="4"
            sm="12"
          >
              <statistic-card-horizontal
                class="w-100"
                :icon="icon ? icon : 'TrendingUpIcon'"
                :statistic="item.sum_paid ? item.sum_paid.toLocaleString() : 0"
                :count="item.count ? item.count.toLocaleString() : 0"
                :statistic-title="$i18n.locale == 'ar' ? item.provider_name_local : item.provider_name"
                :egpIcon="true"
                :color="'success'"
              />
          </b-col>
          <b-col
            v-for="(item) in details.USD " :key="item"
            class="m-0 w-100 "
            md="4"
            sm="12"
          >
              <statistic-card-horizontal
                class="w-100"
                :statistic="item.sum_paid ? item.sum_paid.toLocaleString() : 0"
                :count="item.count ? item.count.toLocaleString() : 0"
                :statistic-title="$i18n.locale == 'ar' ? item.provider_name_local : item.provider_name"
                :egpIcon="false"
                :icon="'DollarSignIcon'"
              />
          </b-col>
        </b-row>
      </b-overlay>
      <!-- <statistics
        :loading="load"
        v-if="details"
        :items="details.provider"
        :icon="'DollarSignIcon'"
        :except="[]"
        :egpIcon="true"
      ></statistics> -->
    </template>
    <DataTable
      :title="title"
      :total="total"
      :allowSearch="true"
      :filter="filter"
      :loading="load"
      @reset="reset"
      @Refresh="refresh"
    >
      <template #filter v-if="lookups">
        <!-- <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.type_id"
            :options="lookups.payments_types"
            label="type"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.payments_types')"
          >
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
            <template #selected-option="{ name, name_local }">
              <div>
                <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                <span v-else>{{ name || name_local }}</span>
              </div>
            </template>
            <template #no-options>
                {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col> -->
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.provider_id"
            :options="lookups.providers"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.payment_way')"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.bank_id"
            :options="options.banks"
            :disabled="filter.provider_id != 16"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('provider')"
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
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.status_id"
            :options="lookups.statuses"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.transaction_status')"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            v-model="filter.year_id"
            :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
            @search="fetchYearsOptions"
            :options="yearsData"
            :filterable="false"
            :reduce="(val) => val.id"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            :placeholder="$t('Global.academic_year')"
          >
            <template slot="no-options">
              {{
                $i18n.locale == "en"
                  ? "Type Year to search"
                  : "أكتب السنة الدراسية للبحث"
              }}
            </template>
            <template #selected-option="{ start_year, end_year }">
              <div style="display: flex; align-items: baseline">
                {{ `${start_year}/${end_year}` }}
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ `${option.start_year}/${option.end_year}` }}
              </div>
            </template>
          </v-select>
        </b-col>
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
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.bylaw_id"
            :options="lookups.bylaws"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.bylaw')"
            :disabled="filter.faculty_id == null && !filter.faculty_id"
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
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.program_id"
            :options="lookups.programs"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.program')"
            :disabled="filter.bylaw_id == null"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.currency_id"
            :options="options.currencies"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('currency')"
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
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            v-model="filter.service_id"
            :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
            @search="fetchServicesOptions"
            :options="servicesData"
            :filterable="false"
            :reduce="(val) => val.id"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            :placeholder="$t('Global.service')"
          >
            <template slot="no-options">
              {{
                $i18n.locale == "en"
                  ? "Type Service Name to search"
                  : "أكتب اسم الخدمة للبحث"
              }}
            </template>
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
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_from"
            ref="date_from"
            v-model="filter.date_from"
            :placeholder="$t('date_from')"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_to"
            ref="date_to"
            v-model="filter.date_to"
            :placeholder="$t('date_to')"
          />
        </b-col>
      </template>
      <template #action>
        <b-button
            v-b-tooltip.hover="$t('Global.export')"
            v-if="hasPermission('export_transaction')"
            class="btn-icon"
            variant="primary"
            :disabled="load"
            @click="exportData()"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button>
        <b-button v-b-tooltip.hover="$t('Global.importMigrationData')"
                  :class="'ml-1'" :disabled="load"
                  class="btn-icon" variant="primary" @click="toggleMigrationModal"
                  v-if="hasPermission('import_migrationData') || hasPermission('import_transactions_migrationData')">
          <feather-icon icon="UploadCloudIcon"/>
        </b-button>
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
          <template #cell(internal_by)="data">
            <!-- <b-media
              v-if="data.item.internal_by"
              vertical-align="center"
              class="d-flex align-items-center"
            >
              <template #aside>
                <b-avatar
                  size="32"
                  :text="avatarText(data.item.internal_by.name)"
                />
              </template>
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.internal_by.id },
                }"
                v-if="$i18n.locale == 'en'"
                v-b-tooltip.hover="data.item.internal_by.name"
                class="font-weight-bold d-block text-nowrap"
              >
                {{
                  data.item.internal_by
                    ? shortMyText(data.item.internal_by.name)
                    : "_"
                }}
              </b-link>
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.internal_by.id },
                }"
                v-if="$i18n.locale == 'ar'"
                v-b-tooltip.hover="data.item.internal_by.name_local"
              >
                {{
                  data.item.internal_by
                    ? shortMyText(data.item.internal_by.name_local)
                    : "_"
                }}
              </b-link>
            </b-media> -->
            <div v-if="data.item.payment.user">
              <b-link
                :to="{
                  name: data.item.user.type == 4 ? 'applicant' : 'student-show',
                  params:
                    data.item.user.type == 4
                      ? { id: data.item.applicant && data.item.applicant.id }
                      : { id: data.item.user && data.item.user.id },
                }"
                v-b-tooltip.hover="$i18n.locale == 'ar' ? data.item.user.name_local : data.item.user.name"
              >
                {{$i18n.locale == 'ar' ?  data.item.payment.user.name_local : data.item.payment.user.name }}
              </b-link>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(provider)="data">
            <b-media
              v-if="data.item.provider"
              vertical-align="center"
              class="d-flex align-items-center"
            >
              <span
                v-if="$i18n.locale == 'en'"
                v-b-tooltip.hover="data.item.provider.name"
                class="font-weight-bold d-block text-nowrap"
              >
                {{ data.item.provider ? data.item.provider.name : "_" }}
                <strong class="d-block">{{
                  data.item.provider.account_number
                }}</strong>
              </span>
              <span
                v-if="$i18n.locale == 'ar'"
                v-b-tooltip.hover="data.item.provider.name_local"
              >
                {{ data.item.provider ? data.item.provider.name_local : "_" }}
                <strong class="d-block">{{
                  data.item.provider.account_number
                }}</strong>
              </span>
            </b-media>
          </template>
          <template #cell(status)="data">
            <b-badge
              pill
              :variant="`${getCustomStatus(data.item.status).color}`"
              class="text-capitalize"
            >
              {{ data.item.status }}
            </b-badge>
          </template>
          <template #cell(currency)="data">
            <div
              v-if="data.item.payment.currency"
            >
              {{$i18n.locale == 'ar' ?  data.item.payment.currency.name_local : data.item.payment.currency.name }}
            </div>
          </template>
          <template #cell(document)="data">
            <a
              v-if="data.item.document"
              :href="data.item.document"
              target="_blank"
              download
              >{{ $t("archive.download") }}</a
            >
          </template>
          <template #cell(created_at)="data">
            <div v-if="data.item.created_at">
              {{
                moment(data.item.created_at).utc().format("YYYY-MM-DD HH:MM:SS")
              }}
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
              <a
                v-if="data.item.document"
                :href="data.item.document"
                target="_blank"
                download
              >
                <feather-icon
                  icon="LinkIcon"
                  v-b-tooltip.hover="$t('Global.attachment')"
                />
              </a>
              <a v-if="data.item.archive_data.url && hasPermission('download_payment_batch')"
              :href="data.item.archive_data.url">
                <feather-icon
                  v-b-tooltip.hover="$t('Download')"
                  icon="DownloadIcon"
                  style="cursor: pointer"
                  class="text-primary"
                />
              </a>
              <b-link :to="{ name: 'transaction', params: { id: data.item.id } }">
                <feather-icon
                  icon="EyeIcon"
                  v-b-tooltip.hover="$t('Global.show')"
                />
              </b-link>
              <b-link>
                <feather-icon
                  v-b-tooltip.hover="$t('Global.delete')"
                  v-if="hasPermission('delete_transaction') && data.item.cancel_transaction == 0 && data.item.provider.id == 16"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="deleteTransaction(data.item)"
                />
              </b-link>
              <!-- <b-link :to="{ name: 'users-edit', params: { id: data.item.id } }" class="mx-1">
                <feather-icon icon="EditIcon" />
              </b-link> -->
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal no-close-on-backdrop ref="my-modal" v-model="importMigrationModal" hide-footer
             :title="$t('Global.importMigrationData')">
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="importForm">
          <b-col md="12">
            <b-form-group class="left_right" :label="$t('Global.upload_files')">
              <validation-provider #default="{ errors }" :rules="'required'">
                <b-form-file multiple accept=".xlsx" v-model="migrationFiles" :placeholder="$t('Global.upload_files')"
                             :drop-placeholder="$t('Global.upload_files')"/>
                <ValidationErrors :default-message="true" :frontend-errors="errors"/>
              </validation-provider>
            </b-form-group>
            <p class="text-dark font-small-3">
              <b class="text-danger">* {{ $t('Global.Hints') }}</b>: {{ $t('Global.transactionsImportMessage') }}
            </p>
          </b-col>
        </validation-observer>
      </div>
      <div class="mt-2" :class="load ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="uploadMigrationData">
              {{ $t('Global.save') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="importMigrationModal = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>

    <b-modal
        ref="my-modal"
        size="lg"
        v-model="statusModal"
        hide-footer
        :title="$t('Global.import_progress')"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
    >
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col
              cols="12"
              md="12"
              class="height-250 overflow-y-scroll"
              v-if="status_messages.length"
          >
            <div
                class="bg-gray"
                v-for="(status_message, index) in status_messages"
                :key="index" v-if="typeof status_message.class !== undefined"
            >
              <b-alert :variant="status_message.class" show>
                <div class="alert-body">
                  <span>
                    {{ (index + 1) + "- " + status_message.message }}
                  </span>
                </div>
              </b-alert>
            </div>
          </b-col>
        </b-form>
      </div>
      <div class="mt-2" v-if="showCloseButton">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
                type="reset"
                variant="outline-primary"
                @click="statusModal = false"
            >
              {{ $t("Global.close") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
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
  BFormDatepicker,
  BCardBody,
  BModal,
  VBModal,
  BPopover, BFormGroup, BForm, BFormFile, BAlert,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal';
import {getToken} from "@/utils/auth";
import {ValidationProvider, ValidationObserver} from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors.vue";
import { required } from '@validations'

export default {
  name: "transactions",
  components: {
    ValidationErrors,
    BAlert,
    BFormFile,
    BForm,
    ValidationProvider,
    ValidationObserver,
    BFormGroup,
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
    BFormDatepicker,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
    Statistics,
    StatisticCardHorizontal
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    payment_id: null,
  },
  data() {
    return {
      zeroStatus: false,
      yearsData: [],
      servicesData: [],
      filter: {
        removed: 0,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        statuses: [],
        order_direction: "DESC",
        date_from: null,
        date_to: null
      },
      importMigrationModal: false,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  watch:{
    'filter.status_id'(val){
      this.zeroStatus = (val == 0) ? true : false
    }
  },
  computed: {
    ...mapGetters({
      items: "transactions/items",
      total: "transactions/total",
      load: "transactions/load",
      lookups: "transactions/lookups",
      details: "transactions/details",
      options: "app/lookups",
    }),
    fields() {
      let fields = [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: true,
        },
        {
          key: "internal_by",
          label: this.$t("Global.user"),
          sortable: true,
        },
        {
          key: "amount",
          label: this.$t("amount"),
          sortable: true,
        },
        {
          key: "created_at",
          label: this.$t("Global.created_at"),
          sortable: true,
        },
        //  {
        //      key: 'document',
        //      label:this.$t('Global.paymentFile'),
        //  },
        {
          key: "provider",
          label: this.$t("Global.payment_way"),
        },
        {
          key: "paid",
          label: this.$t("Global.paid"),
          sortable: true,
        },
        {
          key: "currency",
          label: this.$t("Global.currency"),
          sortable: true,
        },
        {
          key: "pay_date",
          label: this.$t("Global.paid_at"),
          sortable: true,
        },
        {
          label: this.$t("Global.transaction_status"),
          key: "status",
          sortable: true,
        },
        {
          label: this.$t("Global.actions"),
          key: "actions",
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      return fields;
    },
  },
  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
      lookupsMethod: "students/lookup",
      cancelTransaction: "transactions/cancelTransaction"
    }),
    refresh(query) {
      let data = { banks: true, currencies: true};
      if (this.faculty_id) {
        data = {
          ...data,
          faculty_id_programs: this.faculty_id,
          allow_programs: true,
        };
      }
      this.getLookups(data).then((res) => {
        if (this.payment_id) {
          query = { ...query, payment_id: this.payment_id };
        }
        query.status_id = this.zeroStatus ? 0 : query.status_id;
        this.$store.dispatch("transactions/transactions", { query: query })
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
    getCustomStatus(status){
        if(status == -2 || status == 'Not Verified'){
            return{
                color: 'warning',
                name: 'Not Verified'
            }
        }else if(status == -1 || status == 'Incomplete'){
            return{
                color: 'light-warning',
                name: 'Incomplete'
            }
        }else if(status == 0 || status == 'New'){
            return{
                color: 'light-primary',
                name: 'New'
            }
        }else if(status == 1 || status == 'Paid'){
            return{
                color: 'light-success',
                name: 'Paid'
            }
        }else if(status == 2 || status == 'Unpaid'){
            return{
                color: 'danger',
                name: 'Unpaid'
            }
        }else if(status == 3 || status == 'Expired'){
            return{
                color: 'primary',
                name: 'Expired'
            }
        }
    },
    fetchYearsOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_years_keyword: search,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.yearsData = res.success.years;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    exportData(){
      if(this.payment_id){
        this.filter.payment_id = this.payment_id
      }
      this.$store.dispatch('transactions/exportData', {
        query: this.filter
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("Done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
            showConfirmButton: false,
            timer: 1500,
          });
            const errors = [error.response.data.errors];
            errors.forEach((error, index) => {
            const error_data = Object.values(error)[index][0];
            this.errorsdata = error;
          });
      });
    },
    fetchServicesOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_services_keyword: search,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.servicesData = res.success.services;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    toggleMigrationModal() {
      this.importMigrationModal = !this.importMigrationModal;
    },
    async uploadMigrationData() {
      this.$refs.importForm.validate().then(success => {
        if (success) {
          this.$swal({
            title: "Are you sure?",
            text: `${this.$t("Global.confirmUpload")}`,
            icon: "warning",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: `${this.$t("Global.cancel")}`,
            confirmButtonText: `${this.$t("Global.yes_import")}`,
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
          }).then(async (result) => {
            if (result.value) {
              this.total_message = "";
              this.status_messages = [];
              this.statusModal = true;
              this.showCloseButton = false;

              const data = new FormData();
              for (let i = 0; i < this.migrationFiles.length; i++) {
                let file = this.migrationFiles[i];
                data.append('files[' + i + ']', file);
              }
              let url = process.env.VUE_APP_BASE_URL + "/transactions/import_migrated_transactions";
              const response = await fetch(url, {
                headers: {
                  Authorization: "Bearer " + getToken(),
                },
                method: "POST",
                body: data,
              });
              let isDone = false;
              const reader = response.body
                  .pipeThrough(new TextDecoderStream())
                  .getReader();
              while (!isDone) {
                const {value, done} = await reader.read();
                if (done || isDone) {
                  this.migrationFiles = [];
                  this.toggleMigrationModal();
                  this.refresh(this.filter);
                  this.showCloseButton = true;
                  this.$swal({
                    icon: "success",
                    title: this.$t("Global.success"),
                    showConfirmButton: true,
                    text: this.$t("Global.import_done_successfully"),
                  });
                  break;
                }

                let allObjects = typeof value !== "undefined" ? value.split("}") : {};
                if (allObjects.length) {
                  for (let i = 0; i < allObjects.length; i++) {
                    if (allObjects[i].trim() !== "" && allObjects[i].trim()) {
                      let object = allObjects[i] + "}";
                      object = JSON.parse(object);
                      if (object.done === false && object.failed === false) {
                        this.setStatusesMessages(object);
                      } else if (object.done === true && object.failed === false) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh(this.filter);
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "success",
                          title: this.$t("Global.success"),
                          showConfirmButton: true,
                          text: this.$t("Global.import_done_successfully"),
                        });
                      } else if (object.failed === true) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh(this.filter);
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "error",
                          title: this.$t("Global.failed"),
                          showConfirmButton: true,
                          text: object.message,
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
    setStatusesMessages(object) {
      if (typeof object.done !== undefined) {
        let status_message = {};
        status_message.status = object.status;
        status_message.class = object.status ? 'success' : 'danger';
        status_message.message = object.message;
        this.status_messages.push(status_message);
      }
      return true;
    },
    deleteTransaction(transaction){
      this.$swal({
        title: `${this.$t("Global.confirmMessage")}`,
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.yes")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.cancelTransaction(transaction).then(_=>{
            this.refresh(this.filter)
            this.$emit('refresh');

            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            })
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          })
        }else {
          this.$swal({
            type: "error",
            text: response.error,
            icon: "error",
            showConfirmButton: true,
            timer: 5000,
          });
        }
      })
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
@import "@core/scss/vue/libs/vue-select.scss";
</style>
