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
     
    this.syntheseProgramme();
    this.syntheseProgramme2();
    this.syntheseCategorie();
    this.syntheseCategorie2(); 
    this.syntheseTime();
    this.syntheseTimeEtp();
  }

  syntheseProgramme(){
    const programmes = JSON.parse(this.data.get("programmes"));
    const etp = JSON.parse(this.data.get("programme1"));
    const data = [{
    id: '0.0',
    parent: '',
    name: "Mouvements totaux d'ETP",
    color: "var(--text-inverted-grey)",
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

    //const couleurs = ["var(--background-action-low-blue-ecume-active)","var(--background-contrast-green-emeraude)","var(--background-contrast-yellow-tournesol-active)","var(--border-action-low-purple-glycine)","var(--background-action-high-green-tilleul-verveine-active)","var(--border-default-blue-ecume)","var(--background-action-high-orange-terre-battue-active)","var(--border-default-grey)"]; 
    const couleurs = ["#99b3f9","#c3fad5", "#e6c130", "#fbb8f6",'#a7a967',"#465f9d","#c68f7d","#ddd"];
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
          text: "Suivi des mouvements en ETP par programme",
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
            rotationMode: 'circular',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 0
            },
            style: {
              color: 'var(--text-title-grey)',
              textOutline: 0,
            }
        },
        //borderColor:'rgba(255,255,255,0)',
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels:{
              style: {
                textOverflow: 'clip',
              },
            },
        }, {
            level: 2,
            colorByPoint: true,
            //levelSize: {
            //  unit: 'percentage',
            //  value: 30
            //},
        }, {
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
        }]

    }],

    tooltip: {
        borderColor: 'transparent',
        borderRadius: 16,
        backgroundColor: "rgba(245, 245, 245, 1)",
        headerFormat: '',
        pointFormat: '<b>{point.name} :</b> {point.value} ETP'
    }
    }
    this.chart = new Highcharts.chart(this.canvasProgramme1Target, options);
    this.chart.reflow();
  }
  syntheseProgramme2(){
    const programmes = JSON.parse(this.data.get("programmes"));
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
          colors: ["var(--background-action-low-blue-ecume-active)", "rgba(183, 167, 63, 0.6)"],
          
          title: {
              text: 'Plafond 3% ETP et ETP supprimés par programme',
             
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
          colors: ["var(--background-action-low-blue-ecume-active)", "rgba(183, 167, 63, 0.6)"],
          
          title: {
              text: 'Plafond 3% ETP et ETP supprimés par région',
             
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
    name: "Mouvements totaux d'ETP",
    color: "var(--text-inverted-grey)",
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
        text: 'Suivi des mouvements en ETP par région',
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
            rotationMode: 'circular',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 0
            },
            style: {
              color: 'var(--text-title-grey)',
              textOutline: 0,
            }
        },

        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              style: {
                    textOverflow: 'clip',
              },
            }
        }, {
            level: 2,
            colorByPoint: true,
            //levelSize: {
            //  unit: 'percentage',
            //  value: 30
            //},
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
                return '<b>ETP ' + this.point.name +' supprimés : </b>' + Math.round(this.percentage*10)/10 + '%'
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
                      style: {
                        color: 'var(--text-title-grey)',
                        textOutline: 0,
                      }
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
                return '<b>ETP ' + this.point.name +' ajoutés :</b> ' + Math.round(this.percentage*10)/10 + '%'
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
                      style: {
                        color: 'var(--text-title-grey)',
                        textOutline: 0,
                      }
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
          colors: ["#DAD29E", "var(--background-action-low-brown-opera)"],
          
          title: {
              text: 'ETP ajoutés et supprimés dans le temps (date du mouvement)',
             
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
                      enabled: true,
                      style: {
                        color: 'var(--text-title-grey)',
                        textOutline: 0,
                      }
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
          colors: ["#DAD29E", "var(--background-action-low-brown-opera)"],
          
          title: {
              text: "Départs et arrivées d'ETP à date effective",
             
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
                      enabled: true,
                      style: {
                        color: 'var(--text-title-grey)',
                        textOutline: 0,
                      }
                  }
              }
          },
          series: [{
              name: 'Départs ETP',
              data: data2,
          },{
              name: 'Arrivées ETP',
              data: data1,
          }]
    }
    this.chart = new Highcharts.chart(this.canvasTimeEtpTarget, options);
    this.chart.reflow();
  }

}
