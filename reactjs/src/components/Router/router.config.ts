
import LoadableComponent from './../Loadable/index';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    permission: '',
    title: 'Home',
    icon: 'home',
    component: LoadableComponent(() => import('../../components/Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    permission: '',
    title: 'Dashboard',
    icon: 'home',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  },

  {
    path: '/teams',
    permission: 'Pages.Roles',
    title: 'Teams',
    name: 'teams',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Teams')),
  },
  {
    path: '/players',
    permission: 'Pages.Roles',
    title: 'Players',
    name: 'player',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Players')),
  },
  {
    path: '/matches',
    permission: 'Pages.Roles',
    title: 'Matches',
    name: 'matches',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Matches')),
  },
  {
    path: '/ground',
    permission: 'Pages.Roles',
    title: 'Ground',
    name: 'Ground',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Ground')),
  },
  {
    path: '/readImage',
    title: 'ReadImage',
    name: 'readImage',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ReadImage/readImage')),
  },
  {
    path: '/users',
    permission: 'Pages.Users',
    title: 'Users',
    name: 'user',
    icon: 'user',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Users')),
  },
  {
    path: '/roles',
    permission: 'Pages.Roles',
    title: 'Roles',
    name: 'role',
    icon: 'tags',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Roles')),
  },
  {
    path: '/tenants',
    permission: 'Pages.Tenants',
    title: 'Tenants',
    name: 'tenant',
    icon: 'appstore',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Tenants')),
  },
  {
    path: '/about',
    permission: '',
    title: 'About',
    name: 'about',
    icon: 'info-circle',
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/About')),
  },
  {
    path: '/logout',
    permission: '',
    title: 'Logout',
    name: 'logout',
    icon: 'info-circle',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
   
  },
  {
    path: '/scoreCard/team1/:team1Id/team2/:team2Id/match/:matchId',
    permission: '',
    title: 'ScoreCard',
    name: 'scoreCard',
    icon: 'info-circle',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/ScoreCard')),
    //component: (prop: any)=> <ScoreCard {...prop} /> ,
  },
  {
    path: '/exception?:type',
    permission: '',
    title: 'exception',
    name: 'exception',
    icon: 'info-circle',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
  },
];

export const routers = [...userRouter, ...appRouters];
