import { NgModule } from '@angular/core';
import { SearchPipe } from './search';
import { SortPipe } from './sort';
@NgModule({
	declarations: [SearchPipe,
    SortPipe],
	imports: [],
	exports: [SearchPipe,
    SortPipe]
})
export class PipesModule {}
