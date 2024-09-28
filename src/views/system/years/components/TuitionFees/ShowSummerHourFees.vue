<template>
  <b-row
    class="custom_flex"
  >
    <b-col cols="12">
      <b-overlay
        :show="loading"
        rounded="sm"
      >
        <b-card v-if="data">
          <b-card-header class="mt-0 pt-0 pb-0 p-0">
            <div class="mt-0 d-flex align-items-center">
              <h3>
                {{ $t('Service Fees Details') }}
              </h3>
            </div>
            <slot
              name="edit"
              :data="data"
            />
          </b-card-header>
          <hr>
          <div>
            <list
              style="padding: 0 !important"
              :data="data.payment_setting"
              :only="[]"
              :has-margins="false"
              class="new_edit"
            >
              <template #custom_show>
                <tr>
                  <th>
                    {{ $t('Global.level') }}
                  </th>
                  <td>
                    <span v-if="data.payment_setting.level_number">
                      {{ getTranslatedName(getLevelName(data.payment_setting.level_number)) }}
                    </span>
                  </td>
                </tr>
              </template>
            </list>
          </div>
          <hr>
          <div>
            <h4>
              {{ $t('Fees') }}
            </h4>
            <table
              v-if="data.payment_setting"
              class="table table-striped custom_table text_nobreak"
            >
              <thead>
                <th> {{ $t('egy_pound') }} </th>
                <th> {{ $t('usd_dollar') }} </th>
              </thead>
              <tbody style="text-align: initial">
                <tr>
                  <td>
                    {{ data.payment_setting.value_local }}
                  </td>
                  <td>
                    {{ data.payment_setting.value_usd }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr>
          <div>
            <h4>
              {{ $t('services_details') }}
            </h4>
            <table
              v-if="data && data.payment_setting.payment_accounts"
              class="table table-striped custom_table text_nobreak"
            >
              <thead>
                <th> {{ $t('service_name') }} </th>
                <th> {{ $t('egy_pound') }} </th>
                <th> {{ $t('usd_dollar') }} </th>
              </thead>
              <tbody style="text-align: initial">
                <tr
                  v-for="field in data.payment_setting.payment_accounts"
                  :key="field.id"
                >
                  <td>
                    {{ getTranslatedNameFound( { name:field.name, name_local:field.name_local } ) }}
                  </td>
                  <td>
                    {{ field.pivot.value_local }}
                  </td>
                  <td>
                    {{ field.pivot.value_usd }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </b-overlay>
    </b-col>
    <b-row style="width: 100%">
      <b-col
        md="12"
        style="text-align:end"
      >
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          variant="outline-secondary"
          @click="$emit('hideModal')"
        >
          {{ $t('Global.cancel') }}
        </b-button>
      </b-col>
    </b-row>
  </b-row>
</template>

<script>
import {
  BTabs, BTab, BCardText, BCard, BBadge, BCol, BRow, BCardHeader, BOverlay, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import List from '@/views/components/info/list'

export default {
  components: {
    BCardText,
    BCardHeader,
    BTabs,
    BTab,
    BCard,
    BCol,
    BOverlay,
    BRow,
    BBadge,
    BButton,
    List,
  },
  directives: {
    Ripple,
  },
  props: {
    data: null,
    loading: false,
    lookupLevels: {
      default: null,
      type: Array,
    },
  },
  data() {
    return {
      totalSumServices: {
        totalLocal: 0,
        totalUsd: 0,
      },
    }
  },
  computed: {
  },
  watch: {
    data(val) {
      val.payment_setting.payment_accounts.forEach(item => {
        this.totalSumServices.totalLocal += item.pivot.value_local
        this.totalSumServices.totalUsd += item.pivot.value_usd
      })
    },
  },
  mounted() {
  },
  methods: {
    getLevelName(id) {
      if(this.lookupLevels.length > 0){
        return  this.lookupLevels.filter(x => x.level_number == id)[0]
      }else{
        return id;
      }
    }
  },
}
</script>

<style lang="scss">
.custom_flex .card .row div{
  margin-bottom: 6px;
}
.custom_flex .card .row div div{
  display: flex;
  flex-direction: column;
  span,a{
    margin-inline-start: 5px;
  }
}
</style>
