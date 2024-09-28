<template>
  <div>
    <b-overlay :show="loading" rounded="sm">
      <div class="mb-3">
          <b-row class="mb-1 w-100 align-items-center">
            <h3 class="ml-1">
              {{ $t("Global.fall_due_date") }}
            </h3>
            <div class="mx-2 d-block w-100 text-center">
              <strong
                class="w-100 d-flex justify-content-center align-items-center flex-wrap"
              >
                <div>
                  {{ $t("Global.first_due_date") }} :
                  <small class="text-uppercase text-primary text-bold">
                    {{ (due_dates_object && due_dates_object.fall_due_date && due_dates_object.fall_due_date.options_value) ? due_dates_object.fall_due_date.options_value.first_due_date : " _ " }}
                  </small>
                  &nbsp; &nbsp;
                  {{ $t("Global.second_due_date") }} :
                  <small class="text-uppercase text-primary text-bold">
                    {{ (due_dates_object && due_dates_object.fall_due_date && due_dates_object.fall_due_date.options_value) ? due_dates_object.fall_due_date.options_value.second_due_date : " _ " }}
                  </small>
                </div>
                <feather-icon
                  v-if="hasPermission('edit_dueDates')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="mx-2"
                  style="cursor: pointer"
                  @click="showDueDateModal('fall_due_date',due_dates_object.fall_due_date)"
                />
              </strong>
            </div>
          </b-row>
      </div>
      <hr/>
      <div class="mb-3">
          <b-row class="mb-1 w-100 align-items-center">
            <h3 class="ml-1">
              {{ $t("Global.spring_due_date") }}
            </h3>
            <div class="mx-2 d-block w-100 text-center">
              <strong
                class="w-100 d-flex justify-content-center align-items-center flex-wrap"
              >
                <div>
                  {{ $t("Global.first_due_date") }} :
                  <small class="text-uppercase text-primary text-bold">
                    {{ (due_dates_object && due_dates_object.spring_due_date && due_dates_object.spring_due_date.options_value) ? due_dates_object.spring_due_date.options_value.first_due_date : " _ " }}
                  </small>
                  &nbsp; &nbsp;
                  {{ $t("Global.second_due_date") }} :
                  <small class="text-uppercase text-primary text-bold">
                    {{ (due_dates_object && due_dates_object.spring_due_date && due_dates_object.spring_due_date.options_value) ? due_dates_object.spring_due_date.options_value.second_due_date : " _ " }}
                  </small>
                </div>
                <feather-icon
                  v-if="hasPermission('edit_dueDates')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="mx-2"
                  style="cursor: pointer"
                  @click="showDueDateModal('spring_due_date',due_dates_object.spring_due_date)"
                />
              </strong>
            </div>
          </b-row>
      </div>
      <hr/>
      <div class="mb-3">
        <b-row class="mb-1 w-100 align-items-center">
          <h3 class="ml-1">
            {{ $t("Global.summer_due_date") }}
          </h3>
          <div class="mx-2 d-block w-100 text-center">
            <strong
              class="w-100 d-flex justify-content-center align-items-center flex-wrap"
            >
              <div>
                {{ $t("Global.first_due_date") }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ (due_dates_object && due_dates_object.summer_due_date && due_dates_object.summer_due_date.options_value) ? due_dates_object.summer_due_date.options_value.first_due_date : " _ " }}
                </small>
                &nbsp; &nbsp;
                {{ $t("Global.second_due_date") }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ (due_dates_object && due_dates_object.summer_due_date && due_dates_object.summer_due_date.options_value) ? due_dates_object.summer_due_date.options_value.second_due_date : " _ " }}
                </small>
              </div>
              <feather-icon
                v-if="hasPermission('edit_dueDates')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                class="mx-2"
                style="cursor: pointer"
                @click="showDueDateModal('summer_due_date',due_dates_object.summer_due_date)"
              />
            </strong>
          </div>
        </b-row>
      </div>
      <hr/>
  </b-overlay>

  <b-modal
    ref="due-date-modal"
    v-model="dueDateModal"
    :title="$t(`Global.${type}`)"
    no-close-on-backdrop
    hide-footer
    @show="resetModal"
    @hidden="resetModal"
  >
    <validation-observer ref="dueDateRules">
      <b-form>
        <div class="row">
          <div class="col-md-12">
            <b-form-group 
              label-for="first_due_date"
              :label="$t('Global.first_due_date')"
              class="mb-1"
            >
              <validation-provider
                name="first due date"
                #default="{ errors }"
                rules="required"
              >
                <b-form-datepicker
                  v-model="due_dates.first_due_date"
                  :label-no-date-selected="$t('Global.no_selected')"
                  :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                  id="first_due_date"
                  ref="first_due_date"
                  :state="errors.length > 0 ? false : null"
                  :placeholder="$t('first_due_date')"
                />
                <small
                  class="text-danger"
                  v-for="(error, index) in errors"
                  :key="index"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "تاريخ الاستحقاق الأول مطلوب"
                      : error
                  }}
                </small>
              </validation-provider>
            </b-form-group>
          </div>
          <div class="col-md-12">
            <b-form-group 
              label-for="second_due_date"
              :label="$t('Global.second_due_date')"
              class="mb-2"
            >
              <validation-provider
                name="second due date"
                #default="{ errors }"
                rules="required"
              >
                <b-form-datepicker
                  v-model="due_dates.second_due_date"
                  :label-no-date-selected="$t('Global.no_selected')"
                  :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                  id="second_due_date"
                  ref="second_due_date"
                  :disabled="due_dates.first_due_date == null"
                  :min="due_dates.first_due_date"
                  :state="errors.length > 0 ? false : null"
                  :placeholder="$t('second_due_date')"
                />
                <small
                  class="text-danger"
                  v-for="(error, index) in errors"
                  :key="index"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "تاريخ الاستحقاق الثاني مطلوب"
                      : error
                  }}
                </small>
              </validation-provider>
            </b-form-group>
          </div>
        </div>
        <b-row>
        <!-- submit and reset -->
        <b-col md="12" style="text-align:end">
          <b-button
            :disabled="checkBtn"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mr-1"
            @click="saveDueDate()"
          >
            {{ $t('Global.save') }}
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="outline-secondary"
            @click="cancelDue"
          >
            {{ $t('Global.cancel') }}
          </b-button>
        </b-col>
      </b-row>
      </b-form>
    </validation-observer>
  </b-modal>
      
  </div>
</template>


<script>

import { mapGetters, mapActions } from 'vuex'
import {
  BTable,
  BOverlay,
  BFormCheckboxGroup,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BForm,
  BFormTextarea,
  BPopover,
  BFormDatepicker,
  BButton,
  BCard,
  BRow,
  BCol,
  BAvatar,
  BBadge,
  BLink,
  BSpinner,
  BTr,
  BCardHeader,
  BTh,
} from "bootstrap-vue";
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from "vee-validate";
export default {
    name: "DueDates",
    components: {
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BFormTextarea,
    BPopover,
    BFormDatepicker,
    BFormCheckbox,
    BTr,
    BTh,
    BCardHeader,
    BTable,
    BLink,
    BCard,
    BSpinner,
    BRow,
    BCol,
    BBadge,
    BAvatar,
    BFormCheckbox,
    BFormCheckboxGroup,
    BOverlay,
    extend,
    ValidationProvider,
    ValidationObserver,
    localize,
    },
    props: {
        yearId:Number
    },
    data() {
        return {
          checkBtn:false,
          due_dates_object: [],
          id: null,
          due_dates: {
            first_due_date: null,
            second_due_date: null,
          },
            dueDateModal: false,
            type: null,
            loading: false
        };
    },
    computed: {
        ...mapGetters({
            lookups: 'app/lookups',
        }),
    },
    mounted() {
        this.init()
    },
    methods: {
      ...mapActions({
          saveDueDates: "yearPayments/saveDueDates",
          getDueDates: "yearPayments/getDueDates",
        }),
        init() {
            this.loading = true
            this.checkBtn = false
            this.due_dates.first_due_date = null
            this.due_dates.second_due_date = null 
            this.getDueDates(this.yearId).then(response => {
              this.due_dates_object = response.data;
              this.loading = false
            });
        },
        showDueDateModal(type , due_date = null) {
          console.log(due_date)
          this.type = type;
          if( due_date && due_date.id){
            this.due_dates = due_date.options_value;
            this.id = due_date.id;
          }
          this.dueDateModal = true;
        },
        cancelDue(){
          this.init()
          this.dueDateModal = false
        },
        resetModal() {},
        saveDueDate() {
          this.$refs.dueDateRules.validate().then(success => {
          if (success) {
            const payload = { yearId: this.yearId , type:this.type , query:this.due_dates }
            if(this.id){
              payload['id'] = this.id;
            }
            this.checkBtn = true
            this.saveDueDates(payload)
            .then(response => {
              
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              })
              this.dueDateModal = false
              this.init();
              this.id = null
            })
            .catch(error => {
              const errors = [error.response.data.errors]
              errors.forEach((error, index) => {
                this.errorsdata = error
              })
            })
          }
        })
      },
    }
}
</script>

<style scoped>

</style>
