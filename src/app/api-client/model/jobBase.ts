/**
 * Soil Moisture API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.3
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Priority } from './priority';
import { ProductType } from './productType';
import { Aoi } from './aoi';


export interface JobBase { 
    startDate?: string | null;
    endDate?: string | null;
    outputEnvironment?: string | null;
    transferType?: string | null;
    transferCredentials?:  | null;
    priority?: Priority | null;
    callbackUrl?: string | null;
    name?: string | null;
    aoi: Aoi;
    productType: ProductType;
}
export namespace JobBase {
}


