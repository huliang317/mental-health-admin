<template>
  <div class="charts-wrapper">
    <!-- 图表1：情绪趋势 -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📈 情绪趋势</span>
          <span class="card-subtitle">近30天情绪变化</span>
        </div>
      </template>
      <div ref="chartRef1" class="chart-container"></div>
    </el-card>

    <!-- 图表2：咨询活动统计 -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📊 咨询活动统计</span>
          <div class="stats-tags">
            <span class="stat-tag">
              <span class="stat-label">总会话</span>
              <span class="stat-number">{{ consultationStats?.totalSessions || 0 }}</span>
            </span>
            <span class="stat-tag">
              <span class="stat-label">平均时长</span>
              <span class="stat-number">{{ Math.round(consultationStats?.avgDurationMinutes || 0) }}分钟</span>
            </span>
            <span class="stat-tag">
              <span class="stat-label">活跃用户</span>
              <span class="stat-number">{{ consultationStats?.activeUsers || 0 }}</span>
            </span>
          </div>
        </div>
      </template>
      <div ref="chartRef2" class="chart-container"></div>
    </el-card>

    <!-- 图表3：用户活跃趋势 -->
    <el-card class="chart-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">👥 用户活跃趋势</span>
          <span class="card-subtitle">近30天用户行为</span>
        </div>
      </template>
      <div ref="chartRef3" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({
  name: 'Card1'
})

const props = defineProps(['emotionTrend', 'consultationStats', 'userActivity'])

// 情绪趋势
const emotionTrendData = props.emotionTrend || []
const emotionx = emotionTrendData.map((item: any) => item.date)
const emotiony = emotionTrendData.map((item: any) => item.avgMoodScore || 0)

// 咨询统计
const dailyTrend = props.consultationStats?.dailyTrend || []
const consultationx = dailyTrend.map((item: any) => item.date)
const consultationy1 = dailyTrend.map((item: any) => item.sessionCount || 0)
const consultationy2 = dailyTrend.map((item: any) => item.userCount || 0)

// 用户活跃
const userActivityData = props.userActivity || []
const userActivityx = userActivityData.map((item: any) => item.date)
const userActivity1 = userActivityData.map((item: any) => item.activeUsers || 0)
const userActivity2 = userActivityData.map((item: any) => item.newUsers || 0)
const userActivity3 = userActivityData.map((item: any) => item.diaryUsers || 0)
const userActivity4 = userActivityData.map((item: any) => item.consultationUsers || 0)

const chartRef1 = ref(null)
const chartRef2 = ref(null)
const chartRef3 = ref(null)

let chartInstance1: any = null
let chartInstance2: any = null
let chartInstance3: any = null

// 公共颜色
const colors = {
  blue: '#409EFF',
  green: '#67C23A',
  orange: '#E6A23C',
  red: '#F56C6C',
  purple: '#9B59B6',
  cyan: '#00BCD4'
}

onMounted(() => {
  chartInstance1 = echarts.init(chartRef1.value)
  chartInstance2 = echarts.init(chartRef2.value)
  chartInstance3 = echarts.init(chartRef3.value)

  // 图表1：情绪趋势
  chartInstance1.setOption({
    legend: {
      data: ['平均情绪分'],
      top: 0,
      right: 0,
      textStyle: { fontSize: 12 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const p = params[0]
        return `<strong>${p.axisValue}</strong><br/>平均情绪分：<strong>${p.value}</strong>`
      }
    },
    grid: { left: '3%', right: '4%', bottom: '8%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: emotionx,
      axisLabel: { fontSize: 11, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '情绪分',
      min: 0,
      max: 10,
      splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } }
    },
    series: [{
      type: 'line',
      data: emotiony,
      name: '平均情绪分',
      smooth: true,
      lineStyle: { color: colors.purple, width: 3 },
      itemStyle: { color: colors.purple },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(155, 89, 182, 0.3)' },
          { offset: 1, color: 'rgba(155, 89, 182, 0)' }
        ])
      }
    }]
  })

  // 图表2：咨询活动统计
  chartInstance2.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        let html = `<strong>${params[0].axisValue}</strong><br/>`
        params.forEach((p: any) => {
          html += `${p.marker} ${p.seriesName}：<strong>${p.value}</strong><br/>`
        })
        return html
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 0,
      right: 0,
      textStyle: { fontSize: 12 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: consultationx,
      axisLabel: { fontSize: 11, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '数量',
      splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } }
    },
    series: [
      {
        name: '会话数量',
        type: 'line',
        smooth: true,
        data: consultationy1,
        lineStyle: { color: colors.blue, width: 2.5 },
        itemStyle: { color: colors.blue },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.25)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0)' }
          ])
        }
      },
      {
        name: '参与用户数',
        type: 'line',
        smooth: true,
        data: consultationy2,
        lineStyle: { color: colors.green, width: 2.5 },
        itemStyle: { color: colors.green },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.25)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0)' }
          ])
        }
      }
    ]
  })

  // 图表3：用户活跃趋势
  chartInstance3.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        let html = `<strong>${params[0].axisValue}</strong><br/>`
        params.forEach((p: any) => {
          html += `${p.marker} ${p.seriesName}：<strong>${p.value}</strong><br/>`
        })
        return html
      }
    },
    legend: {
      data: ['活跃用户数', '新增用户数', '写日记的用户数', '咨询的用户数'],
      top: 0,
      right: 0,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: userActivityx,
      axisLabel: { fontSize: 11, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '用户数',
      splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } }
    },
    series: [
      {
        type: 'line',
        data: userActivity1,
        smooth: true,
        name: '活跃用户数',
        lineStyle: { color: colors.blue, width: 2.5 },
        itemStyle: { color: colors.blue }
      },
      {
        type: 'line',
        data: userActivity2,
        smooth: true,
        name: '新增用户数',
        lineStyle: { color: colors.green, width: 2.5 },
        itemStyle: { color: colors.green }
      },
      {
        type: 'line',
        data: userActivity3,
        smooth: true,
        name: '写日记的用户数',
        lineStyle: { color: colors.orange, width: 2.5 },
        itemStyle: { color: colors.orange }
      },
      {
        type: 'line',
        data: userActivity4,
        smooth: true,
        name: '咨询的用户数',
        lineStyle: { color: colors.red, width: 2.5 },
        itemStyle: { color: colors.red }
      }
    ]
  })

  window.addEventListener('resize', () => {
    chartInstance1?.resize()
    chartInstance2?.resize()
    chartInstance3?.resize()
  })
})

onBeforeUnmount(() => {
  const instances = [chartInstance1, chartInstance2, chartInstance3]
  instances.forEach(instance => {
    if (instance && !instance.isDisposed()) {
      instance.dispose()
    }
  })
})
</script>

<style scoped>
.charts-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0;
  overflow: hidden;
}

.chart-card {
  border-radius: 12px;
  overflow: hidden;
  min-width: 0;
}

.chart-card :deep(.el-card__header) {
  padding: 12px 14px;
  border-bottom: 1px solid #f0f2f5;
  background: #fafbfc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-subtitle {
  font-size: 13px;
  color: #909399;
}

.stats-tags {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f7fa;
  padding: 4px 14px;
  border-radius: 20px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-number {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
}

.chart-container {
  width: 100%;
  height: 320px;
  padding: 8px 0 4px 0;
  overflow: hidden;
}
</style>