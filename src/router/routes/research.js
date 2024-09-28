import {getAuth} from "@/auth/utils";

export default [
  {
    path: '/theses',
    name: 'theses',
    component: () => import('@/views/research/theses/index'),
    meta: {pageTitle: 'theses', breadcrumb: [{text: 'theses'}]},
  },
  {
    path: '/theses/:id',
    name: 'thesis',
    component: () => import('@/views/research/theses/show'),
    meta: {
      pageTitle: 'thesis',
      breadcrumb: [
        {to: {name: 'theses'}, text: 'theses'},
        {text: 'thesis', active: true},
      ],
    },
  },
  {
    path: '/theses/thesis/add',
    name: 'add_thesis',
    component: () => import('@/views/research/theses/show'),
    meta: {
      pageTitle: 'Add Thesis',
      breadcrumb: [
        {to: {name: 'theses'}, text: 'theses'},
        {text: 'Add Thesis', active: true},
      ],
    },
  },
  //Publications
  {
    path: '/my_researches/publications/list/:id?',
    name: 'publications',
    component: () => import('@/views/research/publications/components/publication'),
    meta: {
      pageTitle: 'Publications',
      breadcrumb: [
        {to: {name: 'publications'}, text: 'Researches'},
        {text: 'Publications', active: true},
      ],
    },
  },
  {
    path: '/my_researches/publications/add',
    name: 'add_publication',
    component: () => import('@/views/research/publications/show'),
    meta: {
      pageTitle: 'Add Publication',
      breadcrumb: [
        {to: {name: 'publications'}, text: 'Researches'},
        {to: {name: 'publications'}, text: 'Publications'},
        {text: 'Add Publication', active: true},
      ],
    },
  },
  {
    path: '/my_researches/publications/edit/:id',
    name: 'edit_publication',
    component: () => import('@/views/research/publications/show'),
    meta: {
      pageTitle: 'Edit Publication',
      breadcrumb: [
        {to: {name: 'publications'}, text: 'Researches'},
        {to: {name: 'publications'}, text: 'Publications'},
        {text: 'Edit Publication', active: true},
      ],
    },
  },
  {
    path: '/my_researches/publications/show/:id',
    name: 'show_publication',
    component: () => import('@/views/research/publications/show'),
    meta: {
      pageTitle: 'Show Project',
      breadcrumb: [
        {to: {name: 'publications'}, text: 'Researches'},
        {to: {name: 'publications'}, text: 'Publications'},
        {text: 'Show Publication', active: true},
      ],
    },
  },
];
