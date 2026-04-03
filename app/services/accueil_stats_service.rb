class AccueilStatsService
  def initialize(objectifs, mouvements, programmes, regions, annee)
    @programmes = programmes
    @regions    = regions
    @annee      = annee

    @objectifs_par_programme  = objectifs.group_by(&:programme_id)
    @objectifs_par_region     = objectifs.group_by(&:region_id)
    @mouvements_par_programme = mouvements.group_by(&:programme_id)
    @mouvements_par_region    = mouvements.group_by(&:region_id)
    @mouvements_par_grade     = mouvements.group_by(&:grade)

    @prog_type_grade  = Hash.new(0.0)
    @region_type_grade = Hash.new(0.0)
    @date_effet_month = Hash.new(0.0)
    @creation_month   = Hash.new(0.0)

    mouvements.each do |m|
      q = m.quotite.to_f
      @prog_type_grade[[m.programme_id, m.type_mouvement, m.grade]]  += q
      @region_type_grade[[m.region_id, m.type_mouvement, m.grade]]   += q
      @date_effet_month[[m.type_mouvement, m.date_effet.month]]       += q if m.date_effet&.year == annee
      @creation_month[[m.type_mouvement, m.created_at.month]]         += q
    end
  end

  def data_par_programme
    @programmes.map do |prog|
      stats = aggregate_stats(
        @objectifs_par_programme[prog.id],
        @mouvements_par_programme[prog.id]
      )
      stats.merge(programme: prog)
    end
  end

  def mvt_programme_etp
    sunburst_etp(@programmes, @prog_type_grade)
  end

  def data_par_region
    @regions.map do |region|
      stats = aggregate_stats(
        @objectifs_par_region[region.id],
        @mouvements_par_region[region.id]
      )
      stats.merge(nom: region.nom)
    end
  end

  def mvt_region_etp
    sunburst_etp(@regions, @region_type_grade)
  end

  def data_par_macrograde
    @mouvements_par_grade.map do |grade, mvts|
      s = aggregate_mouvement_sums(mvts)
      { macrograde: grade,
        etp_supp:   s[:etp_supp],
        etp_add:    s[:etp_add],
        etpt_supp:  s[:etpt_supp],
        etpt_add:   s[:etpt_add] }
    end.sort_by { |d| d[:macrograde].to_s }
  end

  def date_effet_ajout = monthly_series(@date_effet_month, 'ajout')
  def date_effet_supp  = monthly_series(@date_effet_month, 'suppression')
  def creation_ajout   = monthly_series(@creation_month,   'ajout')
  def creation_supp    = monthly_series(@creation_month,   'suppression')

  private

  def aggregate_stats(objectifs, mouvements)
    etp_cible    = 0.0
    etpt_plafond = 0.0
    (objectifs || []).each do |o|
      etp_cible    += o.etp_cible.to_f
      etpt_plafond += o.etpt_plafond.to_f
    end

    s = aggregate_mouvement_sums(mouvements || [])

    { etp_cible:    etp_cible.round(1),
      etpt_plafond: etpt_plafond.round(1),
      plafond_3:    (0.03 * etp_cible).round(1),
      etp_supp:     s[:etp_supp],
      pct_etp_supp: etp_cible > 0 ? (s[:etp_supp] / etp_cible * 100).round(2) : 0,
      etp_add:      s[:etp_add],
      etpt_supp:    s[:etpt_supp],
      etpt_add:     s[:etpt_add],
      credits:      s[:credits],
      couts:        s[:couts] }
  end

  def aggregate_mouvement_sums(mouvements)
    etp_supp = 0.0; etp_add = 0.0
    etpt_supp = 0.0; etpt_add = 0.0
    credits = 0.0; couts = 0.0

    mouvements.each do |m|
      q = m.quotite.to_f
      e = m.etpt.to_f
      case m.type_mouvement
      when 'suppression' then etp_supp += q; etpt_supp += e
      when 'ajout'       then etp_add  += q; etpt_add  += e
      end
      credits += m.credits_gestion.to_f
      couts   += m.cout_etp.to_f
    end

    { etp_supp: etp_supp.round(2), etp_add: etp_add.round(2),
      etpt_supp: etpt_supp.round(2), etpt_add: etpt_add.round(2),
      credits: credits.to_i, couts: couts.to_i }
  end

  def sunburst_etp(collection, hash)
    collection.flat_map do |item|
      %w[ajout suppression].flat_map do |type|
        %w[A B C].map { |grade| hash[[item.id, type, grade]].round(1) }
      end
    end
  end

  def monthly_series(hash, type)
    (1..12).map { |m| hash[[type, m]].round(1) }
  end
end
