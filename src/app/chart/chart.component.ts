import { Component, OnInit, Input, ViewEncapsulation,NgZone } from '@angular/core';
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
  @Input() subtitleTextHtml:string;
  @Input() yAxisText:string;
  @Input() xAxisText:string;
  @Input() type:string = "line";
  @Input() toolTipSuffix:string;
  @Input() categories:Array<string>
  @Input() options3d:{} = null;
  @Input() headercolor:string = "red";

  @Input() set setSeries(value:string) {
    this.series = JSON.parse(value);
  }
  chartTypes:Array<any> = [{
    name: "line"
  },{
    name: "area"
  },{
    name: "bar"
  },{
    name: "column"
  },{
    name: "cylinder"
  }]
  constructor(private ngZone:NgZone) { }

  changeType(event:any, type:string){
    console.log(event,type);
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
      tooltip: {
          valueSuffix: this.toolTipSuffix
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: ('#FFFFFF'),
          shadow: true
      },
      credits: {
        enabled: false
      },
      series: this.series
    })
  }

  change3D(event, param){

    this.ngZone.run(()=>{
      this.options3d = {
        enabled: true,
        alpha: this.alpha,
        beta: this.beta,
        depth: this.depth,
        viewDistance: 25
      }  

      this.drawChart();
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
        name: 'Series name',
        data: [10000000, 27890000, 3656577, 3656577, 5000000, 45000]
      },{
        name: 'Series name',
        data: [100000, 2790000, 356577, 3656577, 500000, 45000]
      }
    ];
    this.options3d = {
        enabled: false,
        alpha: this.alpha,
        beta: this.beta,
        depth: this.depth,
        viewDistance: 25
    }
    this.categories = ['Africa', 'America', 'Asia', 'Antartica', 'Australia', 'Europe'];
    this.drawChart();

    this.chart.ref$.subscribe(()=>{

    });
  }

}
