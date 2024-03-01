import EventEmitter from "events";
import { join } from "path";
import { access, mkdir, remove } from "fs-extra";
import puppeteer from "puppeteer-extra";
import { createPlugin } from "puppeteer-with-fingerprints";
import { BrowserInstance } from "./BrowserInstance";
import { BrowserManagerConfig, CreateBrowserConfig } from "./types";


// BrowserManager class extends EventEmitter to handle events
export class BrowserManager extends EventEmitter {
  // Define class properties
  private STORAGE_PATH: string;
  browserInstances: BrowserInstance[] = [];
  handledRequestUrls = [];

  // Constructor for the class
  constructor({ storagePath }: BrowserManagerConfig) {
    super();
    // Use the provided storagePath or a default one
    this.STORAGE_PATH = storagePath ?? DEFAULT_PROFILE_STORAGE_PATH;
  }

  // Method to create a new browser instance
  async createBrowser(createBrowserConfig: CreateBrowserConfig) {
    // Destructure the config object to get necessary parameters
    const {
      id,
      proxy,
      fingerprints,
      existingProfileKey,
    } = createBrowserConfig;

    // Check if a browser with the provided id already exists
    const isBrowserActive = this.browserInstances.find(
      (browser) => browser.id === id
    );

    // If the browser already exists, throw an error
    if (isBrowserActive) {
      throw new Error("Browser ID already active");
    }

    // Create a new plugin for the browser
    const plugin = createPlugin({
      launch: (config) => puppeteer.launch(config),
    });

    try {
      // Use the provided fingerprints if any
      if (fingerprints) {
        plugin.useFingerprint(JSON.stringify(fingerprints));
      }

      // Set up proxy if provided
      if (proxy) {
        const { username, password, ip, port } = proxy;

        plugin.useProxy(`${ip}:${port}@${username}:${password}`, {
          detectExternalIP: true,
          changeGeolocation: true,
          changeBrowserLanguage: true,
          changeTimezone: true,
          changeWebRTC: true,
        });
      }

      // If an existing profile key is provided, get the profile path
      let profilePath: string;
      if (existingProfileKey) {
        profilePath = await this.getProfile({ id: existingProfileKey });
      }

      // Set up the browser configuration
      const browserConfig = {
        headless: false,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-session-crashed-bubble",
          "--noerrdialogs",
        ],
        executablePath: executablePath(),
        ...(existingProfileKey ? { userDataDir: profilePath } : {}),
      };

      // Launch the browser with the provided configuration
      const browser = await plugin.launch(browserConfig);

      // Open a new page in the browser
      const page = await browser.newPage();

      // Create a new browser instance and add it to the list
      const browserInstance = new BrowserInstance(id, browser, page);
      this.browserInstances.push(browserInstance);

      // Emit an event to indicate the change in active browsers
      this.emit(
        "activeBrowsersChanged",
        this.browserInstances.map((instance) => instance.id)
      );

      // Return the new browser instance
      return browserInstance;
    } catch (error) {
      // If there's an error, throw it
      throw new Error(`Error creating browser: ${error}`);
    }
  }

  // Method to close a specific browser instance
  async closeBrowser(id: string): Promise<void> {
    // Find the index of the browser in the list
    const index = this.browserInstances.findIndex((b) => b.id === id);
    // If the browser exists, close it and remove it from the list
    if (index !== -1) {
      await this.browserInstances[index].close();
      this.browserInstances.splice(index, 1);

      // Emit an event to indicate the change in active browsers
      this.emit(
        "activeBrowsersChanged",
        this.browserInstances.map((instance) => instance.id)
      );
    }
  }

  // Method to close all browser instances
  async closeAll(): Promise<void> {
    // Use Promise.all to close all browsers concurrently
    await Promise.all(
      this.browserInstances.map((browserInstance) => {
        return browserInstance.browser.close();
      })
    );

    // Clear the list of browser instances
    this.browserInstances = [];

    // Emit an event to indicate the change in active browsers
    this.emit("activeBrowsersChanged", []);
  }

  // Method to get a browser instance by its id
  getBrowserById(id: string): BrowserInstance {
    // Find and return the browser instance with the given id
    return this.browserInstances.find((instance) => instance.id === id);
  }

  // Method to get a profile by its id
  async getProfile({ id }: GetProfileArgs): Promise<string> {
    // Construct the directory path for the profile
    const directory = join(this.STORAGE_PATH, id);

    try {
      // Try to access the directory
      await access(directory);
    } catch {
      // If the directory does not exist, throw an error
      throw new Error(`Profile ${id} does not exist.`);
    }

    // Return the directory path
    return directory;
  }

  // Method to delete a profile by its id
  async deleteProfile({ id }: GetProfileArgs): Promise<boolean> {
    // Construct the directory path for the profile
    const directory = join(this.STORAGE_PATH, id);

    try {
      // Try to remove the directory
      await remove(directory);
    } catch {
      // If the directory does not exist, throw an error
      throw new Error(`Profile ${id} does not exist.`);
    }

    // Return true to indicate successful deletion
    return true;
  }

  // Method to create a new profile
  async createProfile({ id }: CreateProfileArgs): Promise<string> {
    // Construct the directory path for the profile
    const directory = join(this.STORAGE_PATH, id);

    try {
      // Try to access the directory
      await access(directory);
    } catch {
      // If the directory does not exist, create it
      await mkdir(directory, { recursive: true });
    }

    // Return the directory path
    return directory;
  }
}