import axios from "axios";
import { Group } from "@prisma/client";
import { X_ZOOM_HEADER, X_ZOOM_HEADER_VALUE } from "apps/configurator/decorators/XZoomHeaderGuard";
import { GroupEntity } from "apps/configurator/entities/group";

export namespace GroupRepositoryApi {

  const Request = axios.create({
    baseURL: '/api/group',
    headers: {
      [X_ZOOM_HEADER]: X_ZOOM_HEADER_VALUE,
      'Content-Type': 'application/json'
    }
  });

  export const update = async(payload: Pick<Group, 'id' | 'name' | 'description'>): Promise<Group> => {
    const body = new GroupEntity.Update();

    if (payload.name) {
      body.name = payload.name;
    }

    if (payload.description !== null) {
      body.description = payload.description;
    }

    return await (await Request.patch(`/${payload.id}`, JSON.stringify(body))).data;
  }

}