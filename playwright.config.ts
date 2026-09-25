import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:60000,use:{baseURL:'http://127.0.0.1:5173',channel:'chrome'},workers:1,reporter:'list',projects:[{name:'desktop',use:{viewport:{width:1440,height:900}}},{name:'mobile-reduced',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}}]});
