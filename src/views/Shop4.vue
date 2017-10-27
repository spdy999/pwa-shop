<template>
  <div>
    <mu-card>
      <table border="0" width="100%">
        <tr valign="top">
          <td class="thumb">
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
          text: 'Referral Coupon / Redeem Coupon'
        },
        xAxis: {
          categories: ['D-5', 'D-4', 'D-3', 'D-2', 'Yesterday', 'Today']
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

        yAxis: [{ // Primary yAxis
          labels: {
            style: {
              color: 'black'
            }
          },
          title: {
            text: 'Transactions',
            style: {
              color: 'black'
            }
          }
        }, { // Secondary yAxis
          max: 100,
          labels: {
            format: '{value} %',
            style: {
              color: 'black'
            }
          },
          title: {
            text: 'Referral Rate (%)',
            style: {
              color: 'black'
            }
          },
          opposite: true
        }],

        series: [{
          name: 'Coupon-10%',
          data: [2, 5, 6, 2, 1, 2],
          stack: 'Referral',
          color: '#FF99CC'
        }, {
          name: 'Coupon-20%',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'Referral',
          color: '#CC6699'
        }, {
          name: 'Coupon-30%',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'Referral',
          color: '#993366'
        }, {
          name: 'Coupon-40%',
          data: [2, 5, 6, 2, 1, 1],
          stack: 'Referral',
          color: '#660033'
        }, {
          name: 'Redeem-10%',
          data: [2, 5, 6, 2, 1, 2],
          stack: 'Success',
          color: '#99FF99'
        }, {
          name: 'Redeem-20%',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'Success',
          color: '#66CC66'
        }, {
          name: 'Redeem-30%',
          data: [2, 5, 6, 2, 1, 0],
          stack: 'Success',
          color: '#339933'
        }, {
          name: 'Redeem-40%',
          data: [2, 5, 6, 2, 1, 1],
          stack: 'Success',
          color: '#006600'
        }, {
          type: 'line',
          yAxis: 1,
          name: 'Referral Rate',
          data: [10, 20, 30, 40, 50, 60],
          marker: {
            lineWidth: 3,
            lineColor: 'black',
            fillColor: 'white',
            color: 'black'
          }
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
.thumb {
  width: 180px;
}
.thumb img {
  width: 180px;
}
</style>
