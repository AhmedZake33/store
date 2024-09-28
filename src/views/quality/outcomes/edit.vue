<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent 
            :loading="load"
            v-if="data" 
            :data="data" 
            :only="[
                'questionnaire_type',
                'destination',
                'starts_at',
                'ends_at',
                'type',
              ]" 
            >
            <template #questionnaire_type>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.questionnaire_type`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.questionnaire_type')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.questionnaire_type_id"
                      :label="getSelectLabel()"
                      :options="lookups.questionnaires_types"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.questionnaire_type')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل نوع الاستبيان مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #destination>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.destination`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.destination')"
                    :rules="form.type == 3 ? '' :'required'"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.destination"
                      :label="getSelectLabel()"
                      :options="lookups.destinations"
                      :reduce="(val) => val.id"
                      :disabled="form.type == 3"
                      multiple
                      :placeholder="$t('Global.destination')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الوجهة مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #starts_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.start_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="date-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="date"
                    :rules="{
                      required: true,
                    }"
                  >
                    <date-picker 
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      type="datetime"
                      id="date-input"
                      v-model="form.starts_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.start_date')"
                      class="w-100"
                      valueType="format"  
                    >
                    </date-picker>
                    <!-- <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="date-input"
                      v-model="form.starts_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.start_date')"
                      date-format-options=""
                    /> -->
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.start_date")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #ends_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.end_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="end_date"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="end date"
                    :rules="{
                      required: true,
                    }"
                  >
                      <date-picker 
                        :label-no-date-selected="$t('Global.no_selected')"
                        :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                        type="datetime"
                        id="end_date"
                        v-model="form.ends_at"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.end_date')"
                        class="w-100"
                        valueType="format"  
                      >
                      </date-picker>
                    <!-- <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="end_date"
                      v-model="form.ends_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.end_date')"
                    /> -->
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ الانتهاء مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #type>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.type`) }}
              </th>
              <td>
                <b-form-group
                  label-for="type-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.type')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.type"
                      :label="getSelectLabel()"
                      :options="lookups.types"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.type')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل النوع مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon v-if="hasPermission('edit_exam')" @click="cancel()" style="cursor: pointer"
                  icon="XCircleIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.close')" />
              </div>
            </template>
          </ShowComponent>
          <b-row>
            <b-col md="12 mt-3">
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
                type="reset"
                variant="outline-secondary"
                @click="cancel"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
import ShowComponent from "@/views/components/info/show";
import DatePicker from "vue2-datepicker";

import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormTextarea,
  BSpinner,
  BPopover,
  BFormDatepicker,
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    BFormDatepicker,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    localize,
    DatePicker
  },
  directives: {
    Ripple,
  },
  watch:{
    'form.type': function (val){
    }
  },
  computed: {
    ...mapGetters({
      lookups: "questionnaires/lookups",
      item: "questionnaires/item",
      load: "questionnaires/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.questionnaires_edit")
        : this.$t("Global.questionnaires_add");
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
    data: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      errorsdata: {},
      form: {
        questionnaire_type_id: null,
        destination:[],
        starts_at: null,
        ends_at: null,
        type: null,
      },
    };
  },
  
  methods: {
    ...mapActions({
      getItem: "questionnaires/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.questionnaire_type_id = this.item.questionnaire_type.id;
          this.form.starts_at = this.item.starts_at;
          this.form.ends_at = this.item.ends_at;
          this.form.type = this.item.type.id;
          this.item.destination.forEach((el)=>{
            this.form.destination.push(el.id)
          })
        });
      }
    },
    cancel() {
      if(!this.id){
        this.$router.go(-1)
      }
      if (this.inline) {
        return this.$emit('hide');
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("questionnaires/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if(this.$route.name == "add_questionnaire"){
                this.$router.go(-1)
              }else{
                this.init();
                this.$emit('hide');
              }
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped></style>
