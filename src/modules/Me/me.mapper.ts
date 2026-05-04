import { customer } from '../../generated/prisma/client';
import { MeUpdType } from './me.schema';

export function meUpdDtoOut(customer: customer) {
  return {
    firstName: customer.first_name,
    lastName: customer.last_name,
    company: customer.company,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    country: customer.country,
    postalCode: customer.postal_code,
    phone: customer.phone,
    fax: customer.fax,
  };
}
export function meUpdDtoIn(dto: MeUpdType) {
  return {
    first_name: dto.firstName,
    last_name: dto.lastName,
    company: dto.company,
    address: dto.address,
    city: dto.city,
    state: dto.state,
    country: dto.country,
    postal_code: dto.postalCode,
    phone: dto.phone,
    fax: dto.fax,
  };
}
