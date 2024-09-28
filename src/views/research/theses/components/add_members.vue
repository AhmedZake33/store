<template>
  <div class="new_edit">
    <edit-component :add="params && params.status == 1">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form
            ref="form"
            @submit.stop.prevent="save"
          >
            <b-row>
              <b-col md="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  class="float-right mt-0 mt-md-2"
                  variant="primary"
                  @click="addNewLevel"
                >
                  <feather-icon
                    icon="PlusIcon"
                    class="text-md-right"
                  />
                </b-button>
              </b-col>
              <b-col md="6" class="mb-3" v-if="memberType==1">
                <b-form-group 
                  label-for="name"
                  :label="$t('Global.external_supervisor')"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="name"
                  >
                    <b-form-input
                      style="height: 40px !important"
                      v-model="external_supervisor"
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      id="name"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.name')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6" class="mb-3" v-else>
                <b-form-group 
                  label-for="name"
                  :label="$t('Global.external_committee')"

                >
                  <validation-provider
                    #default="{ errors }"
                    name="name"
                  >
                    <b-form-input
                      style="height: 40px !important"
                      v-model="external_committee"
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      id="name"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.name')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-row
                  v-for="(input, k) in form.members"
                  :key="k"
                >
                  <b-col md="6">
                    <b-form-group
                      :label="$t('Member')"
                      label-for="mc-members"
                    >
                      <validation-provider
                        #default="{ errors }"
                        :name=" 'member(' + (k+1) + ')'"
                        rules="required"
                      >
                        <v-select
                          id="mc-members"
                          v-model="input.member_id"
                          :options="searchMembers"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :placeholder="$t('Global.search')"
                          :filterable="false"
                          clearable
                          :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                          :reduce="(val) => val.id"
                          @search="fetchUsers"
                        >
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col
                    lg="1"
                    md="1"
                    class="mb-50"
                  >
                    <b-button
                      v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                      variant="outline-danger"
                      class="mt-0 mt-md-2 float-right"
                      @click="remove(k)"
                    >
                      <feather-icon icon="XIcon" />
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>

              <b-col cols="12">
                <hr>
              </b-col>
              <!-- submit and reset -->
              <b-col md="12">
                <b-button
                  v-if="hasPermission('edit_student_thesis')"
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
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BButton,
  BForm,
  BFormGroup,
  BFormInput,
  BRow,
  BCol,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import EditComponent from '@/views/components/table/Edit'
import ValidationErrors from '@/views/components/common/ValidationErrors'

export default {
  title: 'Edit',
  components: {
    BRow,
    BCol,
    BFormGroup,
    BForm,
    BFormInput,
    BButton,
    EditComponent,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      items: 'theses/items',
      total: 'theses/total',
      load: 'theses/load',
      lookups: 'theses/lookups',
    }),
    id() {
      if (this.params && this.params.id) return this.params.id
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    memberType: String
  },
  data() {
    return {
      form: {
        members: [
          {
            member_id: null,
          },
        ],
      },
      external_supervisor: null,
      external_committee: null,
      errorsdata: {},
      searchMembers: [],
      waitFetchUsers: false,
    }
  },
  mounted() {
    this.init()
    this.searchMembers = []
  },

  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
    }),
    fetchUsers(search, load) {
      if (search.length >= 3 && !this.waitFetchUsers) {
        this.waitFetchUsers = true;
        load(true)
        const query = {
          search_instructors_keyword: search,
        }

        this.getLookups(query).then(response => {
          this.searchMembers=response.success.instructors
          load(false)
          this.waitFetchUsers = false;
        })
      }
    },
    init() {
      this.getLookups(query).then(response => {
        this.loading = false
      })
    },
    cancel() {
      return this.$emit('hide')
    },
    addNewLevel() {
      this.form.members.push({
        memberType: Number(this.$route.params.id),
      })
    },
    remove(index) {
      this.form.members.splice(index, 1)
    },
    validationErrorMessage(errors){
      if (errors.length){
        errors[0] = errors[0].replace(/\(.*?\)/gi, "");
      }
      return errors;
    },
    save() {
      this.$refs.simpleRules.validate().then( success => {
        if (success) {
          let supervisors = []
          this.form.members.forEach(element => {
            supervisors.push(element.member_id)
          });
          this.$store
          .dispatch('theses/addMember', { id: this.id , query: {instructors_ids: supervisors , role_id: this.memberType,external_supervisor: this.external_supervisor,external_committee: this.external_committee } })
          .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.searchMembers = []
              this.$emit('refresh');
              this.$emit('hide');
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
      })
    },
  },
}
</script>

<style scoped>
/deep/.form-group .vs__dropdown-toggle {
    height: 37px;
}
</style>
