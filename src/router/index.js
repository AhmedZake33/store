import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import store from '@/store';

// Routes
import {
  isUserLoggedIn,
} from '@/auth/utils';
import dashboard from './routes/dashboard';
import pages from './routes/pages';
import for_student from './routes/for_student';
import course_File from './routes/course_file';
import study from './routes/study';
import user_settings from './routes/user_settings';
import students from './routes/students';
import development from './routes/development';
import administration from './routes/administration';
import academic_settings from './routes/academic_settings';
import quality from './routes/quality';
import requests from './routes/requests';
import control from './routes/control';
import examination from './routes/examination';
import research from './routes/research';
import service_settings from './routes/service_settings';
import chat from '@/router/routes/chat';
import ticket from '@/router/routes/ticket';
import work_space from '@/router/routes/work_space';
import student_activities from '@/router/routes/student_activities';
import payments from '@/router/routes/payments';
import hotels from '@/router/routes/hotels';
import emtyaz from '@/router/routes/emtyaz';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: { name: 'dashboard' } },
    ...dashboard,
    ...pages,
    ...for_student,
    ...study,
    ...user_settings,
    ...students,
    ...administration,
    ...academic_settings,
    ...quality,
    ...requests,
    ...control,
    ...examination,
    ...research,
    ...service_settings,
    ...chat,
    ...ticket,
    ...work_space,
    ...student_activities,
    ...course_File,
    ...development,
    ...payments,
    ...hotels,
    ...emtyaz,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = isUserLoggedIn();
  if (to.query.code) {
    return next({
      name: 'auth-login',
      params: {
        code: to.query.code,
        session_state: to.query.session_state,
        state: to.query.state,
      },
    });
  }
  if (!isLoggedIn && !to.meta.redirectIfLoggedIn && to.name !== "misc-under-maintenance") {
    if (to.name != 'auth-login') {
      store.commit('app/SAVE_URL', to);
    }
    return next({ name: 'auth-login' });
  }else{
    return next();
  }

  // if (!canNavigate(to)) {
  //   // Redirect to login if not logged in
  //   if (!isLoggedIn) {
  //     return next({ name: 'auth-login' });
  //   }
  //   return next({ name: 'misc-not-authorized' });
  // } else {
  //   return next();
  // }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach((to) => {
  const isLoggedIn = isUserLoggedIn();
  if (to.name == 'auth-login' && isLoggedIn) {
    router.push({ name: 'dashboard' });
  }
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg');
  if (appLoading) {
    appLoading.style.display = 'none';
  }
});

export default router;
