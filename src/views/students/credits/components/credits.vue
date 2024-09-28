<template>
  <div>
    <statistics
      v-if="user_id"
      :loading="load"
      :items="{ balance: details.Deposit - details.Withdraw }"
      :egpIcon="true"
      :icon="'DollarSignIcon'"
      :except="[]"
    ></statistics>
    <statistics
      v-else
      :loading="load"
      :items="details"
      :egpIcon="true"
      :icon="'DollarSignIcon'"
      :except="[]"
    ></statistics>
    <DataTable
      :total="total"
      :allowSearch="true"
      :filter="filter"
      :loading="load"
      @reset="reset"
      @Refresh="refresh"
      :paramsLoaded="paramsLoaded"
    >
      <template #filter v-if="lookups">
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            v-model="filter.user_id"
            :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
            @search="fetchOptions"
            :options="usersData"
            :filterable="false"
            :reduce="(val) => val.id"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            :placeholder="$t('Global.created_by')"
          >
            <template slot="no-options">
              {{
                $i18n.locale == "en"
                  ? "Type Student Code or Name to search"
                  : "أكتب كود الطالب او اسمه للبحث"
              }}
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
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.type_id"
            :options="lookups.types"
            label="type"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.types')"
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
                <span v-if="$i18n.locale == 'ar'">{{
                  name_local || name
                }}</span>
                <span v-else>{{ name || name_local }}</span>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <!-- <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.payment_type_id"
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
        <b-col cols="12" md="4">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.removed"
            :options="getStatusList(true)"
            class="w-100"
            :reduce="(val) => val.value"
            :placeholder="$t('Global.status')"
          >
            <template slot="selected-option" slot-scope="option">
              <span>
                {{ $t(`Global.${option.label}`) }}
              </span>
            </template>
            <template v-slot:option="option">
              {{ $t(`Global.${option.label}`) }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(user)="data">
            <!-- <b-media vertical-align="center" class="d-flex align-items-center">
              <template #aside>
                <b-avatar size="32" :text="avatarText(data.item.user.name)" />
              </template>
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'user-show', params: { id: data.item.user.id } }"
                v-b-tooltip.hover="data.item.user.name"
                class="font-weight-bold d-block text-nowrap"
              >
                {{ data.item.user ? shortMyText(data.item.user.name) : "_" }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'user-show', params: { id: data.item.user.id } }"
                v-b-tooltip.hover="data.item.user.name_local"
              >
                {{ data.item.user ? shortMyText(data.item.user.name_local) : "_" }}
              </b-link>
            </b-media> -->
            <div v-if="data.item.user">
              <b-link
                :to="{ name: 'user-show', params: { id: data.item.user.id } }"
                v-b-tooltip.hover="
                  $i18n.locale == 'ar'
                    ? data.item.user.name_local
                    : data.item.user.name
                "
              >
                {{
                  $i18n.locale == "ar"
                    ? data.item.user.name_local
                    : data.item.user.name
                }}
              </b-link>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(created_by)="data">
            <!-- <b-media
              v-if="data.item.created_by"
              vertical-align="center"
              class="d-flex align-items-center"
            >
              <template #aside>
                <b-avatar
                  size="32"
                  :text="avatarText(data.item.created_by.name)"
                />
              </template>
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.created_by.id },
                }"
                v-if="$i18n.locale == 'en'"
                v-b-tooltip.hover="data.item.user.name"
                class="font-weight-bold d-block text-nowrap"
              >
                {{
                  data.item.created_by
                    ? shortMyText(data.item.created_by.name)
                    : "_"
                }}
              </b-link>
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.created_by.id },
                }"
                v-if="$i18n.locale == 'ar'"
                v-b-tooltip.hover="data.item.user.name_local"
              >
                {{
                  data.item.created_by
                    ? shortMyText(data.item.created_by.name_local)
                    : "_"
                }}
              </b-link>
            </b-media>
            <span v-else>_</span> -->
            <div v-if="data.item.created_by">
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.created_by.id },
                }"
                v-b-tooltip.hover="
                  $i18n.locale == 'ar'
                    ? data.item.created_by.name_local
                    : data.item.created_by.name
                "
              >
                {{
                  $i18n.locale == "ar"
                    ? data.item.created_by.name_local
                    : data.item.created_by.name
                }}
              </b-link>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(created_at)="data">
            <span v-if="data.item.created_at">
              {{
                moment(data.item.created_at).utc().format("YYYY-MM-DD HH:MM:SS")
              }}
            </span>
            <span v-else>_</span>
          </template>
          <template #cell(type)="data">
            <b-badge pill variant="light-primary" class="text-capitalize">
              {{
                $i18n.locale == "ar"
                  ? data.item.type.name_local
                  : data.item.type.name
              }}
            </b-badge>
          </template>
          <template #cell(service)="data">
            <div v-if="data.item">
              {{
                $i18n.locale == "ar"
                  ? data.item.payment.service.name_local
                  : data.item.payment.service.name
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
              <b-link :to="{ name: 'credit', params: { id: data.item.id } }">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="user_id">
        <b-button
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.cashback')"
          variant="primary"
          @click="openCashbackModal()"
        >
          {{ $t("Global.cashback") }}
        </b-button>
        <b-button
          class="btn-icon ml-1"
          v-b-tooltip.hover="$t('Global.charge_wallet')"
          variant="primary"
          @click="openChargeWalletModal()"
        >
          {{ $t("Global.charge_wallet") }}
        </b-button>
      </template>
    </DataTable>
    <b-modal
      ref="cashback_modal"
      no-close-on-backdrop
      @hide="resetCashbackModal"
      v-model="cashbackModal"
      :title="$t('Global.cashback')"
      size="lg"
    >
      <validation-observer ref="simpleRulesCashback">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('amount')"
                label-for="amount"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                  :rules="`required|between:0,${
                    details.Deposit - details.Withdraw
                  }`"
                >
                  <b-form-input
                    v-model="cashbackForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <!-- <ValidationErrors :frontend-errors="validationErrorMessage(errors)" /> -->
                  <ValidationErrors
                    :frontend-errors="validationErrorMessage(errors)"
                    :backend-errors="getBackendFieldError(errorsdata, 'amount')"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.file')" label-for="code-input">
                <validation-provider
                  #default="{ errors }"
                  :name="$t('file')"
                >
                  <b-form-file
                    v-model="cashbackForm.file"
                    :placeholder="$t('Global.paymentFile')"
                    drop-placeholder="Drop file here..."
                  />
                  <ValidationErrors
                    default-message
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'file')"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.notes')"
                  rules="required"
                >
                  <b-form-textarea id="notes" v-model="cashbackForm.notes" />
                  <ValidationErrors
                    default-message
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'notes')"
                  />
                  <!-- <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small> -->
                </validation-provider>
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit"
            >
              {{ $t("Global.submit") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.cashback_modal.hide()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="chargeWallet_modal"
      no-close-on-backdrop
      @hide="resetChargeWalletModal"
      v-model="chargeWalletModal"
      :title="$t('Global.charge_wallet')"
      size="lg"
    >
      <b-overlay
        :show="lookupsLoad"
        rounded="sm"
      >
      <validation-observer ref="simpleRulesChargeWallet">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('amount')"
                label-for="amount"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                  :rules="`required`"
                >
                  <b-form-input
                    v-model="chargeWalletForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors
                    :frontend-errors="validationErrorMessage(errors)"
                    :backend-errors="getBackendFieldError(errorsdata, 'amount')"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                :label="$t('Provider')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="chargeWalletForm.provider"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks : []"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local +
                            "(" +
                            option.account_number +
                            ")"
                          : option.name + "(" + option.account_number + ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <div v-if="$i18n.locale == 'ar'">{{
                          name_local + "(" + account_number + ")"
                        }}</div>
                        <div v-else
                          >{{ name + "(" + account_number + ")" }}
                        </div>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      </b-overlay>

      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitChargeWallet"
            >
              {{ $t("Global.submit") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="chargeWalletModal = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
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
  BCardBody,
  BModal,
  BFormGroup,
  BForm,
  BFormFile,
  VBModal,
  BFormTextarea,
  BPopover,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: "credits",
  components: {
    Statistics,
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    ValidationProvider,
    ValidationErrors,
    ValidationObserver,
    BCardBody,
    BFormInput,
    BButton,
    BForm,
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
    BFormGroup,
    BFormFile,
    BFormTextarea,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    user_id: null,
    noStatus: Boolean,
  },
  data() {
    return {
      filter: {
        removed: 0,
        order_direction: true,
        user_id: null,
        type_id: null,
      },
      cashbackForm: {
        amount: null,
        notes: null,
        file: null,
      },
      chargeWalletForm:{
        amount: null,
        provider: null
      },
      errorsdata: {},
      cashbackModal: false,
      chargeWalletModal:false,
      usersOptions: [],
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "credits/items",
      total: "credits/total",
      load: "credits/load",
      lookups: "credits/lookups",
      options: "app/lookups",
      lookupsLoad: "app/load",
      details: "credits/details",
      needDrop:'app/needDrop',
    }),
    fieldsData() {
      let fields = [
        {
          key: "user",
          sortable: true,
          thStyle: { width: "15%" },
          label: this.$t("student"),
        },
        {
          key: "amount",
          sortable: true,
          label: this.$t("amount"),
        },
        {
          key: "service",
          label: this.$t("service"),
        },
        {
          key: "type",
          sortable: true,
          label: this.$t("type"),
        },
        {
          key: "created_by",
          thStyle: { width: "15%" },
          label: this.$t("Global.created_by"),
        },
        {
          key: "created_at",
          thStyle: { width: "15%" },
          label: this.$t("Global.created_at"),
        },
        {
          key: "actions",
          thClass: "customAction",
          tdClass: "customWidth",
          label: this.$t("Global.actions"),
        },
      ];
      if (this.noStatus) {
        fields = fields.filter((obj) => !["status"].includes(obj.key));
      }
      if (this.user_id) {
        fields = fields.filter((obj) => !["user"].includes(obj.key));
      }
      return fields;
    },
    usersData: function () {
      return this.usersOptions;
    },
  },
  methods: {
    ...mapActions({
      lookupsMethod: "students/lookup",
      getLookups: "app/GET_LOOKUPS",
    }),
    refresh(query) {
      if (this.user_id) {
        query = { ...query, user_id: this.user_id };
      }
      this.$store.dispatch("credits/credits", { query: query }).then((_) => {
        this.paramsLoaded = false;
      });
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_all_users_keyword: search,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.usersOptions = res.success.all_users;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
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
    openCashbackModal() {
      this.cashbackForm.amount = this.details.Deposit - this.details.Withdraw;
      this.cashbackModal = true;
    },
    openChargeWalletModal() {
      this.getLookups({banks: true})
      this.chargeWalletModal = true;
    },
    resetCashbackModal() {
      this.cashbackForm = {
        amount: null,
        notes: null,
        file: null,
      };
    },
    resetChargeWalletModal(){
      this.chargeWalletForm = {
        amount: null,
        provider: null
      }
    },
    validationErrorMessage(errors) {
      if (errors[0] && errors[0].includes("between")) {
        errors[0] = this.$t("total must be less than max total");
      } else if (errors[0] && errors[0].includes("required")) {
        errors[0] = this.$t("Validation.selectFiled");
      }
      return errors;
    },
    submit() {
      this.$refs.simpleRulesCashback.validate().then((success) => {
        if (success) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.cashbackForm)) {
            if (value) {
              formData.append(key, value);
            }
          }
          let payload = { id: this.user_id, query: formData };
          this.$store
            .dispatch("credits/cashback", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Done")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.cashbackModal = false;
              this.refresh();
            })
            .catch((error) => {
              // this.errorsdata = this.handleBackendError(error.response.data.errors);
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (error.response.data) {
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  const error_data = Object.values(error)[index][0];
                  this.errorsdata = error;
                });
              }
            });
        }
      });
    },
    submitChargeWallet() {
      this.$refs.simpleRulesChargeWallet.validate().then((success) => {
        if (success) {
          const formData = new FormData();
          this.chargeWalletForm.id = this.user_id;
          let payload = { query: this.chargeWalletForm };

          this.$store
            .dispatch("credits/chargeWallet", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Done")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.chargeWalletModal = false;
              this.refresh();
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (error) {
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  const error_data = Object.values(error)[index][0];
                  this.errorsdata = error;
                });
              }
            });
        }
      });
    },
  },
  mounted() {
    this.refresh();
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
