<template>
  <div>
    <DataTable
      :total="total"
      :allowSearch="false"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      :paramsLoaded="paramsLoaded"
    >
      <template #customTable>
        <b-table
          class="position-relative"
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(name)="data">
            <span>
              {{
                $i18n.locale == "en"
                  ? data.item.name
                    ? data.item.name
                    : data.item.name_local
                  : data.item.name_local
                  ? data.item.name_local
                  : data.item.name
              }}
            </span>
          </template>
          <template #cell(currency)="data">
            <span v-if="data.item.currency">
              {{
                $i18n.locale == "en"
                  ? data.item.currency.name
                    ? data.item.currency.name
                    : data.item.currency.name_local
                  : data.item.currency.name_local
                  ? data.item.currency.name_local
                  : data.item.currency.name
              }}
            </span>
            <div v-else>
              -
            </div>
          </template>
          <template #cell(is_administrative)="data">
            <div>
              {{ data.item.is_administrative != 0 ? 'Yes' : 'No'  }}
            </div>
          </template>
          <template #cell(created_by)="data">
            <span v-if="data.item.created_by">
              {{
                $i18n.locale == "en"
                  ? data.item.created_by.name
                    ? data.item.created_by.name
                    : data.item.created_by.name_local
                  : data.item.created_by.name_local
                  ? data.item.created_by.name_local
                  : data.item.created_by.name
              }}
            </span>
          </template>
          <template #cell(notes)="data">
            <span v-if="data.item.notes">
              {{
                data.item.notes
              }}
            </span>
          </template>
          <!-- <template #cell(actions)="data">
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
              <b-link v-if="hasPermission('access_discount_payment')">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.discount')"
                  icon="MinusIcon"
                  style="cursor: pointer"
                  class="text-primary"
                  @click="openDeductModal(data)"
                  id="toggle-btn"
                />
              </b-link>
              <b-link v-if="hasPermission('access_extrafee_payment')">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.extra_fee')"
                  icon="PlusIcon"
                  style="cursor: pointer"
                  class="text-primary mx-1"
                  @click="openAddModal(data)"
                  id="toggle-btn"
                />
              </b-link>
              <b-link v-if="hasPermission('edit_payment')">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  style="cursor: pointer"
                  class="text-primary"
                  @click="openEditModal(data)"
                  id="toggle-btn"
                />
              </b-link>
            </div>
          </template> -->
        </b-table>
      </template>
    </DataTable>
    
    <!-------------------------------------- Deduct --------------------------------->
    <b-modal
      :title="$t('Global.discount')"
      @hidden="resetModal"
      :cancel-title="$t('Global.cancel')"
      v-if="!load"
      ref="update-modal"
      v-model="deductModal"
      @ok="deduct"
    >
      <div>
        <h4 class="mb-2">
          {{
            $i18n.locale == "en"
              ? dialogData.user
                ? dialogData.user.name
                  ? dialogData.user.name
                  : dialogData.user.name_local
                : ""
              : dialogData.user
              ? dialogData.user.name_local
                ? dialogData.user.name_local
                : dialogData.user.name
              : ""
          }}
          (
          {{
            dialogData
              ? $i18n.locale == "en"
                ? dialogData.name
                : dialogData.name_local
              : ""
          }}
          )
        </h4>
      </div>
      <validation-observer ref="deductSimpleRules">
        <b-form ref="deductForm" @submit.stop.prevent="deduct">
          <b-row>
            <b-col cols="6">
              <b-form-group
                label-for="questionnaires-types-input"
                :label="$t('Global.value')"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.value')"
                  :rules="`required|between:0,${dialogData.amount}`"
                >
                  <b-form-input
                    id="amount"
                    v-model="editData.amount"
                  />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل القيمة مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                label-for="questionnaires-types-input"
                :label="$t('Global.type')"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.type')"
                  rules="required"
                >
                  <v-select
                    v-model="editData.type"
                    :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
                    :options="options"
                    :reduce="(val) => val.id"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    :placeholder="$t('Global.type')"
                  >
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل النوع مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                :class="$i18n.locale == 'en' ? 'left_right' : 'right_left'"
                :label="$t('Global.notes')"
                label-for="apply-to"
              >
                <validation-provider 
                  #default="{ errors }" 
                  name="Notes"
                  rules="required"
                >
                  <b-form-textarea id="apply-to" v-model="editData.notes" />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل الملوحظات مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="deduct">
          {{ $t('Global.save') }}
        </b-button>
        <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="deductModal = false">
          {{ $t('Global.cancel') }}
        </b-button>
      </template>
    </b-modal>

    <!-------------------------------------- add --------------------------------->
    <b-modal
      :title="$t('Global.extra_fee')"
      @hidden="resetModal"
      :cancel-title="$t('Global.cancel')"
      v-if="!load"
      ref="update-modal"
      v-model="addModal"
      @ok="add"
    >
      <div>
        <h4 class="mb-2">
          {{
            $i18n.locale == "en"
              ? dialogData.user
                ? dialogData.user.name
                  ? dialogData.user.name
                  : dialogData.user.name_local
                : ""
              : dialogData.user
              ? dialogData.user.name_local
                ? dialogData.user.name_local
                : dialogData.user.name
              : ""
          }}
          (
          {{
            dialogData
              ? $i18n.locale == "en"
                ? dialogData.name
                : dialogData.name_local
              : ""
          }}
          )
        </h4>
      </div>
      <validation-observer ref="addSimpleRules">
        <b-form ref="addForm" @submit.stop.prevent="add">
          <b-row>
            <b-col cols="6">
              <b-form-group
                label-for="questionnaires-types-input"
                :label="$t('Global.value')"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.value')"
                  rules="required"
                >
                  <b-form-input
                    id="amount"
                    v-model="editData.amount"
                  />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل القيمة مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                label-for="questionnaires-types-input"
                :label="$t('Global.type')"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.type')"
                  rules="required"
                >
                  <v-select
                    v-model="editData.type"
                    :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
                    :options="options"
                    :reduce="(val) => val.id"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    :placeholder="$t('Global.type')"
                  >
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل النوع مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                :class="$i18n.locale == 'en' ? 'left_right' : 'right_left'"
                :label="$t('Global.notes')"
                label-for="apply-to"
              >
                <validation-provider 
                  #default="{ errors }" 
                  name="Notes"
                  rules="required"
                >
                  <b-form-textarea id="apply-to" v-model="editData.notes" />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل الملوحظات مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="add">
          {{ $t('Global.save') }}
        </b-button>
        <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="addModal = false">
          {{ $t('Global.cancel') }}
        </b-button>
      </template>
    </b-modal>

    <!-------------------------------------- edit --------------------------------->
    <b-modal
      :title="$t('Global.edit')"
      @hidden="resetModal"
      :cancel-title="$t('Global.cancel')"
      v-if="!load"
      ref="update-modal"
      v-model="editModal"
      @ok="edit"
    >
      <div>
        <h4 class="mb-2">
          {{
            $i18n.locale == "en"
              ? dialogData.user
                ? dialogData.user.name
                  ? dialogData.user.name
                  : dialogData.user.name_local
                : ""
              : dialogData.user
              ? dialogData.user.name_local
                ? dialogData.user.name_local
                : dialogData.user.name
              : ""
          }}
          (
          {{
            dialogData
              ? $i18n.locale == "en"
                ? dialogData.name
                : dialogData.name_local
              : ""
          }}
          )
        </h4>
      </div>
      <validation-observer ref="editSimpleRules">
        <b-form ref="editForm" @submit.stop.prevent="edit">
          <b-row>
            <b-col cols="12">
              <b-form-group
                label-for="questionnaires-types-input"
                :label="$t('Global.value')"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.value')"
                  rules="required"
                >
                  <b-form-input
                    id="amount"
                    v-model="editData.amount"
                  />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل القيمة مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group
                :class="$i18n.locale == 'en' ? 'left_right' : 'right_left'"
                :label="$t('Global.notes')"
                label-for="apply-to"
              >
                <validation-provider 
                  #default="{ errors }" 
                  name="Notes"
                  rules="required"
                >
                  <b-form-textarea id="apply-to" v-model="editData.notes" />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{ $i18n.locale == "ar" ? "حقل الملوحظات مطلوب" : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="edit">
          {{ $t('Global.save') }}
        </b-button>
        <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="editModal = false">
          {{ $t('Global.cancel') }}
        </b-button>
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
  VBModal,
  BPopover,
  BFormDatepicker,
  BFormFile,
  BAlert,
  BButtonGroup,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BForm,
} from "bootstrap-vue";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import Show from "@/views/students/payments/show";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import i18n from "@/libs/i18n";

export default {
  name: "Payments",
  components: {
    Show,
    Statistics,
    DataTable,
    BCard,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    localize,
    BFormDatepicker,
    BFormFile,
    BAlert,
    BButtonGroup,
    BInputGroup,
    BFormTextarea,
    BImg,
    BFormGroup,
    BForm,
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
  props: {},
  data() {
    return {
      errorsdata: {},
      dialogData: {},
      deductModal: false,
      paramsLoaded: true,
      addModal: false,
      editModal: false,
      filter:{
        order_direction: true
      },
      editData: {
        notes: "",
        amount: 0,
        type: "",
      },
      options:[
        { id: 0, name: "Amount", name_local: "الكمية" },
        { id: 1, name: "Percentage", name_local: "النسبة" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      load: "paymentItems/load",
      total: "paymentItems/total",
      items: "paymentItems/items",
      needDrop:'app/needDrop',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fieldsData() {
      return [
        {
          key: "name",
          label: this.$t("Global.name"),
        },
        {
          key: "amount",
          label: this.$t("amount"),
        },
        // {
        //   key: "quantity",
        //   label: this.$t("quantity"),
        // },
        {
          key: "currency",
          label: this.$t("currency"),
        },
        {
          key: 'is_administrative',
          sortable: false,
          label: this.$t('is_administrative'),
        },
        {
          key: "created_by",
          label: this.$t("created_by"),
        },
        // {
        //   key: "notes",
        //   label: this.$t("notes"),
        // },
        // {
        //   key: "actions",
        //   label: this.$t("actions"),
        // },
      ];
    },
    title() {
      let data = this.items ? this.items[0] : null;
      if (data) {
        let title = "";
        this.$i18n.locale == "en"
          ? (title = data.user
              ? data.user.name
                ? data.user.name
                : data.user.name_local
              : "")
          : (title = data.user
              ? data.user.name_local
                ? data.user.name_local
                : data.user.name
              : "");
        let service = data.service;
        let payment =
          this.$i18n.locale == "en" ? service.name : service.name_local;
        let ourtitle = title + " ( " + payment + " ) ";
        return ourtitle;
      }
      return "";
    },
  },
  methods: {
    ...mapActions({
      getItems: "paymentItems/paymentItems",
      updateItem: "paymentItems/put",
      editPaymentItem: 'paymentItems/editPaymentItem'
    }),
    refresh(query) {
      // let id = this.$route.params.id;
      let payload = {id: this.$route.params.id , query:query}
      this.getItems(payload).then((res) => {
        this.paramsLoaded = false;
      });
      this.paramsLoaded = false;
    },
    openDeductModal(data){
      this.deductModal = true;
      this.dialogData = data.item;
    },
    openAddModal(data){
      this.addModal = true;
      this.dialogData = data.item;
    },
    openEditModal(data){
      this.editModal = true;
      this.dialogData = data.item;
      this.editData.amount = data.item.amount
      this.editData.notes = null
    },
    deduct(){
      this.$refs.deductSimpleRules.validate().then((success) => {
        if (success) {
          let newAmout = 0;
          if (this.editData.type == 0) {
              newAmout = -this.editData.amount;
          }else{
            newAmout = (this.dialogData.amount / 100) * this.editData.amount;
            newAmout = -newAmout;
          }  
          let payload = {
            id: this.dialogData.id,
            data: {
              notes: this.editData.notes,
              amount: newAmout,
            },
          };
          this.updateItem(payload).then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.deductModal= false;
                this.refresh();
            })
            .catch((error) => {
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
            });
        }
      });
    },
    add(){
      this.$refs.addSimpleRules.validate().then((success) => {
        if (success) {
          let newAmout = 0;
          if (this.editData.type == 0) {
              newAmout = this.editData.amount;
          }else{
            newAmout = (this.dialogData.amount / 100) * this.editData.amount;
          }  
          let payload = {
            id: this.dialogData.id,
            data: {
              notes: this.editData.notes,
              amount: newAmout,
            },
          };
          this.updateItem(payload).then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.addModal= false;
                this.refresh();
            })
            .catch((error) => {
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
            });
        }
      });
    },
    edit(){
      
      this.$refs.editSimpleRules.validate().then((success) => {
        if (success) {
          let payload = {
            id: this.dialogData.id,
            data: {
              notes: this.editData.notes,
              amount: this.editData.amount,
            },
          };
          this.editPaymentItem(payload).then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.editModal= false;
                this.$emit('init');
                this.refresh()
            })
            .catch((error) => {
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
            });
        }
      });
    },
    resetModal(){
      this.editData.notes= ""
      this.editData.amount= 0
      this.editData.type= ""
    }
  },
  // mounted() {
  //   let id = this.$route.params.id;
  //   this.getItems(id).then((res) => {
  //     this.paramsLoaded = false;
  //   });
  // },
};
</script>



<style lang="scss">
.custom-file-label {
  cursor: pointer !important;
}

@import "@core/scss/vue/libs/vue-select.scss";
</style>
