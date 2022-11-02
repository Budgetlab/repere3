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
  return ['canvasCategorie','canvasCategorie2','canvasTime','canvasRegion1','canvasRegion2','canvasRegion3','canvasProgramme1','canvasProgramme2','canvasTimeEtp','canvasRegionSunburst',
  ];
  }
  connect() {
    
    this.syntheseCategorie();
    this.syntheseCategorie2();
    this.syntheseTime();
    this.syntheseRegion();
    this.syntheseRegionSun();
    this.syntheseProgramme();
    this.syntheseProgramme2();
    this.syntheseTimeEtp();
  }

  syntheseProgramme(){
    const programmes = JSON.parse(this.data.get("programmes"));
    const etp = JSON.parse(this.data.get("programme1"));
    const data = [{
    id: '0.0',
    parent: '',
    name: 'ETP redéployés ',
    color: "#FFF",
    },];
    programmes.forEach((programme,i) =>{
      data.push({ name: programme, id: (1+0.1*i).toString(), parent: '0.0' })
      data.push({ name: 'Ajout', id: (2+0.1*i+0.01).toString(), parent: (1+0.1*i).toString() })
      data.push({ name: 'Suppression', id: (2+0.1*i+0.02).toString(), parent: (1+0.1*i).toString() })
      data.push({ name: 'A', id: (3+0.1*i+0.01+0.001).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i], color: "var(--background-contrast-blue-cumulus-hover)" })
      data.push({ name: 'B', id: (3+0.1*i+0.01+0.002).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+1], color: "var(--background-disabled-grey)"})
      data.push({ name: 'C', id: (3+0.1*i+0.01+0.003).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+2], color: "var(--background-contrast-beige-gris-galet-hover)"})
      data.push({ name: 'A', id: (3+0.1*i+0.02+0.001).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+3], color: "var(--background-contrast-blue-cumulus-hover)" })
      data.push({ name: 'B', id: (3+0.1*i+0.02+0.002).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+4], color: "var(--background-disabled-grey)"})
      data.push({ name: 'C', id: (3+0.1*i+0.02+0.003).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+5], color: "var(--background-contrast-beige-gris-galet-hover)"})
    });

    const couleurs = ["var(--background-action-low-blue-ecume-active)","var(--background-contrast-green-emeraude)","var(--background-contrast-yellow-tournesol-active)","var(--border-action-low-purple-glycine)","var(--background-action-high-green-tilleul-verveine-active)","var(--border-default-blue-ecume)","var(--background-action-high-orange-terre-battue-active)","var(--border-default-grey)"]; 
    const options = {
      chart: {
        height: '100%',
        style:{
                    fontFamily: "Marianne",
                },
    },
    exporting:{enabled: false},
    // Let the center circle be transparent
    colors: couleurs,

    title: {
        text: 'ETP redéployés par programme',
        style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
    },


    series: [{
        type: 'sunburst',
        data: data,
        name: 'Tout',
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            },
            rotationMode: 'circular'
        },
        borderColor:'#ffffff',
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            }
        }, {
            level: 2,
            colorByPoint: true,
            levelSize: {
              unit: 'percentage',
              value: 30
          },
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: 0.2
            },
            levelSize: {
              unit: 'percentage',
              value: 20
          },
        }, {
            level: 4,
            levelSize: {
              unit: 'percentage',
              value: 10
          },
            //colorVariation: {
            //    key: 'brightness',
            //   to: 0.3
            //}
        }]

    }],

    tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '',
        pointFormat: '<b>{point.name}</b> : <b>{point.value}</b>'
    }
    }
    this.chart = new Highcharts.chart(this.canvasProgramme1Target, options);
    this.chart.reflow();
  }
  syntheseProgramme2(){
    const programmes = JSON.parse(this.data.get("programmes"));
    const data = JSON.parse(this.data.get("programme2"));
    const colors = ["var(--background-action-high-blue-france)","var(--background-action-high-green-bourgeon)","var(--background-action-high-purple-glycine)"] 
    const etp_plafond = JSON.parse(this.data.get("progplafond"));
    const etp_supp = JSON.parse(this.data.get("progetp"));
  
    const options = {
          chart: {
                height:'100%',
                style:{
                    fontFamily: "Marianne",
                },
                type: 'column',  
                                  
          },
          exporting:{enabled: false},
          colors: ["#99B3F9", "rgba(183, 167, 63, 0.6)"],
          
          title: {
              text: 'Plafond 3% et ETP supprimés par programme',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          xAxis: {
            categories: programmes,
          },
          yAxis: {
            min: 0,
            title: {
              text: 'ETP',
            },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              shared: true,

          },
          legend: {
              shadow: false
          },
          plotOptions: {
              column: {
                  grouping: false,
                  shadow: false,
                  borderWidth: 0
              }
          },
          
          series: [{
              name: 'Plafond 3% ETP',
              data: etp_plafond,
              pointPadding: 0.3,
              pointPlacement: 0
          },{
              name: 'ETP supprimés',
              data: etp_supp,
              pointPadding: 0.1,
              pointPlacement: 0
          }]
    }
    this.chart = new Highcharts.chart(this.canvasProgramme2Target, options);
    this.chart.reflow();
  }
  syntheseRegion(){
    const regions = JSON.parse(this.data.get("regions"));
    const data = JSON.parse(this.data.get("region1"));
    const colors = ["var(--background-action-high-blue-france)","var(--background-action-high-green-bourgeon)","var(--background-action-high-purple-glycine)"] 
    const etp_supp =   JSON.parse(this.data.get("region2"));
    const etp_plafond =   JSON.parse(this.data.get("plafond"));
  
    const options = {
          chart: {
                height:'600px',
                style:{
                    fontFamily: "Marianne",
                },
                type: 'column',  
                                  
          },
          exporting:{enabled: false},
          colors: ["#99B3F9", "rgba(183, 167, 63, 0.6)"],
          
          title: {
              text: 'Plafond 3% et ETP supprimés par région',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          xAxis: {
            categories: regions,
          },
          yAxis: {
            min: 0,
            title: {
              text: 'ETP',
            },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              shared: true,

          },
          legend: {
              shadow: false
          },
          plotOptions: {
              column: {
                  grouping: false,
                  shadow: false,
                  borderWidth: 0
              }
          },
         
          series: [{
              name: 'Plafond 3% ETP',
              data: etp_plafond,
              pointPadding: 0.3,
              pointPlacement: 0
          },{
              name: 'ETP supprimés',
              data: etp_supp,
              pointPadding: 0.1,
              pointPlacement: 0
          }]
    }
    this.chart = new Highcharts.chart(this.canvasRegion1Target, options);
    this.chart.reflow();
  }
  syntheseRegionSun(){
    const regions = JSON.parse(this.data.get("regions"));
    const etp = JSON.parse(this.data.get("regionsun"));
    const data = [{
    id: '0.0',
    parent: '',
    name: 'ETP redéployés ',
    color: "#FFF",
    },];
    regions.forEach((region,i) =>{
      data.push({ name: region, id: (1+0.1*i).toString(), parent: '0.0' })
      data.push({ name: 'Ajout', id: (2+0.1*i+0.01).toString(), parent: (1+0.1*i).toString() })
      data.push({ name: 'Suppression', id: (2+0.1*i+0.02).toString(), parent: (1+0.1*i).toString() })
      data.push({ name: 'A', id: (3+0.1*i+0.01+0.001).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i], color: "var(--background-contrast-blue-cumulus-hover)" })
      data.push({ name: 'B', id: (3+0.1*i+0.01+0.002).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+1], color: "var(--background-disabled-grey)"})
      data.push({ name: 'C', id: (3+0.1*i+0.01+0.003).toString(), parent: (2+0.1*i+0.01).toString(), value: etp[6*i+2], color: "var(--background-contrast-beige-gris-galet-hover)"})
      data.push({ name: 'A', id: (3+0.1*i+0.02+0.001).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+3], color: "var(--background-contrast-blue-cumulus-hover)" })
      data.push({ name: 'B', id: (3+0.1*i+0.02+0.002).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+4], color: "var(--background-contrast-beige-gris-galet-hover)"})
      data.push({ name: 'C', id: (3+0.1*i+0.02+0.003).toString(), parent: (2+0.1*i+0.02).toString(), value: etp[6*i+5], color: "var(--background-disabled-grey)"})
    });

    const couleurs = ["#62A9A2","#B7A73F","#F3E2D7","#99B3F9","#A7A967","#F4E3C7","#BAFAEE","#FEECC2","#C7F6FC","#FDDBFA","#E7BEA6","#76ADF8","#FDE39C","#A6F2FA","#9FC3FC","#FDDFD8","#BFCCFB","#F6F6F6","#C3FAD5"];
    const options = {
      chart: {
        height: '100%',
        style:{
                    fontFamily: "Marianne",
                },
    },
    exporting:{enabled: false},
    // Let the center circle be transparent
    colors: couleurs,

    title: {
        text: 'ETP redéployés par région',
        style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
    },


    series: [{
        type: 'sunburst',
        data: data,
        name: 'Tout',
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            },
            rotationMode: 'circular'
        },
        borderColor:'#ffffff',
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            }
        }, {
            level: 2,
            colorByPoint: true,
            levelSize: {
              unit: 'percentage',
              value: 30
          },
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: 0.2
            },
            levelSize: {
              unit: 'percentage',
              value: 20
          },
        }, {
            level: 4,
            levelSize: {
              unit: 'percentage',
              value: 10
          },
            //colorVariation: {
            //    key: 'brightness',
            //   to: 0.3
            //}
        }]

    }],

    tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '',
        pointFormat: '<b>{point.name}</b> : <b>{point.value}</b>'
    }
    }
    this.chart = new Highcharts.chart(this.canvasRegionSunburstTarget, options);
    this.chart.reflow();
  }
  syntheseRegion2(){
    const regions = JSON.parse(this.data.get("regions"));
    const data = JSON.parse(this.data.get("region2"));
    const couleurs = ["#62A9A2","#B7A73F","#F3E2D7","#99B3F9","#A7A967","#F4E3C7","#BAFAEE","#FEECC2","#C7F6FC","#FDDBFA","#E7BEA6","#76ADF8","#FDE39C","#A6F2FA","#9FC3FC","#FDDFD8","#BFCCFB","#F6F6F6","#C3FAD5"];  
    const datas = [];
    
    regions.forEach((region,i) =>{
      datas.push({ name: region, y: data[i] })
    }) 
           
    const options = {
          chart: {
                height:'100%',
                style:{
                    fontFamily: "Marianne",
                },
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',  
                                  
          },
          exporting:{enabled: false},
          colors: Highcharts.map(couleurs, function (color) {
              return {
                  radialGradient: {
                      cx: 0.5,
                      cy: 0.3,
                      r: 0.7
                  },
                  stops: [
                      [0, color],
                      [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                  ]
              };
          }),
          
          title: {
              text: 'ETP supprimés par région',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              formatter: function () {
                return  this.point.name +' : ' + Math.round(this.percentage*10)/10 
              }
              //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  size: '100%',
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.y} ',
                      connectorColor: 'silver',
                      connectorPadding: 0,
                      distance:-20,
                  }
              }
          },
          series: [{
              name: 'Région',
              data: datas
          }]
    }
    this.chart = new Highcharts.chart(this.canvasRegion2Target, options);
    this.chart.reflow();
  }

  syntheseRegion3(){
    const regions = JSON.parse(this.data.get("regions"));
    const data = JSON.parse(this.data.get("region3"));
    const couleurs = ["#62A9A2","#B7A73F","#F3E2D7","#99B3F9","#A7A967","#F4E3C7","#BAFAEE","#FEECC2","#C7F6FC","#FDDBFA","#E7BEA6","#76ADF8","#FDE39C","#A6F2FA","#9FC3FC","#FDDFD8","#BFCCFB","#F6F6F6","#C3FAD5"];
    const datas = []
    
    regions.forEach((region,i) =>{
      datas.push({ name: region, y: data[i] })
    }) 
           
    const options = {
          chart: {
                height:'100%',
                style:{
                    fontFamily: "Marianne",
                },
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',  
                                  
          },
          exporting:{enabled: false},
          colors: Highcharts.map(couleurs, function (color) {
              return {
                  radialGradient: {
                      cx: 0.5,
                      cy: 0.3,
                      r: 0.7
                  },
                  stops: [
                      [0, color],
                      [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken Highcharts.getOptions().colors
                  ]
              };
          }),
          
          title: {
              text: 'ETP ajoutés par région',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              formatter: function () {
                return  this.point.name +' : ' + Math.round(this.percentage*10)/10 
              }
              //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  size: '100%',
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.y} ',
                      connectorColor: 'silver',
                      connectorPadding: 0,
                      distance:-20,
                  }
              }
          },
          series: [{
              name: 'Région',
              data: datas
          }]
    }
    this.chart = new Highcharts.chart(this.canvasRegion3Target, options);
    this.chart.reflow();
  }

  syntheseCategorie(){
    const data = JSON.parse(this.data.get("categories"));
    const colors = ["var(--background-contrast-blue-cumulus-hover)","var(--background-disabled-grey)","var(--background-contrast-beige-gris-galet-hover)"] 
    const options = {
          chart: {
                height:'100%',
                style:{
                    fontFamily: "Marianne",
                },
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',  
                                  
          },
          exporting:{enabled: false},
          colors: Highcharts.map(colors, function (color) {
              return {
                  radialGradient: {
                      cx: 0.5,
                      cy: 0.3,
                      r: 0.7
                  },
                  stops: [
                      [0, color],
                      [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                  ]
              };
          }),
          
          title: {
              text: 'ETP supprimés (%)',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              formatter: function () {
                return 'ETP ' + this.point.name +' supprimés : ' + Math.round(this.percentage*10)/10 + '%'
              }
              //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  size: '100%',
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      connectorColor: 'silver',
                      connectorPadding: 0,
                      distance:-50,
                  }
              }
          },
          series: [{
              name: 'Catégorie',
              data: [
                  { name: 'A', y: data[0] },
                  { name: 'B', y: data[1] },
                  { name: 'C', y: data[2] }
              ]
          }]
    }
    this.chart = new Highcharts.chart(this.canvasCategorieTarget, options);
    this.chart.reflow();
  }

  syntheseCategorie2(){
    const data = JSON.parse(this.data.get("categories2"));
    const colors = ["var(--background-contrast-blue-cumulus-hover)","var(--background-disabled-grey)","var(--background-contrast-beige-gris-galet-hover)"] 
    const options = {
          chart: {
                height:'100%',
                style:{
                    fontFamily: "Marianne",
                },
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',  
                                  
          },
          exporting:{enabled: false},
          colors: Highcharts.map(colors, function (color) {
              return {
                  radialGradient: {
                      cx: 0.5,
                      cy: 0.3,
                      r: 0.7
                  },
                  stops: [
                      [0, color],
                      [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                  ]
              };
          }),
          
          title: {
              text: 'ETP ajoutés (%)',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              formatter: function () {
                return 'ETP ' + this.point.name +' ajoutés : ' + Math.round(this.percentage*10)/10 + '%'
              }
              //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  size: '100%',
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      connectorColor: 'silver',
                      connectorPadding: 0,
                      distance:-50,
                  }
              }
          },
          series: [{
              name: 'Catégorie',
              data: [
                  { name: 'A', y: data[0] },
                  { name: 'B', y: data[1] },
                  { name: 'C', y: data[2] }
              ]
          }]
    }
    this.chart = new Highcharts.chart(this.canvasCategorie2Target, options);
    this.chart.reflow();
  }

  syntheseTime(){
    const data1 = JSON.parse(this.data.get("ajout"));
    const data2 = JSON.parse(this.data.get("suppression"));
    const options = {
          chart: {
                height:'400px',
                style:{
                    fontFamily: "Marianne",
                },
                type: 'column',  
                                  
          },
          exporting:{enabled: false},
          colors: ["#DAD29E", "#F3E2D7"],
          
          title: {
              text: 'Mouvements effectués dans le temps',
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          xAxis: {
            categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre','Novembre','Décembre']
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Mouvements',
            },
            stackLabels: {
                enabled: true,
                style: {
                    textOutline: 'none'
                }
            }
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true
                  }
              }
          },
          series: [{
              name: 'Suppression',
              data: data2,
          },{
              name: 'Ajout',
              data: data1,
          }]
    }
    this.chart = new Highcharts.chart(this.canvasTimeTarget, options);
    this.chart.reflow();
  }

  syntheseTimeEtp(){
    const data1 = JSON.parse(this.data.get("time1"));
    const data2 = JSON.parse(this.data.get("time2"));
    const options = {
          chart: {
                height:'400px',
                style:{
                    fontFamily: "Marianne",
                },
                type: 'column',  
                                  
          },
          exporting:{enabled: false},
          colors: ["#DAD29E", "#F3E2D7"],
          
          title: {
              text: "ETP ajoutés et supprimés à date effective",
             
              style: {
                fontSize: '13px',
                fontWeight: "900",
                color: 'var(--text-title-grey)',
                },
          },
          xAxis: {
            categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre','Novembre','Décembre']
          },
          yAxis: {
            min: 0,
            title: {
              text: 'ETP',
            },
            stackLabels: {
                enabled: true,
                style: {
                    textOutline: 'none'
                }
            }
          },
          tooltip: {
              borderColor: 'transparent',
              borderRadius: 16,
              backgroundColor: "rgba(245, 245, 245, 1)",
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
              column: {
                  stacking: 'normal',
                  dataLabels: {
                      enabled: true
                  }
              }
          },
          series: [{
              name: 'ETP supprimés',
              data: data2,
          },{
              name: 'ETP ajoutés',
              data: data1,
          }]
    }
    this.chart = new Highcharts.chart(this.canvasTimeEtpTarget, options);
    this.chart.reflow();
  }

}
