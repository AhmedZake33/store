<template>
  <div v-if="loading" class="new_edit">
    <b-overlay :show="show" rounded="sm">
        <edit-component  :add="params && params.status == 1" >
        <template #inputs>
            <validation-observer ref="simpleRules">
            <b-form ref="form" @submit.stop.prevent="save">
                <b-row>
                <b-col md="12">
                    <b-form-group
                        
                            label-for="mc-linked_offering"
                        >
                            <validation-provider
                            #default="{ errors }"
                            name="linked_offering"
                            rules=""
                            >
                            <v-select
                                id="mc-course"
                                v-model="form.linked_offering"
                                :options="FilteredLinkedOffering"
                                :class="errors.length > 0 ? 'custom_invalid' : ''"
                                :label="getSelectLabel()"
                                class="w-100"
                                :placeholder="$t('Global.search')"
                                :reduce="(val) => val.id"
                                multiple
                                :filter="fuseSearch"
                                :dir="
                                $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                                "
                            >
                                <template slot="no-options">
                                <div v-if="loadOfferings">
                                    {{ $t("Global.loading") }}
                                </div>
                                <div v-else>
                                    {{ $t("Global.search") }}
                                </div>
                                </template>
                                <template slot="selected-option" slot-scope="option">
                                <span v-if="$i18n.locale == 'ar'">
                                    {{ option.name_local || option.name }}
                                
                                </span>
                                <span v-else>
                                    {{ option.name || option.name_local }}
                                
                                </span>
                                </template>
                                <template v-slot:option="option">
                                {{
                                    $i18n.locale == "ar"
                                    ? option.name_local || option.name
                                    : option.name || option.name_local
                                }}
                                </template>
                                <template #no-options>
                                {{ $t("noMatching") }}
                                </template>
                            </v-select>
                            <small v-if="errors.length" class="text-danger">{{
                                validation(null, 0).message
                            }}</small>
                            </validation-provider>
                        </b-form-group>
                </b-col>
                

                <b-col cols="12">
                    <hr />
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
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import draggable from "vuedraggable";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import EditComponent from "@/views/components/table/Edit";
import { EventBus } from '@/main';

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
      item: "offerings/item",
      loadOfferings: "offerings/load",
      offerings: "offerings/items",
    }),
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.$t("Global.add_linked_offering");
    },
   
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
  },
  data() {
    return {
      form: {
        linked_offering: [],
      },
      errorsdata: {},
      lookups: [],
      lookupModules: {
        linked_offerings: true,
      },
     FilteredLinkedOffering: [],
      loading: false,
      show:true,
      
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
      addLinkedOffering:"offerings/addLinkedOffering"
    
    }),
    init() {
      this.getOfferings({ query: "" });
      if (this.id) {
        this.getItem(this.id).then((value) => {
             this.getLookups(this.lookupModules).then((data) => {
            this.lookups = data.success;
            this.linkedOffering(this.id, this.lookups.linked_offerings);
             })

             if(this.item.linked_offering.length > 0)
          {
            let arr =[]
            this.item.linked_offering.forEach(linked => {
              if(linked.course)
              {
                arr.push(linked.id)
              }
            })
             this.form.linked_offering=arr

          }
          else{
            this.form.linked_offering=null
          }
          
        });
        this.loading=true
       this.show=false
        
      }
     
      
    },
     linkedOffering(offering_id, linked_offering) {
      let data = [];
      linked_offering.map((item) => {
        if ((item.id != offering_id) && (item.course)) {
            let name =  item.course.code + ' ' + item.course.name;
            let name_local = item.course.code + ' ' + item.course.name_local;
             let instance = {
               id: item.id,
               name: name,
               name_local: name_local,
            };
            data.push(instance);
        }
      });
      this.FilteredLinkedOffering = data;
    },
    save() {
       let offeringMarkInputs = [];
      
       this.$refs.simpleRules.validate().then((success) => {
            if (success) {
              this.show = true
              
                let linkedOfferingsIds= this.form.linked_offering
                  ? this.form.linked_offering
                  : []
              
              const payload = { offering_id: this.id, linkedOfferingsIds:linkedOfferingsIds };
              
              this.addLinkedOffering(payload).then((response) => {
                if (response.status && (response.status === "success")) {
                  this.$swal({
                    icon: "success",
                    title:
                      this.$i18n.locale === "en"
                        ? "Offering Linked !"
                        : "تم ربط المفرر ",
                    text:
                      this.$i18n.locale === "en"
                        ? "Offering Linked Successfully."
                        : "تم ربط المقرر بنجاح",
                    showConfirmButton: true,
                    timer: 4000,
                  });
                  
                  this.init();
                  this.cancel();
                  this.show = false
                  
                } else {
                }
              })
              .catch((error) => {
                let message = error.response.data.errors.length >0 ? error.response.data.errors[0].title : this.$t("Global.errorMessage")
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
            } else {
            }
          });
     
    },
    cancel() {
      if (this.inline) {
        EventBus.$emit('changeIt', 'cancel');
        return this.$emit("hide");
      }
    },
  
  },
};
</script>

<style scoped></style>
