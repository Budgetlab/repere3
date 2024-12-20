# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "@hotwired--stimulus.js" # @3.2.2
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/custom", under: "custom"
pin "flatpickr" # @4.6.13
pin "flatpickr/dist/l10n/fr.js", to: "flatpickr--dist--l10n--fr.js.js" # @4.6.13
pin "highcharts", to: "https://ga.jspm.io/npm:highcharts@11.4.8/highcharts.js" # @11.4.8
pin "highcharts-more", to: "https://ga.jspm.io/npm:highcharts@11.4.8/highcharts-more.js"
pin "exporting", to: "https://ga.jspm.io/npm:highcharts@11.4.8/modules/exporting.js"
pin "accessibility", to: "https://ga.jspm.io/npm:highcharts@11.4.8/modules/accessibility.js"
pin "data", to: "https://ga.jspm.io/npm:highcharts@11.4.8/modules/export-data.js"
pin "nodata", to: "https://ga.jspm.io/npm:highcharts@11.4.8/modules/no-data-to-display.js"
pin "sunburst", to: "https://ga.jspm.io/npm:highcharts@11.4.8/modules/sunburst.js"
pin "@stimulus-components/rails-nested-form", to: "@stimulus-components--rails-nested-form.js" # @5.0.0
