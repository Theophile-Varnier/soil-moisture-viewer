import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { Tree } from '../store/ui/reducer';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent {
  files = input.required<Tree[]>();
  fileSelected = output<string>();
  treeControl = new NestedTreeControl<Tree>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<Tree>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.files();
    });
  }

  hasChild = (_: number, node: Tree) =>
    !!node.children && node.children.length > 0;

  selectDate = (event: any, file: string) => {
    event.stopPropagation();
    this.fileSelected.emit(file);
  };
}
