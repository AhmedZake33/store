<template>
  <b-row>
    <b-col cols="12" xl="12" lg="12" md="12">
      <b-card>
        <b-overlay :show="show" rounded="sm" no-fade>
          <Edit
              v-if="(edit && (((authUser().type.type == 1 || hasPermission('edit_publication')) && $route.name == 'add_publication') || ($route.name == 'edit_publication' && publication && publication.canEdit)) || ($route.name == 'show_publication' && publication && edit  && publication.canEdit))"
              :languages="languages" :types="types" :data="publication" @hide="cancel" :tabIndex="tabIndex"/>
          <div v-else-if="!edit && $route.name != 'add_publication'">
            <b-tabs v-if="publication" @input="saveStatus" v-model="tabIndex" vertical nav-wrapper-class="nav-hidden" align="left" lazy>
              <div class="custom_drop mb-2" v-if="$store.getters['app/width'] < 982 && $store.getters['app/width'] != 0">
                <b-dropdown block :text="$store.getters['app/updateSelectedTab'] ? $store.getters['app/updateSelectedTab'].name:''" variant="primary">
                  <b-dropdown-item :key="tab.id" @click="setSelectedTab(tab);tabIndex=tab.id" v-for="tab in $store.getters['app/dropArray']">
                    {{ tab.name }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <b-tab @click="setTabIndex(0)">
                <template #title>
                  <feather-icon icon="BookOpenIcon"/>
                  <span>{{ $t('Publication Information') }}</span>
                </template>
                <ShowComponent :data="publication" :loading="load"
                               :only="['title', 'journal_name', 'language', 'type_of_source', 'year', 'info', 'eid', 'doi']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon @click="openEdit()" style="cursor: pointer"
                                    icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
                    </div>
                  </template>
                  <template #title="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Title`) }}
                    </th>
                    <td>
                      {{ data.title }}
                    </td>
                  </template>

                  <template #journal_name="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Source name`) }}
                    </th>
                    <td>
                      {{ data.journal_name }}
                    </td>
                  </template>
                  <template #language="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Language`) }}
                    </th>
                    <td v-if="languages.length">
                      {{ $t(languages[data.language - 1].name) }}
                    </td>
                    <td v-else>
                      -
                    </td>
                  </template>
                  <template #type_of_source="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Type of source`) }}
                    </th>
                    <td v-if="types.length">
                      {{ $t(types[data.type_of_source - 1].name) }}
                    </td>
                    <td v-else>
                      -
                    </td>
                  </template>
                  <template #year="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Year`) }}
                    </th>
                    <td>
                      {{ data.year }}
                    </td>
                  </template>
                  <template #info="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Info`) }}
                    </th>
                    <td>
                      {{ data.info }}
                    </td>
                  </template>
                  <template #eid="{ data }">
                    <th scope="row" :width="'20%'">
                      EID
                    </th>
                    <td>
                      {{ data.eid }}
                    </td>
                  </template>
                  <template #doi="{ data }">
                    <th scope="row" :width="'20%'">
                      DOI
                    </th>
                    <td>
                      {{ data.doi }}
                    </td>
                  </template>
                </ShowComponent>
              </b-tab>
              <b-tab v-if="publication && publication.id" @click="setTabIndex(1)">
                <template #title>
                  <feather-icon icon="UsersIcon"/>
                  <span>{{ $t('Authors') }}</span>
                </template>
                <div class="text-center text-black my-2" v-if="load">
                  <b-spinner class="align-middle"></b-spinner>
                </div>
                <div v-else>
                  <Members/>
                </div>
              </b-tab>
              <b-tab v-if="publication && publication.id" @click="setTabIndex(2)">
                <template #title>
                  <feather-icon icon="FileIcon"/>
                  <span>{{ $t('Attachment File') }}</span>
                </template>
                <ShowComponent :data="publication" :loading="load" :only="['file']">
                  <template #file="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`File`) }}
                    </th>
                    <td>
                      <table class="mt-2 mt-xl-0" style="width: 100%;">
                        <tr>
                          <th style="padding: 0px;border: 0;width: 85%" v-if="publication.file">
                            <a :href="publication.file.url" target="_blank">{{ "Publication File." + publication.file.extension }}</a>
                          </th>
                          <th style="padding: 0px;border: 0;width: 85%" v-else>
                            <span>{{ $t('No Attachment') }}</span>
                          </th>
                          <td style="padding: 0px;border: 0;width: 15%">
                            <feather-icon
                                v-b-tooltip.hover="$t('Global.upload_attachment')"
                                icon="UploadCloudIcon"
                                style="cursor: pointer"
                                @click="$refs.refInputEl.click()"
                                class="text-primary"
                            />
                            <feather-icon
                                v-b-tooltip.hover="$t('Global.delete')"
                                icon="Trash2Icon"
                                style="cursor: pointer"
                                class="text-danger"
                                @click="deleteFile(publication.file.id)"
                            />
                          </td>
                        </tr>
                      </table>
                      <input ref="refInputEl" type="file" @change="updateFile" class="d-none"/>
                    </td>
                  </template>
                </ShowComponent>
              </b-tab>
            </b-tabs>
          </div>
        </b-overlay>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {BTab, BTabs, BCard, BCol, BRow, BOverlay, BSpinner, BDropdown, BDropdownItem, BFormGroup} from 'bootstrap-vue';
import ShowComponent from '@/views/components/info/show';
import Edit from '@/views/research/publications/edit';
import Members from '@/views/research/publications/components/members';

import ArchiveApi from "@/api/administration/archive/archive";
const archiveApi = new ArchiveApi()

export default {
  name: 'Show',
  components: {
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    ShowComponent,
    BDropdownItem,
    BDropdown,
    Edit,
    BOverlay,
    Members,
    BSpinner,
  },
  data() {
    return {
      tabIndex: 0,
      show: true,
      edit: false,
      languages: [],
      types: [],
      query: {
        research_types: true,
        research_languages: true,
      },
    };
  },
  props: {
    publication_id: null,
  },
  computed: {
    ...mapGetters({
      publication: 'publications/item',
      load: 'publications/load',
    }),
    localLang() {
      return this.$i18n.locale;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : this.publication_id;
    },
  },
  beforeMount() {
    if (+this.$route.query.tabNum > 0) {
      this.tabIndex = +this.$route.query.tabNum
    }

    if (this.$route.query.editing == true || this.$route.query.editing == "true")
      this.edit = true;
    else
      this.edit = false;
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
    }),
    init(id) {
      if (this.id || id) {
        this.$store.dispatch('publications/get', this.id || id).then((_) => {
          if (this.$route.name == 'add_publication' || this.$route.name == 'edit_publication') {
            this.edit = true;
          }
          this.$nextTick((_) => {
            this.setPageTabs()
          });
        })
      } else {
        this.edit = true;
      }

      this.lookups(this.query).then(res => {
        this.types = res.success.research_types;
        this.languages = res.success.research_languages;
        this.show = false;
      })
    },
    setTabIndex(tabIndex) {
      this.tabIndex = tabIndex;
    },
    saveStatus(index) {
      this.updateFilterQueryParams({tabNum: index});
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({ tabNum: this.tabIndex, editing: false });
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({ tabNum: this.tabIndex, editing: true });
    },
    deleteFile(id) {
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
          archiveApi.remove(id).then(response => {
            this.init();
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Deleted'),
              showConfirmButton: false,
              timer: 1500,
            })
            this.publication.file = null;
          });
        }
      });
    },
    updateFile(e) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const that = this;
      reader.onload = e => {
        that.uploadFile(file);
      };
    },
    uploadFile(file) {
      let data = new FormData();
      data.append('file', file);
      this.loading = true;

      let payload = {
        id: this.publication.id,
        data: data,
      };
      this.$store.dispatch('publications/putFile', payload).then(() => {
        this.$store.dispatch('publications/get', this.id).then((_) => {
          this.init();
          this.loading = false;
        });
      });
    },
  },
};
</script>
