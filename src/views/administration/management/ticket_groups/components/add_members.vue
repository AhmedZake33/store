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
                            {{ $t("search_input_text") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="4">
                    <b-form-group
                      :label="$t('Global.role')"
                      label-for="mc-role"
                    >
                      <validation-provider
                        #default="{ errors }"
                        :name=" 'role(' + (k+1) + ')'"
                        rules="required"
                      >
                        <v-select
                          v-model="input.role_id"
                          :options="roles"
                          class="w-100"
                          :reduce="(val) => val.id"
                          :label="getSelectLabel()"
                          :selectable="(item) => !item.disable"
                        />
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="1" />
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
      item: 'ticketGroups/item',
    }),
    id() {
      if (this.params && this.params.id) return this.params.id
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    ticket_group_id: String,
  },
  data() {
    return {
      form: {
        members: [
          {
            member_id: null,
            role_id: null,
          },
        ],
      },
      errorsdata: {},
      lookups: [],
      roles: [],
      loading: false,
      searchMembers: [],
      waitFetchUsers: false,
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      submitItem: 'ticketGroups/addMembers',
    }),
    addNewLevel() {
      this.form.members.push({
        ticket_group_id: Number(this.$route.params.id),
      })
    },
    remove(index) {
      this.form.members.splice(index, 1)
    },
    fetchUsers(search, load) {
      if (search.length >= 3 && !this.waitFetchUsers) {
        this.waitFetchUsers = true;
        load(true)
        const query = {
          search_users: true,
          search_users_keyword: search,
        }

        this.getLookups(query).then(response => {
          this.searchMembers = response.success.users
          load(false)
          this.waitFetchUsers = false;
        })
      }
    },
    init() {
      const query = { ticket_groups_roles: true }
      this.getLookups(query).then(response => {
        this.roles = response.success.roles
        this.loading = false
      })
    },
    save() {
      this.$refs.simpleRules.validate().then( success => {
        if (success) {
          if (this.validateDuplicateFormData(this.form.members)) {
            this.errorToast(this.$t('Please Check Duplicated Records'))
            return
          }

          const payload = {
            id: `${this.id}/attach-users`,
            query: {
              users: this.form.members,
            },
          }

          this.submitItem(payload).then(response => {
            if (response.status == 'success') {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: true,
                timer: 2000,
              })
              this.$emit('refresh')
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      return this.$emit('hide')
    },
    validationErrorMessage(errors) {
      if (errors.length) {
        errors[0] = errors[0].replace(/\(.*?\)/gi, '')
      }
      return errors
    },
    validateDuplicateFormData(formDataArr) {
      let founded = false
      formDataArr.forEach((object, index) => {
        formDataArr.find((o, i) => {
          if (i > index && o.member_id == object.member_id && o.faculty_id == object.faculty_id && o.department_id == object.department_id) {
            formDataArr[i].duplicatedError = true
            founded = true
            return true
          }
        })
        if (founded) return
      })
      return founded
    },
  },
}
</script>

<style scoped></style>
