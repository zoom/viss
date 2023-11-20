import { Value } from "@prisma/client";
import { X_ZOOM_HEADER, X_ZOOM_HEADER_VALUE } from "apps/configurator/decorators/XZoomHeaderGuard";
import { ValueEntity } from "apps/configurator/entities/value";
import axios from "axios";

export namespace ValueRepositoryApi {

  const Request = axios.create({
    baseURL: '/api/value',
    headers: {
      [X_ZOOM_HEADER]: X_ZOOM_HEADER_VALUE,
      'Content-Type': 'application/json'
    }
  });

  export const create = async(payload: Pick<Value, 'key' | 'name' | 'weight' | 'metricId'>) => {
    const { key, name, weight, metricId } = payload;

    const body = new ValueEntity.Create();

    body.key = key.toUpperCase();
    body.name = name;
    body.weight = weight;
    body.metricId = metricId;

    return await (await Request.post('/', JSON.stringify(body))).data;
  }

  export const getHistory = async(payload: Pick<Value, 'id'>) => {
    const { id } = payload;

    return await (await Request.get(`/${id}/history`)).data;
  }

  export const updateBulk = async(payload: Array<Pick<Value, 'id' | 'metricId' | 'key' | 'weight' | 'name' | 'deleted'>>) => {
    const body = new ValueEntity.UpdateBulk();

    body.values = payload.map(value => ({
      id: value.id,
      key: value.key,
      name: value.name,
      metricId: value.metricId,
      weight: value.weight,
      deleted: value.deleted
    }));

    return await (await Request.patch(`/`, JSON.stringify(body))).data;
  }

}