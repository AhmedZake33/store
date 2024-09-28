<template>
  <div>
    <Add v-if="edit && $route.name == 'user-add'" @hide="cancel" :inline="true" @refresh="init" :tabNumber="0" :data="null"></Add>
    <show v-if="(!edit && $route.name == 'user-show') || (edit&& $route.name != 'user-add' )" @refresh="init" :item="user" :load="load">
      <template #add_tab>
        <b-tab>
          <template #title>
            <feather-icon icon="UserIcon" />
            <span>{{ $t('Global.personal_info') }}</span>
          </template>
          <Edit v-if="edit" @hide="cancel()" :inline="true" @refresh="init" :tabNumber="0" :data="id ? user : { code: '', name: '',type:'', name_local: '', id: '', gender: '', birth_date: '', nationality: '', access: '' }"></Edit>
          <!-- <list :data="user" :loading="load" :only="['name', 'code', 'name_local', 'birth_date', 'gender', 'national_id']"></list> -->
          <ShowComponent v-if="!edit && user" :data="user" :loading="load" :only="['code', 'name', 'name_local', 'id', 'gender', 'birth_date', 'nationality', 'access']">
            <template #edit>
              <div class="mb-2">
                <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
              </div>
            </template>
            <template #code="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.code`) }}
              </th>
              <td >
                {{ data.code || '-' }}
              </td>
            </template>
            <template #name="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.name_custom`) }}
              </th>
              <td >
                {{ data.name }}
              </td>
            </template>
            <template #nationality="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.nationality`) }}
              </th>
              <td >
                {{ $i18n.locale == 'en' ? data.nationality.name : data.nationality.name_local }}
              </td>
            </template>
            <template #access="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.national_id`) }}
              </th>
              <td >
                {{ data.national_id ? data.national_id : '-' }}
              </td>
            </template>
            <template #birth_date="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.birth_date`) }}
              </th>
              <td >
                {{ toLocalDatetime(data.birth_date, $i18n.locale) }}
              </td>
            </template>
            <template #gender="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.gender`) }}
              </th>
              <td >
                {{ data.gender && data.gender.name ? $t(`Global.${data.gender.name}`) : '-' }}
              </td>
            </template>
  
            <template #name_local="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.arabic_name`) }}
              </th>
              <td >
                {{ data.name_local }}
              </td>
            </template>
            <template #id="{ data }">
              <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                {{ $t(`Global.name_local`) }}
              </th>
              <td v-if="$i18n.locale == 'en'" >
                {{ data.name_local }}
              </td>
  
              <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
              <td v-if="$i18n.locale == 'ar'" >
                {{ data.name }}
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="PhoneIcon" />
            <span>{{ $t('Global.contact_info') }}</span>
          </template>
          <Edit v-if="edit" @hide="cancel()" :inline="true" @refresh="init" :tabNumber="1" :data="id ? user : { 'email':'', 'personal_email':'', 'mobile':'', 'phone':''}"></Edit>
          <ShowComponent v-else :data="user" :loading="load" :only="['email', 'personal_email', 'mobile', 'phone']">
            <template #edit>
              <div class="mb-2">
                <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
              </div>
            </template>
            <template #email="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`academic_email`) }}
              </th>
              <td >
                {{ data.email ? data.email : '-' }}
              </td>
            </template>
            <template #personal_email="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.personal_email`) }}
              </th>
              <td >
                {{ data.personal_email ? data.personal_email : '-' }}
              </td>
            </template>
            <template #mobile="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.mobile`) }}
              </th>
              <td >
                {{ data.mobile ? data.mobile : '-' }}
              </td>
            </template>
            <template #phone="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.phone`) }}
              </th>
              <td >
                {{ data.phone ? data.phone : '-' }}
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="MapPinIcon" />
            <span>{{ $t('Global.address_info') }}</span>
          </template>
          <Edit v-if="edit" @hide="cancel()" :inline="true" @refresh="init" :tabNumber="2" :data="id ? user : { 'address':'', 'postal_code':''}"></Edit>
          <ShowComponent v-else :data="user" :loading="load" :only="['address', 'postal_code']">
            <template #edit>
              <div class="mb-2">
                <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
              </div>
            </template>
            <template #address="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.address`) }}
              </th>
              <td >
                {{ data.address ? data.address : '-' }}
              </td>
            </template>
            <template #postal_code="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.postal_code`) }}
              </th>
              <td >
                {{ data.postal_code ? data.postal_code : '-' }}
              </td>
            </template>
          </ShowComponent>
          <!-- <list :data="user" :loading="load" :only="['address', 'postal_code']"></list> -->
        </b-tab>
      </template>
    </show>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import show from '@/views/user_settings/components/show';
import { BTab, BCardText, BCard, BCol, BRow } from 'bootstrap-vue';
import List from '@/views/components/info/list';
import ShowComponent from '@/views/components/info/show';
import Edit from '@/views/user_settings/users/edit';
import Add from '@/views/user_settings/users/add';

export default {
  name: 'user',
  components: { Add,Edit, show, ShowComponent, BTab, BCardText, BCard, BCol, BRow, List },
  props: {
    user_id: null,
  },
  computed: {
    ...mapGetters({
      user: 'users/item',
      load: 'users/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : this.user_id;
    },
  },
  data() {
    return {
      edit: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      if (this.id || id) {
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        }
        this.$store.dispatch('users/get', this.id || id).then(response=>{
          // this.user = response
        });
      } else {
        this.edit = true;
      }
    },
    cancel(){
      this.edit = false;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
    },
    openEdit() {
      if(this.user && this.user.type){
        if(this.user.type.type == 1){
          return this.$router.push({ name: 'staff-show', params: { id: this.user.id },query:{inline:true} })
        }else if(this.user.type.type == 2){
           return this.$router.push({ name: 'employee-show', params: { id: this.user.id },query:{inline:true} })
        }else{
          this.edit = true;
          this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
        }
      }
      // this.edit = true;
      // this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
    },
  },
};
</script>

<style scoped></style>
