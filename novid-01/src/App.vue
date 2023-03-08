<template>
  <div :style="{background:`url(${bg})`}" class="box">
    <div style="color:white" class="box-left">
      <div class="box-left-card">
        <section>
        <div>较上日 + {{store.chinaAdd.localConfirmH5}}</div>
        <div>{{ store.chinaTotal.localConfirm}}</div>
        <div>本土现有确诊</div>
      </section>
      <section>
        <div>较上日 + {{store.chinaAdd.nowConfirm}}</div>
        <div>{{ store.chinaTotal.nowConfirm}}</div>
        <div>累计确诊</div>
      </section> 
      <section>
        <div>较上日 + {{store.chinaAdd.Confirm}}</div>
        <div>{{ store.chinaTotal.confirm}}</div>
        <div>累计确诊</div>
      </section> 
      <section>
        <div>较上日 + {{store.chinaAdd.noInfect}}</div>
        <div>{{ store.chinaTotal.noInfect}}</div>
        <div>无症状感染者</div>
      </section> 
      <section>
        <div>较上日 + {{store.chinaAdd.importedCase}}</div>
        <div>{{ store.chinaTotal.importedCase}}</div>
        <div>境外输入</div>
      </section> 
      <section>
        <div>较上日 + {{store.chinaAdd.dead}}</div>
        <div>{{ store.chinaTotal.dead}}</div>
        <div>累计死亡</div>
      </section> 
      </div>
      <div class="box-left-pie"></div>
    </div>
    <div id="china" class="box-center">
    </div>
    <div style="color:white" class="box-right">
      <table class="table" border="1" cellspacing="0">
        <thead>
          <tr>
            <th>地区</th>
            <th>新增确诊</th>
            <th>累计确诊</th>
            <th>治愈</th>
            <th>死亡</th>
          </tr>
        </thead>
        <transition-group enter-active-class="animate__animated animate__bounce" tag="tbody">
          <tr v-for="item in store.item" :key="item.name">
            <td align="center">{{item.name}}</td>
            <td align="center">{{item.today.confirm}}</td>
            <td align="center">{{item.total.confirm}}</td>
            <td align="center">{{item.total.heal}}</td>
            <td align="center">{{item.total.dead}}</td>
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import bg from './assets/back.jpg'
  import { useStore } from './stores'
  import { onMounted } from 'vue'
  import * as echarts from 'echarts'
  import './assets/china'
  import {geoCoordMap} from './assets/geoMap'
  import 'animate.css'

  const store = useStore()
  store.getList()


  onMounted(async()=>{
    await store.getList()
    initCharts()
    initPie()
  })

  const initCharts = () => {
    const city = store.list.diseaseh5Shelf.areaTree[0].children;
    store.item = city[14].children
    console.log(city);
    
    const data = city.map(v => {
    return {
      name: v.name,
      value: geoCoordMap[v.name].concat(v.total.nowConfirm),
      children: v.children
    }
  })
    
    const charts = echarts.init(document.querySelector('#china') as HTMLElement)


    charts.setOption({
        geo: {
          map: "china",
          aspectScale: 0.8,
          layoutCenter: ["50%", "50%"],
          layoutSize: "100%",
          itemStyle: {
            // normal: {
              areaColor: {
                type: "linear-gradient",
                x: 0,
                y: 1200,
                x2: 1000,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#152E6E", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#0673AD", // 50% 处的颜色
                  },
                ],
                global: true, // 缺省为 false
              },
              shadowColor: "#0f5d9d",
              shadowOffsetX: 0,
              shadowOffsetY: 15,
              opacity: 0.5,
            // },
           
          },
          emphasis: {
              areaColor: "#0f5d9d",
            },

          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                areaColor: "rgba(0, 10, 52, 1)",
                borderColor: "rgba(0, 10, 52, 1)",
                // normal: {
                  opacity: 0,
                  label: {
                    show: false,
                    color: "#009cc9",
                  },
                // },
              },
              label: {
                show: false,
                color: "#FFFFFF",
                fontSize: 12,
              },
            },
          ],
        },
        series: [
          {
            type: "map",
            map: "china",
            aspectScale: 0.8,
            layoutCenter: ["50%", "50%"], //地图位置
            layoutSize: "100%",
            zoom: 1, //当前视角的缩放比例
            // roam: true, //是否开启平游或缩放
            scaleLimit: {
              //滚轮缩放的极限控制
              min: 1,
              max: 2,
            },
            label: {
              show: true,
              color: "#FFFFFF",
              fontSize: 10,
            },
            itemStyle: {
              // normal: {
                areaColor: "#0c3653",
                borderColor: "#1cccff",
                borderWidth: 1.8,
              // },
            
            },
            emphasis: {
                areaColor: "#56b1da",
                label: {
                  show: true,
                  color: "#fff",
                },
              },
            data: data,
          },
          {
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: 'pin',
              symbolSize:[40,40],
              label: {
                      show: true,
                      formatter(value: any) {
            return value.data.value[2]
          }
              },
              itemStyle: {
                  // normal: {
                      color: '#D8BC37', //标志颜色
                  // }
              },
              data: data,
          },
        ],
      })
      charts.on('click',(e:any) => {
        // console.log(e);
        store.item = e.data.children
      })
  }

  const initPie = () => {
    const charts = echarts.init(document.querySelector('.box-left-pie') as HTMLElement)
    charts.setOption({
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '15',
        }
      },
      data:store.cityDetail.map(v=> {
        return {
          name:v.city,
          value:v.nowConfirm
        }
      })
    }
  ]
    })
    
  }
</script>

<style lang="less">
*{
  padding: 0;
  margin: 0;
}
.table{
  width: 100%;
  background: #212028;
  tr {
    th {
      padding: 5px;
      white-space: nowrap;
    }
    td {
      padding: 5px 10px;
      width: 100px;
      white-space: nowrap;
    }
  }
}
html,body,#app{
  height: 100%;
}
.box{
  height: 100%;
  display: flex;
  &-left{
    width: 400px;
    &-pie{
      height: 350px;
      margin-top: 20px;
    }
    &-card{
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto;
      section{
        background: skyblue;
        opacity: .8;
        border: 1px solid #ccc;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        div:nth-child(2){
          color: aqua;
          padding: 10px 0;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
  &-center{
    flex: 1;
  }
  &-right{
    width: 400px;
  }
}
</style>
