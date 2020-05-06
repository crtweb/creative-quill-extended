export default class ImageUploader {
  constructor (url) {
    this.url = url;
  }

  async upload(file, parameters = []) {
    const fd = new FormData();
    fd.append('upload', file);
    fd.append('data', JSON.stringify(parameters));

    return fetch(this.url, {
      method: 'POST',
      body: fd,
    }).then(r => r.json());
  }
}
