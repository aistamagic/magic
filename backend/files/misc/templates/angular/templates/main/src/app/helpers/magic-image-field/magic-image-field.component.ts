// Angular and system imports.
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Helper libraries.
import { NgxImageCompressService } from 'ngx-image-compress';

/**
 * Image field component, allowing you to browse for an image and add it to a field
 * as base64 encoded data. This component automatically resizes the image according to
 * its configuration if you set its maxWidth or maxHeight properties. Example usage
 * can be found below.

  <app-magic-image-field
    *ngIf="canEditColumn('filename')"
    [model]="data.entity"
    field="filename"
    [placeholder]="'filename' | translate"
    class="entity-edit-field"
    maxWidth="1024"
    maxHeight="800"
    (change)="changed('filename')">
  </app-magic-image-field>

 */
@Component({
  selector: 'app-magic-image-field',
  templateUrl: './magic-image-field.component.html',
  styleUrls: ['./magic-image-field.component.scss'],
})
export class MagicImageFieldComponent {

  /**
   * Model you're databinding towards.
   */
  @Input() public model: any;

  /**
   * Field in the model that you want this particular object
   * to be databound towards.
   */
  @Input() public field: string;

  /**
   * Maximum width of image.
   */
  @Input() public maxWidth?: number;

  /**
   * Maximum height of image.
   */
  @Input() public maxHeight?: number;

  /**
   * Title value (label) of component.
   */
  @Input() public label: string;

  /**
   * Callback to invoke once item is changed.
   */
  @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Creates an instance of your component.
   * 
   * @param imageCompress Needed to resize images before using it as field's value
   */
  constructor(private imageCompress: NgxImageCompressService) { }

  /**
   * Invoked as user clicks the button to select an image.
   */
  public selectImage() {

    // Asking user for an image.
    this.imageCompress.uploadFile().then(({image, orientation}) => {
  
      // Verifying user provided a maximum height/width, and if not, using image as is.
      if (this.maxHeight || this.maxWidth) {

        // Figuring out original size of image.
        const img = new Image();
        img.onload = () => {

          // Figuring out aspect ratio between max height/width and actual height/width.
          let widthRatio: number = null;
          let heightRatio: number = null;
          if (img.width > this.maxWidth) {
            widthRatio = this.maxWidth / img.width;
          }
          if (img.height > this.maxHeight) {
            heightRatio = this.maxHeight / img.height;
          }

          // Checking if image was larger in any direction that what our max height/width was.
          if (widthRatio || heightRatio) {

            // We need to find our smallest ratio to make sure image never exceed the specified max height/width.
            const ratio = Math.min(widthRatio || 1, heightRatio || 1);

            // Resizing image.
            this.imageCompress.compressFile(image, orientation, ratio * 100, 100).then((resizedImage: string) => {

                // Uploading resized image.
                const result = resizedImage.substring(resizedImage.indexOf(',') + 1);
                this.model[this.field] = result;

                // Signaling image has changed.
                this.change?.emit();
            });

          } else {

            // Image is smaller in both axis than our maximum size, hence using it as is.
            const result = image.substring(image.indexOf(',') + 1);
            this.model[this.field] = result;

            // Signaling image has changed.
            this.change?.emit();
          }
        };

        img.src = image;

      } else {

        // No max width/height declared - Hence, using image as is.
        const result = image.substring(image.indexOf(',') + 1);
        this.model[this.field] = result;

        // Signaling image has changed.
        this.change?.emit();
      }
    });
  }

  /**
   * Removes the currently selected image.
   */
  remove() {

    // Removing image from entity.
    this.model[this.field] = null;

    // Signaling image has changed.
    this.change?.emit();
  }
}
