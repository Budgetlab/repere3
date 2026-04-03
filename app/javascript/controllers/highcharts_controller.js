import { Controller } from "@hotwired/stimulus"
import Highcharts from "highcharts"
import exporting from "exporting"
import data from "data"
import accessibility from "accessibility"
import nodata from "nodata"
import sunburst from "sunburst"
exporting(Highcharts)
data(Highcharts)
accessibility(Highcharts)
nodata(Highcharts)
sunburst(Highcharts)

export default class extends Controller {
  static get targets() {
  return ['canvasSyntheseProgramme','canvasMouvementsProgramme','categorieETPsuppression','categorieETPajout','syntheseRegion','mouvementsRegion','dateEffetEtp','creationETP',
  ];
  }
  connect() {
    if (this.hasCanvasSyntheseProgrammeTarget)   this.syntheseSyntheseProgramme();
    if (this.hasCanvasMouvementsProgrammeTarget)  this.syntheseMouvementsProgramme();
    if (this.hasCategorieETPsuppressionTarget)    this.syntheseCategorieETPsuppression();
    if (this.hasCategorieETPajoutTarget)          this.syntheseCategorieETPajout();
    if (this.hasSyntheseRegionTarget)             this.syntheseSyntheseRegion();
    if (this.hasMouvementsRegionTarget)           this.syntheseMouvementsRegion();
    if (this.hasDateEffetEtpTarget)               this.syntheseDateEffetEtp();
    if (this.hasCreationETPTarget)                this.syntheseCreationETP();
  }

  syntheseMouvementsProgramme() {
    const programmes = JSON.parse(this.data.get("synthProgrammes"));
    const etp        = JSON.parse(this.data.get("mvtProgramme"));

    const data = [{
      id: '0.0',
      parent: '',
      name: "Mouvements totaux d'ETP",
      color: "var(--text-inverted-grey)",
      dataLabels: [{ style: { textOutline: 0 } }],
    }];

    programmes.forEach((programme, i) => {
      data.push({ name: programme,      id: (1+0.1*i).toString(),         parent: '0.0' });
      data.push({ name: 'Ajout',        id: (2+0.1*i+0.01).toString(),    parent: (1+0.1*i).toString() });
      data.push({ name: 'Suppression',  id: (2+0.1*i+0.02).toString(),    parent: (1+0.1*i).toString() });
      data.push({ name: 'A', id: (3+0.1*i+0.011).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i],   color: "var(--background-contrast-blue-cumulus-hover)" });
      data.push({ name: 'B', id: (3+0.1*i+0.012).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+1], color: "var(--background-disabled-grey)" });
      data.push({ name: 'C', id: (3+0.1*i+0.013).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+2], color: "var(--background-contrast-beige-gris-galet-hover)" });
      data.push({ name: 'A', id: (3+0.1*i+0.021).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+3], color: "var(--background-contrast-blue-cumulus-hover)" });
      data.push({ name: 'B', id: (3+0.1*i+0.022).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+4], color: "var(--background-disabled-grey)" });
      data.push({ name: 'C', id: (3+0.1*i+0.023).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+5], color: "var(--background-contrast-beige-gris-galet-hover)" });
    });

    const couleurs = ["#99b3f9","#c3fad5","#e6c130","#fbb8f6","#a7a967","#465f9d","#c68f7d","#ddd"];
    const options = {
      chart: {
        height: '100%',
        style: { fontFamily: "Marianne" },
      },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: couleurs,
      title: {
        text: "Mouvements ETP par programme",
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      series: [{
        type: 'sunburst',
        data: data,
        name: 'Tout',
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
          format: '{point.name}',
          filter: { property: 'innerArcLength', operator: '>', value: 0 },
          rotationMode: 'circular',
          style: { color: 'var(--text-title-grey)', textOutline: 0 },
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              filter: { property: 'outerArcLength', operator: '>', value: 64 },
              style: { textOverflow: "clip" },
            },
          },
          { level: 2, colorByPoint: true },
          { level: 3, colorVariation: { key: 'brightness', to: 0.2 } },
          { level: 4, levelSize: { unit: 'percentage', value: 10 } },
        ],
      }],
      tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '',
        pointFormat: '<b>{point.name} :</b> {point.value:,.1f} ETP',
        valueDecimals: 1,
      },
    };
    this.chart = Highcharts.chart(this.canvasMouvementsProgrammeTarget, options);
    this.chart.reflow();
  }

  syntheseSyntheseRegion() {
    const regions   = JSON.parse(this.data.get("synthRegions"));
    const etpSupp   = JSON.parse(this.data.get("synthEtpSuppRegion"));
    const plafond   = JSON.parse(this.data.get("synthPlafondRegion"));

    const options = {
      chart: {
        height: '600px',
        style: { fontFamily: "Marianne" },
        type: 'column',
      },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: ["var(--background-action-low-blue-ecume-active)", "rgba(183, 167, 63, 0.6)"],
      title: {
        text: 'Plafond 3% ETP et ETP supprimés par région',
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      xAxis: {
        categories: regions,
        labels: { style: { color: 'var(--text-title-grey)' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'ETP', style: { color: 'var(--text-title-grey)' } },
        labels: { style: { color: 'var(--text-title-grey)' } },
      },
      tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        shared: true,
      },
      legend: {
        shadow: false,
        itemStyle: { color: 'var(--text-title-grey)' },
      },
      plotOptions: {
        column: { grouping: false, shadow: false, borderWidth: 0 },
      },
      series: [
        { name: 'Plafond 3% ETP', data: plafond, pointPadding: 0.3, pointPlacement: 0 },
        { name: 'ETP supprimés',  data: etpSupp,  pointPadding: 0.1, pointPlacement: 0 },
      ],
    };
    this.chart = Highcharts.chart(this.syntheseRegionTarget, options);
    this.chart.reflow();
  }

  syntheseMouvementsRegion() {
    const regions = JSON.parse(this.data.get("synthRegions"));
    const etp     = JSON.parse(this.data.get("mvtRegion"));

    const data = [{
      id: '0.0',
      parent: '',
      name: "Mouvements totaux d'ETP",
      color: "var(--text-inverted-grey)",
      dataLabels: [{ style: { textOutline: 0 } }],
    }];

    regions.forEach((region, i) => {
      data.push({ name: region,       id: (1+0.1*i).toString(),         parent: '0.0' });
      data.push({ name: 'Ajout',      id: (2+0.1*i+0.01).toString(),    parent: (1+0.1*i).toString() });
      data.push({ name: 'Suppression',id: (2+0.1*i+0.02).toString(),    parent: (1+0.1*i).toString() });
      data.push({ name: 'A', id: (3+0.1*i+0.011).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i],   color: "var(--background-contrast-blue-cumulus-hover)" });
      data.push({ name: 'B', id: (3+0.1*i+0.012).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+1], color: "var(--background-disabled-grey)" });
      data.push({ name: 'C', id: (3+0.1*i+0.013).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+2], color: "var(--background-contrast-beige-gris-galet-hover)" });
      data.push({ name: 'A', id: (3+0.1*i+0.021).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+3], color: "var(--background-contrast-blue-cumulus-hover)" });
      data.push({ name: 'B', id: (3+0.1*i+0.022).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+4], color: "var(--background-disabled-grey)" });
      data.push({ name: 'C', id: (3+0.1*i+0.023).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+5], color: "var(--background-contrast-beige-gris-galet-hover)" });
    });

    const couleurs = ["#62A9A2","#B7A73F","#F3E2D7","#99B3F9","#A7A967","#F4E3C7","#BAFAEE","#FEECC2","#C7F6FC","#FDDBFA","#E7BEA6","#76ADF8","#FDE39C","#A6F2FA","#9FC3FC","#FDDFD8","#BFCCFB","#F6F6F6","#C3FAD5"];
    const options = {
      chart: {
        height: '500px',
        style: { fontFamily: "Marianne" },
      },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: couleurs,
      title: {
        text: "Mouvements ETP par région",
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      series: [{
        type: 'sunburst',
        data: data,
        name: 'Tout',
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
          format: '{point.name}',
          filter: { property: 'innerArcLength', operator: '>', value: 0 },
          rotationMode: 'circular',
          style: { color: 'var(--text-title-grey)', textOutline: 0 },
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              filter: { property: 'outerArcLength', operator: '>', value: 64 },
              style: { textOverflow: "clip" },
            },
          },
          { level: 2, colorByPoint: true },
          { level: 3, colorVariation: { key: 'brightness', to: 0.2 } },
          { level: 4, levelSize: { unit: 'percentage', value: 10 } },
        ],
      }],
      tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '',
        pointFormat: '<b>{point.name} :</b> {point.value:,.1f} ETP',
        valueDecimals: 1,
      },
    };
    this.chart = Highcharts.chart(this.mouvementsRegionTarget, options);
    this.chart.reflow();
  }

  _colonneTemporelleOptions(title, labelAjout, labelSupp, dataAjout, dataSupp) {
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    return {
      chart: { height: '400px', style: { fontFamily: "Marianne" }, type: 'column' },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: ["#DAD29E", "var(--background-action-low-brown-opera)"],
      title: {
        text: title,
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      xAxis: {
        categories: mois,
        labels: { style: { color: 'var(--text-title-grey)' } },
      },
      yAxis: {
        min: 0,
        title: { text: 'ETP', style: { color: 'var(--text-title-grey)' } },
        labels: { style: { color: 'var(--text-title-grey)' } },
        stackLabels: { enabled: true, style: { textOutline: 'none' } },
      },
      legend: { itemStyle: { color: 'var(--text-title-grey)' } },
      tooltip: {
        borderColor: 'transparent', borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: { enabled: true, style: { color: 'var(--text-title-grey)', textOutline: 0 } },
        },
      },
      series: [
        { name: labelSupp, data: dataSupp },
        { name: labelAjout, data: dataAjout },
      ],
    };
  }

  syntheseDateEffetEtp() {
    const ajout = JSON.parse(this.data.get("dateEffetAjout"));
    const supp  = JSON.parse(this.data.get("dateEffetSupp"));
    const options = this._colonneTemporelleOptions(
      "Départs et arrivées d'ETP à date effective du mouvement",
      "Arrivées ETP", "Départs ETP", ajout, supp
    );
    this.chart = Highcharts.chart(this.dateEffetEtpTarget, options);
    this.chart.reflow();
  }

  syntheseCreationETP() {
    const ajout = JSON.parse(this.data.get("creationAjout"));
    const supp  = JSON.parse(this.data.get("creationSupp"));
    const options = this._colonneTemporelleOptions(
      "ETP ajoutés et supprimés dans le temps (date de saisie)",
      "ETP ajoutés", "ETP supprimés", ajout, supp
    );
    this.chart = Highcharts.chart(this.creationETPTarget, options);
    this.chart.reflow();
  }

  _pieCategorieOptions(title, data) {
    const colors = ["var(--background-contrast-blue-cumulus-hover)","var(--background-disabled-grey)","var(--background-contrast-beige-gris-galet-hover)"];
    return {
      chart: {
        height: '100%',
        style: { fontFamily: "Marianne" },
        plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false,
        type: 'pie',
      },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: Highcharts.map(colors, (color) => ({
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [[0, color], [1, Highcharts.color(color).brighten(-0.3).get('rgb')]],
      })),
      title: {
        text: title,
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      tooltip: {
        borderColor: 'transparent', borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        formatter: function() {
          return '<b>Grade ' + this.point.name + ' : </b>' + Math.round(this.percentage * 10) / 10 + '%';
        },
      },
      accessibility: { point: { valueSuffix: '%' } },
      plotOptions: {
        pie: {
          size: '100%', allowPointSelect: true, cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            connectorColor: 'silver', connectorPadding: 0, distance: -50,
            style: { color: 'var(--text-title-grey)', textOutline: 0 },
          },
        },
      },
      series: [{ name: 'Grade', data: data }],
    };
  }

  syntheseCategorieETPsuppression() {
    const data = JSON.parse(this.data.get("gradeEtpSupp"));
    const options = this._pieCategorieOptions('ETP supprimés par grade', data);
    this.chart = Highcharts.chart(this.categorieETPsuppressionTarget, options);
    this.chart.reflow();
  }

  syntheseCategorieETPajout() {
    const data = JSON.parse(this.data.get("gradeEtpAdd"));
    const options = this._pieCategorieOptions('ETP ajoutés par grade', data);
    this.chart = Highcharts.chart(this.categorieETPajoutTarget, options);
    this.chart.reflow();
  }

  syntheseSyntheseProgramme() {
    const programmes = JSON.parse(this.data.get("synthProgrammes"));
    const etpSupp    = JSON.parse(this.data.get("synthEtpSupp"));

    const options = {
      chart: {
        height: '100%',
        style: { fontFamily: "Marianne" },
        type: 'column',
      },
      lang: { decimalPoint: "," },
      exporting: { enabled: false },
      colors: ["rgba(183, 167, 63, 0.6)","var(--background-action-low-blue-ecume-active)"],
      title: {
        text: 'ETP supprimés par programme',
        style: { fontSize: '13px', fontWeight: "900", color: 'var(--text-title-grey)' },
      },
      xAxis: {
        categories: programmes,
        labels: { style: { color: 'var(--text-title-grey)' } },
      },
      yAxis: {
        min: 0,
        title: { text: "ETP", style: { color: 'var(--text-title-grey)' } },
        labels: { style: { color: 'var(--text-title-grey)' } },
      },
      tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        shared: true,
      },
      legend: {
        shadow: false,
        itemStyle: { color: 'var(--text-title-grey)' },
      },
      plotOptions: {
        column: { grouping: false, shadow: false, borderWidth: 0 },
      },
      series: [
        { name: 'ETP supprimés', data: etpSupp, pointPadding: 0.1, pointPlacement: 0 },
      ],
    };
    this.chart = Highcharts.chart(this.canvasSyntheseProgrammeTarget, options);
    this.chart.reflow();
  }


}
