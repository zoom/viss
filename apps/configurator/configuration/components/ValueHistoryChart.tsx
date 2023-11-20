import { 
  CategoryScale, 
  LinearScale, 
  Chart, 
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, 
} from "chart.js";
import annotationPlugin, { AnnotationOptions } from "chartjs-plugin-annotation";
import { ValueWithHistoryCountAndSavedProps } from "@viss/db";
import { Line } from "react-chartjs-2";
import { useValueHistoryChart } from "../hooks/useValueHistoryChart";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

function average(ctx) {
  const values = ctx.chart.data.datasets[0].data;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const averageAnnotation: AnnotationOptions = {
  type: 'line',
  borderColor: 'rgb(204, 130, 127)',
  borderDash: [6, 6],
  borderDashOffset: 0,
  borderWidth: 3,
  label: {
    display: true,
    backgroundColor: 'rgb(204, 130, 127)',
    content: (ctx) => 'Average: ' + average(ctx).toFixed(3),
    position: 'start'
  },
  scaleID: 'y',
  value: (ctx) => average(ctx)
}

export interface ValueHistoryChartProps {
  value: ValueWithHistoryCountAndSavedProps
  reload: boolean
}

function ValueHistoryChart({ value, labels, data }: ReturnType<typeof useValueHistoryChart>) {
  return (
    <Line 
      options={{
        plugins: {
          legend: {
            display: false
          },
          annotation: {
            annotations: {
              averageAnnotation
            }
          }
        }
      }}
      data={{
        labels: labels.concat('Current'),
        datasets: [{
          borderColor: 'rgb(100,149,237)',
          data: data.concat(value.weight)
        }] 
      }}
    />
  )
}

export default (props: ValueHistoryChartProps) => <ValueHistoryChart { ...useValueHistoryChart(props) } />;