<template>
  <div class="new_edit">
    {{ setData() }}
    <validation-observer v-if="data" ref="simpleRules">
      <b-form ref="form" @submit.stop.prevent="save">
        <ShowComponent  :data="data" :only="['code', 'name_local', 'name', 'id', 'start_year', 'faculty', 'flag', 'types', 'stage', 'type', ...checkChAndUG? ['training_required']:[]]" :loading="load">
          <template #edit>
            <div class="mb-2">
              <!-- <b-form-checkbox @change="changeBylaws" v-if="hasPermission('edit_bylaw')" v-model="addToAdmission" name="check-button" switch>
                {{ $t('Global.add_to_admission') }}
              </b-form-checkbox> -->
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel" v-if="hasPermission('edit_bylaw')" />
            </div>
          </template>

          <template #stage="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.stage`) }}
            </th>
            <td>
              <b-form-group label-for="stage_id" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.stage')" #default="{ errors }" name="stage_id" rules="required">
                  <v-select :clearable="false" :class="errors.length > 0 ? 'custom_invalid' : ''" v-if="options" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="form.stage_id" :options="options.bylaw_stages" class="w-100" :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'stage_id')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #type="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.type`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="level" rules="required">
                  <v-select :clearable="false" :placeholder="$t('Global.type')" :class="errors.length > 0 ? 'custom_invalid' : ''" v-if="options" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="form.type_id" :options="options.bylaw_types" class="w-100" :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'type_id')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <!--                            <template #types="{ data }">-->
          <!--                                <th scope="row" :width="'20%'">-->
          <!--                                    {{ $t(`Global.type`) }}-->
          <!--                                </th>-->
          <!--                                <td >-->
          <!--                                    <div v-for="type in data.types" :key="type">-->
          <!--                                        <span> {{ $i18n.locale == 'ar' ? type.name_local : type.name }} , </span>-->
          <!--                                    </div>-->
          <!--                                </td>-->
          <!--                            </template>-->
          <template #levels="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.levels`) }}
            </th>
            <td>
              <div v-for="level in data.levels" :key="level">
                <span> {{ $i18n.locale == 'ar' ? level.name_local : level.name }} </span>,
              </div>
            </td>
          </template>
          <template #faculty="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.faculty`) }}
            </th>
            <td>
              <b-form-group v-if="!params || (params && !params.faculty_id)" label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                  <v-select
                    :placeholder="$t('Global.faculty')"
                    :disabled="(id || $route.params.faculty_id) && !$route.params.id ? true : false"
                    v-if="options"
                    v-model="form.faculty_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="getOptions(options.faculties)"
                    :filter="fuseSearch"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="val => val.id"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'faculty_id')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #code="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.code`) }}
            </th>
            <td>
              <b-form-group label-for="code-input">
                <validation-provider #default="{ errors }" name="code" rules="code|required">
                  <b-form-input ref="code" :placeholder="data.code" id="code-input" @keypress="sanitizeEnglish($event)" v-model="form.code" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #name="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.name_custom`) }}
            </th>
            <td>
              <b-form-group label-for="name-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="name" rules="english|required">
                  <b-form-input id="name-input" :placeholder="data.name" @keypress="sanitizeEnglish($event)" @blur="checkIfArabic('en')" v-model="form.name" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #name_local="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.arabic_name`) }}
            </th>
            <td>
              {{ data.name_local }}
            </td>
          </template>
          <template #id="{ data }">
            <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
              {{ $t(`Global.name_local`) }}
            </th>
            <td>
              <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                  <b-form-input class="right_left" :placeholder="data.name_local" @keypress="sanitizeArabic($event)" @blur="checkIfArabic('ar')" id="nameAr-input" v-model="form.name_local" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #start_year="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.start_year`) }}
            </th>
            <td>
              <b-form-group label-for="start-year" invalid-feedback="Start Year">
                <validation-provider #default="{ errors }" name="start_year" rules="required">
                  <b-form-input :placeholder="$t('Global.start_year')" id="start-year" type="number" v-model="form.start_year" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'start_year')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #training_required="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.training_required`) }}
            </th>
            <td>
              <b-form-checkbox v-model="form.training_required" name="check-button">
              </b-form-checkbox>
            </td>
          </template>
        </ShowComponent>
        <b-row>
          <b-col md="12" :class="loading? 'disabled_all' : ''">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
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
import { mapActions, mapGetters } from 'vuex';
import { BButton, BCard, BCol, BForm, BFormCheckbox, BFormGroup, BFormInput, BRow } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email, regex } from '@validations';
import EditComponent from '@/views/components/table/Edit';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import ShowComponent from '@/views/components/info/show';

export default {
  title: 'Edit',
  components: {
    ShowComponent,
    ValidationErrors,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'bylaws/item',
      load: 'bylaws/load',
      options: 'students/lookups',
    }),
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return (this.id && !this.params) || (this.params && this.params.status == 2) ? this.$t('Global.bylaw_edit') : this.$t('Global.bylaw_add');
    },
    checkChAndUG(){
      if(this.form.type_id == 1 && this.form.stage_id == 1){
        return true;
      }
      return false;
    }
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    data: { default: {}, type: [Array, Object] },
    addToAdmissionProp: Boolean,
  },
  data() {
    return {
      loading:false,
      addToAdmission: this.addToAdmissionProp || false,
      form: {},
      errorsdata: {},
      warning_typesTemp:[{
    id: 1,
    name: "Semester GPA",
    name_local: "المعدل الفصلي "}]
    };
  },
  async mounted() {
    await this.init();
    this.setData()
  },
  methods: {
    ...mapActions({
      getItem: 'bylaws/get',
      lookups: 'students/lookup',
      changeStatus: 'bylaws/changeStatus',
      changeSettings: 'bylaws/changeSettings',
    }),
    setData(){
      this.form = this.data
    },
    changeSettingsMethod(){
      this.$refs.settingRules.validate().then(success => {
        if (success) {
          const payload = {
            id: this.params && this.params.status == 1 ? null : this.id,
            query: {min_training_weeks:this.form.min_training_weeks,min_percentage_final_exam:this.form.min_percentage_final_exam,warning_type:this.form.warning_type},
          };
          this.changeSettings(payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });

              // if (this.inline) {
              //   this.$emit('refresh');
              //   this.updateFilterQueryParams({ bread: null }, 'bread');
              //   return this.$emit('hide');
              // }
              // this.$router.go(-1);
              this.$emit('refresh', response.data.id);
              if (!this.id) {
                this.$router.push({ name: 'bylaw', params: { id: response.data.id } });
              }
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
            });
        }
      });
    },
    changeBylaws(val) {
      let payload = {
        query: { status: val },
        id: this.$route.params.id || null,
      };
      this.changeStatus(payload);
    },
    checkIfArabic(type) {
      const arabic = /[\u0600-\u06FF]/;
      if (type == 'en') {
        if (arabic.test(this.item.name)) {
          this.item.name = '';
        } else {
          return this.item.name;
        }
      } else if (type == 'ar') {
        if (!arabic.test(this.item.name_local)) {
          this.item.name_local = '';
        } else {
          return this.item.name_local;
        }
      }
    },
    async init() {
      const query = {
        faculties: true,
        bylaw_types: true,
        bylaw_stages: true,
        lookup_from: 'bylaws',
      };
      this.lookups(query);
      if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
        // this.getItem(this.id).then(_ => {
        this.form = this.data;
        this.form.training_required = this.data.training_required ? true : false;
        this.form.faculty_id = this.item.faculty_id;
        // });
      } else {
        this.form = {};
      }
      if (this.$route.params.faculty_id) {
        this.form.faculty_id = Number(this.$route.params.faculty_id);
      }
    },

    save() {

        this.$refs.simpleRules.validate().then(success => {
          if (success && this.form.stage_id) {
            if (this.params && this.params.faculty_id) {
              this.form.faculty_id = this.params.faculty_id;
            }
            this.form['object'] = {
              id: this.my_id,
              name: this.name,
            };
            const payload = {
              id: this.params && this.params.status == 1 ? null : this.id,
              query: this.form,
            };
            this.loading = true
            this.$store
              .dispatch('bylaws/put', payload)
              .then(response => {
                this.loading = false
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
                this.$emit('refresh', response.data.id);
                // if (this.inline) {
                //   this.$emit('refresh');
                //   this.updateFilterQueryParams({ bread: null }, 'bread');
                //   return this.$emit('hide');
                // }
                // this.$router.go(-1);
                if (!this.id) {
                  this.$router.push({ name: 'bylaw', params: { id: response.data.id } });
                }
              })
              .catch(error => {
                this.errorsdata = this.handleBackendError(error.response.data.errors);
              });
          }
        });
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit('hide');
      }
      // if (this.$route.params.faculty_id) {
      //   this.$router.push({ name: 'faculty', params: { id: this.$route.params.faculty_id } });
      // } else {
      //   this.$router.push({ name: 'bylaws' });
      // }
    },
  },
};
</script>

<style scoped></style>
