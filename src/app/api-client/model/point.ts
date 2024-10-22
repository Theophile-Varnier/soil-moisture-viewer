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
import { Coordinates } from './coordinates';


/**
 * Point Model
 */
export interface Point { 
    bbox?: Bbox | null;
    type: Point.TypeEnum;
    coordinates: Coordinates;
}
export namespace Point {
    export type TypeEnum = 'Point';
    export const TypeEnum = {
        Point: 'Point' as TypeEnum
    };
}


