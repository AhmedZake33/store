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
          :items="items" responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(status)="data">
            <b-badge pill v-if="data.item.status" :variant="`${getCustomStatus(data.item.status.id).color}`" class="text-capitalize">
              {{ $i18n.locale == 'ar' ? data.item.status.name_local : data.item.status.name }}
            </b-badge>
          </template>

          <template #cell(currency)="data">
            <span v-if="data.item.currency">
              {{ $i18n.locale == 'ar' ? data.item.currency.name_local : data.item.currency.name }}
            </span>
          </template>
          <template #cell(created_by)="data">
            <strong v-if="data.item.created_by">
                <b-link :to="{ name: 'user-show', params: { id: data.item.created_by.id } }"> {{ $i18n.locale == 'ar' ? data.item.created_by.name_local : data.item.created_by.name }} </b-link>
            </strong>
          </template>
          <template #cell(created_at)="data">
            <strong v-if="data.item.created_at">
              {{moment(data.item.created_at).utc().format('YYYY-MM-DD HH:MM:SS')}}
            </strong>
            <div v-else>
              -
            </div>
          </template>
          <template  #cell(label)="data">
            <b-link :to="{ name: 'payment', params: { id: data.item.id } }">
              {{ data.item.label ? $t(`Global.${data.item.label}`) : $t('Global.invoice') }}
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
              <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon"
                            style="cursor: pointer" class="text-danger" @click="remove(data.item.id)"/>
              <feather-icon v-b-tooltip.hover="$t('items')" icon="AlignRightIcon"
                            style="cursor: pointer" class="text-primary" @click="navigate(data.item.id)"/>
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <!-- :disabled="!(details && details[0] && details[0].paid > 0)" -->
        <b-button variant="primary" v-if="hasPermission('edit_payment') && student_id" @click="openDialog">{{
            $t('Global.refund') }}
        </b-button>
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
} from 'bootstrap-vue';

import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import {required, email} from '@validations';
import DataTable from '@/views/components/table/DataTable';
import {mapActions, mapGetters} from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Statistics from '@/views/components/info/statistics';
import Show from '@/views/students/payments/show';
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  name: 'payments',
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
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    user_id: null,
    student_id: null,
    faculty_id: null,
    applicant_id: null,
    noStatus: Boolean,
    inline: {type: Boolean, default: false},
    ascomponent:{type: Boolean, default: false}
  },
  data() {
    return {
      filter: {removed: 0,faculty_id: null,bylaw_id:null,program_id:null,status_id:null},
      payment_id: null,
      show: false,
      paymentModel: false,
      file: null,
      ruleForm: {
        amount: null,
        file: null,
        payment_number: null,
        pay_date: null,
        provider_id: null,
      },
      studentsOptions: [],
    };
  },
  computed: {
    ...mapGetters({
      items: 'payments/items',
      total: 'payments/total',
      load: 'payments/load',
      lookups: 'payments/lookups',
      details: 'payments/details',
      options: 'app/lookups',
      needDrop:'app/needDrop',
    }),
    fieldsData() {

      let fields = [
        {
          key: 'label',
          label: this.$t('Global.name'),
          thStyle: {width: '10%'},
        },
        {
          key: 'amount',
          label: this.$t('amount'),
          sortable: true,
        },
        {
          key: 'currency',
          label: this.$t('Global.currency'),
          sortable: true,
          thStyle: {width: '10%'},
        },
        {
          key: 'created_by',
          label: this.$t('Global.changed_by'),
          sortable: true,
        },
        {
          key: 'created_at',
          label: this.$t('Global.changed_at'),
          sortable: true,
        },
        {
          key: 'paid',
          label: this.$t('Global.paid'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('Global.status'),
          sortable: true,
        },
        {
          key: 'notes',
          label: this.$t('Global.notes'),
        },
      ];
      if(this.ascomponent){
        return [
          {
            key: 'amount',
            label: this.$t('amount'),
            sortable: true,
          },
          {
            key: 'currency',
            label: this.$t('Global.currency'),
            sortable: true,
            thStyle: {width: '10%'},
          },
          {
            key: 'created_by',
            label: this.$t('Global.changed_by'),
            sortable: true,
          },
          {
            key: 'created_at',
            label: this.$t('Global.changed_at'),
            sortable: true,
          },
          {
            key: 'paid',
            label: this.$t('Global.paid'),
            sortable: true,
          },
          {
            key: 'status',
            label: this.$t('Global.status'),
            sortable: true,
          },
          {
            key: 'notes',
            label: this.$t('Global.notes'),
          },
        ];
      }
      return fields;
    },
    studentData: function () {
      return this.studentsOptions;
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      refund: 'payments/refund',
      lookupsMethod: 'students/lookup',
      getItems: 'payments/history',
    }),
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

    upload(e) {
      this.file = e.target.files[0];
    },
    openDialog(data) {
      // this.ruleForm.amount = this.InstallmentTotal ? this.InstallmentTotal - data.paid : null;
      this.ruleForm.file = null;
      this.ruleForm.payment_number = null;
      this.ruleForm.pay_date = null;
      this.ruleForm.provider_id = null;
      this.ruleForm.amount = null;

      if (this.details && this.details[0] && this.details[0].paid) {
        // this.ruleForm.amount = this.details[0].paid;
      }
      this.paymentModel = true;
    },

    getCustomStatus(id) {
      if (id == 0) {
        return {
          color: "danger",
          name: "Unpaid",
        };
      } else if (id == 1) {
        return {
          color: "light-success",
          name: "Fully Paid",
        };
      } else if (id == 2) {
        return {
          color: "primary",
          name: "Partially Paid",
        };
      } else if (id == 3) {
        return {
          color: "success",
          name: "Over Paid",
        };
      } else if(id == 4){
        return{
            color: 'primary',
            name: 'Conflict'
        }
      } else if (id == 5) {
        return {
          color: "warning",
          name: "Refund",
        };
      }
    },

    hideRender() {
      this.show = false;
      this.$emit('render');
    },
    showInline(id) {
      this.payment_id = id;
      this.show = true;
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        studentQuery: search,
        certificates: true,
      }
      if (search.length > 1) {
        loading(true)
        this.lookupsMethod(query).then((res) => {
          this.studentsOptions = res.success.students
          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
    navigate(id){
      this.$router.push({ name: 'payments_items' , params: { id : id } });
    }
  },
  mounted() {
    let id = this.$route.params.id;
    this.getItems(id).then((res)=>{
    })
  }
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
.custom-file-label {
  cursor: pointer !important;
}

@import '@core/scss/vue/libs/vue-select.scss';
</style>
