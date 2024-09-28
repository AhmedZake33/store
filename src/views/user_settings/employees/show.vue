<template>
<div>
  <Add v-if="edit && $route.name == 'employee-add'" @hide="cancel" :type="2" :inline="true" @refresh="refresh" :tabNumber="0" :data="employee && employee.user"></Add>
  <show v-if="(employee && $route.name != 'employee-add') || !id && ((!edit && $route.name == 'employee-show') || (edit&& $route.name != 'employee-add' ))" :type="2" @refresh="refresh" :item="employee ? employee.user : null" :load="load">
    <template #add_tab>
      <b-tab>
        <template #title>
          <feather-icon icon="UserIcon" />
          <span>{{ $t('Global.personal_info') }}</span>
        </template>
        <Edit v-if="edit" @hide="edit = false" :inline="true" @refresh="refresh" :tabNumber="0" :data="id ? employee && employee.user && employee.user.employee_data ? { ...employee.user.employee_data, ...employee.user, ...employee } : employee : { code: '', name: '', name_local: '', id: '', gender: '', birth_date: '', insurance_no: '',data:'', access: '' }"></Edit>
        <ShowComponent v-else :data="employee && employee.user && employee.user.employee_data ? { ...employee.user.employee_data, ...employee.user, ...employee } : employee" :loading="load" :only="['code', 'name', 'name_local', 'id', 'gender', 'birth_date', 'insurance_no', 'data', 'access']">
            <template #edit>
            <div class="mb-2">
              <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
            </div>
          </template>
            <template #name="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.name_custom`) }}
            </th>
            <td>
              {{ data.name }}
            </td>
          </template>
          <template #insurance_no="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.insurance_no`) }}
            </th>
            <td>
              {{ data.insurance_no || '-' }}
            </td>
          </template>
          <template #birth_date="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.birth_date`) }}
            </th>
            <td>
              {{ toLocalDatetime(data.birth_date, $i18n.locale) }}
            </td>
          </template>
          <template #gender="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.gender`) }}
            </th>
            <td>
              {{ data.gender ? $t(`Global.${data.gender.name}`) : '-' }}
            </td>
          </template>
          <template #name_local="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.arabic_name`) }}
            </th>
            <td>
              {{ data.name_local }}
            </td>
          </template>
          <template #id="{ data }">
            <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
              {{ $t(`Global.name_local`) }}
            </th>
            <td v-if="$i18n.locale == 'en'">
              {{ data.name_local }}
            </td>

            <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
            <td v-if="$i18n.locale == 'ar'">
              {{ data.name }}
            </td>
          </template>
          <template #access="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.national_id`) }}
            </th>
            <td>
              {{ data.national_id ? data.national_id : '-' }}
            </td>
          </template>
        </ShowComponent>
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="PhoneIcon" />
          <span>{{ $t('Global.contact_info') }}</span>
        </template>
        <Edit v-if="edit" @hide="edit = false" :inline="true" @refresh="refresh" :tabNumber="1" :data="id ? employee && employee.user && employee.user.employee_data ? { ...employee.user.employee_data, ...employee.user, ...employee } : employee : { 'email':'', 'personal_email':'', 'mobile':'', 'phone':'', 'internal_phone':''}"></Edit>
        <ShowComponent v-else :data="employee && employee.user && employee.user.employee_data ? { ...employee.user.employee_data, ...employee.user, ...employee } : employee" :loading="load" :only="['email', 'personal_email', 'mobile', 'phone', 'internal_phone']">
          <template #email="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`academic_email`) }}
            </th>
            <td>
              {{ data.email ? data.email : '-' }}
            </td>
          </template>
          <template #internal_phone="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.internal_phone`) }}
            </th>
            <td>
              {{ data.internal_phone ? data.internal_phone : '-' }}
            </td>
          </template>
          <template #edit>
            <div class="mb-2">
              <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
            </div>
          </template>
        </ShowComponent>
      </b-tab>
      <b-tab>
        <template #title>
          <feather-icon icon="MapPinIcon" />
          <span>{{ $t('Global.address_info') }}</span>
        </template>
        <Edit v-if="edit" @hide="edit = false" :inline="true" @refresh="refresh" :tabNumber="2" :data="id ? employee.user : { 'address':'', 'postal_code':''}"></Edit>
        <ShowComponent v-else :data="employee.user" :loading="load" :only="['address', 'postal_code']">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-if="hasPermission('edit_users')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
            </div>
          </template>
          <template #address="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.address_info`) }}
            </th>
            <td>
              {{ data.address ? data.address : '-' }}
            </td>
          </template>
          <template #postal_code="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`postal_code`) }}
            </th>
            <td>
              {{ data.postal_code ? data.postal_code : '-' }}
            </td>
          </template>
        </ShowComponent>
      </b-tab>
    </template>
  </show>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BTab, BTabs, BCard } from 'bootstrap-vue';
import show from '@/views/user_settings/components/show';
import List from '@/views/components/info/list';
import ShowComponent from '@/views/components/info/show';
import Edit from '@/views/user_settings/employees/edit';
import Add from '@/views/user_settings/employees/add';

export default {
  name: 'Show',
  components: {
    List,
    BTabs,
    BTab,
    BCard,
    ShowComponent,
    Edit,
    show,
    Add
  },
  data() {
    return {
      edit: false,
    };
  },
  props: {
    user_id: null,
  },
  computed: {
    ...mapGetters({
      employee: 'employees/item',
      load: 'employees/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : this.user_id;
    },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh(id) {
      if (this.id || id) {
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        }
        this.$store.dispatch('employees/get', this.id || id);
      } else {
        this.edit = true;
      }
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
    },
  },
};
</script>

<style>
.no_bottom {
  box-shadow: none;
  border: 0;
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
