<template>
  <div>
    <DataTable
        :paramsLoaded="paramsLoaded"
        :total="total"
        :allow-search="true"
        :filter="filter"
        :loading="load"
        @Refresh="refresh"
        :params-loaded="paramsLoaded"
        @reset="reset"
    >
      <template #filter v-if="lookups">
        <b-col cols="12" md="4">
          <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.type_of_source"
                    :options="lookups.types" class="w-100" :reduce="val => val.id" :placeholder="$t('Type of source')">
            <template slot="selected-option" slot-scope="option">
            <span class="text-capitalize">
            {{ $t(`${option.name}`) }}
            </span>
            </template>
            <template v-slot:option="option">
            <span class="text-capitalize">
            {{ $t(`${option.name}`) }}
            </span>
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.research_language"
                    :options="lookups.languages" class="w-100" :reduce="val => val.id" :placeholder="$t('Language')">
            <template slot="selected-option" slot-scope="option">
            <span>
            {{ $t(`${option.name}`) }}
            </span>
            </template>
            <template v-slot:option="option">
              {{ $t(`${option.name}`) }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #action>
        <template v-if="authUser().type.type == 1">
          <b-button
              v-b-tooltip.hover="$t('Global.sync')"
              class="btn-icon"
              variant="primary"
              @click="syncClicked()"
          >
            <feather-icon icon="DownloadCloudIcon"/>
          </b-button>
          &nbsp;
        </template>
        <b-button
            v-if="hasPermission('add_publication') || authUser().type.type == 1"
            v-b-tooltip.hover="$t('Global.add')"
            class="btn-icon"
            variant="primary"
            @click="goToEdit(null)"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </template>
      <template #customTable>
        <b-table
            class="position-relative"
            striped
            :items="items"
            responsive
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="$t('Global.empty_text')"
        >
          <template #cell(type_of_source)="data">
            {{ $t(`${lookups.types[data.item.type_of_source].name}`) }}
          </template>
          <template #cell(title)="data">
            {{ data.item.title }}
          </template>

          <template #cell(journal_name)="data">
            {{ data.item.journal_name }}
          </template>

          <template #cell(members)="data">
          <span>
              {{ $t('Authors') }}:
            </span>
            <template v-for="(author, i) in data.item.authors">
            <span :key="author.user.id" v-if="author.user">
              {{ (i > 0 ? (", " + getTranslatedName(author.user)) : getTranslatedName(author.user)) }}
            </span>
              <span :key="i" v-else-if="author.name">
              {{ (i > 0 ? (", " + author.name) : author.name) }}
            </span>
            </template>
          </template>

          <template #cell(year)="data">
            {{ data.item.year }}
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
                  v-b-tooltip.hover="$t('Global.view')"
                  icon="EyeIcon"
                  style="cursor: pointer"
                  @click="goToShow(data.item.id)"
                  class="text-primary"
              />
              <feather-icon
                  v-if="hasPermission('edit_publication') || data.item.canEdit"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  style="cursor: pointer"
                  @click="goToEdit(data.item.id)"
                  class="text-primary"
              />
              <feather-icon
                  v-if="data.item.canDelete"
                  v-b-tooltip.hover="$t('Global.delete')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="deletePublication(data.item.id)"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal no-close-on-backdrop ref="my-modal" v-model="confirmOrcidNumber" hide-footer
             :title="$t('Confirm ORCID number')">
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form @submit.stop.prevent="syncPublications">
            <b-col cols="12" md="12">
              <b-form-group label="ORCID" label-for="name-input">
                <validation-provider
                    #default="{ errors }"
                    name="orcid"
                    rules="required"
                >
                  <b-form-input
                      dir="ltr"
                      v-model="orcid_number"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <div class="mt-2" :class="load ? 'disabled_all' : ''">
              <b-col cols="12" md="12">
                <div class="d-flex justify-content-end">
                  <b-button type="submit" variant="primary" class="mr-1">
                    {{ $t('Global.save_and_sync') }}
                  </b-button>
                  <b-button type="reset" variant="outline-primary" @click="confirmOrcidNumber = false">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </div>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import {
  VBModal,
  BTable,
  BBadge,
  BCol,
  BLink,
  BModal,
  BFormInput,
  BForm,
  BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'
import {mapActions, mapGetters} from 'vuex'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {required} from '@validations';

import PublicationApi from '@/api/research/publications/publications'

const publicationApi = new PublicationApi()

export default {
  name: 'MyPublications',
  components: {
    DataTable,
    BTable,
    vSelect,
    BBadge,
    BCol,
    BLink,
    BModal,
    BFormInput,
    BForm,
    BFormGroup,
    VBModal,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      filter: {
        type_of_source: null,
        research_language: null
      },
      paramsLoaded: true,
      from: '',
      confirmOrcidNumber: false,
      orcid_number: '',
    }
  },
  computed: {
    ...mapGetters({
      items: 'publications/items',
      total: 'publications/total',
      load: 'publications/load',
      lookups: 'publications/lookups',
      needDrop:'app/needDrop',
    }),
    fields() {
      return [
        {
          key: 'type_of_source',
          label: this.$t('Type of source'),
        },
        {
          key: 'title',
          label: this.$t('Title'),
        },
        {
          key: 'journal_name',
          label: this.$t('Source name'),
        },
        {
          key: 'members',
          label: this.$t('Authors'),
        },
        {
          key: 'year',
          label: this.$t('Year'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
  },
  beforeMount() {
    this.from = this.$route.params.from;
  },
  methods: {
    ...mapActions({
      getLookup: 'app/GET_LOOKUPS',
    }),
    refresh(query) {
      let user_id = this.$route.query.id ? this.$route.query.id : this.authUser().id;
      query = {...query, user_id: user_id};

      this.$store.dispatch('publications/publications', {query}).then(_ => {
        this.paramsLoaded = false
      });
    },
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    deletePublication(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
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
          this.popoverShow = false;
          publicationApi.remove(id).then(response => {
            this.refresh();
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Deleted'),
              showConfirmButton: false,
              timer: 1500,
            })
          });
        }
      });
    },
    goToEdit(id) {
      if (id)
        this.$router.push({name: 'edit_publication', params: {id: id}, query: {inline: true}});
      else
        this.$router.push({name: 'add_publication', params: {id: id}});
    },
    goToShow(id) {
      this.$router.push({name: 'show_publication', params: {id: id}})
    },
    syncClicked() {
      this.orcid_number = this.lookups.orcid;
      this.confirmOrcidNumber = true;
    },
    syncPublications() {
      this.$refs.simpleForm.validate().then(success => {
        if (success) {
          // to send form data with files
          const formData = new FormData()
          formData.append('orcid', this.orcid_number)

          this.$store.dispatch('publications/syncPublications', formData).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })

            this.refresh();
            this.confirmOrcidNumber = false;
          }).catch(error => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
          })
        }
      })
    }
  },

}
</script>
