<template>
  <div>
    <DataTable
      :total="total"
      :allow-search="true"
      :filter="filter"
      style="text-transform: capitalize"
      :allow-actions="true"
      :loading="load"
      @Refresh="refresh"
      @reset="reset()"
      :paramsLoaded="paramsLoaded"
    >
      
      <template #action>
        <b-button
          v-if="hasPermission('edit_accounting_items')"
          v-b-tooltip.hover="$t('Global.add')"
          class="btn-icon"
          variant="primary"
          @click="showModal(null,true)"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>

      </template>
      <template #customTable>
        <b-table
          :busy="load"
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          striped
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
            <div>
              {{ data.item.name }}
            </div>
          </template>
          <template #cell(name_local)="data">
            <div>
              {{ data.item.name_local }}
            </div>
          </template>
          <template #cell(is_administrative)="data">
            <div>
              {{ data.item.is_administrative != 0 ? 'Yes' : 'No'  }}
            </div>
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
                v-if="hasPermission('edit_accounting_items')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer;margin-left: 3px"
                class="text-primary"
                @click="showModal(data.item,true)"
              />
              <feather-icon
                v-if="hasPermission('delete_accounting_items')"
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="remove(data.item.id)"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <div class="all-modals">
      <!-- modal -->
      <b-modal
        id="modal-prevent-closing"
        ref="my-modal"
        size="lg"
        :title="$t('Accounting Item')"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <EditAccount
          :input="inputData"
          @hideModal="hideModal()"
          @refresh="refresh()"
        />
        <div />
      </b-modal>
    </div>
  </div>
</template>
<script>
import DataTable from '@/views/components/table/DataTable'
import {
  BTable, BLink, BCol, BSpinner,
} from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
import EditAccount from '@/views/system/years/components/AccountsSetting/EditAccount'
import vSelect from 'vue-select'

export default {
  name: 'Accounts',
  components: {
    DataTable,
    BTable,
    BLink,
    EditAccount,
    vSelect,
    BCol,
    BSpinner,
  },
  props: {
    yearId: null,
  },
  data() {
    return {
      filter: {},
      paramsLoaded: true,
      list: [],
      totalItems: null,
      load: false,
      inputData: null,
      showEdit: false,
      accountServiceTitle: 'Add Payment Account',

    }
  },
  computed: {
    fields() {
      return [
        {
          key: 'name',
          sortable: false,
          label: this.$t('name_custom'),
          thStyle: { width: '25%' },
        },
        {
          key: 'name_local',
          sortable: false,
          label: this.$t('name_local'),
          thStyle: { width: '25%' },
        },
        {
          key: 'is_administrative',
          sortable: false,
          label: this.$t('is_administrative'),
          thStyle: { width: '25%' },
        },
        /* {
          key: 'type',
          label: this.$t('type'),
          sortable: false,
          thStyle: { width: '30%' },
        }, */
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thStyle: { width: '10%' },
        },
      ]
    },
    items() {
      return this.list
    },
    total() {
      return this.totalItems
    },
  },
  watch: {
  },
  methods: {
    ...mapActions({
      getPaymentAccounts: 'yearPayments/getPaymentAccounts',
      removePaymentAccounts: 'yearPayments/removePaymentAccount',
    }),
    refresh(query = null) {
      this.init(query)
    },
    init(query = null) {
      this.load = true

      const payload = {
        yearId: this.yearId,
        payload: query,
      }

      this.getPaymentAccounts(payload).then(res => {
        this.list = res.data
        this.lookups = res.meta.lookup
        this.totalItems = res.meta.count
        this.paramsLoaded = false
        this.load = false
      })
    },

    showModal(data, showEdit = false) {
      if (data) {
        this.accountServiceTitle = 'Edit Account Item'
      } else {
        this.accountServiceTitle = 'Add Account Item'
      }

      this.inputData = data
      this.showEdit = showEdit
      this.$refs['my-modal'].show()
    },
    showAddModal(showEdit = false) {
      this.showEdit = showEdit
      this.$refs['my-add-modal'].toggle('#toggle-btn')
    },
    hideModal() {
      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    resetModal() {
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
    remove(accountId) {
      const payload = {
        yearId: this.yearId,
        accountId,
      }

      this.$swal({
        title: this.$t("Global.deleteTitle"),
        text: this.$t("Global.deleteText"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("Global.cancel"),
        confirmButtonText: this.$t("Global.deleteBtn"),
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.load = true
          this.removePaymentAccounts(payload).finally(_=>{
            this.refresh()
          })
        }
      })
    }
  },

}
</script>

<style>

</style>
