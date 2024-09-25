import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import { AppState } from '../store/state';
import { geoJsonLayersSelector } from '../store/jobs/selectors';
import { UiFiltersComponent } from '../ui-filters/ui-filters.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [UiFiltersComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  map: L.Map;
  geoJsonLayers: L.GeoJSON[] = [];
  constructor(private store: Store<AppState>) {}
  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: L.latLng(43, 6),
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

    this.store.select(geoJsonLayersSelector).subscribe((layers) => {
      this.geoJsonLayers.forEach((layer) => {
        this.map.removeLayer(layer);
      });
      layers.forEach((layer) => {
        layer.addTo(this.map);
      });
      this.geoJsonLayers = layers;
    });
  }
}
