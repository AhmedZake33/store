<template>
  <div class="new_edit" v-if="data">
    <validation-observer ref="simpleRules">
      <b-form ref="form" @submit.stop.prevent="save">
        <ShowComponent :data="data" :only="['name', 'name_local', 'id', 'code', 'type_data','emtyaz','total_weeks']" :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_department')" />
            </div>
          </template>
          <template #emtyaz="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.emtyaz`) }}
            </th>
            <td>
              <b-form-group class="left_right" label-for="type-input">
                <validation-provider #default="{ errors }" name="type">
                            <b-form-checkbox
                            switch
                              id="type"
                              name="type"
                              v-model="checked"
                            >
                            </b-form-checkbox>
                          </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #code="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.facultyCode`) }}
            </th>
            <td>
              <b-form-group :state="codeState" class="left_right" label-for="code-input">
                <validation-provider #default="{ errors }" name="code" rules="required|code">
                  <b-form-input :placeholder="$t('Global.code')" id="code-input" v-model="form.code" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #total_weeks="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.total_weeks`) }}
            </th>
            <td>
              <b-form-group :state="total_weeks" class="left_right" label-for="code-input">
                <validation-provider #default="{ errors }" name="code" rules="required|code">
                  <b-form-input type="number" :placeholder="$t('Global.total_weeks')" id="code-input" v-model="form.total_weeks" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #id="{ data }">
            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
              {{ $t(`Global.name_local`) }}
            </th>
            <td v-if="$i18n.locale == 'en'">
              <b-form-group :state="nameLocalState" label-for="nameAr-input">
                <validation-provider #default="{ errors }" name="arabic name" rules="required|arabic">
                  <b-form-input
                    id="nameAr-input"
                    class="right_left"
                    :placeholder="$t('Global.arabic_name')"
                    @keypress="
                      sanitizeArabic($event);
                      sanitizeNumber($event);
                    "
                    v-model="form.name_local"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                </validation-provider>
              </b-form-group>
            </td>

            <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
            <td v-if="$i18n.locale == 'ar'">
              <b-form-group class="left_right" label-for="name-input">
                <validation-provider #default="{ errors }" name="name" rules="required|english">
                  <b-form-input
                    @keypress="
                      sanitizeEnglish($event);
                      sanitizeNumber($event);
                    "
                    id="name-input"
                    :placeholder="$t('Global.english_name')"
                    v-model="form.name"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #name="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.name_custom`) }}
            </th>
            <td>
              <b-form-group class="left_right" label-for="name-input">
                <validation-provider #default="{ errors }" name="name" rules="required|english">
                  <b-form-input
                    @keypress="
                      sanitizeEnglish($event);
                      sanitizeNumber($event);
                    "
                    id="name-input"
                    :placeholder="$t('Global.english_name')"
                    v-model="form.name"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #type_data="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.type`) }}
            </th>
            <td>
              <b-form-group class="left_right" label-for="name-input">
                <validation-provider #default="{ errors }" :rules="validation(null, 0).rule" name="type">
                  <v-select :filter="fuseSearch" v-model="form.type" :class="errors.length > 0 ? 'custom_invalid' : ''" label="label" :reduce="re => re.type" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="types" :clearable="false">
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #name_local="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.arabic_name`) }}
            </th>
            <td>
              <b-form-group :state="nameLocalState" label-for="nameAr-input">
                <validation-provider #default="{ errors }" name="arabic name" rules="required|arabic">
                  <b-form-input
                    id="nameAr-input"
                    class="right_left"
                    :placeholder="$t('Global.arabic_name')"
                    @keypress="
                      sanitizeArabic($event);
                      sanitizeNumber($event);
                    "
                    v-model="form.name_local"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
        </ShowComponent>

        <b-row>
          <!-- submit and reset -->
          <b-col md="12" :class="load ? 'disabled_all' : ''">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'"  type="submit" variant="primary" class="mr-1">
              {{ $t('Global.save') }}
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="cancel">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { BCard, BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import ToastificationContent from '@core/components/toastification/ToastificationContent';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';
import EditComponent from '@/views/components/table/Edit';
import ShowComponent from '@/views/components/info/show';

export default {
  title: 'Edit',
  components: {
    EditComponent,
    BCard,
    BCol,
    ShowComponent,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    ValidationErrors,
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
  props: {
    inline: { default: false, Type: Boolean },
    data: { default: {}, type: [Array, Object] },
  },
  computed: {
    ...mapGetters({
      item: 'faculties/item',
      load: 'app/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    types() {
      return [
        { type: 1, label: this.$t('Global.Scientific') },
        { type: 2, label: this.$t('Global.Literary') },
      ];
    },
    title() {
      // return this.id ? this.$t('Global.edit_section') +' '+ item.section : this.$t('Global.add_section')
      return this.id ? this.$t('Global.faculty_edit') : this.$t('Global.faculty_add');
    },
  },
  data() {
    return {
      checked:false,
      nameState: null,
      nameLocalState: null,
      codeState: null,
      errorsdata: {},
      form: {},
      message: null,
    };
  },
  mounted() {
    this.init();
  },
  watch:{
    data: function(newVal , oldVal){
      this.form = newVal
    }
  },
  methods: {
    ...mapActions({
      getItem: 'faculties/get',
    }),
    init() {
      if (this.id && this.data) {
        this.form.name = this.data.name;
        this.form.name_local = this.data.name_local;
        this.form.code = this.data.code;
        this.form.type = this.data.type;
        this.form.emtyaz = this.data.emtyaz;
        this.form.total_weeks = this.data.total_weeks;
        this.checked = this.data.emtyaz == 1 ? true : false;
      }
      if (!this.id) {
        this.data = { name: '', name_local: '', id: '', code: '', type_data: '', type: null, emtyaz:null };
      }
    },
    checkIfArabic(type) {
      const arabic = /[\u0600-\u06FF]/;
      if (type == 'en') {
        if (arabic.test(this.form.name)) {
          this.form.name = '';
        } else {
          return this.form.name;
        }
      } else if (type == 'ar') {
        if (!arabic.test(this.form.name_local)) {
          this.form.name_local = '';
        } else {
          return this.form.name_local;
        }
      }
    },
    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.form.emtyaz = this.checked ? 1 : 0 ;
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch('faculties/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
              // if (this.inline) {
              //   this.$emit('refresh');
              //   return this.$emit('hide');
              // }
              this.$emit('refresh', response.data.id);
              if (!this.$route.params.id) {
                this.$router
                  .push({ name: 'faculty', params: { id: response.data.id } })
                  .then(_ => {})
                  .catch(() => {});
              }
            })
            .catch(error => {
              // this.$swal({
              //   icon: 'error',
              //   text: `${error || this.$t('Global.errorMessage')}`,
              //   showConfirmButton: false,
              //   timer: 1500,
              // })
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
      if (!this.$route.params.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit('hide');
      }
    },
  },
};
</script>

<style lang="scss"></style>
