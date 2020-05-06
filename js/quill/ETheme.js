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

        const parameters = {};
        const range = this.quill.getSelection();
        if (this.quill.options.uploadAsync) {
          // https://stackoverflow.com/a/44078785/3168103
          let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
          let uuid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');

          const size = file.size
          const chunkSize = 1024  * 1024
          const count = Math.ceil(size / chunkSize);
          for (let i = 0; i < count; i++) {
            let from = chunkSize * i;
            let piece = file.slice(from, (from + chunkSize), file.type);

            const fd = new FormData();
            fd.append('upload', piece);
            fd.append('_chunkSize', chunkSize + '');
            fd.append('_currentChunkSize', piece.size);
            fd.append('_chunkNumber', i + '');
            fd.append('_totalSize', size + '');
            fd.append('_uniqueId', uuid);
            fd.append('type', this.quill.uploadType || 'image');

            const result = await this.asyncUpload(uploader, fd);
            if (result.hasOwnProperty('url') && result.url !== null) {
              this.quill.insertEmbed(range.index, 'image', result.url);
            }
          }
        } else {
          this.quill.insertEmbed(range.index, 'image', await this.syncUpload(uploader, file, parameters));
        }
      }
      input.click();
    }
  }

  async asyncUpload(uploader, fd) {
    return uploader.asyncUpload(fd).then(data => data);
  }

  async syncUpload(uploader, file, parameters) {
    const uploaded = await uploader.upload(file, parameters);
    if (!uploaded.hasOwnProperty('uploaded') || uploaded.uploaded !== true)
      return;

    return uploaded.url;
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
