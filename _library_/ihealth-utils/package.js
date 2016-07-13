
Package.describe({
  name: "ihealth:utils",
  summary: "A collection of useful utils functions for iHealth engineers.",
  version: "0.1.5",
  git: "https://github.com/iHealthLab/framework-iHealth"
})

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.2.0.2")

  /**
   * Important Note !!
   * 1. Always make sure that the package versions are updated to the latest.
   * 2. Do use() and imply() in proper areas (client, server or both).
   */

  /*
   * @ @ @ @
   * Use & imply
   * @ @ @ @
   */
  var packages = [
    // Server Packages
    "meteorhacks:subs-manager@1.6.2",
    "aldeed:simple-schema@1.3.3",
    "aldeed:collection2@2.3.3",
    "matb33:collection-hooks@0.7.13",
    "meteorhacks:aggregate@1.3.0",

    // Higher Level Packages
    "kadira:flow-router@2.3.0",

    // React & ES6 related packages that you should probably use
    "react",
    "ecmascript",
    "ramda:ramda@0.18.0",
    "meteorflux:dispatcher@1.2.0",
    "saeho:immutablejs@3.7.5",

    // Utilities
    "coffeescript@1.0.10",
    "check@1.0.5",
    "underscore@1.0.4",
    "momentjs:moment",
    "meteorhacks:fast-render@2.10.0",
    // "fastclick@1.0.7", // Not needed because it's part of the mobile-experience package now
    "jag:pince"
  ]
  api.use(packages, ["client","server"])
  api.imply(packages, ["client","server"])

  /*
   * @ @ @ @
   * Add Files
   * @ @ @ @
   */
  api.addFiles([
    "lib/declarations.js",
    "lib/collections.js",
    "lib/schema.js",
    "lib/callbacks.js",
    "lib/utils.js",
    "lib/shim.js",
  ], ["client","server"])
  api.addFiles("router.jsx", "client")

  /*
   * @ @ @ @
   * Export
   * @ @ @ @
   */
  api.export("DefaultRoutes", "client")
  api.export([
    "h",
    "IH",
  ], ["client","server"])
})
