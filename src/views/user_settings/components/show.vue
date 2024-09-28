<template>
  <b-row>
    <b-col cols="12" xl="12" lg="12" md="12">
      <b-card v-if="id">
        <b-row v-if="item">
          <b-col cols="21" xl="6" class="d-flex justify-content-between flex-column">
            <div class="d-flex justify-content-start position-relative">
              <b-overlay :show="loading" rounded="sm">
                <b-avatar style="width: 150px; height: 150px" :src="user_photo(item.id || null)" size="104px" rounded />
                <div class="position-absolute top_left" v-if="getPermissions('edit')">
                  <input ref="refInputEl" type="file" @change="changePhoto" class="d-none" />
                  <b-button v-b-tooltip.hover="$t('Global.uploadPhoto')" variant="primary" class="btn-icon rounded-circle" @click="$refs.refInputEl.click()">
                    <feather-icon icon="UploadCloudIcon" />
                  </b-button>
                </div>
              </b-overlay>
              <div style="margin-top: 30px" class="d-flex flex-column ml-1">
                <div v-if="item.name" class="mb-1">
                  <h4  class="mb-0 d-inline-block" style="font-weight: bold">
                    {{ $i18n.locale == 'ar' ? item.name_local : item.name }}
                  </h4>
                  <template v-if="item.type && item.type!=3">
                    <b-link class="font-weight-bolder custom_link" v-if="item.type.type == 1 || item.type.type == 2" :to="item.type.type == 1 ? { name: 'staff-show', params: { id: this.$route.params.id } } : { name: 'employee-show', params: { id: this.$route.params.id } }">
                      ({{ $i18n.locale == 'ar' ? item.type.name_local : item.type.name }})
                    </b-link>
                  </template>
                  <span class="card-text d-block">{{ item.email }}</span>
                </div>
                <div class="d-flex flex-wrap">
                  <!-- <b-button v-if="type == 1 && hasPermission('edit_instructor')" v-b-tooltip.hover
                                              class="mb-2" :title="$t('Global.edit')" style="width: 100px"
                                              :to="{ name: 'staff-edit', params: { id: item.id } }"
                                              variant="primary">
                                        {{ $t('Global.edit') }}
                                    </b-button> -->
                  <!-- <b-button v-else-if="type == 2 && hasPermission('edit_employee')" v-b-tooltip.hover
                                              class="mb-2"  :title="$t('Global.edit')"
                                              style="width: 100px"
                                              :to="{ name: 'employee-edit', params: { id: item.id } }"
                                              variant="primary">
                                        {{ $t('Global.edit') }}
                                    </b-button>
                                    <b-button v-else-if="hasPermission('edit_users')" v-b-tooltip.hover class="mb-2"
                                               :title="$t('Global.edit')" style="width: 100px"
                                              :to="{ name: 'user-edit', params: { id: item.id } }" variant="primary">
                                        {{ $t('Global.edit') }}
                                    </b-button> -->

                  <!--                                    <b-button variant="light" class="ml-1" :to="{ name: 'role-view', params: { id: id } }">-->

                  <!--                                        <feather-icon icon="LockIcon" color="red" size="14"-->
                  <!--                                                      class="align-middle text-body"/>-->
                  <!--                                    </b-button>-->
                  <b-button class="mb-2" v-if="hasPermission('admin_roles')" @click="open_role(item.id)"  style="width: 100px">
                    {{ $t('Global.roles') }}
                  </b-button>

                  <div class="mx-1" v-if="item.removed != 2 && getPermissions('delete')">
                    <b-button v-if="item.removed == 0" @click="remove($route.params.id)" id="show-btn"  style="width: 100px"  variant="outline-danger"> {{ $t('Global.delete') }} </b-button>
                    <b-button v-else @click="restore($route.params.id)" style="width: 100px"  variant="outline-danger"> {{ $t('Global.restore') }} </b-button>
                  </div>
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" xl="6">
            <table class="mt-2 mt-xl-0" style="width: 100%">
              <tr>
                <th class="pb-50 ">
                  <feather-icon icon="UserIcon" class="mr-75" />
                  <span class="label">{{ $t('Global.name') }}</span>
                </th>
                <td class="pb-50">
                  <span> {{ $i18n.locale == 'ar' ? item.name_local : item.name }}</span>
                </td>
              </tr>
              <tr>
                <th class="pb-50 ">
                  <feather-icon icon="AirplayIcon" class="mr-75" />
                  <span class="label">{{ $t('Global.type') }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="$i18n.locale == 'ar'">{{ item.type ? item.type.name_local : '-' }}</span>
                  <span v-if="$i18n.locale == 'en'">{{ item.type ? item.type.name : '-' }}</span>
                </td>
              </tr>
              <tr>
                <th class="pb-50 ">
                  <feather-icon icon="CodeIcon" class="mr-75" />
                  <span class="label">{{ $t('Global.code') }}</span>
                </th>
                <td class="pb-50">
                  <span>{{ item.code }}</span>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon icon="CheckIcon" class="mr-75" />
                  <span class="lable">{{ $t('Global.status') }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="item.removed == 0">{{ $t('Global.active') }}</span>
                  <span v-if="item.removed == 1">{{ $t('Global.in_active') }}</span>
                </td>
              </tr>
              <tr v-if="item.address">
                <th class="pb-50">
                  <feather-icon icon="MapPinIcon" class="mr-75" />
                  <span class="label">{{ $t('Global.address') }}</span>
                </th>
                <td class="pb-50">
                  {{ item.address || '-' }}
                </td>
              </tr>
              <th v-if="item.mobile">
                <feather-icon icon="PhoneIcon" class="mr-75" />
                <span class="label">{{ $t('Global.contact') }}</span>
              </th>
              <td>
                {{ item.mobile }}
              </td>
            </table>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12" xl="12" lg="12" md="12">
      <b-card>
        <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left" lazy>
          <slot name="add_tab"></slot>
        </b-tabs>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { BTabs, BLink, BTab, BCardText, BCard, BCol, BRow, BAvatar, BOverlay } from 'bootstrap-vue';
import { mapGetters } from 'vuex';
import List from '@/views/components/info/list';

export default {
  components: {
    List,
    BCardText,
    BTabs,
    BLink,
    BTab,
    BCard,
    BAvatar,
    BCol,
    BRow,
    BOverlay,
  },
  props: {
    item: Object,
    load: false,
    type: 0,
  },

  data() {
    return {
      file: null,
      loading: false,
      tabIndex: 0,
    };
  },

  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
    }
  },
  methods: {
    getPermissions(action){
      if(this.type == 1){
        return this.hasPermission(`${action}_instructor`)
      }else if(this.type == 2){
        return this.hasPermission(`${action}_employee`)
      }else{
        return this.hasPermission(`${action}_users`)
      }
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
    },
    restore(userId) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.active_message')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.Activate')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.$store.dispatch('users/restore', userId).then(_ => {
            this.$emit('refresh');
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    },
    remove(userId) {
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
          this.$store.dispatch('users/remove', userId).then(_ => {
            this.$emit('refresh');
            this.$swal({
              icon: 'success',
              title: this.$t('Global.deleted'),
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    },
    open_role(id) {
      // if(this.item.user_access){
      this.$router.push({ name: 'user-access', params: { id: id } });
      //window.open(this.$router.resolve({name: 'user-access', params: {id: id}}).href, '_blank');

      // }
      // window.open(this.$router.resolve({ name: 'user-role', params: { id: id } }).href, '_blank');
    },
    changePhoto(e) {
      this.file = e.target.files[0];
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      const that = this;
      reader.onload = e => {
        that.uploadPhoto();
      };
    },
    uploadPhoto() {
      let data = new FormData();
      data.append('file', this.file);
      data.append('short_name', 'PERSONAL_PHOTO');
      let payload = {
        id: this.item ? this.item.archive_id : null,
        photo_archive_id: this.item && this.item.photo_archive_id ? this.item.photo_archive_id : null,
        query: data,
      };
      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(this.file.name)) {
        this.errorToast(this.$t('Global.extension_error'));
      } else {
        this.loading = true;
        this.$store.dispatch('users/uploadPhoto', payload).then(_ => {
          this.$store.dispatch('users/get', this.id);
          this.loading = false;
          window.location.reload();
        });
      }
    },

  },
};
</script>

<style lang="scss">
.top_left {
  top: -15px;
  left: -15px;
}
</style>
