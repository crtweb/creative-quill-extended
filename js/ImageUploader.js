export default class ImageUploader {
  constructor (url) {
    this.url = url;
  }

  async asyncUpload(fd) {
    return window.fetch(this.url, {
      method: 'POST',
      body: fd
    }).then(r => r.json());
  }

  async upload(file, parameters = {}) {
    const fd = new FormData();
    fd.append('upload', file);
    fd.append('data', JSON.stringify(parameters));

    return fetch(this.url, {
      method: 'POST',
      body: fd,
    }).then(r => r.json());
  }
}
