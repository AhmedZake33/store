<template>
  <div>
    <edit-component
      :name="name"
      :loading="false"
      :status="2"
    >
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form
            ref="form"
            @submit.prevent
          >
            <b-row>
              <b-col md="4">
                <b-form-group :label="$t('Global.name')" label-for="name-input">
                  <validation-provider #default="{ errors }" name="name" rules="required">
                    <b-form-input
                      id="name-input"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errors_data, 'name')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.name_local_name')" label-for="name-local-input">
                  <validation-provider #default="{ errors }" name="name_local" rules="required">
                    <b-form-input
                      id="name-local-input"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errors_data, 'name_local')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.faculty')">
                  <validation-provider
                    #default="{ errors }"
                    name="faculty_id"
                  >
                    <v-select
                      v-model="form.faculty_id"
                      :filter="fuseSearch"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :options="lookups.faculties"
                      :label="getSelectLabel()"
                      class="w-100"
                      dir=" $i18n.locale == 'en'? ltr : rtl"
                      :placeholder="$t('Global.faculty')"
                      :reduce="val => val.id"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errors_data, 'faculty_id')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.bylaw')"
                  label-for="mc-bylaws"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw_id"
                  >
                    <v-select
                      id="mc-bylaws"
                      v-model="form.bylaw_id"
                      :filter="fuseSearch"
                      :options="lookups.bylaws"
                      :disabled="form.faculty_id == null"
                      :label="getSelectLabel()"
                      class="w-100 mb-2"
                      dir=" $i18n.locale == 'en'? ltr : rtl"
                      :placeholder="$t('Global.bylaw')"
                      :reduce="val => val.id"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errors_data, 'bylaw_id')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.program')"
                  label-for="mc-program"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw_id"
                  >
                    <v-select
                        id="mc-program"
                        v-model="form.program_id"
                        :filter="fuseSearch"
                        :disabled="form.bylaw_id == null"
                        :options="lookups.programs"
                        :label="getSelectLabel()"
                        class="w-100 mb-2"
                        dir=" $i18n.locale == 'en'? ltr : rtl"
                        :placeholder="$t('Global.program')"
                        clearable
                        :reduce="val => val.id"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errors_data, 'program_id')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col md-12>
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="mr-1"
                  @click="submit"
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
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,

} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'

import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'

import EditComponent from '@/views/components/table/Edit'

import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  name: 'Add',
  components: {
    EditComponent,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,

  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'ticketGroups/item',
      load: 'ticketGroups/load',
    }),
    name() {
      return this.$t('add_ticket_group')
    },
  },
  watch: {
    'form.faculty_id': function (newValue) {
      this.form.bylaw_id = null
      this.form.program_id = null
      this.changedFilterId('faculty_id', newValue);
    },
    'form.bylaw_id': function (newValue) {
      this.form.program_id = null
      this.changedFilterId('bylaw_id', newValue);
    },
  },
  data() {
    return {
      marks: [],
      form: {
        name: null,
        name_local: null,
        bylaw_id: null,
        faculty_id: null,
        program_id: null,
        users: null,
      },
      filter: {},
      lookups: [],
      lookupModules: {
        faculties: true,
        bylaws: true,
        programs: true,
      },
      search: '',
      submit_form: {},
      errors_data: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getItem: 'ticketGroups/get',
      getLookups: 'app/GET_LOOKUPS',
      submitItem: 'ticketGroups/create',
    }),
    init() {
      this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success
      })
    },
    submit() {
      const query = this.form;
      this.$refs.simpleRules
        .validate()
        .then(success => {
          if (success) {
            this.submitItem({ query })
              .then(response => {
                if (response.status && response.status === 'success') {
                  this.$swal({
                    icon: 'success',
                    title: `${this.$t('Global.saved')}`,
                    showConfirmButton: false,
                    timer: 2000,
                  })
                  this.$router.push({ name: 'ticket_group_show', params: { id: response.data.id } })
                }
              })
              .catch(error => {
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  this.errors_data = error
                });
              })
          }
        })
    },
    changedFilterId(type, id) {
      this.lookupModules[type] = id;
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
    },
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped></style>
