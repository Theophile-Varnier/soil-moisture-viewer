import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { feature, featureCollection } from '@turf/helpers';
import { bbox } from '@turf/bbox';
import { randomPolygon } from '@turf/random';
import { UiDataSelectorComponent } from '../ui-data-selector/ui-data-selector.component';
import { DataInfoComponent } from '../data-info/data-info.component';
import { JobCreatorComponent } from '../job-creator/job-creator.component';
import * as L from 'leaflet';
import 'leaflet-draw';
import { ClearButtonComponent } from '../clear-button/clear-button.component';
import { UiActions } from '../store/ui/actions';
import { Subscription } from 'rxjs';
import { layersSelector, selectedFilesSelector } from '../store/ui/selectors';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';

import { fromArrayBuffer } from 'geotiff';

import { leafletGeotiff } from './leaflet-geotiff';
import { LeafletGeotiffPlotty } from './leaflet-geotiff-plotty';

// import './leaflet-geotiff.js';

(window as any).type = true;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    UiDataSelectorComponent,
    DataInfoComponent,
    JobCreatorComponent,
    ClearButtonComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  map: L.Map;
  layers: L.Layer[] = [];
  tempLayers: L.Layer[] = [];
  dataLayers: L.Layer[] = [];
  drawControl: L.Control.Draw;
  aoi: any;
  aois: any[] = [];
  layersSubscription: Subscription;
  tifSubscription: Subscription;
  s3params: GetObjectCommandInput = {
    Bucket: '',
    Key: '',
  };
  private s3: S3Client;

  constructor(private store: Store<AppState>) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      region: '',
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: L.latLng(42, 2),
      zoom: 4,
    });

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();

        this.layersSubscription = this.store
          .select(layersSelector)
          .subscribe((layers) => {
            const newLayers = layers.map((layer) => L.geoJSON(layer));
            this.layers.forEach((layer) => {
              this.map.removeLayer(layer);
            });
            newLayers.forEach((layer) => {
              layer.addTo(this.map);
            });
            if (layers.length) {
              const newBbox = bbox(
                featureCollection(layers.map((layer) => feature(layer)))
              );
              this.map.flyToBounds(
                L.latLngBounds(
                  L.latLng(newBbox[1], newBbox[0]),
                  L.latLng(newBbox[3], newBbox[2])
                ),
                {
                  duration: 1,
                }
              );
            }
            this.layers = newLayers;
          });

        this.tifSubscription = this.store
          .select(selectedFilesSelector)
          .subscribe((files) => {
            this.clearDataLayers();
            for (const file of files) {
              this.s3params.Key = file!;
              const command = new GetObjectCommand(this.s3params);
              this.s3.send(command, (err, data) => {
                if (err) {
                  console.log(err);
                } else if (data) {
                  data.Body?.transformToByteArray().then((content) => {
                    var layer = leafletGeotiff(content.buffer, {
                      sourceFunction: fromArrayBuffer,
                      renderer: new LeafletGeotiffPlotty(),
                    });

                    this.map.addLayer(layer);
                    this.dataLayers.push(layer);
                  });
                }
              });
            }
          });
      }, 10);
    });

    var openStreetLayer = new L.TileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        minZoom: 3,
        maxZoom: 18,
      }
    );
    openStreetLayer.addTo(this.map);

    var drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);
    this.drawControl = new L.Control.Draw({
      position: 'topright',
      edit: {
        featureGroup: drawnItems,
      },
    });

    this.map.on(L.Draw.Event.CREATED, (event) => {
      const e = event as L.DrawEvents.Created;
      const layer = e.layer;
      this.tempLayers.push(layer);
      this.map.addLayer(layer);
      this.aoi = layer.toGeoJSON().geometry;
      this.map.removeControl(this.drawControl);
    });
  }

  ngOnDestroy(): void {
    if (this.layersSubscription) {
      this.layersSubscription.unsubscribe();
    }
  }

  showDrawer() {
    this.clear();
    this.map.addControl(this.drawControl);
  }

  clear() {
    this.tempLayers.forEach((layer) => {
      this.map.removeLayer(layer);
    });
    this.tempLayers = [];
    this.clearDataLayers();
    this.store.dispatch(
      UiActions.selectAggregation({ aggregation: undefined })
    );
    this.aoi = '';
  }

  clearDataLayers() {
    this.dataLayers.forEach((layer) => {
      this.map.removeLayer(layer);
    });
    this.dataLayers = [];
  }

  generateAois(event: { numberOfJobs: number; keepBbox: boolean }) {
    this.clear();
    const bounds = this.map.getBounds();
    const aois = randomPolygon(event.numberOfJobs, {
      bbox: [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      num_vertices: 6,
      max_radial_length:
        (bounds.getNorth() - bounds.getSouth()) / event.numberOfJobs,
    });
    this.aois = aois.features.map((aoi) => aoi.geometry);
    for (const aoi of aois.features) {
      this.tempLayers.push(L.geoJSON(aoi.geometry).addTo(this.map));
    }
  }
}
