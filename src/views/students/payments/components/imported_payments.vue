<template>
  <div>
    <DataTable
      :total="items.length"
      :allowSearch="false"
      :filter="filter"
      :loading="load"
      :paramsLoaded="paramsLoaded"
    >
      <template #customTable>
        <b-table
          class="position-relative"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(errors)="data">
            <div v-if="data.item.errors.length > 0">
                <p class="text-danger m-0" v-for="(error, index) in data.item.errors" :key="index"> {{$i18n.locale == 'ar' ? error.ar : error.en }} </p>
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
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
              />
              <feather-icon
                v-b-tooltip.hover="$t('items')"
                icon="AlignRightIcon"
                style="cursor: pointer"
                class="text-primary"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
    <b-row class="mb-5">
        <b-col cols="12" xl="12" lg="12" md="12">
            <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit"
                :style="success ? '':'cursor: not-allowed'"
                :disabled="success == false"
            >
                {{ $t("Global.submit") }}
            </b-button>
            <b-button 
                variant="outline-secondary"
                @click="$router.go(-1)"
            >
                {{ $t("Global.cancel") }}
            </b-button>
        </b-col>
    </b-row>
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
import { required, email } from "@validations";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import Show from "@/views/students/payments/show";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: "imported_payments",
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
  data() {
    return {
      filter:{ },
      paramsLoaded: true
    };
  },
  computed: {
    ...mapGetters({
      items: "payments/paymentsData",
      archive_id: "payments/archive_id", 
      success: "payments/success", 
      needDrop:'app/needDrop',
    }),
    fieldsData() {
      let fields = [
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "amount",
          label: this.$t("Global.amount"),
        },
        {
          key: "paid",
          label: this.$t("Global.paid"),
        },
        {
          key: "currency",
          label: this.$t("Global.currency"),
        },
        {
          key: "due_date",
          label: this.$t("Global.due_date"),
        },
        {
          key: "notes",
          label: this.$t("Global.notes"),
        },
        {
          key: "errors",
          label: this.$t("Global.errors"),
        },
      ];
      return fields;
    },
  },
  methods: {
    refresh(query) {
      this.$store
        .dispatch("payments/importPayments", { query: query })
        .then((_) => {
          this.paramsLoaded = false;
        });
    },
    submit() {
        let payload = { id: this.archive_id }
        this.$store.dispatch("payments/submitFile", payload )
        .then((response) => {
            this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
            });
            this.$router.go(-1);
        })
        .catch((error) => {
            this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
            });
            if(error.response.data){
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                    const error_data = Object.values(error)[index][0];
                    this.errorsdata = error;
                });
            }
        });
    }
  },
};
</script>

<style lang="scss">
    @import "@core/scss/vue/libs/vue-select.scss";
</style>
