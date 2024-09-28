<template>
    <div>
      <!-- search input -->
      <div class="custom-search d-flex justify-content-end">
        <b-form-group>
          <div class="d-flex align-items-center">
            <label class="mr-1">Search</label>
            <b-form-input
              v-model="searchTerm"
              placeholder="Search"
              type="text"
              class="d-inline-block"
            />
          </div>
        </b-form-group>
      </div>
  
      <!-- table -->
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :rtl="direction"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm }"
        :select-options="{
          enabled: true,
          selectOnCheckboxOnly: false, // only select when checkbox is clicked instead of the row
          selectionInfoClass: 'custom-class',
          selectionText: 'rows selected',
          clearSelectionText: 'clear',
          disableSelectInfo: true, // disable the select info panel on top
          selectAllByGroup: false, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
        }"
        :pagination-options="{
          enabled: true,
          perPage:pageLength
        }"
      >
        <template
          slot="table-row"
          slot-scope="props"
        >
  
          <!-- Column: Name -->
          <span
            v-if="props.column.field === 'fullName'"
            class="text-nowrap"
          >
            <span class="text-nowrap">{{ props.row.fullName }}</span>
          </span>
  
          <!-- Column: name local -->
          <span v-else-if="props.column.field === 'name_local'">
            <span class="text-nowrap">{{ props.row.fullName }}</span>
          </span>
  
          <!-- Column: Action -->
          <span v-else-if="props.column.field === 'action'">
            <span>
              <b-dropdown
                variant="link"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template v-slot:button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="text-body align-middle mr-25"
                  />
                </template>
                <b-dropdown-item>
                  <feather-icon
                    icon="Edit2Icon"
                    class="mr-50"
                  />
                  <span>Edit</span>
                </b-dropdown-item>
                <b-dropdown-item>
                  <feather-icon
                    icon="TrashIcon"
                    class="mr-50"
                  />
                  <span>Delete</span>
                </b-dropdown-item>
              </b-dropdown>
            </span>
          </span>

        </template>
  
        <!-- pagination -->
        <template
          slot="pagination-bottom"
          slot-scope="props"
        >
          <div class="d-flex justify-content-between flex-wrap">
            <div class="d-flex align-items-center mb-0 mt-1">
              <span class="text-nowrap ">
                Showing 1 to
              </span>
              <b-form-select
                v-model="pageLength"
                :options="['3','5','10']"
                class="mx-1"
                @input="(value)=>props.perPageChanged({currentPerPage:value})"
              />
              <span class="text-nowrap"> of {{ props.total }} entries </span>
            </div>
            <div>
              <b-pagination
                :value="1"
                :total-rows="props.total"
                :per-page="pageLength"
                first-number
                last-number
                align="right"
                prev-class="prev-item"
                next-class="next-item"
                class="mt-1 mb-0"
                @input="(value)=>props.pageChanged({currentPage:value})"
              >
                <template #prev-text>
                  <feather-icon
                    icon="ChevronLeftIcon"
                    size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                    icon="ChevronRightIcon"
                    size="18"
                  />
                </template>
              </b-pagination>
            </div>
          </div>
        </template>
      </vue-good-table>
    </div>
  </template>
  
  <script>
  import {
    BAvatar, BBadge, BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BDropdownItem,
  } from 'bootstrap-vue'
  import { VueGoodTable } from 'vue-good-table'
  import store from '@/store/index'
  
  export default {
    components: {
      VueGoodTable,
      BAvatar,
      BBadge,
      BPagination,
      BFormGroup,
      BFormInput,
      BFormSelect,
      BDropdown,
      BDropdownItem,
    },
    data() {
      return {
        pageLength: 3,
        dir: false,
        columns: [
          {
            label: 'Name',
            field: 'fullName',
          },
          {
            label: 'name_local',
            field: 'name_local',
          },
          {
            label: 'Action',
            field: 'action',
          },
        ],
        rows: [],
        searchTerm: '',
      }
    },
    computed: {
      direction() {
        if (store.state.appConfig.isRTL) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.dir = true
          return this.dir
        }
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = false
        return this.dir
      },
    },
    created() {
      this.$http.get('/good-table/basic')
        .then(res => { this.rows = res.data })
    },
  }
  </script>