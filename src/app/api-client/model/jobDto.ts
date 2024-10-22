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
import { JobStatus } from './jobStatus';
import { Priority } from './priority';
import { ProductSubType } from './productSubType';
import { ProductType } from './productType';
import { Aoi1 } from './aoi1';
import { JobExecutionInfo } from './jobExecutionInfo';


export interface JobDto { 
    startDate?: string | null;
    endDate?: string | null;
    outputEnvironment?: string | null;
    transferType?: string | null;
    transferCredentials?:  | null;
    priority?: Priority | null;
    callbackUrl?: string | null;
    name?: string | null;
    aoi: Aoi1;
    productType: ProductType;
    id: string;
    status: JobStatus;
    userId: string;
    rerunPending: boolean;
    subtype: ProductSubType;
    executions: Array<JobExecutionInfo>;
}
export namespace JobDto {
}


