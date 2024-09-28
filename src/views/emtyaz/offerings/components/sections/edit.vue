<template>
  <div class="new_edit">
     <b-overlay :show="show" rounded="sm" no-fade>
     <validation-observer ref="form">
     <b-form @submit.stop.prevent="save" ref="form">
      <ShowComponent :data="item" :only="['group','quota','over_quota']" >
         <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" 
              @click="cancel()" v-if="hasPermission('edit_sections')" />
            </div>
         </template>
         <template #group={data}>
          <th scope="row" :width="'20%'">
                  {{ $t(`Global.group`) }}
                </th>
                <td>
                <b-form-group  label-for="mc-group">
                    <validation-provider
                      #default="{ errors }"
                      name="group"
                      rules="required"
                    >
                      <v-select
                        v-if="students_count == 0"
                        id="mc-group"
                        v-model="form.group_id"
                        :filter="fuseSearch"
                        :options="offeringGroups"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        :reduce="(val) => val.id"
                        :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                      />
                      <v-select
                        v-else
                        id="mc-group"
                        v-model="form.group_id"
                        :filter="fuseSearch"
                        :options="offeringGroups"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        :reduce="(val) => val.id"
                        disabled
                        :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                        style="cursor:not-allowed;"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </td>
          </template>
         <template #quota={data}>
          <th scope="row" :width="'20%'">
                  {{ $t(`Global.quota_per_section`) }}
                </th>
                <td>
                <b-form-group
                   
                    label-for="mc-quota"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="quota"
                      rules="required|integer|positive"
                    >
                      <b-form-input
                        v-if="students_count == 0"
                        id="mc-quota"
                        v-model="form.quota"
                        :state="errors.length > 0 ? false : null"
                        type="number"
                      />
                      <b-form-input
                        v-if="students_count > 0"
                        id="mc-quota"
                        v-model="form.quota"
                        :state="errors.length > 0 ? false : null"
                        disabled
                        style="cursor:not-allowed;"
                      />
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </td>
          </template>
         <template #over_quota={data}>
          <th scope="row" :width="'20%'">
                  {{ $t(`Global.over_quota_per_section`) }}
                </th>
                <td>
                  <b-form-group
                    
                    label-for="mc-over-quota"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="over quota"
                      rules="required|integer|positive"
                    >
                      <b-form-input
                        id="mc-over-quota"
                        v-model="form.over_quota"
                        :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </td>
         </template>
      </ShowComponent>
      <b-row>
       <b-col>
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
     </b-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
 BOverlay,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import draggable from "vuedraggable";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { EventBus } from '@/main';
import ShowComponent from '@/views/components/info/show';


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
    BOverlay,
    ValidationErrors,
    ShowComponent,
  },
  directives: {
    Ripple,
  },
  
  computed: {
    ...mapGetters({
      // item: 'sections/item',
      item: "sections/item",
      load: "sections/load",
    }),
    id() {
      return this.params.section_id ? this.params.section_id : null;
    },
     name() {
      return this.$t("Global.edit_section");
    },
   
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
  },
  data() {
    return {
     form: {
        quota: null,
        over_quota: null,
        group_id: null,
        section: null,
        offering_id: null,
      },
      status: null,
      students_count: 0,
      loading: false,
      show: true,
      lookups: [],
      lookupModules: {
        groups: true,
      },
      loading: false,
      section_name_local:null,
      section_name:null,
      offeringGroups: [],
      errorsdata: {},

      
    };
  },
  mounted() {
    this.init();
    //this.getItem(this.$route.params.id)
    //this.getLookups(this.lookupModules);
    //this.getItem(this.id);
  },

  methods: {
    ...mapActions({
       getItem: "sections/get",
      submitItem: "sections/put",
      getOffering: "offerings/get",
      getLookups: "app/GET_LOOKUPS",
      groupsLookup: "offerings/groupsLookup"
    }),
   
   init() {
    this.show = true
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
      this.groupsLookup(this.$route.params.id).then(response=>{
        this.offeringGroups = response
      })
      this.getOffering(this.$route.params.id).then((value) => {
        this.status = value.data.status.name;
        this.students_count = value.data.students_count;
      });

      if (this.params.section_id) {
        this.getItem(this.params.section_id).then((data) => {
          let db = {};
          db.offering_id = data.offering.id;
          db.quota = data.quota;
          db.over_quota = data.over_quota;
          db.name = data.name ? data.name : null;
          this.section_name=data.name ? data.name : data.name_local?data.name_local: null;
          this.section_name_local=data.name_local ? data.name_local : data.name?data.name: null;
          db.name_local = data.name_local ? data.name_local : null;
          db.group_id = data.group.id;

          this.form = db;
          this.loading = true;
        });
      } else {
        this.form = {
          offering_id: null,
        };
        this.$refs.form.reset();
      }
      this.show = false;
    },
  save() {
      if (this.$route.params.id) {
        this.form.offering_id = this.$route.params.id;
      } else {
        this.form.offering_id = this.item.offering.id;
      }
      const payload = {
        id: this.params && this.params.status == 1 ? null : this.id,
        query: this.form,
      };
      this.submitItem(payload).then((response) => {
         this.show = true
        if (response.status == "success") {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          /* this.$router.push({
            name: "sections",
            query: { offering_id: this.form.offering_id },
          }); */
          if (this.inline) {
            EventBus.$emit('changeIt', 'cancel');
               this.$emit("hide");
      }
        }
         this.show = false
      });
    },
    cancel() {
      if (this.inline) {
        EventBus.$emit('changeIt', 'cancel');
        return this.$emit("hide");
      }
      //this.$router.push({name: 'instructors'})
    },
    
  },
};
</script>

<style scoped></style>
