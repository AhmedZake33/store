<template>
  <div>
    <b-card class="mb-0">
      <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left" v-model="inputTab"
              @input="saveStatus">
        <template v-for="(item, index) in items">
          <b-tab>
            <template #title>
              <feather-icon :icon="item.title.icon"/>
              <span>{{ getTranslatedName(item.title) }}</span></template
            >
            <b-row>
              <b-col cols="12">
                <b-table
                    :busy="load"
                    @sort-changed="sortingChanged"
                    no-local-sorting
                    class="position-relative"
                    :items="item.data"
                    responsive
                    striped
                    :fields="fields"
                    primary-key="id"
                    show-empty
                    :per-page="perPage"
                    :current-page="currentPage"
                    :empty-text="$t('Global.empty_text')"
                >
                  <template #table-busy>
                    <div class="text-center text-black my-2">
                      <b-spinner class="align-middle"/>
                    </div>
                  </template>
                  <template #cell(name)="data">
                    {{ friendlyName(data.item.name) }}
                  </template>
                  <template #cell(value)="data">
                    <div v-if="data.item && data.item.value && data.item.value.includes('http')">
                      <a target="_blank" :href="data.item.value"> {{ data.item.value }}</a>
                    </div>
                    <div v-else-if="data.item && data.item.form_type == 4">
                      {{ getOptionName(data.item) }}
                    </div>
                    <div v-else>
                      {{ data.item.value }}
                    </div>
                  </template>

                  <template #cell(actions)="data">
                    <div>
                      <feather-icon
                          v-if="hasPermission('edit_university')"
                          v-b-tooltip.hover="$t('Global.edit')"
                          style="cursor: pointer"
                          icon="EditIcon"
                          class="font-medium-3"
                          @click="openEdit(data.item)"
                      />

                    </div>
                  </template>
                </b-table>
              </b-col>

              <b-col cols="12">
                <div class="mx-2 mb-2">
                  <b-row>
                    <b-col cols="12" sm="6"
                           class="d-flex align-items-center justify-content-center justify-content-sm-start">
                      <!-- <div class="mx-1">
                                          <label>{{ $t('Global.show') }}</label>
                                          <v-select v-model="perPage"
                                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                                    :options="pageOptions" :clearable="false"
                                                    class="per-page-selector d-inline-block mx-50"/>
                                      </div> -->
                      <div class="mx-1">
                        <label>{{ $t('Global.Showing') }}</label>
                        <v-select :searchable="false" v-model="perPage"
                                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="pageOptions"
                                  :clearable="false" class="per-page-selector d-inline-block mx-50 pointer"/>
                        <label>{{ $t('Global.entries') }} </label>
                        <label class="mx-05"
                        >{{ $t('Global.from') }} {{ meta.from + 1 }}
                          {{ $t('Global.to') }}
                          {{
                            perPage >= meta.of ? meta.of.toString().replace(/^0+/, '') : meta.to.toString().replace(/^0+/, '')
                          }}
                          {{ $t('Global.of') }} {{ meta.of }}
                        </label>
                      </div>
                      <div></div>
                    </b-col>
                    <!-- Pagination -->
                    <b-col cols="12" sm="6"
                           class="d-flex align-items-center justify-content-center justify-content-sm-end">
                      <b-pagination v-if="items" :total-rows="items.length" v-model="currentPage" :per-page="perPage"
                                    first-number last-number class="mb-0 mt-1 mt-sm-0" prev-class="prev-item"
                                    next-class="next-item">
                        <template #prev-text>
                          <feather-icon icon="ChevronLeftIcon" size="18"/>
                        </template>
                        <template #next-text>
                          <feather-icon icon="ChevronRightIcon" size="18"/>
                        </template>
                      </b-pagination>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
          </b-tab>
        </template>
      </b-tabs>
    </b-card>


    <b-modal id="modal_requirement" v-model="Editmodal" no-close-on-backdrop size="lg" :title="$t('Global.edit')">
      <validation-observer ref="simpleForm">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group v-if="form">
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-group>
                    <validation-provider #default="{ errors }" name="name" rules="required">
                      <b-form-input disabled :placeholder="$t('Global.name')" id="name" v-model="form.name"
                                    :state="errors.length > 0 ? false : null"/>
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group 
                    v-if="form.form_type != 1 && form.form_type != 3 && form.form_type != 4"
                  >
                    <validation-provider #default="{ errors }" name="value" rules="required">
                      <b-form-input 
                        :placeholder="$t('Global.name')" 
                        id="value" 
                        v-model="form.value"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group v-if="form.form_type == 3">
                    <validation-provider #default="{ errors }" name="value_local" rules="required">
                      <b-form-checkbox v-model="form.value" id="value_local" switch/>
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group v-if="form.form_type == 2">
                    <validation-provider #default="{ errors }" name="value_local" rules="required">
                      <b-form-input :placeholder="$t('Global.name_local')" id="value_local" v-model="form.value_local"
                                    :state="errors.length > 0 ? false : null"/>
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group v-if="form.form_type == 1">
                    <validation-provider #default="{ errors }" name="file">
                      <b-form-file
                          ref="fileInput"
                          v-model="form.file"
                          :placeholder="$t('Global.upload_file')"
                      ></b-form-file>
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>

                  <b-form-group v-if="form.form_type == 4 && options.length">
                    <validation-provider #default="{ errors }" name="select">
                      <v-select
                          v-model="form.value"
                          :clearable="false"
                          :options="options"
                          :reduce="(val) => val.id"
                          label="name"
                      >
                        <template slot="no-options">
                          {{ $t('type_to_search') }}
                        </template>
                        <template
                            slot="selected-option"
                            slot-scope="option"
                        >
                          <div class="d-center">
                            {{ option.name + ' (' + option.hint + ')' }}
                          </div>
                        </template>
                        <template slot="option" slot-scope="option">
                          <div class="d-center">
                            {{ option.name + ' (' + option.hint + ')' }}
                          </div>
                        </template>
                      </v-select>
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>
                </validation-provider>
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1"
                      @click="updateData(form.id)">
              {{ $t('Global.save') }}
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary"
                      @click="cancel()">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>

</template>

<script>

import {mapGetters, mapActions} from 'vuex'
import Edit from '@/views/administration/management/ticket_groups/components/edit'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import {required, email, regex} from '@validations';


import {
  VBModal,
  BTab,
  BTabs,
  BLink,
  BCard,
  BModal,
  BDropdown,
  BDropdownItem,
  BAvatar,
  BTable,
  BTh,
  BTr,
  BButton,
  BCol,
  BForm,
  BFormFile,
  BBadge,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BRow,
  BFormTextarea,
  BPagination,
} from 'bootstrap-vue';

export default {
  components: {
    BPagination,
    ValidationProvider,
    ValidationObserver,
    DataTable,
    BTab,
    BTabs,
    BLink,
    BCard,
    BModal,
    BDropdown,
    BDropdownItem,
    BAvatar,
    BTable,
    BTh,
    BTr,
    BButton,
    BCol,
    BForm,
    BFormFile,
    BBadge,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BRow,
    BFormTextarea,
    vSelect
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      edit: false,
      link: '',
      editItem: null,
      filter: {faculty_id: null, bylaw_id: null, program_id: null},
      paramsLoaded: true,
      Editmodal: false,
      item: null,
      form: {
        name: null,
        value: null,
        value_local: null,
        file: null,
        flag: null,
      },
      inputTab: 0,
      perPage: 10,
      pageOptions: [10, 20, 25, 50, 100],
      totalRows: 1,
      currentPage: 1,
      options: [],
    }
  },
  beforeMount() {
    if (this.$route.query) {
      this.inputTab = Number(this.$route.query.tabNum);
      if (this.$route.query.tabNum) {
        this.setSelectedTab({name: "", id: Number(this.$route.query.tabNum)});
      }
    }
  },
  computed: {
    ...mapGetters({
      items: 'app/groupedUniversityData',
      load: 'app/load',
      needDrop: 'app/needDrop',
    }),
    meta() {
      return {
        from: this.perPage * (this.currentPage - 1),
        to: this.perPage * (this.currentPage - 1) + this.perPage,
        of: this.items ? this.items.length : '',
      };
    },
    fields() {
      return [
        {
          label: this.$t('name'),
          key: 'name',
          sortable: false,
        },
        {
          label: this.$t('value'),
          key: 'value',
          sortable: false,
        },

        {
          label: this.$t('actions'),
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    saveStatus(index) {
      this.updateFilterQueryParams({
        tabNum: index,
        ...this.getTabFilterData(index),
      });
      // this.setSelectedTab({ name: "", id: this.inputTab });

    },
    updateData(id) {
      this.$refs.simpleForm.validate().then(success => {
        // if(success){
        const formData = new FormData();
        if (this.$refs.fileInput) {
          let fileToUpload = this.$refs.fileInput.files[0];
          formData.append('file', fileToUpload);
        }
        formData.append('value', this.form.value);
        formData.append('value_local', this.form.value_local);
        let payload = null;
        payload = {id: id, query: formData};
        this.$store.dispatch('app/UPDATE_UNIVERSITY_DATA', payload).then((res) => {
          this.Editmodal = false;
          this.refresh();
          this.paramsLoaded = false;
        })
        // }

      });
    },
    ...mapActions({
      getItem: 'ticketGroups/list',
      removeItem: 'ticketGroups/remove',
    }),
    openEdit(item) {
      this.options = item.options;
      this.form.name = item.name
      this.form.form_type = +item.form_type
      this.form.value = item.value
      this.form.id = +item.id
      this.$nextTick(() => {
        this.Editmodal = true;
      })

    },
    cancel() {
      this.form = {
        name: null,
        value: null,
        value_local: null,
        file: null,
        flag: null,
      };
      this.options = [];
      this.Editmodal = false;
    },
    refresh() {
      this.$store.dispatch('app/GET_GROUPED_UNIVERSITY_DATA').then((res) => {
        this.paramsLoaded = false;
      })
    },
    remove(item) {
      this.deleteConfirmPopup(() => {
        this.removeItem(item.id).then(response => {
          this.refresh()
          this.successDeleteAlert()
        }).catch(error => {
          this.errorDeleteAlert(10000, this.$t(error.errors[0]["title"]))
        })
      })
    },
    friendlyName(name) {
      if (!name)
        return name;
      name = name.toString().replaceAll('_', ' ');
      const words = name.split(" ");

      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      name = words.join(" ");
      return name;
    },
    getOptionName(item) {
      let selectedOption = item.options.filter((option) => {
        return option.id == item.value;
      });

      return selectedOption.length ? selectedOption[0].name : '';
    }
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
