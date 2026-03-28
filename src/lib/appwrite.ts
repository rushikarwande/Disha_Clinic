import { Account, Client, ID, Permission, Role, Storage, TablesDB } from "appwrite";

export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "";
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "";
export const APPWRITE_PROJECT_NAME = import.meta.env.VITE_APPWRITE_PROJECT_NAME ?? "";
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "";
export const APPWRITE_TABLE_ID =
  import.meta.env.VITE_APPWRITE_TABLE_ID ??
  import.meta.env.VITE_APPWRITE_COLLECTION_ID ??
  "";
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID ?? "";
export const APPWRITE_SITE_DOCUMENT_ID =
  import.meta.env.VITE_APPWRITE_SITE_DOCUMENT_ID ?? "site_content";

export const isAppwriteConfigured =
  Boolean(APPWRITE_ENDPOINT) && Boolean(APPWRITE_PROJECT_ID);

export const isAppwriteContentConfigured =
  isAppwriteConfigured &&
  Boolean(APPWRITE_DATABASE_ID) &&
  Boolean(APPWRITE_TABLE_ID);

export const isAppwriteStorageConfigured =
  isAppwriteConfigured && Boolean(APPWRITE_BUCKET_ID);

export const appwriteClient = new Client();

if (isAppwriteConfigured) {
  appwriteClient.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
}

export const appwriteAccount = new Account(appwriteClient);
export const appwriteTablesDB = new TablesDB(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);

export const createPublicEditorPermissions = () => [
  Permission.read(Role.any()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

export const createPublicFilePermissions = (userId: string) => [
  Permission.read(Role.any()),
  Permission.write(Role.user(userId)),
];

export { ID };
