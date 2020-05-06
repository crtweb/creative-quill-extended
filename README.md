QuillJS and extended toolbar functions
======================================

This module:

1. Extends "insert video" button — place video to responsive `div`-block.
1. Add upload action to image button — if you define the `uploadUrl` in Quill properties, is uploads your images to server and insert result url to cursor place.     
    Request will contain a form with `upload`, and module waits a response with json like `{uploaded: true, url: 'https://your.backend.url/images/file-name.jpg'}`

## TODO

Throw exception if file upload fails.
