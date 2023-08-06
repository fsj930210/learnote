import { createRouter, createWebHistory } from 'vue-router';

//路由规则描述数组
const routes = [
  { path: '/', redirect: '/windowMain/chat' },
  {
    path: '/windowMain',
    component: () => import('@renderer/views/window/WindowMain.vue'),
    children: [
      { path: 'chat', component: () => import('@renderer/views/window/WindowMain/Chat.vue') },
      { path: 'contact', component: () => import('@renderer/views/window/WindowMain/Contact.vue') },
      { path: 'collection', component: () => import('@renderer/views/window/WindowMain/Collection.vue') },
    ],
  },
  {
    path: '/windowSetting',
    component: () => import('@renderer/views/window/WindowSetting.vue'),
    children: [{ path: 'accountSetting', component: () => import('@renderer/views/window/WindowSetting/AccountSetting.vue') }],
  },
  {
    path: '/windowUserInfo',
    component: () => import('@renderer/views/window/WindowUserInfo.vue'),
  },
];

// 导出路由对象
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
