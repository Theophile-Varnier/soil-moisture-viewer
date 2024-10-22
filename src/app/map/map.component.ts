import { AfterViewInit, Component } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
  map: L.Map;
  layers: L.Layer[] = [];
  tempLayers: L.Layer[] = [];
  drawControl: L.Control.Draw;
  aoi: any;
  aois: any[] = [];

  constructor(private store: Store<AppState>) {}

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: L.latLng(42, 2),
      zoom: 10,
    });

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
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

    this.store
      .select((st) => st.ui.layers)
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
    this.store.dispatch(
      UiActions.selectAggregation({ aggregation: undefined })
    );
    this.aoi = '';
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
