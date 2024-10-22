import { featureCollection, geometryCollection, point } from '@turf/helpers';
import rewind from '@turf/rewind';
import concave from '@turf/concave';
export enum Complexity {
  SIMPLE = 0,
  MEDIUM = 1,
  COMPLEX = 2,
  VERY_COMPLEX = 3,
  RANDOM = 4,
}

const INDEXES_PER_COMPLEXITY = [
  [4, 4],
  [5, 10],
  [11, 20],
  [21, 50],
];

const getValueInRangeWithPrecision = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const generateFeatures = (
  nbPolygons: number = 10,
  complexity: Complexity = Complexity.RANDOM,
  maxSize: number = 100,
  bbox: [[number, number], [number, number]] = [
    [-179, 179],
    [-89, 89],
  ]
) => {
  const polygons = [];
  for (let i = 0; i < nbPolygons; ++i) {
    const complexityIndex =
      complexity === Complexity.RANDOM
        ? Math.floor(Math.random() * INDEXES_PER_COMPLEXITY.length)
        : complexity;
    const nbPoints = Math.floor(
      Math.random() *
        (INDEXES_PER_COMPLEXITY[complexityIndex][1] -
          INDEXES_PER_COMPLEXITY[complexityIndex][0]) +
        INDEXES_PER_COMPLEXITY[complexityIndex][0]
    );
    const points = [];
    const firstPoint = point([
      getValueInRangeWithPrecision(bbox[0][0], bbox[0][1]),
      getValueInRangeWithPrecision(bbox[1][0], bbox[1][1]),
    ]);
    points.push(firstPoint);
    for (let j = 1; j < nbPoints; ++j) {
      const lon = getValueInRangeWithPrecision(
        firstPoint.geometry.coordinates[0] - maxSize / 100,
        firstPoint.geometry.coordinates[0] + maxSize / 100
      );
      const lat = getValueInRangeWithPrecision(
        firstPoint.geometry.coordinates[1] - maxSize / 100,
        firstPoint.geometry.coordinates[1] + maxSize / 100
      );
      // console.log(`lon: ${lon}, lat: ${lat}`);
      points.push(point([lon, lat]));
    }
    points.push(points[0]);
    const currentPolygon = concave(featureCollection(points))!;
    rewind(currentPolygon, { mutate: true });
    polygons.push(currentPolygon?.geometry);
  }
  return geometryCollection(polygons);
};
