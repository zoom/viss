import axios from "axios";
import { X_ZOOM_HEADER, X_ZOOM_HEADER_VALUE } from "../../decorators/XZoomHeaderGuard";
import { ConfigurationEntity } from "../../entities/configuration";

export namespace ConfigurationRepositoryApi {
  
  const Request = axios.create({
    baseURL: '/api/configuration',
    headers: {
      [X_ZOOM_HEADER]: X_ZOOM_HEADER_VALUE,
      'Content-Type': 'application/json'
    }
  });

  export const rename = async (payload: { id: string, name: string }) => {
    const { id, name } = payload;
    const body = new ConfigurationEntity.Update();

    body.name = name;

    return await (await Request.patch(`/${id}`, JSON.stringify(body))).data;
  }

  export const remove = async (payload: { id: string }) => {
    const { id } = payload;
    
    return await (await Request.delete(`/${id}`)).data;
  }

  export const restore = async (payload: { id: string }) => {
    const { id } = payload;
    const body = new ConfigurationEntity.Restore();

    body.id = id;

    return await (await Request.patch('/restore', JSON.stringify(body))).data;
  }

  export const assignVersion = async (payload: { id: string }) => {
    const { id } = payload;

    return await (await Request.put(`/${id}/version`)).data;
  }

  export const setActive = async (payload: { id: string }) => {
    const { id } = payload;
    const body = new ConfigurationEntity.SetActive();

    body.id = id;

    return await (await Request.patch(`/active`, JSON.stringify(body))).data;
  }

  export const createNew = async (payload: { name: string }) => {
    const { name } = payload;
    const body = new ConfigurationEntity.New();

    body.name = name;

    return await (await Request.post('/new', JSON.stringify(body))).data;
  }

  export const duplicate = async (payload: { id: string, name: string }) => {
    const { id, name } = payload;
    const body = new ConfigurationEntity.Duplicate();

    body.id = id;
    body.name = name;

    return await (await Request.post('/duplicate', JSON.stringify(body))).data;
  }

}