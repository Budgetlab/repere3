module ApplicationHelper
	# Custom Pagy navigation compatible avec le DSFR (Système de Design de l'État français)
	def pagy_nav_custom(pagy, **opts)
		return '' unless pagy.pages > 1

		html = +%(<nav role="navigation" class="fr-pagination" aria-label="Pagination">)
		html << %(<ul class="fr-pagination__list">)

		# Bouton Première page
		if pagy.previous
			html << %(<li><a class="fr-pagination__link fr-pagination__link--first" href="#{pagy.page_url(:first, **opts)}" aria-label="Première page">Première page</a></li>)
		end

		# Bouton Page précédente
		if pagy.previous
			html << %(<li><a class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label" href="#{pagy.page_url(:previous, **opts)}" aria-label="Page précédente">Page précédente</a></li>)
		end

		# Pages numérotées - génération manuelle de la série
		series = pagy_series(pagy, **opts)
		series.each do |item|
			case item
			when Integer
				if item == pagy.page
					html << %(<li><a class="fr-pagination__link" aria-current="page" title="Page #{item}">#{item}</a></li>)
				else
					html << %(<li><a class="fr-pagination__link" href="#{pagy.page_url(item, **opts)}" title="Page #{item}">#{item}</a></li>)
				end
			when String
				html << %(<li><a class="fr-pagination__link" aria-current="page" title="Page #{item}">#{item}</a></li>)
			when :gap
				html << %(<li><a class="fr-pagination__link">...</a></li>)
			end
		end

		# Bouton Page suivante
		if pagy.next
			html << %(<li><a class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label" href="#{pagy.page_url(:next, **opts)}" aria-label="Page suivante">Page suivante</a></li>)
		end

		# Bouton Dernière page
		if pagy.next
			html << %(<li><a class="fr-pagination__link fr-pagination__link--last" href="#{pagy.page_url(:last, **opts)}" aria-label="Dernière page">Dernière page</a></li>)
		end

		html << %(</ul>)
		html << %(</nav>)
		html.html_safe
	end

	# Helper pour générer la série de pages
	def pagy_series(pagy, slots: 7, **opts)
		return [] if pagy.pages <= 1

		series = []

		if slots >= pagy.pages
			series.push(*1..pagy.pages)
		else
			half = (slots - 1) / 2
			start = if pagy.page <= half
								1
				      elsif pagy.page > (pagy.pages - slots + half)
								pagy.pages - slots + 1
				      else
								pagy.page - half
			        end
			series.push(*(start...(start + slots)))

			# Ajouter les gaps et première/dernière page
			unless slots < 7
				series[0] = 1
				series[1] = :gap unless series[1] == 2
				series[-2] = :gap unless series[-2] == pagy.pages - 1
				series[-1] = pagy.pages
			end
		end

		# Convertir la page courante en String
		current = series.index(pagy.page)
		series[current] = pagy.page.to_s if current

		series
	end
	def format_number(number)
	  number = number_with_delimiter("%g" % ("%.2f" % number ), locale: :fr)
	end
end
