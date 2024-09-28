<template>
  <div>
    <div
      class="new-edit"
    >
      <div class="new-edit">
        <validation-observer ref="fromRules">
          <b-form
            ref="formRequest"
            @submit.stop.prevent="save"
          >
            <b-row>
              <b-col
                md="12"
              >
                <list
                  style="padding: 0 !important"
                  :data="form"
                  :only="[]"
                  :has-margins="false"
                  class="new_edit"
                >
                  <template #custom_show>
                    <tr>
                      <th
                        scope="row"
                        :width="'20%'"
                      >
                        {{ $t(`Global.name_custom`) }}
                      </th>
                      <td>
                        <div>
                          <b-form-group>
                            <validation-provider
                              #default="{ errors }"
                              rules="required|english"
                            >
                              <b-form-input v-model="form.name" />
                              <ValidationErrors :frontend-errors="errors" />
                            </validation-provider>
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        :width="'30%'"
                      >
                        {{ $t(`Global.name_arabic`) }}
                      </th>
                      <td
                        class=" width-70"
                      >
                        <div>
                          <b-form-group>
                            <validation-provider
                              #default="{ errors }"
                              rules="required|arabic"
                            >
                              <b-form-input v-model="form.name_local" />
                              <ValidationErrors :frontend-errors="errors" />
                            </validation-provider>
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        :width="'30%'"
                      >
                        {{ $t(`Global.is_administrative`) }}
                      </th>
                      <td
                        class=" width-70"
                      >
                        <div>
                          <b-form-group>
                            <input v-model="form.is_administrative" type="checkbox"> 
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
                  </template>
                </list>
              </b-col>
              <b-col
                md="12"
                class="mt-2"
                style="text-align:end"
              >
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{ $t("Global.save") }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  variant="outline-secondary"
                  @click="cancel()"
                >
                  {{ $t("Global.cancel") }}
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </div>
      <div
        v-if="load"
        style="
            position: absolute;
            width: 100%;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #eee;
            opacity: 0.8;
            text-align: center;
            z-index: 999;
            "
      >
        <b-spinner
          variant="primary"
          style="position: absolute;top: 60px;z-index: 1000"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import {
  required, email, regex, integer, mobileValidation,
} from '@validations'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import List from '@/views/components/info/list'
import { mapActions } from 'vuex'

export default {
  title: 'Edit',
  components: {
    BRow,
    BCol,
    BFormGroup,
    vSelect,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    List,
    BForm,
    BFormInput,
  },
  directives: {
    Ripple,
  },
  props: {
    input: { default: null, type: Object },
    yearId: { default: null, type: String },
  },
  data() {
    return {
      form: {
        name: null,
        name_local: null,
        is_administrative: null
      },
      paymentAccountId: null,
      errorsdata: {},
      language: this.$i18n.locale,
      load: false,
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      updatePaymentAccount: 'yearPayments/updatePaymentAccount',
    }),
    init() {
      if (this.input) {
        this.paymentAccountId = this.input.id

        this.form.name = this.input.name
        this.form.name_local = this.input.name_local
        this.form.is_administrative = (this.input.is_administrative != 0) ? 1 : 0 ;
      }
    },
    save() {
      this.$refs.fromRules.validate().then((success) => {
        this.show = true;
        if (success) {
          const payload = {
            yearId: this.yearId,
            accountId: this.paymentAccountId,
            data: this.form,
          }
          this.updatePaymentAccount(payload).then(res => {
            this.$emit('refresh', { page: this.$route.query.page })
            this.$emit('hideModal')
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
          })
        }
      });
    },
    cancel() {
      this.$emit('hideModal')
    },
  },
}
</script>

<style lang="scss" scoped>
[dir] .table th, [dir] .table td{
  padding: 0;
}
[dir] .table td{
  padding-top: 3px;
  padding-right: 3px;
  padding-bottom: 3px;
}
[dir] .form-group{
  margin-bottom: 0;
}

.new_edit {
  .b-form-datepicker {
    margin-bottom: 0 !important;
  }
  ::placeholder {
    color: #777 !important;
    opacity: 0.8 !important;
  }
  td {
    padding: 0.2rem 23px !important;
    padding-inline-start: 25px !important;
  }
  tr {
    align-items: center;
  }
  textarea.form-control {
    padding: 0.2rem 0.5rem !important;
  }
  .form-group {
    .vs--disabled {
      background-color: #f8f8f8;
    }
    .vs__selected {
      padding: 0;
      margin: 0;
    }
    .v-select div {
      flex-direction: row !important;
    }
    margin-bottom: 0;
    width: 100%;
    padding-left: 0px;
    padding-right: 8px;
    .vs__selected,
    .vs__search {
      margin-top: 0 !important;
    }
    .form-control,
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
      // border-left: 1px dashed #777;
      background: transparent;
      background-color: transparent !important;
      height: 30px;
      padding: 0.2rem 0.5rem;
    }
    .form-control.text-break {
      box-shadow: none !important;
    }
    .vs--searchable:not(.vs--single) .vs__dropdown-toggle {
      height: auto !important;
    }
    .vs--searchable.vs--single {
      .vs__dropdown-toggle {
        margin-bottom: 0;
      }
      margin-bottom: 0;
    }
  }
}
</style>
