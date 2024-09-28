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
                {{ $t('Admission Exams Fees Details') }}
              </h3>
            </div>
            <slot
              name="edit"
              :data="data"
            />
          </b-card-header>
          <hr>
          <div>
            <table>
              <tr>
                <th>
                  {{ $t('faculty') }}:
                </th>
                <td>
                  <span v-if="data.payment_setting.faculty">
                    {{ getTranslatedNameFromObject(data.payment_setting.faculty) }}
                  </span>
                </td>
              </tr>
              <tr>
                <th>
                  {{ $t('program') }}:
                </th>
                <td>
                  <span v-if="data.payment_setting.program">
                    {{ getTranslatedNameFromObject(data.payment_setting.program) }}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          <hr>
          <div>
            <h4>
              {{ $t('Fees') }}
            </h4>
            <table
              v-if="data && data.payment_installments"
              class="table table-striped custom_table text_nobreak"
            >
              <thead>
                <th />
                <th> {{ $t('egy_pound') }} </th>
                <th> {{ $t('usd_dollar') }} </th>
              </thead>
              <tbody style="text-align: initial">
                <tr>
                  <td>
                    {{ $t('exam_fees') }}
                  </td>
                  <td>
                    {{ data.payment_installments[0].value_local }}
                  </td>
                  <td>
                    {{ data.payment_installments[0].value_usd }}
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
                <th> {{ $t('is_administrative') }} </th>
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
                    {{ field.is_administrative == 2 ? 'Yes' : 'No'  }}
                  </td>
                  <td>
                    {{ field.pivot.value_local }}
                  </td>
                  <td>
                    {{ field.pivot.value_usd }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <th> {{ $t('total') }} </th>
                <th></th>
                <th> {{ totalSumServices.totalLocal }} </th>
                <th> {{ totalSumServices.totalUsd }} </th>
              </tfoot>
            </table>
          </div>
        </b-card>
      </b-overlay>
    </b-col>
    <b-row style="width: 100%">
      <!-- submit and reset -->
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
  },
  directives: {
    Ripple,
  },
  props: {
    data: null,
    loading: false,
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
      this.totalSumServices= {
        totalLocal: 0,
        totalUsd: 0,
      },
      val.payment_setting.payment_accounts.forEach(item => {
        this.totalSumServices.totalLocal += item.pivot.value_local
        this.totalSumServices.totalUsd += item.pivot.value_usd
      })
    },
  },
  methods: {
    totalLocalCalc(){
      const sum = this.data.payment_setting.payment_accounts.reduce((accumulator, object) => {
        return accumulator + object.pivot.value_local;
      }, 0);
      return this.totalSumServices.totalLocal = sum
    },
    totalUsdCalc(){
      const sum = this.data.payment_setting.payment_accounts.reduce((accumulator, object) => {
        return accumulator + object.pivot.value_usd;
      }, 0);
      return this.totalSumServices.totalUsd = sum
    }
  },
  mounted() {
    if(this.data){
      this.totalLocalCalc()
      this.totalUsdCalc()
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
