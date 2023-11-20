import { Prisma } from '@prisma/client';
import { database } from '@viss/db';
import { XZoomHeaderGuard } from 'apps/configurator/decorators/XZoomHeaderGuard';
import { GroupEntity } from 'apps/configurator/entities/group';
import { StatusCodes } from 'http-status-codes';
import {
  Body,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  ValidationPipe,
  createHandler,
} from 'next-api-decorators';

class GroupHandler {

  @Patch('/:id')
  @XZoomHeaderGuard()
  @HttpCode(StatusCodes.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) body: GroupEntity.Update
  ) {
    const groupUpdate: Prisma.GroupUpdateInput = {};

    const group = await database.group.findUnique({
      where: {
        id: id
      }
    });

    if (!group) {
      throw new NotFoundException(`Cannot find group ${id}`)
    }

    if (body.name) {
      groupUpdate.name = body.name;
    }

    if (body.description !== null) {
      groupUpdate.description = body.description;
    }

    const updatedGroup = await database.group.update({
      data: groupUpdate,
      where: {
        id: id
      }
    });
    
    if (!updatedGroup) {
      throw new InternalServerErrorException(`Error while updating group details`);
    }

    return updatedGroup;
  }
  
}

export default createHandler(GroupHandler);