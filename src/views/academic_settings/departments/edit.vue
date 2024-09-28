<template>
  <div class="new_edit">
      <validation-observer ref="simpleForm">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent v-if="data" :data="data" :only="['name', 'name_local', 'id', 'code', 'faculty']" :loading="load">
            <template #id="{ data }">
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.name_local`) }}
              </th>
              <td >
                <b-form-group label-for="name_local" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                    <b-form-input :placeholder="$t('Global.arabic_name')" id="name_local" v-model="form.name_local" :state="errors.length > 0 ? false : null" @keypress="sanitizeArabic($event)" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
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
                <b-form-group label-for="name">
                  <validation-provider #default="{ errors }" name="name" rules="english|required">
                    <b-form-input ref="english_name" :placeholder="$t('Global.english_name')" id="name" v-model="form.name" :state="errors.length > 0 ? false : null" @keypress="sanitizeEnglish($event)" />
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
                <b-form-group label-for="name_local" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                    <b-form-input :placeholder="$t('Global.arabic_name')" id="name_local" v-model="form.name_local" class="right_left" :state="errors.length > 0 ? false : null" @keypress="sanitizeArabic($event)" />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #faculty="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.faculty`) }}
              </th>
              <td>
                <b-form-group v-if="options" label-for="faculty_id">
                  <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                    <v-select
                      :disabled="(id || $route.params.faculty_id) && !$route.params.id ? true : false"
                      v-model="form.faculty_id"
                      :filter="fuseSearch"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="options.faculties"
                      :clearable="false"
                      input-id="faculty_id"
                      :placeholder="$t('Global.faculty')"
                      :reduce="val => val.id"
                    >
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <span v-if="$i18n.locale == 'ar'">{{ name_local }} </span>
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
            <template #edit>
              <div class="mb-2">
                <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel" v-if="hasPermission('edit_department')" />
              </div>
            </template>
          </ShowComponent>
          
        <b-row>
          <b-col md="12" :class="load ? 'disabled_all' : ''">
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
import { required, email } from '@validations';
import EditComponent from '@/views/components/table/Edit';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import ShowComponent from '@/views/components/info/show';

export default {
  title: 'Edit',
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    vSelect,
    ShowComponent,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
  },
  directives: {
    Ripple,
  },
  watch:{
    data: function(newVal , oldVal){
      this.form = newVal
    }
  },
  computed: {
    ...mapGetters({
      item: 'departments/item',
      load: 'departments/load',
      options: 'students/lookups',
    }),
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return (this.id && !this.params) || (this.params && this.params.status == 2) ? this.$t('Global.department_edit') : this.$t('Global.department_add');
    },
  },

  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    data: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      form: {
        code: null,
        name: null,
        name_local: null,
        faculty_id: null,
      },
      errorsdata: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: 'departments/get',
      lookups: 'students/lookup',
    }),

    init() {
      this.lookups({ faculties: true, lookup_from: 'departments' });
      if (this.$route.params.faculty_id) {
        this.form.faculty_id = Number(this.$route.params.faculty_id);
      }
      if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
        // this.getItem(this.id).then(_ => {
          this.form.code = this.data.code;
          this.form.name = this.data.name;
          this.form.name_local = this.data.name_local;
          this.form.faculty_id = Number(this.data.faculty_id);
        // });
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
      this.$refs.simpleForm.validate().then(success => {
        if (success) {
          if (this.params && this.params.faculty_id) {
            this.form.faculty_id = this.params.faculty_id;
          }
          const payload = {
            id: this.params && this.params.status == 1 ? null : this.id,
            query: this.form,
          };
          this.$store
            .dispatch('departments/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
              // if (this.inline) {
              //   this.$emit('Refresh');
              //   this.updateFilterQueryParams({ bread: null }, 'bread');
              //   return this.$emit('hide');
              // }
              // this.$router.push({ name: 'departments' });
              this.$emit('Refresh',response.data.id);
              if (!this.id) {
                this.$router.push({ name: 'department',params:{id:response.data.id} });
              }
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
            });
        }
      });
    },
    cancel() {
      if(!this.id){
        this.$router.go(-1)
      }
      if (this.inline) {
        return this.$emit('hide');
      }
      // if (this.$route.params.faculty_id) {
      //   this.$router.push({ name: 'faculty', params: { id: this.$route.params.faculty_id } });
      // } else {
      //   this.$router.push({ name: 'departments' });
      // }
    },
  },
};
</script>

<style scoped></style>
