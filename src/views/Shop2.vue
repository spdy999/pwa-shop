<template>
  <div>
    <mu-card>
      <table border="0" width="100%">
        <tr valign="top">
          <td class="thumb" align="center">
            In-store Cam<br />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
          </td>
          <td width="100%">
            <highcharts :options="senseChartOption" ref="senseChart"></highcharts>
          </td>
        </tr>
      </table>
    </mu-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      senseChartOption: {
        chart: {
          type: 'column'
        },

        title: {
          text: 'In-store Traffic by Demographics'
        },

        xAxis: {
          categories: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now']
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Number of leads'
          }
        },

        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y + '<br/>' +
              'Total: ' + this.point.stackTotal;
          }
        },

        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },

        series: [{
          name: 'M18-24',
          data: [5, 3, 4, 7, 2, 3],
          stack: 'male',
          color: '#99CCFF'
        }, {
          name: 'M25-34',
          data: [3, 4, 4, 2, 5, 0],
          stack: 'male',
          color: '#6699CC'
        }, {
          name: 'M35-44',
          data: [3, 4, 4, 2, 5, 1],
          stack: 'male',
          color: '#336699'
        }, {
          name: 'M45+',
          data: [3, 4, 4, 2, 5, 1],
          stack: 'male',
          color: '#003366'
        }, {
          name: 'F18-24',
          data: [2, 5, 6, 2, 1, 2],
          stack: 'female',
          color: '#FF99CC'
        }, {
          name: 'F25-34',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'female',
          color: '#CC6699'
        }, {
          name: 'F35-44',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'female',
          color: '#993366'
        }, {
          name: 'F45+',
          data: [2, 5, 6, 2, 1, 1],
          stack: 'female',
          color: '#660033'
        }]
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style scoped>
.thumb { width:180px; }
.thumb img { width:180px }
</style>
