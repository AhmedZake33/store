<template>
  <div>
    <b-card class="mb-0 custom_margin">
      <b-tabs
        v-model="tabIndex"
        vertical
        nav-wrapper-class="nav-hidden"
        align="left"
        style="overflow: auto"
        @input="saveStatus"
      >
        <b-tab>
          <template #title>
            <feather-icon icon="InfoIcon" />
            <span>{{ $t('Global.basic_info') }}</span>
          </template>
          <edit
            v-if="edit && (item.id==idCheck)"
            :data="item"
            :inline="true"
            @hide="cancel()"
            @refresh="init"
          />
          <div v-else>
            <ShowComponent
              v-if="item"
              :data="item"
              :only="['name', 'id', 'name_local', 'faculty', 'bylaw', 'program']"
              :loading="load"
            >
              <template #edit>
                <div class="mb-2">
                  <feather-icon
                    v-if="hasPermission('edit_ticketGroup')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    @click="openEdit()"
                  />
                </div>
              </template>
              <template #name_local="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Global.english_name`) }}
                </th>
                <td>
                  {{ data.name }}
                </td>
              </template>
              <template #name="{ data }">
                <th
                  scope="row"
                  :width="'20%'"
                >
                  {{ $t(`Global.english_name`) }}
                </th>
                <td>
                  {{ data.name }}
                </td>
              </template>
              <template #id="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Global.name_local_name`) }}
                </th>
                <td>
                  {{ data.name_local }}
                </td>
              </template>
              <template #faculty="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Global.faculty`) }}
                </th>
                <td>
                  {{ getTranslatedNameFromObject(data.faculty) }}
                </td>
              </template>
              <template #bylaw="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Global.bylaw`) }}
                </th>
                <td>
                  {{ getTranslatedNameFromObject(data.bylaw) }}
                </td>
              </template>
              <template #program="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Global.program`) }}
                </th>
                <td>
                  {{ getTranslatedNameFromObject(data.program) }}
                </td>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
        <b-tab v-if="!edit">
          <template #title>
            <feather-icon icon="UsersIcon" />
            <span>{{ $t('Members') }}</span></template>
            <members
                v-if="checkTabVisited(1)"
                :tabNum="1"
                :ticket_group_id="id"
                @hide="cancel()"
                @refresh="init"
            />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BTab, BTabs, BCard,
} from 'bootstrap-vue'
import Edit from '@/views/administration/management/ticket_groups/components/edit'
import ShowComponent from '@/views/components/info/show'
import Members from "@/views/administration/management/ticket_groups/components/members";

export default {
  name: 'Show',
  components: {
    Edit,
    BTab,
    BTabs,
    BCard,
    ShowComponent,
    Members,
  },
  computed: {
    ...mapGetters({
      item: 'ticketGroups/item',
      load: 'ticketGroups/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },

  data() {
    return {
      edit: false,
      tabIndex: 0,
      visitedTabs: [],
      index: 0,
      idCheck:0,
    }
  },
  watch: {
    tabIndex(val) {
    },
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum)
      this.visitedTabs.push(this.tabIndex)
    }
  },
  mounted() {
    this.idCheck= this.$route.params.id;
    this.init()
  },
  destroyed() {
    // to reset tab filter data
    this.$store.dispatch('app/resetTabsFilter')
  },
  methods: {
    ...mapActions({
      getItem: 'ticketGroups/get',
      getLookups: 'app/GET_LOOKUPS',
      submitItem: 'ticketGroups/create',
    }),
    init(id) {
      if (this.id || id) {
        this.getItem(id ?? this.id)
        this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline
      } else {
        this.edit = true
      }
    },
    openEdit() {
      this.edit = true
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true })
    },
    cancel() {
      this.edit = false
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false })
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index, ...this.getTabFilterData(index), inline: false })
      if (this.$route.query.inline == 'false' && index != 0) {
        this.edit = false
      }
      this.visitedTabs.push(index)
    },
    checkTabVisited(index) {
      return this.visitedTabs.includes(index)
    },
  },
}
</script>

<style scoped></style>
