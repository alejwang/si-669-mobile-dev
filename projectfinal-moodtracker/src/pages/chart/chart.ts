import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Entry, Mood } from '../../models/models';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service'


@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})

export class ChartPage {


 @ViewChild('barChart') barChart;
 @ViewChild('doughnutChart') doughnutChart;

 private entries: Entry[];
 public barChartEl: any;
 public doughnutEL: any;

 public chartLabels: any = [];
 public chartTips: any = [];
 public chartValues: any = [];
 public chartColours: any = [];
 public chartHoverColours: any = [];
 public chartLoadingEl: any;
 private happyCount: number;
 private angryCount: number;
 private sadCount: number;
 private okayCount: number;


constructor(public navCtrl: NavController,
            public navParams: NavParams,
            private entryService: EntryDataServiceProvider) {

    this.entryService.getObservable().subscribe(
      (update) => {
          this.entries = this.entryService.getEntries();
          // this.defineChartData();
          // this.createBarChart();
          // this.createDoughnutChart();


         //  console.log(this.entries);
      //   console.log('this.entryService.getObservable().subscribe ');
      },
      (err) => {
      //   console.log('this.entryService.getObservable().subscribe :', err);
      });
    this.entries = this.entryService.getEntries();

    this.happyCount = this.entryService.moodCount("happy");
    this.angryCount = this.entryService.moodCount("angry");
    this.sadCount = this.entryService.moodCount("sad");
    this.okayCount = this.entryService.moodCount("okay");

  }

  ionViewDidLoad()
  {
     this.defineChartData();
     this.createBarChart();
     this.createDoughnutChart();
  }


  private formatLabel(str, maxwidth){
   var sections = [];
   var words = str.split(" ");
   var temp = "";

   words.forEach(function(item, index){
       if(temp.length > 0)
       {
           var concat = temp + ' ' + item;

           if(concat.length > maxwidth){
               sections.push(temp);
               temp = "";
           }
           else{
               if(index == (words.length-1))
               {
                   sections.push(concat);
                   return;
               }
               else{
                   temp = concat;
                   return;
               }
           }
       }

       if(index == (words.length-1))
       {
           sections.push(item);
           return;
       }

       if(item.length < maxwidth) {
           temp = item;
       }
       else {
           sections.push(item);
       }

   });

   return sections;
}

/**
    * Parse the JSON data, push specific keys into selected arrays for use with
    * each chart
    */
   defineChartData() : void
   {
      let k : any;
      for(k in this.entries)
      {
         var entry = this.entries[k];
         let thisMood = entry.mood;
         console.log("retrieved mood:", thisMood);
         var formattedLabel = this.formatLabel(entry.location, 15);
         // this.chartTips.push(thisMood.type);
         this.chartLabels.push(formattedLabel);
         this.chartValues.push(thisMood.score);
         this.chartColours.push(thisMood.color);
         this.chartHoverColours.push(thisMood.hover);
      }

   }



   /**
    * Configure the Bar chart, define configuration options
    */
   createBarChart() : void
   {
      console.log("start...")
    this.barChartEl= new Chart(this.barChart.nativeElement,
      {
         type: 'horizontalBar',
         data: {
            labels: this.chartLabels,
            datasets: [{
               label: 'Mood Score',
               data: this.chartValues,
               duration: 2000,
               easing: 'easeInQuart',
               backgroundColor: this.chartColours,
               hoverBackgroundColor: this.chartHoverColours
            }]
         },
         options : {
            maintainAspectRatio: false,
            legend         : {
               display     : false,
               // boxWidth    : 80,
               // fontSize    : 15,
               // padding     : 0
            },
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero:true,
                     stepSize: 20,
                     max : 100
                  }
               }],
               xAxes: [{
                  ticks: {
                     autoSkip: true,
                     fontSize: 8,
                  }
               }]
            }
         }
      });
      // console.log("safe!")

   }



   createDoughnutChart(): void{
      this.doughnutEL = new Chart(this.doughnutChart.nativeElement,
         {
         type: 'doughnut',
         data: {
           labels: [ 'Happy', 'Angry', 'Sad', 'Okay' ],
           datasets: [
             {
               data: [this.happyCount, this.angryCount, this.sadCount, this.okayCount],
               backgroundColor: [
                 '#F0CF75',
                 '#E6646E',
                 '#6DBEFF',
                 '#F09C4F'
               ],
             },
           ]
         },
         options : {
            borderWidth: 0,
            legend         : {
               display     : false,
               // boxWidth    : 80,
               // fontSize    : 15,
               // padding     : 0
            },
       }
      });
   }



   // private moodCount(moodtype:string) {
   //    let k : any;
   //    for(k in this.entries)
   //    {
   //       var entry = this.entries[k];
   //       var mood = moodtype;
   //       var count = this.entries.filter((obj) => obj.mood === mood).length;
   //    }
   //    return count;

   // }


   // private meanScore() {
   //    var sameLoc = [],
   //    sum = 0;

   //    let k : any;
   //    for(k in this.entries)
   //    {
   //       var entry = this.entries[k];
   //       let thisMood = entry.mood;
   //       if (entry.location in sameLoc == true ){
   //          sameLoc.push(entry);
   //       }
   //       for (var i=0; i < sameLoc.length; i++){
   //          sum += thisMood.score;
   //       }
   //       return sum/sameLoc.length
   //    }}




}

