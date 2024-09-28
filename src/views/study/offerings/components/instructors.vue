<template>
  <DataTable
    :title="title"
    :allow-search="false"
    :filter="filter"
    @Refresh="refresh"
    :tabNum="tabNum"
  >
    <template #customTable>
      <b-table
                  @sort-changed="sortingChanged"
          no-local-sorting
        class="position-relative font-small-2"
        :items="getInstructors"
        responsive
        :fields="getFields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(academic_name)="data">
          <div>
            <router-link :to="`/users/${data.item.id}`">
              {{ data.item.academic_name }}
            </router-link>
          </div>
        </template>
        <template #cell(role)="data">
          <div v-if="$i18n.locale == 'en' && data.item.role">
           
              {{ data.item.role.name }}
          </div>
          <div v-if="$i18n.locale == 'ar' && data.item.role">
           
              {{ data.item.role.name_local }}
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
                                    v-b-tooltip.hover="$t('Global.delete')"
                                    icon="Trash2Icon"
                                    style="cursor: pointer"
                                    class="text-danger"
                                    @click="remove(data.item)"
                            />
                        </div>
                    </template>
        <!-- <template #cell(email)="data">
          <span>
            {{ data.item.user.email }}
          </span>
        </template> -->
      </b-table>
    </template>
    
   
    <template #action>
      <b-button
        v-b-tooltip.hover="$t('Global.add')"
        class="btn-icon "
        variant="primary"
      >
        <feather-icon
          icon="PlusIcon"
        />
      </b-button>
      
    </template>
  </DataTable>
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
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

export default {
  name: 'Instructors',
  components: {
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
    instructors: null,
    tabNum:null
  },
  data() {
    return {
      filter: { removed: 0 },
      newInstructors:null,
    }
  },
  computed: {
    getFields() {
      let fields = [
         {
          key: 'academic_name',
          label: this.$t('Global.academic_name'),
          sortable: true,
        },
        {
          key: 'email',
          label: this.$t('Global.email'),
          sortable: true,
        },
        {
          key: 'phone',
          label: this.$t('Global.phone'),
          sortable: true,
        },
        {
          key: 'role',
          label: this.$t('Global.role'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
        },
      ]
      return fields;
    },
    getInstructors()
    {
      if(this.newInstructors)
      {
         return this.newInstructors
      }
      let instructors = this.instructors
      return instructors
    }
  },
  methods: {
     ...mapActions({
      removeInstructor:'offerings/removeInstructor',
    }),
    refresh(query) {
      query = { ...query, type: this.type };

      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }

      if (this.department_id) {
        query = { ...query, department_id: this.department_id };
      }

      this.$store.dispatch('instructors/instructors', { query });
    },
    remove(item) {
     
      let query = { id: item.id , role_id: item.role.id, offering_id:this.$route.params.id}
       this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
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
          this.removeInstructor(query).then(response => {
            this.newInstructors=response.data.instructors
           this.getInstructors
           
            this.refresh();
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    
    }
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
