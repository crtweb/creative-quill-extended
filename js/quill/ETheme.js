import Quill from 'quill';
import { BaseTooltip } from 'quill/themes/base'
import ImageUploader from '../ImageUploader'

const Theme = Quill.import('themes/snow');
const Icons = Quill.import('ui/icons')

/**
 * Override QuillJS theme
 */
class ETheme extends Theme {

  /**
   * Add video-container handler to toolbar.
   * @param toolbar
   */
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar);
    const button = toolbar.container.querySelectorAll('button.ql-video-container')[0];
    if (!button instanceof HTMLButtonElement || (typeof Icons['video'] !== 'string')) return;
    button.innerHTML = Icons['video'];

    this.tooltip = new ETooltip(this.quill, this.options.bounds);
    toolbar.handlers['video-container'] = () => {
      const url = prompt('Enter Video URL:');
      const cursorPosition = this.quill.getSelection().index;

      this.quill.insertEmbed(cursorPosition, 'video-container', this.tooltip.extractVideoUrl(url));
      this.quill.setSelection(cursorPosition + 1);
    }

    this.imageHandler(toolbar, this.quill.options.uploadUrl || null)
  }

  /**
   * Add image upload handler to toolbar.
   * @param toolbar
   * @param uploadUrl
   */
  imageHandler(toolbar, uploadUrl = null) {
    if (uploadUrl === null) return;

    toolbar.handlers['image'] = () => {

      const uploader = new ImageUploader(uploadUrl);
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.onchange = async () => {
        const file = input.files[0];
        if (!/^image\//.test(file.type)) return;

        const uploaded = await uploader.upload(file);
        if (!uploaded.hasOwnProperty('uploaded') || uploaded.uploaded !== true)
          return;

        const range = this.quill.getSelection();
        this.quill.insertEmbed(range.index, 'image', uploaded.url);
      }
      input.click();
    }
  }
}

/**
 * Only one function to parse video links.
 */
class ETooltip extends BaseTooltip {

    extractVideoUrl(url) {
      let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
        url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return (match[1] || 'https') + '://www.youtube.com/embed/' + match[2] + '?showinfo=0';
      }
      let vimeoMatch = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)
      if (vimeoMatch) {
        return (vimeoMatch[1] || 'https') + '://player.vimeo.com/video/' + vimeoMatch[2] + '/';
      }
      return url;
    }

}

ETooltip.TEMPLATE = [
  '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
  '<input type="text" data-formula="e=mc^2" data-link="https://google.com" data-video-container="Embed URL">',
  '<a class="ql-action"></a>',
  '<a class="ql-remove"></a>'
].join('');

export default ETheme;
