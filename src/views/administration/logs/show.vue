<template>
  <div>
    <b-card v-if="log && log.old_value && log.old_value.affected_user">
      <h4>Affected User</h4>
      <ShowComponent v-if="log && log.old_value.affected_user" :data="log.old_value.affected_user" :loading="load" :only="['code','name','name_local','id']">
       
        <template #code="{ data }">
          
          <th scope="row" :width="'20%'">
            {{ $t(`Global.code`) }}
          </th>
          <td class="d-flex flex-wrap">
            <div >
              <b-link
                    class="font-weight-bold d-block text-nowrap"
                    :to="{ name: 'student-show', params: { id: data.id } }"
                  >
                    {{data.code }}
              </b-link>
            </div>
          </td>

        </template>
        <template #name_local="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`Global.english_name`) }}
          </th>

          <td class="d-flex flex-wrap">
            <div v-if="data">
                  <span>
                    {{ data.name || '-' }}
                  </span>
            </div>
          </td>
        </template>
        <template #id="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`Global.arabic_name`) }}
          </th>

          <td class="d-flex flex-wrap">
            <div v-if="data">
                  <span>
                    {{ data.name_local || '-' }}
                  </span>
            </div>
          </td>
        </template>
      </ShowComponent>
    </b-card>
    <b-card>
      <h4>Action Details</h4>
      <ShowComponent :data="log" :loading="load" :only="['action','page_url','url','user','created_at']" >
        <template #created_at="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`Global.created_at`) }}
          </th>

          <td class="d-flex flex-wrap">
            <div v-if="data">
              <span class="text-nowrap">{{
                toLocalDatetime(data.created_at, 'EN', true)
              }}</span>
            </div>
          </td>
        </template>
        
        <template #user="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`Created By`) }}
          </th>

          <td class="d-flex flex-wrap">
            <div v-if="data && data.user && $i18n.locale == 'en'">
              <b-link
                    class="font-weight-bold d-block text-nowrap"
                    :to="{ name: 'user-show', params: { id: data.user.id } }"
                  >
                    {{data.user.name }}
              </b-link>
                  
            </div>
            <div v-if="data && $i18n.locale == 'ar'">
              <b-link
                    class="font-weight-bold d-block text-nowrap"
                    :to="{ name: 'student-show', params: { id: data.id } }"
                  >
                    {{data.user.name_local }}
              </b-link>
                 
            </div>
          </td>
        </template>
       
        <template #url="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`API URL`) }}
          </th>

          <td class="d-flex flex-wrap">
            <div v-if="data">
                  <span>
                    {{ data.url || '-' }}
                  </span>
            </div>
          </td>
        </template>
        <template #page_url="{ data }">
          <th scope="row" :width="'20%'">
            {{ $t(`Page URL`) }}
          </th>

          <td class="d-flex flex-wrap">
            <b-link
              class="font-weight-bold d-block text-nowrap"
              :href=" data.page_url "
            >
              {{ data.page_url }}
            </b-link> 
          </td>
        </template>
      </ShowComponent>
    </b-card>

    <!-- <b-card>
      <h4>location</h4>
      <ShowComponent v-if="log && log.geo_location" :data="log.geo_location" :loading="load" :except="[]">

      </ShowComponent>
    </b-card> -->

   
   
    <b-row v-if="log.action.search('Auto Update') >= 0">
      <b-col md="12">
        <b-card>
          <h4>Updates List</h4>
          <ShowComponent v-if="log && log.old_value" :data="log.old_value" :loading="load" :except="[]">
          </ShowComponent>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col md="6">
        <b-card>
          <h4>New Data</h4>
          <ShowComponent v-if="log && log.new_value" :data="log.new_value" :loading="load" :except="[]">
          </ShowComponent>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card>
          <h4>Old Data</h4>
          <ShowComponent v-if="log && log.old_value" :data="log.old_value" :loading="load" :except="['affectedUserId','affected_user']">
         
          </ShowComponent>
        </b-card>
      </b-col>

    </b-row>
  </div>
</template>
<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BCardText,
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
  BCardBody
} from 'bootstrap-vue';

import DataTable from '@/views/components/table/DataTable';
import Show from '@/views/components/table/show';
import {mapGetters, mapState} from 'vuex';
import {VueGoodTable} from 'vue-good-table';
import ShowComponent from '@/views/components/info/show';

export default {
  components: {
    BCardActions,
    Show,
    VueGoodTable,
    BCardText,
    ShowComponent,
    DataTable,
    BCard,
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
  },
  data() {
    return {
      columns: [
        {
          label: '',
          field: 'key',
        },
        {
          label: '',
          field: 'value',
        },
      ],

      columns2: [
        {
          label: 'key',
          field: 'key',
        },
        {
          label: 'value',
          field: 'value',

        },
      ],
      rows: [
        {id: 1, name: "John", age: 20, createdAt: '', score: 0.03343},
        {id: 2, name: "Jane", age: 24, createdAt: '2011-10-31', score: 0.03343},
        {id: 3, name: "Susan", age: 16, createdAt: '2011-10-30', score: 0.03343},
        {id: 4, name: "Chris", age: 55, createdAt: '2011-10-11', score: 0.03343},
        {id: 5, name: "Dan", age: 40, createdAt: '2011-10-21', score: 0.03343},
        {id: 6, name: "John", age: 20, createdAt: '2011-10-31', score: 0.03343},
      ],
    };
  },
  computed: {
    ...mapGetters({
      log: 'log/log',
      logNewValue: 'log/logNewValue',
      logOldValue: 'log/logOldValue',
      load: 'log/load',
    }),
  },
  methods: {
    refresh(query) {
      this.$store.dispatch('log/getLog', {id: this.$route.params.id, type: this.$route.params.tableName});
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
