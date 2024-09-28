<template>
  <div>
    <add
      v-if="hasPermission('edit_offering') && inline"
      :inline="true"
      :params="params"
      @hide="cancelAdd"
      @refresh="refresh"
      :ticket_group_id="ticket_group_id"
    />
    <DataTable
      v-else
      :title="title"
      :allow-search="false"
      :loading="load"
      @submit-modal="handleModalSubmit"
    >
      <template #action>
        <div>
          <b-button
              v-if="hasPermission('edit_members_ticketGroup')"
              v-b-tooltip.hover="$t('Global.add')"
              variant="primary"
              class="btn-icon"
              @click="params = { status: 4, faculty_id: 1, bylaw_id: 1 }; addClicked()"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </template>

        <template #customTable>
          <b-table
            :sort-desc.sync="filter.order_direction"
            :sort-by.sync="filter.order_by"
            :items="members"
            responsive
            striped
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="$t('Global.empty_text')"
          >
            <template #cell(name)="data">
              <b-link
                v-b-tooltip.hover="data.item.name"
                :to="`/users/${data.item.id}`"
                class="font-weight-bold"
              >
                {{ getTranslatedNameFromObject(data.item) }}
              </b-link>
            </template>
            <template #cell(email)="data">
              <template>
                <div v-if="data.item.email">
                  {{ data.item.email? data.item.email : '_' }}
                </div>
              </template>
            </template>
            <template #cell(phone)="data">
              <template>
                <div
                  v-if="data.item.phone"
                  class="font-weight-bold"
                >
                  {{ data.item.phone? data.item.phone : '_' }}
                </div>
              </template>
            </template>
            <template #cell(role)="data">
              <div v-if="data.item.role">
                {{ getTranslatedNameFromObject(data.item.role) }}
              </div>
            </template>
            <template #cell(actions)="data">
              <div>
                <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
                <feather-icon
                      v-if="hasPermission('edit_members_ticketGroup')"
                      v-b-tooltip.hover="$t('Global.edit')"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3"
                      v-b-modal="data.item.id.toString()"
                      @click="openEditDialog({...data.item})"
                    />
                    
                <feather-icon
                    v-if="hasPermission('delete_members_ticketGroup')"
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="remove(data.item)"
                />
                <!-- <validation-observer ref="simpleRules">
                      <b-form
                      ref="form"
                        @submit.stop.prevent="save"
                      > -->
                
            <!-- </b-form>
                </validation-observer> -->
              </div>

          </template>
        </b-table>
        
      </template>
    </DataTable>
    <b-modal
                v-model="syncModal"
                :title="$t('Global.edit')"
                :ok-title="$t('Global.submit')"
                cancel-variant="outline-secondary"
                :cancel-title="$t('Global.cancel')"
                style="cursor: pointer"
                @ok="openEditModal(ticketMember)"
                no-close-on-backdrop
              >
                      
                      <b-form-group
                        :label="$t('Global.role')"
                        label-for="mc-role"
                      >
                        <validation-provider
                          #default="{ errors }"
                          :name=" 'role(' + (1) + ')'"
                          rules="required"
                        >
                          <v-select
                            v-model="ticketMember.role_id"
                            :options="roles"
                            class="w-100"
                            :reduce="(val) => val.id"
                            :label="getSelectLabel()"
                            :selectable="(item) => !item.disable"
                          />
                          <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                        </validation-provider>
                      </b-form-group>

                      <b-form-group
                        :label="$t('Member')"
                        label-for="mc-members"
                      >
                        <validation-provider
                          #default="{ errors }"

                          rules="required"
                        >
                          <v-select
                            id="mc-members"
                            v-model="ticketMember.name"
                            :options="searchMembers"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :label="getSelectLabel()"
                            class="w-100"
                            :placeholder="$t('Global.search')"
                            :filterable="false"
                            clearable
                            :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                            :reduce="(val) =>val.id"
                            :selectable="(item) => !item.disable"
                            @search="fetchUsers"
                          >
                            <template #no-options>
                              {{ $t("Global.search_input_text") }}
                            </template>
                          </v-select>
                          <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                        </validation-provider>
                      </b-form-group>

                
              </b-modal>
  </div>
</template>

<script>
import {
  BButton, BModal, VBModal, BForm, BFormInput, BFormGroup,BLink,BTable,BCol,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { mapActions, mapGetters } from 'vuex'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import Add from '@/views/administration/management/ticket_groups/components/add_members'
import DataTable from '@/views/components/table/DataTable'
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  name: 'Members',
  components: {
    DataTable,
    Add,
    BButton,
    BTable,
    BLink,
    BModal,
    BForm,
    BFormInput,
    BFormGroup,
    vSelect,
    BCol,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    action_hide: Boolean,
    inline: false,
    ticket_group_id: String,
  },
  data() {
    return {
      selectedMember: '',
      filter: {},
      params: {},
      changeName: null,
      members: null,
      selected: 'USA',
      itemValue: null,
      modalId: "",
      roles: [],
      syncModal:false,
      form:{
        members: [
          {
            member_id: null,
            role_id: null,
          },
        ],
      },
      ticketMember:null,
      oldrole:'',
      searchMembers: [],
      waitFetchUsers: false,
    }
  },
  computed: {
    ...mapGetters({
      load: 'offerings/load',
      needDrop:'app/needDrop',
    }),
    fields() {
      const fields = [
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        {
          key: 'email',
          label: this.$t('Global.email'),
          sortable: true,
        },
        {
          key: 'phone',
          label: this.$t('Global.phone'),
          sortable: true,
        },

        {
          key: 'role',
          label: this.$t('Global.role'),
          sortable: true,
        },

        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
      return fields
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      removeMember: 'ticketGroups/removeMember',
      getMembers: 'ticketGroups/getMembers',
      getLookups: 'app/GET_LOOKUPS',
    }),
    openEditDialog(ticketMember){
      //this.oldId = oldId;
      this.ticketMember = ticketMember;
      this.syncModal=true;
      this.oldrole=ticketMember.role_id;
      this.ticketMember.name=this.$i18n.locale === 'en' ? ticketMember.name : ticketMember.name_local;
    },
    isInteger(obj){
      return typeof obj === 'number' && Number.isInteger(obj);
    },
    openEditModal(item) {
      // Set the current modal id to the selected item's id
      let oldUser_id = item.id;
      let newUser_id = item.name;
      let role = item.role_id;
      let id = this.ticket_group_id;
    
          let checkRoleOnly=0;
          if(this.isInteger(newUser_id) && oldUser_id != newUser_id){
              this.$store.dispatch("ticketGroups/edits",{id,newUser_id,oldUser_id,role,checkRoleOnly}).then((data)=>{
                if(data.status=="success"){
                    this.refresh();
                  }else{
                    this.$swal({
                        title: `${this.$t("Global.dublicate")}`,
                        text:`${this.$t("Global.edit member message")}`,
                        icon: 'warning',
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                    this.refresh();
                  }
              });
            }else if(role != this.oldrole){
                let checkRoleOnly = 1;
                newUser_id = item.id;
                this.$store.dispatch("ticketGroups/edits",{id,newUser_id,oldUser_id,role,checkRoleOnly}).then((data)=>{
                  
                  if(data.status=="success"){
                    this.refresh();
                  }else{
                    this.refresh();
                  }
                  
                });
            }
        
      // })
    },
    addClicked() {
      this.inline = true
    },
    cancelAdd() {
      this.inline = false
    },
    openEdit(id) {
      this.edit = true
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true })
    },
    handleModalSubmit(){
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
    remove(item) {
      const query = {
        id: `${this.$route.params.id}/remove-users`,
        query: {
          user_id: item.id,
          ticket_group_id: this.ticket_group_id,
        },
      }
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.removeMember(query).then(response => {
            this.refresh()
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            })
          })
        }
      })
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
          if (i > index && o.role_id == object.role_id && o.faculty_id == object.faculty_id && o.department_id == object.department_id) {
            formDataArr[i].duplicatedError = true
            founded = true
            return true
          }
        })
        if (founded) return
      })
      return founded
    },
    
    init() {
      this.getMembers(`${this.ticket_group_id}/users`).then(response => {
        this.members = response.data
      })
      const query = { ticket_groups_roles: true }
      this.getLookups(query).then(response => {
        this.roles = response.success.roles
        this.loading = false
      })
    },
    refresh() {
      this.init();
    },
  },
  watch: {
      memberName(newVal) {
        this.selectedMember = newVal;
      },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
