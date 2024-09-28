<template>
  <div class="auth-wrapper auth-v2" v-if="universityData">
    <!-- universityData : {{ universityData.url }} -->
    <b-row class="auth-inner m-0">
      <!-- Brand logo-->
      <b-link class="brand-logo">
        <!-- <vuexy-logo /> -->
        <div class="brand-text text-primary ml-1 nav navbar-nav flex-row d-flex align-items-center">
          <div class="mx-1">
            <b-img width="200" height="200" fluid :src="universityData.big_icon" alt="logo"/>
            <!-- <b-img width="40" height="40" fluid :src="logo" alt="logo" /> -->
          </div>

        </div>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col v-bind:style="{ backgroundImage: 'url(' + universityData.background + ')' }" lg="8"
             class="d-none d-lg-flex align-items-center p-5 cover">
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <!-- <b-img fluid :src="imgUrl" alt="Login V2" /> -->
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <b-card-title class="mb-1 font-weight-bold" title-tag="h2">
            <div class="m-0 brand-text text-primary nav navbar-nav flex-row d-flex align-items-center">
              <!--             <h4 class="m-0 brand-text"> Welcome to </h4>-->
              <!--              <div class="mx-1">-->
              <!--                <b-img width="30" height="30" fluid :src="appLogoImage" alt="logo" />-->
              <!--              </div>-->
              <h4 class="m-0 brand-text mb-1">
                <!--                {{ appName }}-->
                {{ universityData.name }}
                <br/>
                <!-- Education Management System -->
              </h4>
              <h6>
                The Education Management System (EMS) is only accessible to academic staff and employees. To access the
                student information system (SIS), please click .
                <a class="a_hover font-weight-bolder" :href="universityData.student_link" target="_blank"
                   rel="noopener noreferrer">here</a>
              </h6>
            </div>
          </b-card-title>
          <!--          <b-card-text class="mb-2"> Please sign-in to your account and start the adventure</b-card-text>-->

          <!-- form -->
          <template v-if="!forceLogin">
            <validation-observer ref="loginForm" #default="{ invalid }">
              <b-form class="auth-login-form mt-2" @submit.prevent="login">
                <!-- email -->
                <b-form-group label="Email" label-for="login-email">
                  <validation-provider #default="{ errors }" name="Email" vid="email" rules="required|email">
                    <b-form-input trim id="login-email" v-model="loginForm.email"
                                  :state="errors.length > 0 ? false : null" name="login-email"
                                  placeholder="john@example.com"/>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>

                <!-- forgot password -->
                <b-form-group>
                  <div class="d-flex justify-content-between">
                    <label for="login-password">Password</label>
                    <!-- <b-link :to="{ name: 'auth-forgot-password' }">
                                        <small>Forgot Password?</small>
                                      </b-link> -->
                  </div>
                  <validation-provider #default="{ errors }" name="Password" vid="password" rules="required">
                    <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid' : null">
                      <b-form-input id="login-password" v-model="loginForm.password"
                                    :state="errors.length > 0 ? false : null" class="form-control-merge"
                                    :type="passwordFieldType" name="login-password" placeholder="Password"/>
                      <b-input-group-append is-text>
                        <feather-icon class="cursor-pointer" :icon="passwordToggleIcon"
                                      @click="togglePasswordVisibility"/>
                      </b-input-group-append>
                    </b-input-group>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>

                <!-- checkbox -->
                <!-- <b-form-group>
                  <b-form-checkbox id="remember-me" v-model="status" name="checkbox-1"> Remember Me </b-form-checkbox>
                </b-form-group> -->

                <!-- submit buttons -->
                <b-button :class="loginLoad['login'] ? 'disabled_all' : ''" type="submit" variant="primary" block
                ><span v-if="!loginLoad['login']">{{ $t('Global.SignIn') }}</span>
                  <b-spinner v-if="loginLoad['login']" small :label="$t('Global.loading')"></b-spinner>
                </b-button>
                <b-button :class="loginLoad['login'] ? 'disabled_all' : ''" type="button" variant="outline-primary white" block
                          @click.prevent="msLoginUrl">
                  <span v-if="!loginLoad['login']"><img src="/ms-icon.png" alt="">&nbsp; {{ $t('Global.SignInWithMicrosoft') }}</span>
                  <b-spinner v-if="loginLoad['login']" small :label="$t('Global.loading')"></b-spinner>
                </b-button>
                <p class="text-dark font-small-2 mt-1">
                  {{ $t('Global.loginHint') }}
                </p>
              </b-form>
            </validation-observer>
            <div class="pt-1" v-if="loginError">
              <b-alert
                  variant="danger"
                  :show="true"
                  class="mb-0"
              >
                <div class="alert-body">
                  <feather-icon
                      icon="InfoIcon"
                      class="mr-50"
                  />
                  {{ loginError }}
                </div>
              </b-alert>
            </div>
          </template>
          <template v-else>
            <b-button :class="'disabled_all'" type="button" variant="outline-primary white" block>
              <span ><img src="/ms-icon.png" alt="">&nbsp; Signing you in ...&nbsp;</span>
              <b-spinner small :label="$t('Global.loading')"></b-spinner>
            </b-button>
          </template>


          <!-- <div class="divider my-2">
            <div class="divider-text">or</div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button variant="facebook" href="javascript:void(0)">
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button variant="twitter" href="javascript:void(0)">
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button variant="google" href="javascript:void(0)">
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button variant="github" href="javascript:void(0)">
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div> -->

          <div class="divider my-2">
            <div class="divider-text"></div>
          </div>

          <div class="auth-footer-btn d-flex justify-content-center">
            <span class="float-md-left d-block d-md-inline-block mt-25">
              {{ $t('Copyright') }}  © {{ new Date().getFullYear() }}
              <b-link
                  class="ml-25"
                  href="http://octopiems.com/"
                  target="_blank"
              >{{ $t('Octopi') }}</b-link>
              <span class="d-none d-sm-inline-block">, {{ $t('All rights Reserved') }}</span>
            </span>
          </div>

        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import {ValidationProvider, ValidationObserver} from 'vee-validate';
import VuexyLogo from '@core/layouts/components/Logo.vue';
import {
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BSpinner,
  BFormInput,
  BInputGroupAppend,
  BInputGroup,
  BFormCheckbox,
  BCardText,
  BCardTitle,
  BImg,
  BForm,
  BButton,
  BAlert,
  VBTooltip
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import {required, email} from '@validations';
import {togglePasswordVisibility} from '@core/mixins/ui/forms';
import store from '@/store/index';
import {getHomeRouteForLoggedInUser} from '@/auth/utils';
import {$themeConfig} from '@themeConfig';
import {mapActions, mapGetters} from 'vuex';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  setup() {
    const {appName, appLogoImage} = $themeConfig.app;
    return {
      appName,
      appLogoImage,
    };
  },
  data() {
    return {
      status: '',
      forceLogin: false,
      loginForm: {
        email: '',
        password: '',
      },
      sideImg: require('@/assets/images/pages/bg2.jpg'),

      // validation rules
      required,
      email,
      loginError: false
    };
  },
  computed: {
    ...mapGetters({
      universityData: 'app/universityData',
      savedUrl: 'app/savedUrl',
      loginLoad:"app/generalLoad"
    }),
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        this.sideImg = require('@/assets/images/pages/bg2.jpg');
        return this.sideImg;
      }
      return this.sideImg;
    },
  },
  mounted() {
    this.$store.dispatch('app/GET_UNIVERSITY_DATA')
    if(this.$route.params.code !== undefined) {
      this.forceLogin = true;
      this.msLoginCallback({
        code: this.$route.params.code,
        session_state: this.$route.params.session_state,
        state: this.$route.params.state,
      });
    }
  },
  methods: {
    login: function () {
      this.$refs.loginForm
          .validate()
          .then(success => {
            if (success) {
              this.$store.dispatch('users/login', this.loginForm).then(() => {
                if (this.authUser().id) {
                  this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id).then(() => {
                    if(this.savedUrl && this.savedUrl.fullPath){
                    this.$router.push({ path: this.savedUrl.fullPath })
                    this.$store.commit('app/SAVE_URL',null)
                  }else{
                    this.$store.commit('app/SAVE_URL',null)
                    this.$router.replace({ name: 'dashboard' }).catch(()=>{});
                  }
                    this.$store.commit('app/SET_GENERAL_LOAD', {link:'login',data:false},{root:true});
                    // switch (this.authUser().type.type){
                    //   case 1:
                    //     this.$router.replace({ name: 'user-profile' });
                    //     break;
                    //   case 3:
                    //     this.$router.replace({ name: 'student_profile'});
                    //     break;
                    //   default:
                    //     this.$router.replace({ name: 'user-profile' });
                    //     break;
                    // }
                  });
                }
                //replace(getHomeRouteForLoggedInUser('admin'))
              }).catch((err) => {
                this.$store.commit('app/SET_GENERAL_LOAD', {link:'login',data:false},{root:true});
                this.loginError = this.$t('Email or password is incorrect');
              });
            }
          })
          .catch(error => {
            this.$store.commit('app/UPDATE_LOAD', false);
            this.$refs.loginForm.setErrors(error.response.data.error);
          });
    },
    msLoginUrl() {
      this.$store.dispatch('users/getMSLoginUrl').then(res => {
        return location.replace(res.data.url);
      });
    },
    msLoginCallback(payload) {
      this.$store.dispatch('users/msLoginCallback', payload).then(_ => {
        if (this.authUser().id) {
          this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id).then(() => {
            this.$router.replace({name: 'dashboard'}).catch(()=>{});
            this.$store.commit('app/UPDATE_LOAD', false);
          });
        }
      }).catch(_ => {
        this.forceLogin = false;
        this.$store.commit('app/UPDATE_LOAD', false);
        this.$refs.loginForm.setErrors(error.response.data.error);
      });
    },
    getStudentLink() {
      // return this.universityData.data.url;
      if (location.hostname == 'localhost' || location.hostname == 'emsdev.fekracomputers.net') {
        return 'https://students.emsdev.fekracomputers.net/login'
      } else {
        return 'https://student.o6u.edu.eg/login'
      }
    }
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
