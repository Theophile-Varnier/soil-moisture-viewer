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
import { GeometriesInner } from './geometriesInner';


/**
 * GeometryCollection Model
 */
export interface GeometryCollection { 
    bbox?: Bbox | null;
    type: GeometryCollection.TypeEnum;
    geometries: Array<GeometriesInner>;
}
export namespace GeometryCollection {
    export type TypeEnum = 'GeometryCollection';
    export const TypeEnum = {
        GeometryCollection: 'GeometryCollection' as TypeEnum
    };
}

