import { X_ZOOM_HEADER, X_ZOOM_HEADER_VALUE } from "apps/configurator/decorators/XZoomHeaderGuard";
import { MetricEntity } from "apps/configurator/entities/metric";
import axios from "axios";

export namespace MetricRepositoryApi {

  const Request = axios.create({
    baseURL: '/api/metric',
    headers: {
      [X_ZOOM_HEADER]: X_ZOOM_HEADER_VALUE,
      'Content-Type': 'application/json'
    }
  });
  
  export const rename = async (payload: { id: string, name: string }) => {
    const body = new MetricEntity.Update()

    body.name = payload.name;

    return await (await Request.patch(`/${payload.id}`, JSON.stringify(body))).data;
  }

}