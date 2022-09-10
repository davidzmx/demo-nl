import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { JsonNgforPipe } from './pipes/json-ngfor.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { DemoService } from './services/demo.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NotFoundComponent,
    JsonNgforPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    DragDropModule,
    FormsModule,
    NgSelectModule,
  ],
  providers: [
    DemoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
