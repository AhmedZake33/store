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
                {{ $t('tuition_fees_details') }}
              </h3>
            </div>
            <slot
              name="edit"
              :data="data"
            />
          </b-card-header>
          <hr>
          <div>
            <h4>
              {{ $t('installment_details') }}
            </h4>
            <table
              v-if="data && data.payment_installments"
              class="table table-striped custom_table text_nobreak"
            >
              <thead>
                <th> {{ $t('installments') }} </th>
                <th> {{ $t('egy_pound') }} </th>
                <th> {{ $t('usd_dollar') }} </th>
              </thead>
              <tbody style="text-align: initial">
                <tr>
                  <td>
                    {{ $t('first_installment') }}
                  </td>
                  <td>
                    {{ data.payment_installments[0].value_local }}
                  </td>
                  <td>
                    {{ data.payment_installments[0].value_usd }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ $t('second_installment') }}
                  </td>
                  <td>
                    {{ data.payment_installments[1].value_local }}
                  </td>
                  <td>
                    {{ data.payment_installments[1].value_usd }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <th>
                  {{ $t('total') }}
                </th>
                <th>
                  {{ data.payment_setting.value_local }}
                </th>
                <th>
                  {{ data.payment_setting.value_usd }}
                </th>
              </tfoot>
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
      <b-col md="12" style="text-align:end">
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
  BTabs, BTab, BCardText, BCard, BBadge, BCol, BRow, BCardHeader, BOverlay,BButton
} from 'bootstrap-vue'
import Ripple from "vue-ripple-directive";

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
    BButton
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
  computed: {},
  watch: {
    // 'formServicesRemoved'(newVal){
    //   this.totalSumServices.totalLocal = 0
    //   this.totalSumServices.totalUsd = 0
    //   this.formServices.forEach((item, index) => {
    //     if (item.value_local) {
    //       this.totalSumServices.totalLocal += parseInt(item.value_local)
    //       this.handleNewInstallmentCalculation(this.formInstallments,this.totalSumServices.totalLocal,'value_local')
    //     }
    //     if (item.value_usd) {
    //       this.totalSumServices.totalUsd += parseInt(item.value_usd)
    //       this.handleNewInstallmentCalculation(this.formInstallments,this.totalSumServices.totalUsd,'value_usd')
    //     }
    //   })
    // },
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
  mounted() {
    this.data.payment_setting.payment_accounts.forEach(item => {
        this.totalSumServices.totalLocal += item.pivot.value_local
        this.totalSumServices.totalUsd += item.pivot.value_usd
      })
  },
  methods: {
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
