import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './components/map/map.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  //{ path: 'landing', component: LandingComponent },
  { path: '', component: MapComponent },
  //{ path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent },
  { path: 'mapa', component: MapComponent },
  { path: 'public', component: MapComponent },
  { path: '**', component: NotFoundComponent }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
