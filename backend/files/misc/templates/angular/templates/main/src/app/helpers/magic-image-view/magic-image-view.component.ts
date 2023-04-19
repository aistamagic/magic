
// Angular and system imports.
import { Component, Input } from '@angular/core';
import { environment } from '@env/environment';

/**
 * Image view component, allowing you to view an individual image referenced
 * as a field in a table. Below you can find example usage.
 * 

            <p class="details">
              <label>{{'filename' | translate}}</label>
              <app-magic-image-view
                [image]="el.filename"
                downloadUrl="/MODULE_NAME/download-image">
              </app-magic-image-view>
            </p>

 */
@Component({
  selector: 'app-magic-image-view',
  templateUrl: './magic-image-view.component.html',
  styleUrls: ['./magic-image-view.component.scss'],
})
export class MagicImageViewComponent {

  /**
   * Backend API URL.
   */
  public apiUrl: string = environment.apiUrl;

  /**
   * Relative filename of image to view.
   */
  @Input() public image: string;

  /**
   * Relative download URL to retrieve image.
   */
  @Input() public downloadUrl: string;

  /**
   * Encodes the specified param as q QUERY URI component.
   * 
   * @param param Query parameter to encode
   */
  public encode(param: string) {

    // Simply encoding as QUERY parameter.
    return encodeURIComponent(param);
  }
}
