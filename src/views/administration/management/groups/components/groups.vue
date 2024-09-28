<template>
  <DataTable
    :title="title"
    :total="total"
    :allow-search="true"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
  >
    <!-- <template
      v-if="lookups"
      #filter
    >
      
    </template> -->
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
        :empty-text="getLoadText(load)"
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
              :to="{name: 'edit_group',params: { id: data.item.id }}"
              class="mx-1"
              v-b-tooltip.hover="$t('Global.edit')"
            >
              <feather-icon
                icon="EditIcon"
                class="text-primary"
              />
            </b-link>
            <b-link v-b-tooltip.hover="$t('Global.delete')">
            
              <feather-icon
                icon="Trash2Icon"
                class="text-danger"
                @click="deleteGroup(data.item.id)"
              />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
    <template #action>

      <b-button
        :to="{ name: 'add_group'}"
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
  name: 'groups',
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
    /* bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null, */
  },
  data() {
    return {
      filter: { removed: 0 },
    
    }
  },
  computed: {
    ...mapGetters({
      items: 'groups/items',
      needDrop:'app/needDrop',
      //total: 'groups/total',
      //load: 'groups/load',
      //lookups: 'groups/lookups',
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
          key: 'name_local',
          label: this.$t('Global.name_arabic'),
          sortable: true,
        },
      
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
    getGroups: 'groups/groups',
    }),
   
    refresh(query) {
     
      //this.getGroups(query)
      this.$store.dispatch('groups/groups', { query })
    },
    deleteGroup(id) {
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
          this.$store.dispatch('groups/remove', id).then(_ => {
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
