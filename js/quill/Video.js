import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');
const Link = Quill.import('formats/link');

class EVideo extends BlockEmbed {
  static create(value) {
    const node = super.create();

    const child = document.createElement('iframe');
    child.setAttribute('frameborder', '0');
    child.setAttribute('allowfullscreen', true);
    child.setAttribute('src', this.sanitize(value));
    node.appendChild(child);

    return node;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(node) {
    return node.firstChild.getAttribute('src');
  }
}

EVideo.blotName = 'video-container';
EVideo.className = 'video-responsive';
EVideo.tagName = 'div';

export default EVideo;
