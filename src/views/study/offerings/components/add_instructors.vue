<template>
  <div v-if="loading" class="new_edit">
    <edit-component :add="params && params.status == 1">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row>
              <b-col md="12">
                <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    class="float-right mt-0 mt-md-2"
                    variant="primary"
                    @click="addNewLevel"
                >
                  <feather-icon icon="PlusIcon" class="text-md-right"/>
                </b-button>
              </b-col>
              <b-col md="12">
                <b-row v-for="(input, k) in form.instructors" :key="k">
                  <b-col md="6">
                    <b-form-group
                        :label="$t('Global.teacher')"
                        label-for="mc-teachers"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="teachers"
                          rules=""
                      >
                        <v-select
                            id="mc-teachers"
                            v-model="input.instructors"
                            :options="instructors_data"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :label="getSelectLabel()"
                            class="w-100"
                            :placeholder="$t('Global.search')"
                            :filterable="false"
                            clearable
                            @search="fetchUsers"
                            :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                        >
                          <template slot="selected-option" slot-scope="option">
                                                    <span v-if="$i18n.locale == 'ar'">
                                                      {{ option.name_local || option.name }}
                                                                    </span>
                            <span v-else>
                                                         {{ option.name || option.name_local }}
                                                    </span>
                          </template>
                          <template v-slot:option="option">
                                                      <span v-if="$i18n.locale == 'ar'">
                                                      {{ option.name_local || option.name }}
                                                                    </span>
                            <span v-else>
                                                         {{ option.name || option.name_local }}
                                                    </span>
                          </template>
                          <template #no-options>
                            {{ $t("search_input_text") }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{
                            validation(null, 0).message
                          }}</small>
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
                          name="role_id"
                          rules="required"
                      >
                        <v-select
                            v-model="input.role_id"
                            :options="roles"
                            :items="roles"
                            class="w-100"
                            :reduce="(val) => val.id"
                            :label="getSelectLabel()"
                            :selectable="(item) => !item.disable"
                            @input="roleChanged"
                        />

                        <small v-if="errors.length" class="text-danger">{{
                            validation(null, 0).message
                          }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="1"></b-col>
                  <b-col lg="1" md="1" class="mb-50">
                    <b-button
                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                        variant="outline-danger"
                        class="mt-0 mt-md-2 float-right"
                        @click="remove(k)"
                    >
                      <feather-icon icon="XIcon"/>
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>


              <b-col cols="12">
                <hr/>
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
import {mapActions, mapGetters} from "vuex";
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
  BRow,
  BFormTextarea,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import draggable from "vuedraggable";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import {ValidationProvider, ValidationObserver, localize} from "vee-validate";
import EditComponent from "@/views/components/table/Edit";
import {EventBus} from '@/main';

export default {
  title: "Edit",
  components: {
    BCard,
    BCol,
    BCardText,
    BFormTextarea,
    BCardGroup,
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
  computed: {
    ...mapGetters({
      //item: 'programs/item',
      //load: 'programs/load',
      //options: 'students/lookups',
      item: "offerings/item",
      loadUsers: "users/load",
      loadOfferings: "offerings/load",
      options: "app/lookups",
      users: "users/items",
      offerings: "offerings/items",
      instructors: "instructors/items",
      lookups_data: "app/indexLookups",
    }),
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    instructors_data() {
      if (this.lookups_data) {
        return this.lookups_data.instructors
      }
      return [];
    },
    title() {
      return this.$t("Global.add_instructors");
    },
    query() {
      const data = {
        bylaw_id: this.form.bylaw_id,
        instructors: true,
      };
      return data;
    },
  },
  props: {
    inline: {default: false, Type: Boolean},
    params: {},
  },
  data() {
    return {
      form: {
        instructors: [
          {
            offering_id: Number(this.$route.params.id),
          },
        ],
        teachers: [],
        examiners: [],
        coordinators: [],
        teachingAssistant: [],
      },
      errorsdata: {},
      lookups: [],
      lookupModules: {
        instructors: true,
      },
      roles: [],
      loading: false,

    };
  },
  mounted() {
    this.init();
    //this.getLookups(this.lookupModules);
    //this.getItem(this.id);
  },

  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
      getItem: "offerings/get",
      submitItem: "offerings/put",
      getOfferings: "offerings/offerings",
      SyncInstructors: "offerings/SyncInstructors",
      fetchInstructors: 'app/GET_INDEX_LOOKUPS',
      /*  getItem: 'programs/get',
                lookups: 'students/lookup',
                saveData: 'courses/sync', */
    }),
    addNewLevel() {
      this.form.instructors.push({
        offering_id: Number(this.$route.params.id),
      });
    },
    remove(index) {
      this.form.instructors.splice(index, 1);

      let dis = false
      this.form.instructors.forEach(element => {
        if (element.role_id == 4) {
          dis = true
        }
        let roles = [];
        this.lookups.instructors.forEach((data) => {
          let db = {};
          db.name = data.name;
          db.id = data.id;
          db.name_local = data.name_local;
          db.disable = data.id == 4 && dis ? true : false;
          roles.push(db);
        });
        this.roles = roles;
      })
    },
    fetchUsers(search, load) {
      // let query;
      // if (search) {
      //   query = { keywords: search || "" };
      // }
      // this.$store.dispatch('users/users', { query })
      // this.$store.dispatch("instructors/instructors", { query });

      if (search.length > 1) {
        load(true);
        let query = {
          lookups: [
            {
              table: 'instructors',
              query: 'users.removed = 0',
              ignore_search: true,
              joins: [
                {
                  table: 'users',
                  foreign_key: 'id',
                  key: 'id',
                  searchable: true,
                },
              ],
              columns: ['users.id', 'users.name', 'users.name_local'],
              keywords: search,
            },
          ],
        };
        this.fetchInstructors(query).then(_ => {
          load(false);
        });
      }
    },
    init() {
      let query = {instructors: true, offering_id: this.params.offering_id};
      /* this.lookups(query)
                if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
                    this.getItem(this.id)
                } */
      this.lookupModules = {...this.lookupModules};
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
        let roles = [];
        this.lookups.instructors.forEach((data) => {
          let db = {};
          db.name = data.name;
          db.id = data.id;
          db.name_local = data.name_local;
          //db.disable = true;
          roles.push(db);
        });
        this.roles = roles;
      });
      if (this.id) {
        this.getItem(this.id).then((value) => {

        });

      }
      this.loading = true
    },
    save() {
      let instructors = [];
      this.form.instructors.forEach((teacher) => {
        let db = {};
        db.role_id = teacher.role_id;
        db.instructor_id = teacher.instructors.id;
        instructors.push(db);
      });
      instructors = JSON.stringify(instructors);

      const payload = {id: this.$route.params.id, instructors};

      this.SyncInstructors(payload).then((response) => {
        if (response.status && response.status == "success") {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: true,
            timer: 2000,
          });
          this.init();
          this.cancel();
        }
      })
          .catch((error) => {
            let message =
                error.response.data.errors.length > 0
                    ? error.response.data.errors[0].title
                    : this.$t("Global.errorMessage");
            this.$swal({
              icon: "error",
              text: message,
              showConfirmButton: true,
              timer: 3000,
            });
          });
      /* this.saveData(payload)
                    .then(response => {
                        this.$swal({
                            icon: 'success',
                            text: `${this.$t('Global.successMessage')}`,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        if (this.inline) {
                            this.$emit('refresh')
                            return this.$emit('hide')
                        }
                        this.$router.push({name: 'instructors'})
                    }).catch(error => {
                    const errors = [error.response.data.errors]
                    errors.forEach((error, index) => {
                        const error_data = Object.values(error)[index][0]
                        this.errorsdata = error
                    })
                        }) */
    },
    cancel() {
      if (this.inline) {
        EventBus.$emit('changeIt', 'cancel');
        return this.$emit("hide");
      }
      //this.$router.push({name: 'instructors'})
    },
    roleChanged(item) {
      let dis = false
      this.form.instructors.forEach(element => {
        if (element.role_id == 4) {
          dis = true
        }
        let roles = [];
        this.lookups.instructors.forEach((data) => {
          let db = {};
          db.name = data.name;
          db.id = data.id;
          db.name_local = data.name_local;
          db.disable = data.id == 4 && dis ? true : false;
          roles.push(db);
        });
        this.roles = roles;
      })
    },
  },
};
</script>

<style scoped></style>
