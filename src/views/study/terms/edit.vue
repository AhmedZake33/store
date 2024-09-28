<template>
  <div>
    <edit-component>
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row>
              <div v-if="show" class="overlayShow" @click="hideYear"></div>
              <b-col md="4">
                <b-form-group :label="$t('Global.english_name')" label-for="name-input">
                  <validation-provider #default="{ errors }" name="name" rules="english|required">
                    <b-form-input
                      id="name-input"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                      @keypress="
                        sanitizeEnglish($event);
                      "
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :state="nameLocalState" :label="$t('Global.arabic_name')" label-for="nameAr-input">
                  <validation-provider #default="{ errors }" name="name_local" rules="required|arabic">
                    <b-form-input
                      id="nameAr-input"
                      class="right_left"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                      @keypress="
                        sanitizeArabic($event);
                      "
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group :state="codeState" :label="$t('Global.code')" label-for="code-input">
                  <validation-provider #default="{ errors }" name="code" rules="required|code">
                    <b-form-input id="code-input" v-model="form.code" :state="errors.length > 0 ? false : null" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4" @click="showOverlay">
                <b-form-group :label="$t('Global.year')" label-for="year-input">
                  <validation-provider #default="{ errors }" name="year" rules="required">
                    <year-picker @input="handlerInput" v-model="form.year" :year-disable="'no'" />
                    <!-- @input="handlerInput"  -->
                    <!-- <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="form.year" :options="yearList" class="w-100" label="name" placeholder="Year" /> -->
                    <!-- <b-form-datepicker :date-format-options="{ year: 'numeric'}" :label-no-date-selected="$t('Global.no_selected')" class="top_100" id="end-input" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" v-model="form.year" :state="errors.length > 0 ? false : null" /> -->
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'year')" />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group :state="typeState" :label="$t('Global.type')" label-for="type-input">
                  <validation-provider #default="{ errors }" name="type" rules="selected">
                    <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="form.type" :options="lookup.types" class="w-100" label="name" :reduce="val => val.id">
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                          <strong v-else>{{ name }}</strong>
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t('noMatching') }}
                      </template>
                    </v-select>
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'type')" />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group :state="startDateState" :label="$t('Global.start_date')" label-for="start-input">
                  <validation-provider #default="{ errors }" name="Start DATE" rules="required">
                    <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')" class="top_0" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="start-input" v-model="form.start_date" :state="errors.length > 0 ? false : null" />

                    <small v-if="errors.length" class="text-danger">
                      {{ validation(null, 0).message }}
                    </small>
                  </validation-provider>
                  <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.start_date ? errorsdata.start_date[0].ar : '') : '' }}</small>
                  <small v-else class="danger" style="color: red !important">
                    {{ errorsdata ? (errorsdata.start_date ? errorsdata.start_date[0].en : '') : '' }}
                  </small>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :state="endDateState" :label="$t('Global.end_date')" label-for="end-input">
                  <validation-provider #default="{ errors }" name="Start DATE" rules="required">
                    <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')" class="top_20" id="end-input" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" v-model="form.end_date" :min="minDate" :state="errors.length > 0 ? false : null" />

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
                <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" @click="cancel" variant="outline-secondary">
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
import { required, integer, selected } from '@validations';
import ValidationErrors from '@/views/components/common/ValidationErrors';
// document.body.addEventListener("click", clickOutside, true);
// function clickOutside(e) {
//    const inside = document.querySelector('.form-group .year-picker .year-picker__year-box')
//    inside.style.display = 'none'
// }
export default {
  title: 'Edit',
  components: {
    ValidationErrors,
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
    yearList() {
      let date = new Date().getFullYear() - 10;
      let arr = [];
      for (let i = 0; i < 20; i++) {
        arr[i] = date + i;
      }
      return arr;
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      codeState: null,
      endDateState: null,
      startDateState: null,
      typeState: null,
      yearState: null,
      errorsdata: {},
      form: {
        name: null,
        name_local: null,
        code: null,
        year: this.$route.id ? null : new Date().getFullYear(),
        start_date: null,
        type: null,
        end_date: null,
      },
      message: null,
      selected: undefined,
      dateDefault: null,
      show: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: 'terms/get',
      getLookups: 'app/GET_LOOKUPS',
    }),
    showOverlay() {
      this.show = true;
      document.querySelector('.year-picker__year-box').style.display = 'block';
    },
    handlerInput(e) {
    },
    hideYear() {
      document.querySelector('.year-picker__input.year-picker__input--real').classList.remove('year-picker__input--focus');
      document.querySelector('.year-picker__year-box').style.display = 'none';
      document.querySelector('.year-picker__input.year-picker__input--real').blur();
    },
    init() {
      this.getLookups({ term_types: true }).then(_ => {
        if (this.id) {
          this.getItem(this.id).then(_ => {
            this.form = { ...this.item };
            this.form.type = this.item.type.type
          });
        }
      });
    },
    save() {
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
            this.$emit('refresh');
            return this.$emit('hide');
          }
          this.$router.push({ name: 'terms' });
        })
        .catch(error => {
          const errors = [error.response.data.errors];
          errors.forEach((error, index) => {
            const error_data = Object.values(error)[index][0];
            this.errorsdata = error;
          });
        });
    },
    cancel() {
      if (this.inline) {
        this.$emit('refresh');
        return this.$emit('hide');
      }
      this.$router.push({ name: 'terms' });
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
@import '@core/scss/vue/libs/vue-flatpicker.scss';
.overlayShow {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 77vh;
  background: transparent;
}
</style>
