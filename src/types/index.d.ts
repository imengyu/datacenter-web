/// <reference types="sizzle" />
/// <reference path="extends.d.ts" />

import Vue from "vue";
import { AxiosInstance } from "axios";

declare module "vue/types/vue" {
  interface Vue {
    $axios : AxiosInstance;
  }
}