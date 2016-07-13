
Package.describe({
  name: "ihealth:framework-engine",
  summary: "Engine for iHealth Framework.",
  version: "0.5.7",
  git: "https://github.com/iHealthLab/framework-iHealth"
})

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.2.0.2")

  /**
   * @ @ @ @
   * Use & Imply
   * @ @ @ @
   */
  api.use([
    "react",
    "ecmascript",
    "es5-shim",
    "aramk:tinycolor",
    "underscore",
    "momentjs:moment",
    "ihealth:utils",
  ], ["client","server"])

  api.imply([
    "ecmascript",
    "es5-shim",
    "ihealth:utils",
    "aramk:tinycolor",
    "fortawesome:fontawesome@4.4.0",
  ], ["client","server"])

  /**
   * @ @ @ @
   * Add Files
   * @ @ @ @
   */
  api.addFiles([
    "lib/utils.jsx",
    "lib/autoPrefixer.jsx",
    "lib/cssBuilder.jsx",
    "lib/framework.jsx",

    "RC/core/animate.css",
    "RC/core/css.jsx",
    "RC/core/meteorData.jsx",
    "RC/core/commons/fw_commons.jsx",
    "RC/core/commons/fw_utility.jsx",
    "RC/core/commons/avatar.jsx",
    "RC/core/commons/pagination.jsx",
    "RC/core/html.jsx",

    "RC/grid/grid.jsx",
    "RC/backdrop/backdrop.jsx",
    "RC/datepicker/datepicker.jsx",
    "RC/hero/hero.jsx",
    "RC/card/card.jsx",
    "RC/list/list.jsx",
    "RC/timeline/timeline.jsx",

    // Items
    "RC/item/item.jsx",
    "RC/item/itemMediaElements.jsx",
    "RC/item/itemContentElements.jsx",

    // Forms
    "RC/form/form.jsx",
    "RC/form/formElementBase.jsx",
    "RC/form/button.jsx",
    "RC/form/formBasicElements.jsx",
    "RC/form/formOtherElements.jsx",

    // Tabs
    "RC/tabs/tabs.jsx",
    "RC/tabs/tabsSlider.jsx",
    "RC/tabs/tabsSteps.jsx",
    "RC/tabs/tabsInline.jsx",
    "RC/tabs/tabsFolder.jsx",
  ], "client")

  /*
   * @ @ @ @
   * Export
   * @ @ @ @
   */
  api.export([
    "autoprefix",
    "RC",
  ], ["client","server"])
})
