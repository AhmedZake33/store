<template>
  <div right class="d-flex align-items-center dropdown-user-link dropdown-user">
    <!-- <template #button-content> -->

    <div class="d-sm-flex d-none user-nav mx-1">
      <b-link  v-if="authUser().first_name" :to="{ name: 'user-profile' }" class="user-name font-weight-bolder mb-0">
        {{ authUser().first_name}}
      </b-link>
      <b-link  v-else-if="authUser().name" :to="{ name: 'user-profile' }" class="user-name font-weight-bolder mb-0">
        {{ $i18n.locale == 'ar' ?  authUser().name_local || authUser().name : authUser().name || authUser().name_local}}
      </b-link>
      <b-link  v-else :to="{ name: 'user-profile' }" class="user-name font-weight-bolder mb-0">
        {{"Profile"}}
      </b-link>
<!--      <b-link :to="{ name: 'user-show', params: { id: authUser().id } }" class="user-name font-weight-bolder mb-0">-->
<!--        {{ authUser().first_name || 'Admin System' }}-->
<!--      </b-link>-->
      <!-- <span class="user-status">admin</span> -->
    </div>
    <b-avatar size="40" :src="user_photo(authUser().id)" variant="light-primary" badge class="badge-minimal" badge-variant="success">
      <feather-icon v-if="!authUser().first_name" icon="UserIcon" size="22" />
    </b-avatar>
    <div v-b-tooltip.hover title="Log Out" style="margin-inline-start: 15px;margin-inline-end: 10px;" class="pointer logout_icon" @click="logout">
      <feather-icon size="16" icon="LogOutIcon" class="m-0" />
    </div>
    <!-- <span>Logout</span> -->
    <!-- </template> -->

    <!-- <b-dropdown-item :to="{ name: 'user-show', params: { id: authUser().id } }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="UserIcon" class="mr-50" />
      <span>Profile</span>
    </b-dropdown-item> -->
    <!-- <b-dropdown-item :to="{ name: 'apps-email' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="MailIcon" class="mr-50" />
      <span>Inbox</span>
    </b-dropdown-item>
    <b-dropdown-item :to="{ name: 'apps-todo' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="CheckSquareIcon" class="mr-50" />
      <span>Task</span>
    </b-dropdown-item>
    <b-dropdown-item :to="{ name: 'apps-chat' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="MessageSquareIcon" class="mr-50" />
      <span>Chat</span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item :to="{ name: 'pages-account-setting' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="SettingsIcon" class="mr-50" />
      <span>Settings</span>
    </b-dropdown-item>
    <b-dropdown-item :to="{ name: 'pages-pricing' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="CreditCardIcon" class="mr-50" />
      <span>Pricing</span>
    </b-dropdown-item>
    <b-dropdown-item :to="{ name: 'pages-faq' }" link-class="d-flex align-items-center">
      <feather-icon size="16" icon="HelpCircleIcon" class="mr-50" />
      <span>FAQ</span>
    </b-dropdown-item> -->
    <!-- <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
      <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
      <span>Logout</span>
    </b-dropdown-item> -->
  </div>
</template>

<script>
import { BNavItemDropdown, BLink, BDropdownItem, BDropdownDivider, BAvatar } from 'bootstrap-vue';

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
    BLink,
  },
  data() {
    return {
      userData: this.authUser(),
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('users/logout').then(_ => {
        this.$router.push({ name: 'auth-login' });
      });
    },
  },
};
</script>

<style lang="scss">
  [dir=rtl] .logout_icon{
    transform: rotate(180deg)
  }
</style>
