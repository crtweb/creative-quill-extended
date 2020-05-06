QuillJS and extended toolbar functions
======================================

This module:

1. Extends "insert video" button — place video to responsive `div`-block.
1. Add upload action to image button — if you define the `uploadUrl` in Quill properties, is uploads your images to server and insert result url to cursor place.     
    Request will contain a form with `upload`, and module waits a response with json like `{uploaded: true, url: 'https://your.backend.url/images/file-name.jpg'}`

## Async upload

If your Quill instance configured with custom parameter `uploadAsync`, Image Handler will try to upload images asynchronically. This action split file to pieces and for each pease send a form with data like this:

```js
const fd = new FormData();
fd.append('upload', piece);                   // piece of file
fd.append('_chunkSize', chunkSize + '');      // default chunk size
fd.append('_currentChunkSize', piece.size);   // current chink size
fd.append('_chunkNumber', i + '');            // number of chunk
fd.append('_totalSize', size + '');           // total file size
fd.append('_uniqueId', uuid);                 // unique ID for file
fd.append('type', this.quill.uploadType || 'image');
```

Also, your backend must receive this data, process it and should answer with json like

```json
{
  "done": 67,
  "file": null,
  "url": null
}
```

When upload complete, data must be like this

```json
{
  "done": 100,
  "file": "171e9994-f3f0-4000-8eb0-6649500b0000.png",
  "url": "https://absolute.url.to/171e9994-f3f0-4000-8eb0-6649500b0000.png"
}
```

## TODO

Throw exception if file upload fails.
