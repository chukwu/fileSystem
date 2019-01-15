import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation,NgZone, ViewChild, ElementRef } from '@angular/core';
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
  @Input() titleText:string;
  @Input() subtitleTextHtml:string;
  @Input() yAxisText:string;
  @Input() xAxisText:string;
  @Input() type:string = "line";
  @Input() toolTipSuffix:string;
  @Input() categories:Array<string>
  @Input() options3d:{} = null;

  @Input() set setSeries(value:string) {
    this.series = JSON.parse(value);
  }
  constructor() { }

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
  ngOnInit() {
    this.titleText = "My chart";
    this.yAxisText = "My Y Axis title";
    this.xAxisText = "My X Axis title";
    this.toolTipSuffix = " AED";
    this.type = "column";
    this.subtitleTextHtml = 'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>';
    this.series = [
      {
        name: 'Line 1',
        data: [1, 2, 3]
      }
    ];
    this.options3d = {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25
    }
    this.categories = ['Africa', 'America', 'Asia'];
    this.drawChart();
  }

}
