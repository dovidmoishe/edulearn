const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const config = getDefaultConfig(__dirname);

// No source is shared between apps. Keep sibling apps and local migration
// artifacts out of Metro's workspace-wide file scan, while retaining the root
// node_modules directory for pnpm dependency resolution.
const escapePath = (filePath) =>
  filePath
    .split(path.sep)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\\\/]");
const defaultBlockList = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(defaultBlockList)
    ? defaultBlockList
    : defaultBlockList
      ? [defaultBlockList]
      : []),
  ...["web", "admin", "edulearnapi", ".repo-backups", ".pnpm-store", ".deploy", ".turbo"].map(
    (directory) =>
      new RegExp(`^${escapePath(path.resolve(__dirname, "..", directory))}([\\\\/].*)?$`),
  ),
];
config.resolver.unstable_enablePackageExports = false;
module.exports = config;
