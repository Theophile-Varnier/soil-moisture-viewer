/**
 * Soil Moisture API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Bbox } from './bbox';
import { CoordinatesInner } from './coordinatesInner';


/**
 * LineString Model
 */
export interface LineString { 
    bbox?: Bbox | null;
    type: LineString.TypeEnum;
    coordinates: Array<CoordinatesInner>;
}
export namespace LineString {
    export type TypeEnum = 'LineString';
    export const TypeEnum = {
        LineString: 'LineString' as TypeEnum
    };
}

