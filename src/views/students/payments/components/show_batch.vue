<template>
  <div>
    <DataTable
      :title="title"
      :total="total"
      :allowSearch="false"
      :filter="filter"
      :loading="load"
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

        <template #cell(id)="paymentsData">
          <b-link
            class="font-weight-bold d-block"
            :to="{ name: 'payment', params: { id: paymentsData.item.id }}"
          >{{ paymentsData.item.id }}</b-link>
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
  name: "payments",
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
      filter: {
        removed: 0,
      },
    };
  },
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    ...mapGetters({
      items: "payments/batch",
      total: "payments/total",
      load: "payments/load",
      needDrop:'app/needDrop',
      lookups: "payments/lookups",
    }),
    fieldsData() {
      let fields = [
      {
          key: "id",
          label: this.$t("Global.id"),
        },
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
        }
      ];
      return fields;
    },
  },
  methods:{
    ...mapActions({
      getItems: 'payments/getBatch',
    }),
  },
  mounted() {
    this.getItems(this.id)
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
