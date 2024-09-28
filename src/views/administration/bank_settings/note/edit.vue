<template>
    <div class="new_edit" v-if="data">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent :data="data" :only="['name','name_local']" :loading="load">
            <template #edit>
              <div class="mb-2">
                <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_note_bank')" />
              </div>
            </template>
  
            <template #name="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.note`) }}
              </th>
              <td >
                <b-form-group class="left_right" label-for="name-input">
                  <validation-provider #default="{ errors }" name="name" rules="required">
                    <b-form-textarea
                      style="height: 200px;"
                      id="name-input"
                      :placeholder="$t('Global.note')"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #name_local="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.note`) }}
              </th>
              <td >
                <b-form-group class="right_left" label-for="name-input">
                  <validation-provider #default="{ errors }" name="name" rules="required">
                    <b-form-textarea
                      style="height: 200px;"
                      id="name-input"
                      :placeholder="$t('Global.note')"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
          </ShowComponent>
  
          <b-row>
            <!-- submit and reset -->
            <b-col md="12" :class="load ? 'disabled_all' : ''">
              <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'"  type="submit" variant="primary" class="mr-1">
                {{ $t('Global.save') }}
              </b-button>
              <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="cancel">
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import { BCard, BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton,BFormTextarea } from 'bootstrap-vue';
  import vSelect from 'vue-select';
  import Ripple from 'vue-ripple-directive';
  import ValidationErrors from '@/views/components/common/ValidationErrors';
  import ToastificationContent from '@core/components/toastification/ToastificationContent';
  import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
  import { required, email } from '@validations';
  import EditComponent from '@/views/components/table/Edit';
  import ShowComponent from '@/views/components/info/show';
  
  export default {
    title: 'Edit',
    components: {
      BFormTextarea,
      EditComponent,
      BCard,
      BCol,
      ShowComponent,
      BRow,
      BFormGroup,
      BFormInput,
      BFormCheckbox,
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
    props: {
      inline: { default: false, Type: Boolean },
      data: { default: {}, type: [Array, Object] },
    },
    computed: {
      ...mapGetters({
        item: 'faculties/item',
        load: 'app/load',
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
      types() {
        return [
          { type: 1, label: this.$t('Global.Scientific') },
          { type: 2, label: this.$t('Global.Literary') },
        ];
      },
      title() {
        // return this.id ? this.$t('Global.edit_section') +' '+ item.section : this.$t('Global.add_section')
        return this.id ? this.$t('Global.faculty_edit') : this.$t('Global.faculty_add');
      },
    },
    data() {
      return {
        checked:false,
        nameState: null,
        nameLocalState: null,
        codeState: null,
        errorsdata: {},
        form: {},
        message: null,
      };
    },
    mounted() {
      this.init();
    },
    watch:{
      data: function(newVal , oldVal){
        this.form = newVal
      }
    },
    methods: {
      ...mapActions({
        getItem: 'faculties/get',
      }),
      init() {
        console.log(this.data.name);
        if (this.data) {
          this.form.name = this.data.value;
        }
      },
      checkIfArabic(type) {
        const arabic = /[\u0600-\u06FF]/;
        if (type == 'en') {
          if (arabic.test(this.form.name)) {
            this.form.name = '';
          } else {
            return this.form.name;
          }
        } else if (type == 'ar') {
          if (!arabic.test(this.form.name_local)) {
            this.form.name_local = '';
          } else {
            return this.form.name_local;
          }
        }
      },
      save() {
        this.$refs.simpleRules.validate().then(success => {
          if (success) {
            this.form.emtyaz = this.checked ? 1 : 0 ;
            const payload = {value: this.form.name };
            this.$store
              .dispatch('bankInfos/putNotes', payload)
              .then(response => {
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 3, inline: false });
                this.$emit('refresh');
                // if (!this.$route.params.id) {
                //   this.$router
                //     .push({ name: 'faculty', params: { id: response.data.id } })
                //     .then(_ => {})
                //     .catch(() => {});
                // }
              })
              .catch(error => {
                // this.$swal({
                //   icon: 'error',
                //   text: `${error || this.$t('Global.errorMessage')}`,
                //   showConfirmButton: false,
                //   timer: 1500,
                // })
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  const error_data = Object.values(error)[index][0];
                  this.errorsdata = error;
                });
              });
          }
        });
      },
  
      cancel() {
        // if (!this.$route.params.id) {
        //   this.$router.go(-1);
        // }
        // if (this.inline) {
          return this.$emit('hide');
        // }
      },
    },
  };
  </script>
  
  <style lang="scss"></style>
  