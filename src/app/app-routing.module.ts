import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

// We are creating an array called roots.
// This array will contain a list of objects with configuration settings for each root.
// We can add an object for each route 
const routes: Routes = [
  /*
      Route

          A configuration object that defines a single route.
          A set of routes are collected in a Routes array to define a Router configuration.
          The router attempts to match segments of a given URL against each route, using the configuration options defined in this object.
            title?: string | Type<Resolve<string>> | ResolveFn<string>
            path?: string
            pathMatch?: 'prefix' | 'full'
            matcher?: UrlMatcher
            component?: Type<any>
            loadComponent?: () => Type<unknown> | Observable<Type<unknown>> | Promise<Type<unknown>>
            redirectTo?: string
            canActivate?: Array<CanActivateFn | any>
  */

  { path: '', component: HomeComponent },         //  routerLink=""
  { path: 'about', component: AboutComponent },   //  routerLink="about"
  { path: 'clip/:id', component: ClipComponent },
  {
    path: 'video', loadChildren: () => import("./video/video.module").then(module => module.VideoModule)
  },
  { path: '**', component: NotFoundComponent}
];

// The router will not become aware of our roots unless we pass them in as an argument to the forRoot function.
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// 
export class AppRoutingModule { }
