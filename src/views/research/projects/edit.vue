<template>
  <div>
    <b-row class="new_edit">
      <b-col cols="12">
        <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <b-tab>
            <template #title>
              <feather-icon icon="InfoIcon"/>
              <span>{{ $t('Project Information') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon v-if="!edit" @click="onEdit" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
                <feather-icon v-else @click="cancel" style="cursor: pointer"
                              icon="XCircleIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Title`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Title"
                        rules="required"
                    >
                      <b-form-input v-model="formRequest.title"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Reference Number`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Reference Number"
                        rules="required"
                    >
                      <b-form-input v-model="formRequest.reference_number"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Description`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Description"
                        rules="required"
                    >
                      <b-form-textarea v-model="formRequest.description"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Location`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Location"
                    >
                      <b-form-input v-model="formRequest.location"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Room Number`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Room"
                    >
                      <b-form-input v-model="formRequest.room"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Surface Area`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Surface Area"
                    >
                      <b-form-input v-model="formRequest.surface_area"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Amount`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Amount"
                    >
                      <b-form-input type="number" v-model="formRequest.amount"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Mobility`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="desc-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Mobility"
                    >
                      <b-form-textarea v-model="formRequest.mobility"/>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Department`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Department"
                    >
                      <v-select
                          v-model="formRequest.department"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="departments"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Organizations`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Organizations"
                    >
                      <v-select
                          v-model="formRequest.organizations"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="organizations"
                          @search="fetchOrganization"
                          multiple
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Attachment Files`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="files-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Attachment Files"
                        rules=""
                    >
                      <b-form-file
                          ref="attachmentFiles"
                          v-model="formRequest.files"
                          accept=".jpg, .png, .gif, .pdf"
                          multiple
                      />
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon"/>
              <span>{{ $t('Teammates') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon @click="$emit('toEditProject', id)" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`PIs`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="PIs"
                    >
                      <v-select
                          v-model="formRequest.pis"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="pisMembers"
                          @search="fetchPIs"
                          multiple
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Team`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Team"
                    >
                      <v-select
                          v-model="formRequest.team"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="teamMembers"
                          @search="fetchTeam"
                          multiple
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Partners`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Partners"
                    >
                      <v-select
                          v-model="formRequest.partners"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="partnersMembers"
                          @search="fetchPartners"
                          multiple
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon"/>
              <span>{{ $t('Publications') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon @click="$emit('toEditProject', id)" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Publications`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-form-group
                      label-for="type-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Publications"
                    >
                      <v-select
                          v-model="formRequest.publications"
                          label="title"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="publications"
                          @search="fetchPublication"
                          multiple
                          input-id="type-input"
                          :reduce="(val) => val.id"
                      >
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>
        </b-tabs>
        <b-row>
          <b-col md="12">
            <b-button type="submit" variant="primary" class="mr-1">
              {{ $t('Global.save') }}
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="cancel">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BFormDatepicker,
  BButton,
  BFormFile,
  BFormInput,
  BFormTextarea,
  BTab,
  BTabs
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {required} from '@validations'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import EditComponent from '@/views/components/table/Edit'

import ProjectApi from "@/api/research/projects/projects";

const projectsApi = new ProjectApi()

export default {
  title: 'AddProject',
  props: {
    project_id: null,
  },
  components: {
    EditComponent,
    BCol,
    BRow,
    BFormGroup,
    BForm,
    BFormDatepicker,
    BButton,
    vSelect,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    BFormFile,
    BFormTextarea,
    BFormInput,
    BTab,
    BTabs
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      options: 'app/lookups',
      item: "projects/item",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : this.project_id;
    },
    title() {
      return this.id
          ? this.$t("Edit Project")
          : this.$t("Add Project");
    },
  },
  data() {
    return {
      edit: false,
      load: false,
      formRequest: {
        title: null,
        reference_number: null,
        description: null,
        location: null,
        room: null,
        surface_area: null,
        mobility: null,
        from_date: null,
        to_date: null,
        amount: null,
        currency_id: null,
        organizations: [],
        department: null,
        pis: [],
        team: [],
        partners: [],
        publications: [],
        cb_activities: [],
      },
      query: {
        research_types: true,
        research_languages: true,
        currencies: true,
        faculty_departments: true,
      },
      types: [],
      languages: [],
      currencies: [],
      studentsAuthors: [],
      publications: [],
      cbActivities: [],
      pisMembers: [],
      teamMembers: [],
      partnersMembers: [],
      organizations: [],
      departments: [],
      searchFiled: null,
      errorsdata: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
      getItem: "projects/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.formRequest.title = this.item.title;
          this.formRequest.reference_number = this.item.reference_number;
          this.formRequest.description = this.item.description;
          this.formRequest.location = this.item.location;
          this.formRequest.room = this.item.room;
          this.formRequest.surface_area = this.item.surface_area;
          this.formRequest.mobility = this.item.mobility;
          this.formRequest.from_date = this.item.from_date;
          this.formRequest.to_date = this.item.to_date;
          this.formRequest.amount = this.item.amount;
          this.formRequest.currency_id = this.item.currency_id;
          this.formRequest.department = this.item.department;

          for (let i = 0; i < this.item.organizations.length; i++) {
            this.formRequest.organizations.push(this.item.organizations[i].organization.id);
            this.organizations.push({
              id: this.item.organizations[i].organization.id,
              name: this.item.organizations[i].organization.name,
              name_local: this.item.organizations[i].organization.name_local
            })
          }

          for (let i = 0; i < this.item.publications.length; i++) {
            this.formRequest.publications.push(this.item.publications[i].publication.id);
            this.publications.push({
              id: this.item.publications[i].publication.id,
              title: this.item.publications[i].publication.title,
            })
          }

          for (let i = 0; i < this.item.cb_activities.length; i++) {
            this.formRequest.cb_activities.push(this.item.cb_activities[i].cb_activity.id);
            this.cbActivities.push({
              id: this.item.cb_activities[i].cb_activity.id,
              type: this.item.cb_activities[i].cb_activity.type,
            })
          }

          for (let i = 0; i < this.item.pis.length; i++) {
            this.formRequest.pis.push(this.item.pis[i].user.id);
            this.pisMembers.push({
              id: this.item.pis[i].user.id,
              name: this.item.pis[i].user.name,
              name_local: this.item.pis[i].user.name_local
            })
          }

          for (let i = 0; i < this.item.team.length; i++) {
            this.formRequest.team.push(this.item.team[i].user.id);
            this.teamMembers.push({
              id: this.item.team[i].user.id,
              name: this.item.team[i].user.name,
              name_local: this.item.team[i].user.name_local
            })
          }

          for (let i = 0; i < this.item.partners.length; i++) {
            this.formRequest.partners.push(this.item.partners[i].user.id);
            this.partnersMembers.push({
              id: this.item.partners[i].user.id,
              name: this.item.partners[i].user.name,
              name_local: this.item.partners[i].user.name_local
            })
          }

        });
      }
      this.lookups(this.query).then(res => {
        this.types = res.success.research_types;
        this.languages = res.success.research_languages;
        this.currencies = res.success.currencies;
        this.departments = res.success.faculty_departments;
      })
    },
    fetchPublication(search, loading) {
      let query = {
        search_publications_keyword: search,
      }

      if (search.length > 1) {
        loading(true)
        this.lookups(query).then((res) => {
          this.publications = res.success.publications
          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
    fetchOrganization(search, loading) {
      let query = {
        search_organizations_keyword: search,
      }

      if (search.length > 1) {
        loading(true)
        this.lookups(query).then((res) => {
          this.organizations = res.success.organizations
          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
    fetchCBActivity(search, loading) {
      let query = {
        search_cb_activities_keyword: search,
      }

      if (search.length > 1) {
        loading(true)
        this.lookups(query).then((res) => {
          this.cbActivities = res.success.cb_activities
          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
    fetchPIs(search, loading) {
      this.fetchOptions(search, loading, 'PIs')
    },
    fetchTeam(search, loading) {
      this.fetchOptions(search, loading, 'Team')
    },
    fetchPartners(search, loading) {
      this.fetchOptions(search, loading, 'Partners')
    },
    fetchOptions(search, loading, from) {
      let query = {
        search_instructors_keyword: search,
      }

      if (search.length > 1) {
        loading(true)
        this.lookups(query).then((res) => {

          if (from == 'PIs') {
            this.pisMembers = res.success.instructors
          }

          if (from == 'Team') {
            this.teamMembers = res.success.instructors
          }

          if (from == 'Partners') {
            this.partnersMembers = res.success.instructors
          }

          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
    cancel() {
      this.$emit('toListProjects');
    },
    save() {
      this.$refs.fromRules.validate().then(success => {
        if (success) {
          this.load = true
          // to send form data with files

          const formData = new FormData()
          formData.append('title', this.formRequest.title)
          formData.append('reference_number', this.formRequest.reference_number)
          formData.append('description', this.formRequest.description)
          formData.append('location', this.formRequest.location)
          formData.append('room', this.formRequest.room)
          formData.append('surface_area', this.formRequest.surface_area)
          formData.append('mobility', this.formRequest.mobility)
          formData.append('from_date', this.formRequest.from_date)
          formData.append('to_date', this.formRequest.to_date)
          formData.append('amount', this.formRequest.amount)
          formData.append('currency_id', this.formRequest.currency_id)
          formData.append('organizations', this.formRequest.organizations)
          formData.append('department', this.formRequest.department)
          formData.append('pis', this.formRequest.pis)
          formData.append('team', this.formRequest.team)
          formData.append('partners', this.formRequest.partners)
          formData.append('publications', this.formRequest.publications)
          formData.append('cb_activities', this.formRequest.cb_activities)

          projectsApi.add(this.id, formData).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.$router.go(-1)
          }).catch(error => {
            this.load = false
          })
        }
      })
    },
    onEdit() {
      this.edit = true;
      this.$emit('toEditProject', id)
    }
  },
}
</script>
