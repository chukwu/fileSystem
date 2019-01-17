import { Component, OnInit, Input, ViewEncapsulation,NgZone, HostListener } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ChartComponent implements OnInit {
  chart:Chart = null; 
  series:Array<{}>;
  alpha:number = 0;
  beta:number = 0;
  depth:number = 60;
  @Input() titleText:string;
  @Input() mode3d:boolean = true;
  @Input() subtitleTextHtml:string;
  @Input() yAxisText:string;
  @Input() xAxisText:string;
  @Input() type:string = "spline";
  @Input() toolTipSuffix:string;
  @Input() categories:Array<string>;
  @Input() categoriesType:string = "category";
  @Input() options3d:any = {
      enabled: true,
      alpha: this.alpha,
      beta: this.beta,
      depth: this.depth,
      viewDistance: 25
  };
  @Input() headercolor:string = "red";

  @Input() drilldown:any;
  @Input() set setSeries(value:string) {
    this.series = JSON.parse(value);
  }
  @Input() set toggleOptions(value:boolean) {
    this.ngZone.run(()=>{
      this.showOptionsPanel = value;
    })
    setTimeout(()=>{
      this.redrawChart();
    },0)

  }
  changeToggle(event:any){
    console.log(this.mode3d);
    this.options3d.enabled = this.mode3d;
    setTimeout(()=>{
      this.redrawChart();
    },0)
  }
  showOptionsPanel:boolean = true;
  chartTypes:Array<any> = [{
    name: "line",
    caption: "Line"
  },{
    name: "area",
    caption: "Area"
  },{
    name: "bar",
    caption: "Bar"
  },{
    name: "column",
    caption: "Column"
  },{
    name: "spline",
    caption: "Spline"
  },{
    name: "pie",
    caption: "Pie"
  },{
    name: "areaspline",
    caption: "Area Spline"
  }]
  constructor(private ngZone:NgZone) { }

  changeType(event:any, type:string){
    //console.log(event,type);
    this.type = type;
    this.redrawChart();
  }
  drawChart(){
    this.chart = new Chart({
      chart: {
        type: this.type,
        options3d: this.options3d
      },
      title: {
        text: this.titleText
      },
      subtitle: {
          text: this.subtitleTextHtml
      },
      xAxis: {
          type: this.categoriesType,
          categories: this.categories, //what actually shows on X
          title: {
              text: this.xAxisText
          }
      },
      yAxis: {
          min: 0,
          title: {
              text: this.yAxisText,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                }
            }
        }]
    },
      tooltip: {
          valueSuffix: this.toolTipSuffix
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          },
          column: {
            depth: 25
          },pie: {
            //innerSize: 100,
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
          }
      },
      legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: 0,
          floating: true,
          borderWidth: 1,
          backgroundColor: ('#FFFFFF'),
          shadow: true
      },
      credits: {
        enabled: false
      },
      series: this.series,
      drilldown: this.drilldown
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.chart.ref$.subscribe((chart:any)=>{
      chart.redraw(false);
      //this.drawChart();
    });

  }

  change3D(event:any, param:string){

    this.ngZone.run(()=>{
      this.options3d = {
        enabled: true,
        alpha: this.alpha,
        beta: this.beta,
        depth: this.depth,
        viewDistance: 25
      }  
      this.chart.ref$.subscribe((chart:any)=>{
        chart.options.chart.options3d.enabled = true;
        chart.options.chart.options3d.alpha = this.alpha;
        chart.options.chart.options3d.beta = this.beta;
        chart.options.chart.options3d.depth = this.depth;
        chart.redraw(false);
      });
    })

  }
  redrawChart(){
    this.ngZone.run(()=>{
      this.drawChart();
    })
  }
  ngOnInit() {
    this.titleText = "My chart";
    this.yAxisText = "My Y Axis title";
    this.xAxisText = "My X Axis title";
    this.toolTipSuffix = " AED";
    this.type = "column";
    this.subtitleTextHtml = 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>';
    this.series = [
      {
        name: 'Series 1',
        data: [{
          "name": "Point",
          "y": 62.74,
          "drilldown": "Point"
        }, {
          "name": "Point 2",
          "y": 6.74,
          "drilldown": "Point 2"
        }, {
          "name": "Point 3",
          "y": 56.74,
          "drilldown": "Point 3"
        }, {
          "name": "Point 4",
          "y": 22.74,
          "drilldown": null
        }, {
          "name": "Point 5",
          "y": 72.74,
          "drilldown": "Point 5"
        }, {
          "name": "Point 6",
          "y": 82.74,
          "drilldown": "Point 6"
        }]
      }
    ];
    this.drilldown = {
      series: [
        {
          name: "Point",
          id: "Point",
          data: [
            //x and y axis  
            ["Sub point", 29], ["Sub point 2", 29], ["Sub point 3", 29], ["Sub point 4", 29],          
          ]
        },{
          name: "Point 2",
          id: "Point 2",
          data: [
            //x and y axis  
            ["Sub point", 29], ["Sub point 2", 29], ["Sub point 3", 29], ["Sub point 4", 29],          
          ]
        }
      ]
    }

    this.categories = ['Africa', 'America', 'Asia', 'Antartica', 'Australia', 'Europe'];
    this.drawChart();


  }

}
