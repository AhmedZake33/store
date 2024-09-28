<template>
  <DataTable
    :title="title"
    :total="total"
    :allow-search="true"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
  >
    <template
      v-if="lookups"
      #filter
    >
      <!-- <b-col
        cols="6"
        md="3"
      >
        <v-select
          v-model="filter.term_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.terms"
          label="name"
          class="w-100"
          :reduce="val => val.id"
          :placeholder="$t('Global.term')"
        />
      </b-col> -->
      <!-- <b-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList()"
          class="w-100"
          :reduce="val => val.value"
          placeholder="Users Status"
        />
      </b-col> -->
    </template>
    <template #customTable>
      <b-table
                  @sort-changed="sortingChanged"
          no-local-sorting
        class="position-relative font-small-2"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >

        <template #cell(name)="data">
          <div>
            <span
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold"
            >{{ data.item.name }}</span>

            <span
              v-else
              class="font-weight-bold"
            >{{ data.item.name_local }}</span>
          </div>
        </template>
          <template #cell(permissions)="data">
            <div>
            
              <b-badge :key="permission" variant="light-primary"  v-if="$i18n.locale == 'en' && data.item.permissions"
              v-for="permission in data.item.permissions" 
             
              class=" mr-1" >
              {{ permission.name }} 
              </b-badge>
            </div>
            <div>
            
              <b-badge :key="permission" variant="light-primary"  v-if="$i18n.locale == 'ar' && data.item.permissions"
              v-for="permission in data.item.permissions" 
             
              class=" mr-1" >
              {{ permission.name_local }} 
              </b-badge>
            </div>
            
          
        </template>
        <!--   <template #cell(type)="data">
            <div v-if="data.item.type">
            
              <b-badge variant="light-primary"  v-if="$i18n.locale == 'en' && data.item.flage"
             
              class=" mr-1" >
              {{  data.item.type.name}} 
              </b-badge>
            </div>
            <div v-if="data.item.type">
            
              <b-badge variant="light-primary"  v-if="$i18n.locale == 'ar' && data.item.flage"
             
              class=" mr-1" >
              {{  data.item.type.name_local}} 
              </b-badge>
            </div>
          
            
          
        </template> -->
         <template #cell(type)="data">
          <div  v-if="$i18n.locale == 'en' && data.item.type ">
            <b-badge :variant="getBadge(data.item.type.name)" class="font-weight-bold">
            {{ data.item.type.name }}
            </b-badge>
          </div>  
          <div  v-if="$i18n.locale == 'ar' && data.item.type ">
            <b-badge :variant="getBadge(data.item.type.name)" class="font-weight-bold">
            {{ data.item.type.name_local }}
            </b-badge>
          </div>  
          
          
        </template>
        <!-- <template #cell(description)="data">
          <div>
            <span
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold"
            >{{ data.item.description }}</span>

            <span
              v-else
              class="font-weight-bold"
            >{{ data.item.description_local }}</span>
          </div>
        </template> -->

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
              :to="{name: 'edit_markCategory',params: { id: data.item.id }}"
              class="mx-1"
              v-b-tooltip.hover="$t('Global.edit')"
            >
              <feather-icon
                icon="EditIcon"
                class="text-primary"
              />
            </b-link>
            <!-- <b-link v-b-tooltip.hover="$t('Global.delete')">
            
              <feather-icon
                v-if="data.item.removed == 0"
                icon="Trash2Icon"
                class="text-danger"
                @click="deletemarkCategories(data.item.id)"
              />
            </b-link> -->
          </div>
        </template>
      </b-table>
    </template>
    <template #action>

      <b-button
        :to="{ name: 'add_markCategory'}"
        class="btn-icon "
        variant="primary"
        v-b-tooltip.hover="$t('Global.add')"
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
import { mapActions, mapGetters } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

export default {
  name: 'MarkCategories',
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
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
  },
  data() {
    return {
      filter: { removed: 0 },
    
    }
  },
  computed: {
    ...mapGetters({
      items: 'markCategories/items',
      total: 'markCategories/total',
      load: 'markCategories/load',
      lookups: 'markCategories/lookups',
      needDrop:'app/needDrop',
    }),
     fields() {
      let fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        {
          key: 'short_name',
          label: this.$t('Global.short_name'),
          sortable: true,
        },
         {
          key: "type",
          label: this.$t("Global.type"),
          sortable: true,
          thStyle: {width:'10%'},
        },
        {
          key: "permissions",
          label: this.$t("Global.permissions"),
          sortable: true,
        },
        // {
        //   key: 'description',
        //   sortable: true,
        // },
        // {
        //     key: 'status',
        //     sortable: true,
        // },
        {
          key: 'actions',
          label: this.$t('Global.actions'),

          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      
      return fields;

    },
  },
  methods: {
    ...mapActions({
      // exportExcel: 'offerings/exportData',
    }),
     getBadge(name){
      if(name == "Work")
      {
        return "light-success"
      }
      if(name == "Exam")
      {
        return "light-info"
      }
    },
    refresh(query) {
      // if (this.bylaw_id) {
      //   query = { ...query, bylaw_id: this.bylaw_id }
      // }
      // if (this.course_id) {
      //   query = { ...query, course_id: this.course_id }
      // }
      // if (this.term_id) {
      //   query = { ...query, term_id: this.term_id }
      // }
      // if (this.program_id) {
      //   query = { ...query, program_id: this.program }
      // }
      this.$store.dispatch('markCategories/markCategories', { query })
    },
    deletemarkCategories(id) {
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
          this.$store.dispatch('markCategories/remove', id).then(_ => {
            this.refresh()
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
