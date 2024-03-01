import { HTTPRequest, Page } from "puppeteer";

export interface BrowserManagerConfig {
  storagePath?: string;
}

export interface CreateBrowserConfig {
  id: string;
  proxy?: Proxy;
  fingerprints?: string;
  existingProfileKey?: string;
}

export interface CreateProfileArgs {
  id: string;
}

export interface GetProfileArgs {
  id: string;
}

export interface Proxy {
  ip: string;
  port: string;
  username?: string;
  password?: string;
}