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
import { Bbox } from './bbox';
import { CoordinatesInner } from './coordinatesInner';


/**
 * MultiPoint Model
 */
export interface MultiPoint { 
    bbox?: Bbox | null;
    type: MultiPoint.TypeEnum;
    coordinates: Array<CoordinatesInner>;
}
export namespace MultiPoint {
    export type TypeEnum = 'MultiPoint';
    export const TypeEnum = {
        MultiPoint: 'MultiPoint' as TypeEnum
    };
}


