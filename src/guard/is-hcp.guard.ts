import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { response } from 'express';
import { ContextIdFactory } from '@nestjs/core';

@Injectable()
export class HcpGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToHttp().getRequest().body.hcpToken;
    const url =
      'https://microservice-develop.mytomorrows.com/v1.1.0/api/get_user';
    try {
      const response = await this.httpService.axiosRef.post(url, { token });
      var fullName = `${response.data.details.FirstName} ${response.data.details.LastName}`
      var contactType = response.data.details.ContactType
      context.switchToHttp().getRequest().body.fullName = fullName;
      context.switchToHttp().getRequest().body.hcpId = contactType;
    } catch (err) {
      throw new BadRequestException('Unauthorized');
    }
    return true;
  }
}
