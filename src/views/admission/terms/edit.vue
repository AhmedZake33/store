<template>
  <div>
    <edit-component>
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row>
              <b-col md="6">
                <b-form-group :state="codeState" :label="$t('Global.code')" label-for="code-input">
                  <validation-provider #default="{ errors }" name="code" rules="code|required">
                    <b-form-input id="code-input" v-model="form.code" :state="errors.length > 0 ? false : null" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.english_name')" label-for="name-input">
                  <validation-provider #default="{ errors }" name="name" rules="english|required">
                    <b-form-input @keypress="sanitizeEnglish($event)" id="name-input" v-model="form.name" :state="errors.length > 0 ? false : null" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :state="nameLocalState" :label="$t('Global.arabic_name')" label-for="nameAr-input">
                  <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                    <b-form-input @keypress="sanitizeArabic($event)" id="nameAr-input" v-model="form.name_local" :state="errors.length > 0 ? false : null" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.year')" label-for="start-year" invalid-feedback="Start Year">
                  <validation-provider #default="{ errors }" name="year" rules="number|required">
                    <b-form-input @keypress="writeNumber($event)" id="year" v-model="form.year" :state="errors.length > 0 ? false : null" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'start_year')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- 
              <b-col md="6">
                <b-form-group v-if="options" :label="$t('Global.year')" label-for="year">
                  <validation-provider #default="{ errors }" name="year" rules="required">
                    <v-select :disabled="id ? true : false" v-model="form.year" :class="errors.length > 0 ? 'custom_invalid' : ''" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="years" :clearable="false" input-id="faculty_id" :reduce="val => val.id">
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                          <strong v-else>{{ name }}</strong>
                        </div>
                      </template>
                    <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                  <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important">{{ errorsdata ? (errorsdata.faculty_id ? errorsdata.faculty_id[0].ar : '') : '' }}</small>
                  <small v-else class="danger" style="color: red !important">
                    {{ errorsdata ? (errorsdata.faculty_id ? errorsdata.faculty_id[0].en : '') : '' }}
                  </small>
                </b-form-group>
              </b-col> -->

              <b-col md="6">
                <b-form-group :state="startDateState" :label="$t('Global.start_date')" label-for="start-input">
                  <validation-provider rules="required" #default="{ errors }" name="Start DATE">
                    <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')" class="top_100" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="start-input" v-model="form.start_date" :state="errors.length > 0 ? false : null" />
                    <small v-if="errors.length" class="text-danger">
                      {{ validation(null, 0).message }}
                    </small>
                  </validation-provider>
                  <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : '') : '' }}</small>
                  <small v-else class="danger" style="color: red !important">
                    {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : '') : '' }}
                  </small>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :state="endDateState" :label="$t('Global.end_date')" label-for="end-input">
                  <validation-provider rules="required" #default="{ errors }" name="end_date">
                    <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')" class="top_100" id="end-input" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" v-model="form.end_date" :min="minDate" :state="errors.length > 0 ? false : null" />
                    <small v-if="errors.length" class="text-danger">
                      {{ validation(null, 0).message }}
                    </small>
                  </validation-provider>
                  <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.end_date ? errorsdata.end_date[0].ar : '') : '' }}</small>
                  <small v-else class="danger" style="color: red !important">
                    {{ errorsdata ? (errorsdata.end_date ? errorsdata.end_date[0].en : '') : '' }}
                  </small>
                </b-form-group>
              </b-col>

              <!-- submit and reset -->
              <b-col md="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
                  {{ $t('Global.save') }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  @click="
                    cancel();
                    reset();
                  "
                  variant="outline-secondary"
                >
                  {{ $t('Global.cancel') }}
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { BCard, BRow, BCol, BFormGroup, BFormInput, BFormDatepicker, BFormCheckbox, BForm, BButton } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import EditComponent from '@/views/components/table/Edit';
import { required, email, regex, integer } from '@validations';
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  title: 'Edit',
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormDatepicker,
    BFormCheckbox,
    BForm,
    BButton,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'terms/item',
      load: 'terms/load',
      lookup: 'app/lookups',
    }),
    minDate() {
      if (!this.form.start_date) return;
      const last = this.form.start_date.charAt(this.form.start_date.length - 1);
      const beforeLast = this.form.start_date.charAt(this.form.start_date.length - 2);
      let addDay = Number(last) + 1;
      if (beforeLast == 3 && last == 0) {
        let month = this.form.start_date.charAt(this.form.start_date.length - 4);
        let increase = Number(month) + 1;
        let text = this.form.start_date.slice(0, -4) + increase + '-' + 1;
        return text;
      } else {
        let text = this.form.start_date.slice(0, -1) + addDay;
        return text;
      }
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id ? this.$t('Global.term_edit') : this.$t('Global.term_add');
    },
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      codeState: null,
      endDateState: null,
      startDateState: null,
      yearState: null,
      errorsdata: {},
      form: {
        name: null,
        name_local: null,
        code: null,
        year: null,
        type: 6,
        start_date: null,
        end_date: null,
      },
      message: null,
    };
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
  },
  mounted() {
    this.init();
  },

  methods: {
    ...mapActions({
      getItem: 'terms/get',
      getLookups: 'app/GET_LOOKUPS',
    }),
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    // addDays(count) {
    //   var date = new Date(this.form.start_date);
    //   date.setDate(date.getDate() + count);
    //   return date;
    // },
    init() {
      this.getLookups({ term_types: true }).then(_ => {
        if (this.id) {
          this.getItem(this.id).then(_ => {
            // this.form = this.item
            this.form.name = this.item.name;
            this.form.name_local = this.item.name_local;
            this.form.code = this.item.code;
            this.form.year = this.item.year;
            this.form.type = 6;
            this.form.start_date = this.item.start_date;
            this.form.end_date = this.item.end_date;
          });
        }
      });
    },

    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch('terms/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                return this.$emit('hide');
              } else {
                this.$router.push({ name: 'admission_terms' });
              }
            })
            .catch(error => {
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    cancel() {
      if (this.inline) {
        return this.$emit('hide');
      } else {
        this.$router.push({ name: 'admission_terms' });
      }
    },
  },
  watch: {
    'form.start_date'(oldVal, newVal) {
      if (newVal) {
        this.form.end_date = null;
      }
    },
  },
};
</script>

<style lang="scss">

</style>
