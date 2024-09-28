<template>
  <div
    class="new_edit"
  >
    <validation-observer ref="simpleRules">
      <b-form
        ref="form"
        @submit.stop.prevent="save"
      >
        <ShowComponent
          :data="data"
          :loading="load"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.close')"
                style="cursor: pointer"
                icon="XCircleIcon"
                class="font-medium-3"
                @click="cancel()"
              />
            </div>
          </template>

          <template #id="{ data }">
            <th
              v-if="$i18n.locale == 'en'"
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.name_local`) }}
            </th>
            <td v-if="$i18n.locale == 'en'">
              <b-form-group
                :state="nameLocalState"
                label-for="nameAr-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="arabic name"
                  rules="required|arabic"
                >
                  <b-form-input
                    id="nameAr-input"
                    v-model="form.name_local"
                    class="right_left"
                    :placeholder="$t('Global.arabic_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeArabic($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name_local')"
                  />
                </validation-provider>
              </b-form-group>
            </td>

            <th
              v-if="$i18n.locale == 'ar'"
              scope="row"
              :width="'20%'"
            >
              الاسم بالانجليزية
            </th>
            <td v-if="$i18n.locale == 'ar'">
              <b-form-group
                class="left_right"
                label-for="name-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required|english"
                >
                  <b-form-input
                    id="name-input"
                    v-model="form.name"
                    :placeholder="$t('Global.english_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeEnglish($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #name="{ data }" >
            <th v-if="$i18n.locale == 'en'"
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.name_custom`) }}
            </th>
            <th v-if="$i18n.locale == 'ar'"
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.arabic_name`) }}
            </th>
            <td v-if="$i18n.locale == 'en'">
              <b-form-group
                class="right"
                label-for="name-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required|english"
                >
                  <b-form-input
                    id="name-input"
                    v-model="form.name"
                    :placeholder="$t('Global.english_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeEnglish($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
            <td v-else-if="$i18n.locale === 'ar'">
              <b-form-group
                :state="nameLocalState"
                label-for="nameAr-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required|arabic"
                >
                  <b-form-input
                    id="nameAr-input"
                    v-model="form.name_local"
                    class="right"
                    :placeholder="$t('Global.arabic_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeArabic($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name_local')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #name_local="{ data }">
            <th v-if="$i18n.locale == 'ar'"
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.name_custom`) }}
            </th>
            
            <th v-if="$i18n.locale == 'en'"
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.arabic_name`) }}
            </th>
            <td v-if="$i18n.locale == 'ar'">
              <b-form-group
                class="right"
                label-for="name-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required|english"
                >
                  <b-form-input
                    id="name-input"
                    v-model="form.name"
                    :placeholder="$t('Global.english_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeEnglish($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name')"
                  />
                </validation-provider>
              </b-form-group>
            </td>

            <td v-else-if="$i18n.locale === 'en'">
              <b-form-group
                :state="nameLocalState"
                label-for="nameAr-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="name"
                  rules="required|arabic"
                >
                  <b-form-input
                    id="nameAr-input"
                    v-model="form.name_local"
                    class="right"
                    :placeholder="$t('Global.arabic_name')"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeArabic($event);
                      sanitizeNumber($event);
                    "
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'name_local')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template #faculty="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.faculty`) }}
            </th>
            <td>
              <b-form-group>
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
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'faculty_id')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #bylaw="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.bylaw`) }}
            </th>
            <td>
              <b-form-group
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
                    dir=" $i18n.locale == 'en'? ltr : rtl"
                    :placeholder="$t('Global.bylaw')"
                    :reduce="val => val.id"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'bylaw_id')"
                  />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #program="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.program`) }}
            </th>
            <td>
              <b-form-group
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
                    dir=" $i18n.locale == 'en'? ltr : rtl"
                    :placeholder="$t('Global.program')"
                    clearable
                    :reduce="val => val.id"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'program_id')"
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
              type="submit"
              variant="primary"
              class="mr-1"
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
import { mapGetters, mapActions } from 'vuex'
import {
  BRow, BCol, BFormGroup, BFormInput, BForm, BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required } from '@validations'
import ShowComponent from '@/views/components/info/show'

export default {
  title: 'Edit',
  components: {
    BCol,
    ShowComponent,
    BRow,
    BFormGroup,
    BFormInput,
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
  beforeRouteLeave(to, from, next) {
    if (to.path === '/ticket-groups/:id') {
      if (confirm('Are you sure you want to leave this page?')) {
        // Allow navigation to proceed
        next();
      } else {
        // Cancel navigation
        next(false);
      }
    } else {
      // Allow navigation to proceed
      next();
    }
  },
  props: {
    inline: { default: false, Type: Boolean },
    data: {
      default: {},
      type: [Array, Object],
    },
  },
  computed: {
    ...mapGetters({
      item: 'ticketGroups/item',
      load: 'ticketGroups/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      errorsdata: {},
      message: null,
      lookups: [],
      lookupModules: {
        faculties: true,
        bylaws: true,
        programs: true,
      },
      form: {
        name: null,
        name_local: null,
        bylaw_id: null,
        faculty_id: null,
        program_id: null,
      },
      firstLoad: true,
    }
  },
  mounted() {
    this.init()
  },
  
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      updateItem: 'ticketGroups/update',
      createItem: 'ticketGroups/create',
    }),
    init() {
      if (this.id) {
        this.form.name = this.data.name
        this.form.name_local = this.data.name_local
        this.form.faculty_id = this.data.faculty_id
        this.form.bylaw_id = this.data.bylaw_id
        this.form.program_id = this.data.program_id

        if (this.form.faculty_id) this.lookupModules.faculty_id = this.form.faculty_id
        if (this.form.bylaw_id) this.lookupModules.bylaw_id = this.form.bylaw_id
      }else {
        this.data = {
          name: null,
          name_local: null,
          faculty: null,
          bylaw: null,
          program: null,
        }
      }

      this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success
        this.firstLoad = false
      })
    },
    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const payload = { query: this.form }
          let submitItemMehtod = 'createItem'
          if (this.id) {
            payload.id = this.id
            submitItemMehtod = 'updateItem'
          }
          this[submitItemMehtod](payload).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            if (submitItemMehtod === 'createItem') {
              //this.$router.push({ name: 'ticket_group_show', params: { id: response.data.id } })
              let currentPath = this.$route.path;
              let queryParams = { ...this.$route.query };

              // Remove "perPage" query parameter
              delete queryParams.perPage;

              // Construct new URL without "perPage" query parameter
              let query = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
              let newUrl = `${currentPath}?${query}`;

              
              // Use $router.push() with the modified URL and route parameters
              this.$router.push({ 
                path: newUrl,
                name: 'ticket_group_show',
                params: { id: response.data.id }, 
              });
              
              // // window.location.reload();
              return this.$emit('hide')
            } else {
              this.$emit('refresh', response.data.id)
              this.cancel()
            }
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
    cancel() {
      if (!this.$route.params.id) {
        this.$router.go(-1)
      } else if (this.inline) {
        return this.$emit('hide')
      }
      return null
      // this.$router.push({ 
      //   path: '/ticket-groups/' + this.id,
      //   params: { inline:false }, 
      // });
      // this.edit = false
      // this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false })
    },
    changedFilterId(type, id) {
      this.lookupModules[type] = id;
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
    },
  },
  watch: {
    'form.faculty_id': function (newValue) {
      if (this.firstLoad) return
      this.form.bylaw_id = null
      this.form.program_id = null
      this.changedFilterId('faculty_id', newValue);

    },
    'form.bylaw_id': function (newValue) {
      if (this.firstLoad) return
      this.form.program_id = null
      this.changedFilterId('bylaw_id', newValue);
    },
  },
}
</script>

<style lang="scss">
.card-body .tabs{
  overflow: visible !important;
}
</style>
