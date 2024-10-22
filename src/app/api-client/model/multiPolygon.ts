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
 * MultiPolygon Model
 */
export interface MultiPolygon { 
    bbox?: Bbox | null;
    type: MultiPolygon.TypeEnum;
    coordinates: Array<Array<Array<CoordinatesInner>>>;
}
export namespace MultiPolygon {
    export type TypeEnum = 'MultiPolygon';
    export const TypeEnum = {
        MultiPolygon: 'MultiPolygon' as TypeEnum
    };
}


