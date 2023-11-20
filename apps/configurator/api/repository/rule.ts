import { Rule } from "@prisma/client";
import { X_ZOOM_HEADER, X_ZOOM_HEADER_VALUE } from "apps/configurator/decorators/XZoomHeaderGuard";
import { RuleEntity } from "apps/configurator/entities/rule";
import axios from "axios";

export namespace RuleRepositoryApi {

  const Request = axios.create({
    baseURL: '/api/rule',
    headers: {
      [X_ZOOM_HEADER]: X_ZOOM_HEADER_VALUE,
      'Content-Type': 'application/json'
    }
  });

  export const create = async(payload: Pick<Rule, 'metricId' | 'activationMetricId' | 'activationValueId'>) => {
    const body = new RuleEntity.Create();

    body.metricId = payload.metricId;
    body.activationMetricId = payload.activationMetricId;
    body.activationValueId = payload.activationValueId;

    return await (await Request.put('', JSON.stringify(body))).data;
  }

  export const remove = async(payload: Pick<Rule, 'id'>) => {
    const { id } = payload;

    return await (await Request.delete(`/${id}`)).data;
  }

}