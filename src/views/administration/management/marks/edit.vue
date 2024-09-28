<template>
  <div>
    <edit-component :name="this.name" :loading="false" :status="2">
      <template #inputs>
        <b-form ref="form" @submit.prevent>
          <b-row>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.mark_category')"
                label-for="mc-mark_category"
              >
                <v-select
                  v-model="form.mark_category_id"
                  :options="lookups.mark_categories"
                  class="w-100"
                  :reduce="(val) => val.id"
                  :label="getSelectLabel()"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.type')" label-for="mc-type">
                <v-select
                  v-model="form.type_id"
                  :options="types"
                  class="w-100"
                  :reduce="(val) => val.id"
                  :label="getSelectLabel()"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.flag')" label-for="mc-type">
                <v-select
                  v-model="form.flag_id"
                  :options="lookups.mark_flages"
                  class="w-100"
                  :reduce="(val) => val.id"
                  :label="getSelectLabel()"
                  multiple
                />
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                :label="$t('Global.name')"
                label-for="mc-name"
                type="text"
              >
                <b-form-input id="mc-name" v-model="form.name" type="text" />
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                :label="$t('Global.name_local')"
                label-for="mc-name_local"
              >
                <b-form-input
                  id="mc-name_local"
                  v-model="form.name_local"
                  type="text"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.short_name')"
                label-for="mc-short_name"
                type="text"
              >
                <b-form-input
                  id="mc-name"
                  v-model="form.short_name"
                  type="text"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.code')"
                label-for="mc-code"
                type="text"
              >
                <b-form-input id="mc-code" v-model="form.code" type="text" />
              </b-form-group>
            </b-col>
            <!-- <b-col md="6">
              <b-form-group
                :label="$t('Global.description')"
                label-for="mc-description"
                type="text"
              >
                <b-form-input
                  id="mc-description"
                  v-model="form.description"
                  type="text"
                />
              </b-form-group>
            </b-col> -->

            <!-- <b-col md="6">
              <b-form-group
                :label="$t('Global.description_local')"
                label-for="mc-description_local"
              >
                <b-form-input
                  id="mc-description_local"
                  v-model="form.description_local"
                  type="text"
                />
              </b-form-group>
            </b-col> -->
            <!-- submit and reset -->
            <b-col md="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit"
              >
                {{ $t("Global.submit") }}
              </b-button>
              <b-button
                @click="cancel"
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import EditComponent from "@/views/components/table/Edit";

export default {
  name: "Edit",
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
    EditComponent,
    vSelect,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "marks/item",
      load: "marks/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      /*
      if (this.id) {
         let heading = this.$t('Global.edit_mark') + ' ' + this.item.name ;
        this.$store.commit('app/SET_PATH', [
          {name:this.$t('marks'),route:{name:'marks'}},
          {name:this.getTranslatedName(this.item.name),route:{name:'marks', query:{mark_id:this.item.id}}},
          {name:heading,active:true}
        ]);
        return heading; 
        if(this.$i18n.locale === "en")
         {
          return this.$t("Global.edit_mark") + ' ' +  this.item.name;
         }
       else if(this.$i18n.locale === "ar")
       {
        return this.$t("Global.edit_mark") + ' ' +  this.item.name_local;

       }

      } 
      else {
        return this.$t("Global.add_mark");
      } */
       return this.id ? `${this.$t('Global.edit_mark')}` : this.$t('Global.add_mark')
    },
  },
  watch: {},
  data() {
    return {
      form: {
        flag_id:[],
      },
      types:[{id: 0, name: "Work"}, {id: 1, name: "Exam"}],
      lookups: [],
      lookupModules: {
        /* bylaws: true,
        terms: true,
        faculties: true,
        programs: true,
        programs_details: true, */
        mark_categories: true,
        mark_flages: true,
      },
      form_submit: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: "marks/get",
      getLookups: "app/GET_LOOKUPS",
      submitItem: "marks/put",
      getMarks: "marks/marks",
      getMarkCategories: 'markCategories/markCategories',
    }),
    init() {
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
      if (this.id) {
        this.getItem(this.id).then((_) => {
         let query = {
          flag_id: [],
         }
          if(this.item) {
          //this.form = this.item;
          query.code= this.item.code
          query.name= this.item.name
          query.name_local= this.item.name_local
          query.short_name = this.item.short_name
          query.mark_category_id = this.item.markCategory.id
          query.type_id = this.item.type.name
          if(this.item.flage)
          {
           
           for (const [key, value] of Object.entries(this.item.flage)) 
           {

                 query.flag_id.push(value)
            }
           
          }
          this.form = query
          }
         
         // this.form.flag_id = this.item.flage
        });
      } 
      

        this.form = {};
      
    },
    submit() {
      // this.form_submit.term_id = this.form.term.id

      const query = {
       //teaching_assistants: this.form.teachingAssistant.map(el => el.id),
        flage: this.form.flag_id,
        name : this.form.name,
        name_local : this.form.name_local,
        code : this.form.code,
        short_name: this.form.short_name,
        mark_category_id: this.form.mark_category_id,
        type :this.form.type_id,
      }
      const payload = { id: this.id, query: query };
      this.submitItem(payload).then((response) => {
        if (response.status === "success" && this.id) {
          this.$swal({
            icon: "success",
            title: "Mark Edited!",
            text: "Mark Successfully.",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push({ name: "marks" });
        } else if (response.status === "success" && this.id == null) {
          this.$swal({
            icon: "success",
            title: "Mark Added!",
            text: "Mark Successfully.",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push({ name: "marks" });
        }
      });
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    cancel() {
      if (this.inline) {
        return this.$emit("hide");
      }
      this.$router.push({ name: "marks" });
    },
  },
};
</script>

<style scoped></style>
