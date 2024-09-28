<template>
  <section>
    <b-row>
      {{setPageTabs()}}
      <b-col cols="12">
        <b-overlay :show="load" rounded="sm">
          <b-card no-body>
            <b-card-header class="flex-wrap text-initial" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem">
              <div style="display: inline-block; font-weight: bold">
                <feather-icon :icon="icon ? icon : 'DatabaseIcon'" size="20" />
                {{ name }}
                <b-badge pill :variant="`light-${getStatus(status).color}`" class="text-capitalize">
                  {{ getStatus(status).name }}
                </b-badge>
                <slot name="status"></slot>
              </div>
              <b-dropdown v-if="!noAction" variant="link" no-caret :right="$store.state.appConfig.layout.isRTL">
                <template #button-content>
                  <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle text-body" />
                </template>
                <slot name="action"></slot>
              </b-dropdown>
            </b-card-header>
            <b-row>
              <b-col cols="12">
                <table class="table table-striped custom_table text_nobreak">
                  <tbody style="text-align: initial">
                    <slot name="other_data"></slot>
                    <tr v-for="(item, key) in item" :key="key">
                      <th scope="row" :width="big_th ? '26%' : '20%'">{{ subtitle ? item.key : $t(`Global.${item.key}`) }}</th>
                      <td :width="'80%'">
                        <!--                      <span v-if="item.key">-->
                        <!--                        <slot :item="{ key: item.key, value: item.value }" name="custom_show"></slot>-->
                        <!--                      </span>-->
                        <span v-if="typeof item.value === 'string' && item.value.search(/\n/g) > 0"></span>
                        <span
                          v-else-if="
                            item.key &&
                            (item.key.includes('date') ||
                              item.key.includes('close_at') ||
                              item.key.includes('ends_at') ||
                              item.key.includes('starts') ||
                              item.key.includes('expiration') ||
                              item.key.includes('start') ||
                              item.key.includes('end') ||
                              item.key.includes('created_at') ||
                              item.key.includes('updated_at') ||
                              item.key === 'from' ||
                              item.key === 'to')
                          "
                        >
                          <span> <i class="el-icon-time"></i> {{ item.value }} </span>
                        </span>
                        <span v-else>
                          {{ Array.isArray(item.value) || item.value == true || item.value == false ? $t(`Global.${item.value}`) : item.value }}
                        </span>
                      </td>
                    </tr>
                    <div class="w-100 text-center py-2" v-show="item && item.length == 0 || !item">
                      No Data Found
                    </div>
                    <slot name="bottom_other_data"></slot>
                  </tbody>
                </table>
              </b-col>
            </b-row>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row>
  </section>
</template>
<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import { BCard, BRow, BCol, BCardTitle, BFormInput, BButton, BCardText, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody } from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable';
import { VueGoodTable } from 'vue-good-table';

export default {
  components: {
    BCardActions,
    VueGoodTable,
    BCardTitle,
    BCardText,
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
    return {};
  },
  props: {
    item: Array,
    name: String,
    big_th: Boolean,
    subtitle: Boolean,
    load: Boolean,
    status: Number,
    noAction: Boolean,
    icon:String,
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
