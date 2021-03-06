import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
// import { ChartDataSet } from '@rds-common-lib';

export interface ChartDataSetScatter {
  label: string,
  data: Array<number>;
  fill: boolean,
  borderColor: string,
  tension: number,
  backgroundColor: Array<string>;
  borderWidth: number;
}

@Component({
  selector: 'rds-chart-scatter',
  templateUrl: './rds-chart-scatter.component.html',
  styleUrls: ['./rds-chart-scatter.component.scss']
})
export class RdsChartScatterComponent implements OnInit, AfterViewInit {

  static count = 0;
  canvas: any;
  ctx: any;
  //chartId = 'scatterChart' + RdsChartScatterComponent.count;
  @Input() chartId:string='scatterChart0';
  @Input() chartWidth = 400;
  @Input() chartStyle?: any;
  @Input() chartLabels?: any
  @Input() canvasBackgroundColor?: any;
  @Input() ChartDataSets?: ChartDataSetScatter[] | any;
  @Input() chartOptions?: any;
  style: CSSStyleDeclaration | undefined;

  constructor() { }

  ngOnInit(): void {
    this.style = getComputedStyle(document.body);
    this.ChartDataSets[0].backgroundColor[0] = this.style.getPropertyValue('--chartColor1');
    this.ChartDataSets[0].backgroundColor[1] = this.style.getPropertyValue('--chartColor2');
    this.ChartDataSets[0].backgroundColor[2] = this.style.getPropertyValue('--chartColor3');
    this.ChartDataSets[0].backgroundColor[3] = this.style.getPropertyValue('--chartColor4');
    this.ChartDataSets[0].backgroundColor[4] = this.style.getPropertyValue('--chartColor5');
    this.ChartDataSets[0].backgroundColor[5] = this.style.getPropertyValue('--chartColor6');
    this.ChartDataSets[0].backgroundColor[6] = this.style.getPropertyValue('--chartColor7');
    this.ChartDataSets[0].backgroundColor[7] = this.style.getPropertyValue('--chartColor8');
    this.ChartDataSets[0].backgroundColor[8] = this.style.getPropertyValue('--chartColor9');
    this.ChartDataSets[0].backgroundColor[9] = this.style.getPropertyValue('--chartColor10');
  }

  public get classes(): string[] {
    var classes = ['res-width']
    if (this.chartStyle === "Dark") {
      classes.push('dark-mode')
      return classes
    }
    return classes
  }
  ngOnChanges(): void {
    this.scatterChartBrowser();
  }

  ngAfterViewInit(): void {
    this.scatterChartBrowser();
  }

  scatterChartBrowser(): void {
    let chartStatus = Chart.getChart(this.chartId);
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
    this.canvas = document.getElementById(this.chartId);
    if (this.canvas !== null) {
      this.canvas.style.backgroundColor = this.canvasBackgroundColor;
      this.ctx = this.canvas.getContext('2d');
      const areaCanvas = new Chart(this.ctx, {
        type: 'scatter',
        data: {
          labels: this.chartLabels,
          datasets: this.ChartDataSets,
        },
        options: this.chartOptions
      });
    }
  }

}
