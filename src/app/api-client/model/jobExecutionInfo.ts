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
import { JobExecutionResult } from './jobExecutionResult';
import { ProductType } from './productType';


export interface JobExecutionInfo { 
    startDate: string;
    endDate: string;
    executionStartDate: string;
    id: string;
    outputPath?: string | null;
    result?: JobExecutionResult | null;
    executionEndDate?: string | null;
    userId: string;
    productType: ProductType;
    jobId: string;
    callbackUrl: string | null;
    rerun?: boolean;
}
export namespace JobExecutionInfo {
}


