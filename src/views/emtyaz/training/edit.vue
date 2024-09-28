<template>
    <div class="new_edit" :class="load_data ? 'disabled_all' : ''">
      <validation-observer>
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent
            v-if="tabNumber == 0"
            :data="data"
            :only="[
              'emtyaz_training_type',
              'Bylaw',
              'period',
              'mandatory_local',
              'capacity',
              'year_name',
              'starts_at',
              'ends_at',
              'mandatory',
            ]"
          >
            <template #edit>
              <div class="mb-2">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.close')"
                  style="cursor: pointer"
                  icon="XCircleIcon"
                  class="font-medium-3 mr-1"
                  @click="cancel()"
                />
              </div>
            </template>
            <template #Bylaw="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.Bylaw`) }}
              </th>
              <td>
                {{ $i18n.locale == 'ar' ? data.bylaw_name_local : data.Bylaw }}
              </td>
            </template>
  
            <template #emtyaz_training_type="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.emtyaz_training_type`) }}
              </th>
              <td>
                {{
                  $i18n.locale == 'ar'
                    ? data.type_name_local
                    : data.emtyaz_training_type
                }}
              </td>
            </template>
  
            <template #period="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.weeks`) }}
              </th>
              <td>
                {{ data ? data.period : '-' }}
              </td>
            </template>
            <template #capacity="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.capacity`) }}
              </th>
              <td>
                <b-form-group
                  label-for="capacity-input"
                  invalid-feedback="capacity is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="capacity"
                    rules="number|required"
                  >
                    <b-form-input
                      id="capacity-input"
                      type="number"
                      :placeholder="$t('Global.capacity')"
                      v-model="form.capacity"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #mandatory_local="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.mandatory`) }}
              </th>
              <td>
                {{ $i18n.locale == 'ar' ? data.mandatory_local : data.mandatory }}
              </td>
            </template>
  
            <template #year_name="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.Year`) }}
              </th>
              <td>
                <b-form-group class="left_right" label-for="name-input">
                  <validation-provider
                    #default="{ errors }"
                    :rules="validation(null, 0).rule"
                    name="type"
                  >
                    <v-select
                      v-model="form.year_id"
                      :filter="fuseSearch"
                      :clearable="false"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="years"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      class="w-100"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.academic_year')"
                    >
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <strong v-if="$i18n.locale == 'ar'">{{
                            name_local
                          }}</strong>
                          <strong v-else>{{ name }}</strong>
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t('noMatching') }}
                      </template>
                    </v-select>
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
  
            <template #starts_at="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.start_at`) }}
              </th>
              <td>
                <b-form-group
                  label-for="starts_at-input"
                  invalid-feedback="Start At is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="starts_at"
                    rules="required"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="starts_at"
                      ref="starts_at"
                      v-model="form.starts_at"
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
  
            <template #ends_at="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.end_at`) }}
              </th>
              <td>
                <b-form-group
                  label-for="ends_at-input"
                  invalid-feedback="Start At is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="ends_at"
                    rules="required"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="ends_at"
                      ref="ends_at"
                      v-model="form.ends_at"
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
          </ShowComponent>
  
          <b-row>
            <!-- submit and reset -->
            <b-col md="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                :disabled="load"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="update()"
              >
                {{ $t('Global.save') }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="cancel"
              >
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
  import {
    BButton,
    BCard,
    BCardGroup,
    BCardText,
    BCol,
    BForm,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BListGroup,
    BListGroupItem,
    BFormDatepicker,
    BRow,
    BFormTextarea,
  } from 'bootstrap-vue';
  import vSelect from 'vue-select';
  import Ripple from 'vue-ripple-directive';
  import draggable from 'vuedraggable';
  import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
  import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
  import { required } from '@validations';
  import EditComponent from '@/views/components/table/Edit';
  import faculty from '@/api/academic_settings/faculities/faculty';
  import { FormWizard, TabContent } from 'vue-form-wizard';
  import 'vue-form-wizard/dist/vue-form-wizard.min.css';
  import ShowComponent from '@/views/components/info/show';
  import { EventBus } from '../../../main';
  import ValidationErrors from '@/views/components/common/ValidationErrors';
  
  export default {
    name: 'Edit',
    components: {
      BCard,
      BCol,
      ShowComponent,
      ValidationErrors,
      FormWizard,
      TabContent,
      BCardText,
      BFormTextarea,
      BCardGroup,
      BFormDatepicker,
      BListGroup,
      BListGroupItem,
      BRow,
      draggable,
      BFormGroup,
      BFormInput,
      BFormCheckbox,
      BForm,
      BButton,
      EditComponent,
      vSelect,
      ToastificationContent,
      ValidationProvider,
      ValidationObserver,
      localize,
    },
    directives: {
      Ripple,
    },
    props: {
      inline: { default: false, Type: Boolean },
      params: {},
      data: { default: {}, type: [Array, Object] },
      tabNumber: Number,
    },
    data() {
      return {
        form: {
          name: null,
          weeks: null,
          mandatory: false,
          capacity: null,
          year_id: null,
          starts_at: null,
          ends_at: null,
        },
        years: [],
      };
    },
  
    mounted() {
      this.init();
    },
  
    methods: {
      init(query) {
        this.$store.dispatch('Emtyaz/trainings', { query: query }).then((res) => {
          this.years = res.meta.lookup.year;
        });
        if (this.id) {
          this.form.name = this.data.emtyaz_training_type;
          this.form.weeks = this.data.period;
          this.form.year_id = this.data.year_id;
          this.form.capacity = this.data.capacity;
          this.form.starts_at = this.data.starts_at;
          this.form.ends_at = this.data.ends_at;
        }
  
        if (this.id && this.data.mandatory == 'Yes') {
          this.form.mandatory = true;
        }
      },
      cancel() {
        if (!this.data.id) {
          this.$router.go(-1);
        }
        if (this.inline) {
          this.updateFilterQueryParams({
            tabNum: this.$route.query.tabNum || 0,
            inline: false,
          });
          return this.$emit('hide');
        }
      },
  
      update() {
        const payload = { id: this.id, training: this.form };
  
        this.$store
          .dispatch('Emtyaz/updateTraining', payload)
          .then((response) => {
            const res = response.data;
  
            const data = {
              id: res.id,
              Bylaw: res.emtyaz_type.bylaw.name,
              bylaw_name_local: res.emtyaz_type.bylaw.name_local,
              emtyaz_training_type: res.emtyaz_type.name,
              type_name_local: res.emtyaz_type.name_local,
              period: res.emtyaz_type.period,
              mandatory: res.emtyaz_type.mandatory,
              mandatory_local: res.emtyaz_type.mandatory_local,
              ends_at: res.ends_at,
              starts_at: res.starts_at,
              start_year: res.year.start_year,
              end_year: res.year.end_year,
              year_name: res.year.name,
              capacity_count: res.capacityCount,
              capacity: res.capacity,
            };
  
            console.log(data);
            this.$store.commit('Emtyaz/SET_ITEM', data);
  
            this.$swal({
              icon: 'success',
              title:
                this.$i18n.locale == 'en'
                  ? 'success update course'
                  : 'تم التعديل بنجاح',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            this.$swal({
              icon: 'error',
              title: this.$t('Global.errorMessage'),
              showConfirmButton: false,
              timer: 1500,
            });
          });
      },
    },
  
    computed: {
      ...mapGetters({
        item: 'Emtyaz/item',
      }),
  
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },
  };
  </script>
  