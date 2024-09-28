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
                <!--                Personal info -->
                <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  :has-margins="false"
                  class="new_edit"
                >
                  <template #custom_show>
                    <!--                English Name   -->
                    <tr>
                      <th
                        scope="row"
                        :width="'20%'"
                      >
                        {{ $t(`Global.name`) }}
                      </th>
                      <td>
                        <div>
                          <b-form-group>
                            <validation-provider
                              #default="{ errors }"
                              rules="required|english"
                            >
                              <b-form-input v-model="input.name" />
                              <ValidationErrors :frontend-errors="errors" />
                            </validation-provider>
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
                    <!--                      Arabic name   -->
                    <tr>
                      <th
                        scope="row"
                        :width="'30%'"
                      >
                        {{ $t(`Global.name_local`) }}
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
                              <b-form-input v-model="input.name_local" />
                              <ValidationErrors :frontend-errors="errors" />
                            </validation-provider>
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
<!--                    Service V-select of flags-->
                    <tr>
                      <th
                          scope="row"
                          :width="'20%'"
                      >
                        {{ $t('types') }}
                      </th>
                      <td>
                        <div>
                          <b-form-group>
                            <validation-provider
                                #default="{ errors }"
                                name="Signature 1 input"
                                rules="required"
                            >
                              <v-select
                                  v-model="input.flags"
                                  :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                  :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                  :options="flags"
                                  :reduce="val => val.code"
                                  multiple
                              >
                                <template #option="{ name,name_local }">
                                  {{ $i18n.locale == 'en' ? name : name_local }}
                                </template>
                                <template #selected-option="{ name, name_local }">
                                  {{ $i18n.locale == 'en' ? name : name_local }}
                                </template>
                                <template #no-options>
                                  {{ $t('noMatching') }}
                                </template>
                              </v-select>
                              <ValidationErrors
                                  :frontend-errors="errors"
                                  :backend-errors="getBackendFieldError(errorsdata,'selected')"
                              />
                            </validation-provider>
                          </b-form-group>
                        </div>
                      </td>
                    </tr>
<!--                    End of these flags -->
                  </template>
                </list>
                <!--                Parents info -->
              </b-col>
              <!--               submit and reset -->
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
                  @click="emitsClick()"
                >
                  {{ $t("Global.cancel") }}
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </div>
      <div
        v-if="loading"
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
  BCard,
  BFormGroup,
  BFormInput,
  BForm,
  BFormTextarea,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import EditComponent from '@/views/components/table/Edit'
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
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    EditComponent,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    List,
    BForm,
    BFormTextarea,
    BFormInput,
    localize,
  },
  directives: {
    Ripple,
  },
  props: {
    isEditShow: { default: false, type: Boolean },
    flags:{default:[],type:Array}
  },
  data() {
    return {
      form: {},
      errorsdata: {},
      language: this.$i18n.locale,
      load: false,
      edit_mode: false,
      showFlag:null,
      input:{}
    }
  },
  computed: {
    loading() {
      return this.load
    },
    isEditMode() {
      return this.isEditShow
    },
    flagsView(){
      return this.showFlag
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      updateServicePayments: 'yearPayments/updateServicePayments',
    }),
    init() {
    },
    save() {
      const payload = {
        id: null,
        data: this.input,

      }
      this.updateServicePayments(payload).then(res => {
        this.$swal({
          icon: 'success',
          title: `${this.$t('Global.saved')}`,
          showConfirmButton: false,
          timer: 1500,
        })
        this.$emit('refresh', { page: this.$route.query.page })
        this.$emit('hideModal')
      })
    },
    getBack() {
      this.$router.push({ name: 'student-show', params: { id: this.id } })
    },
    editMode() {
      this.isEditShow = !this.isEditShow
    },
    emitsClick(){
      this.$emit('refresh', { page: this.$route.query.page })
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
