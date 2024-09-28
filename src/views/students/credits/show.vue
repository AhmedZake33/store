<template>
  <b-card class="mb-0">
    <b-tabs vertical nav-wrapper-class="nav-hidden" align="left">
      <b-tab>
        <template #title>
          <feather-icon icon="InfoIcon"/>
          <span>{{ $t('Global.basic_info') }}</span></template>
        <ShowComponent v-if="item" :data="item"
                       :only="[ 'amount', 'created_by', 'created_at', 'payment_type', 'type', 'paid', 'status', 'user']"
                       :loading="load">

          <template #user="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.user`) }}
            </th>
            <td class="d-flex flex-wrap">
              <strong>
                <b-link :to="{ name: 'user-show', params: { id: data.user.id } }"> {{ $i18n.locale == 'ar' ? data.user.name_local : data.user.name }} </b-link>
              </strong>
            </td>
          </template>
          <template #created_by="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.created_by`) }}
            </th>
            <td class="d-flex flex-wrap">
              <strong v-if="data.created_by">
                <b-link :to="{ name: 'user-show', params: { id: data.created_by.id } }"> {{ $i18n.locale == 'ar' ? data.created_by.name_local : data.created_by.name }} </b-link>
              </strong>
              <span v-else>_</span>
            </td>
          </template>
          <template #created_at="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.created_at`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-if="data.created_at">
                {{moment(data.created_at).utc().format('YYYY-MM-DD HH:MM:SS')}}
              </span>
              <span v-else>_</span>
            </td>
          </template>
          <template #payment_type="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.payment_type`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-if="data.payment_type">
                {{ $i18n.locale == 'ar' ? data.payment_type : data.payment_type }}
              </span>
              <span v-else>_</span>
            </td>
          </template>
          <template #type="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.type`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-if="data.type">
                {{ $i18n.locale == 'ar' ? data.type.name_local : data.type.name }}
              </span>
              <span v-else>_</span>
            </td>
          </template>
          <template #amount="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`amount`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-if="data.amount">
                {{ data.amount}}
              </span>
              <span v-else>_</span>
            </td>
          </template>
          <!-- <template #notes="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.notes`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-if="data.notes">
                {{ data.notes}}
              </span>
              <span v-else>_</span>
            </td>
          </template> -->
          <template #status="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.status`) }}
            </th>
            <td class="d-flex flex-wrap">
              <b-badge pill v-if="data.status" :variant="`${getStatus(data.status.id).color}`"
                       class="text-capitalize">
                {{ $i18n.locale == 'ar' ? data.status.name_local : data.status.name}}
              </b-badge>
            </td>
          </template>
        </ShowComponent>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import List from '@/views/components/info/list';
import { mapGetters } from 'vuex';
import {BCard, BCol, BLink, BRow, BTab, BTabs} from 'bootstrap-vue';
import ShowComponent from "@/views/components/info/show";

export default {
  name: 'show',
  components: {List, BCard, BCol, BRow , ShowComponent,    BTab, BTabs, BLink },
  computed: {
    ...mapGetters({
      item: 'credits/item',
      load: 'credits/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('credits/get', this.id);
    },
  },
};
</script>

<style scoped></style>
