# Optionally override some pagy default with your own in the pagy initializer
Pagy::DEFAULT[:limit] = 10 # items per page
Pagy::DEFAULT[:size]  = [1, 2, 2, 1] # nav bar links
Pagy::DEFAULT[:page_param] = :p
Pagy::DEFAULT[:items_param] = :page
# Better user experience handled automatically
require 'pagy/extras/custom'
require 'pagy/extras/overflow'
require 'pagy/extras/size'
Pagy::DEFAULT[:overflow] = :last_page
Pagy::DEFAULT.freeze