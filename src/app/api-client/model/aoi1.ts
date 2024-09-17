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
import { GeometryCollection } from './geometryCollection';
import { MultiPolygon } from './multiPolygon';
import { Bbox } from './bbox';
import { GeometriesInner } from './geometriesInner';
import { Polygon } from './polygon';
import { CoordinatesInner } from './coordinatesInner';


export interface Aoi1 { 
    bbox?: Bbox | null;
    type: Aoi1.TypeEnum;
    geometries: Array<GeometriesInner>;
    coordinates: Array<Array<CoordinatesInner>>;
}
export namespace Aoi1 {
    export type TypeEnum = 'GeometryCollection' | 'MultiPolygon' | 'Polygon';
    export const TypeEnum = {
        GeometryCollection: 'GeometryCollection' as TypeEnum,
        MultiPolygon: 'MultiPolygon' as TypeEnum,
        Polygon: 'Polygon' as TypeEnum
    };
}


