<template>
<div>
  <add
    v-if="inline"
    @hide="cancelAdd"
    @refresh="refresh"
    :memberType="memberType"
  />
    
  <div v-else>

  <DataTable
    :title="title"
    :total="total"
    :allowSearch="true"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
    :draggable="hasPermission('edit_student_thesis') && item.canUpdate ? true : false"
    @Drag="drag"
  >
    <template #action>
      <b-button
        v-if="hasPermission('edit_student_thesis') && item.canUpdate"
        @click="addClicked()"
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>
    <template #customTable>
      <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
        :class="hasPermission('edit_student_thesis') && item.canUpdate ? 'position-relative list-group list-group-flush cursor-move' : 'position-relative'"
        :items="memberType == 1 ? item.supervisors : item.committees"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(supervisor)="data">
          <div v-if="data && data.item">
            <div>
              {{ $i18n.locale == 'ar' ? data.item.user.name_local : data.item.user.name }}
            </div>
          </div>
        </template>
        <template #cell(order)="data">
          <div v-if="data && data.item">
            <div>
              {{ data.index + 1 }}
            </div>
          </div>
        </template>
        <template #cell(committee)="data">
          <div v-if="data && data.item">
            <div>
              {{ $i18n.locale == 'ar' ? data.item.user.name_local : data.item.user.name }}
            </div>
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
            <b-link>
              <feather-icon 
                v-if="hasPermission('edit_student_thesis')"
                v-b-tooltip.hover="$t('Global.delete')" 
                icon="Trash2Icon"  
                class="text-danger"
                @click="deleteMember(data.item.id)" 
              />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
  <DataTable
    :title="memberType == 1 ? $t('Global.external_supervisor'): $t('Global.external_committee')"
    :total="total"
    :allowSearch="false"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
  >
    
    <template #customTable>
      <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
        :items="memberType == 1 ? item.external_supervisor : item.external_committee"
        responsive
        :fields="fieldsExternal"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"></b-spinner>
          </div>
        </template>
        <template #cell(supervisor)="data">
          <div v-if="data && data.item">
            <div>
              {{ $i18n.locale == 'ar' ? data.item : data.item}}
            </div>
          </div>
        </template>
        <template #cell(committee)="data">
          <div v-if="data && data.item">
            <div>
              {{ $i18n.locale == 'ar' ? data.item : data.item }}
            </div>
          </div>
        </template>
        <!-- <template #cell(actions)="data">
          <div>
            <b-link>
              <feather-icon 
                v-if="hasPermission('edit_student_thesis')"
                v-b-tooltip.hover="$t('Global.delete')" 
                icon="Trash2Icon"  
                class="text-danger"
                @click="deleteMember(data.item.id)" 
              />
            </b-link>
          </div>
        </template> -->
      </b-table>
    </template>
  </DataTable>
  </div>
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
  VBModal, BPopover } from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable';
import { mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Add from '@/views/research/theses/components/add_members.vue';

export default {
  name: 'theses',
  components: {
    DataTable,
    BCard,
    vSelect,
    Add,
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
  props:{
    memberType: String 
  },
  data() {
    return {
      filter: { removed: 0 },
      inline: false
    };
  },
  watch:{
    'this.memberType'(val){
    }
  },
  computed: {
    ...mapGetters({
      item: "theses/item",
      total: "theses/total",
      load: 'theses/load',
      lookups: 'theses/lookups',
      needDrop:'app/needDrop',
    }),
    tableItems(){
      return this,memberType == 1 ? items.supervisors : items.committees 
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields: function () {
      if(this.memberType == 1){
        return [
          {
            key: "order",
            label: this.$t("order"),
            sortable: false,
            thStyle: { width: "10%" },
          },
          {
            key: "supervisor",
            label: this.$t("supervisor"),
            sortable: false,
          },
          {
            key: 'actions',
            thClass: 'customAction',
            tdClass: 'customWidth',
            label: this.$t("Global.action"),
          },
        ];
      }else{
        return [
          {
            key: "order",
            label: this.$t("order"),
            sortable: false,
            thStyle: { width: "10%" },
          },
          {
            key: "committee",
            label: this.$t("committee"),
            sortable: false,
          },
          {
            key: 'actions',
            thClass: 'customAction',
            tdClass: 'customWidth',
            label: this.$t("Global.action"),
          },
        ];
      }
    },
    fieldsExternal: function () {
      if(this.memberType == 1){
        return [
          {
            key: "supervisor",
            label: this.$t("supervisor"),
            sortable: false,
          },
          {
            key: 'actions',
            thClass: 'customAction',
            tdClass: 'customWidth',
            label: this.$t("Global.action"),
          },
        ];
      }else{
        return [
          {
            key: "committee",
            label: this.$t("committee"),
            sortable: false,
          },
          {
            key: 'actions',
            thClass: 'customAction',
            tdClass: 'customWidth',
            label: this.$t("Global.action"),
          },
        ];
      }
    },
  },
  methods: {
    refresh(query) {
      this.$store.dispatch("theses/get", this.id);
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
    addClicked() {
      this.inline = true
    },
    cancelAdd() {
      this.inline = false
    },
    deleteMember(id) {
      this.$swal({
          title: `${this.$t('Global.deleteTitle')}`,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          confirmButtonText: `${this.$t('Global.deleteBtn')}`,
          customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
      }).then(result => {
          if (result.value) {
            this.popoverShow = false;
            this.$store.dispatch('theses/removeMember', id).then(response => {
                this.$swal({
                    icon: 'success',
                    title: this.$t('Global.Deleted'),
                    showConfirmButton: false,
                    timer: 1500,
                })
                this.refresh()
            });
          }
      });
    },
    drag(data){
      this.$store.dispatch('theses/reorderMembers', {
        query: data
      })
      .then((response) => {
        this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
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
    },
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
</style>
