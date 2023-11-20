import { useEffect, useState } from "react"
import { ValueHistoryChartProps } from "../components/ValueHistoryChart"
import { ValueRepositoryApi } from "apps/configurator/api/repository/value"

const initialState: {
  labels: string[],
  data: number[]
} = {
  labels: [],
  data: []
}

type HistoryData = {
  id: string,
  valueId: string,
  weight: number,
  createdAt: string
}

export const useValueHistoryChart = ({ value, reload }: ValueHistoryChartProps) => {

  const [state, setState] = useState({
    ...initialState
  });

  useEffect(() => {
    if (reload) {
      ValueRepositoryApi
        .getHistory({ id: value.id })
        .then((data: HistoryData[]) => {
          setState({
            labels: data.map(entry => new Date(entry.createdAt).toLocaleDateString()),
            data: data.map(entry => entry.weight)
          })
        });
    }
  }, [reload]);

  return {
    value,
    labels: state.labels,
    data: state.data
  }
}