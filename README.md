# BunnyNet Storage Library


A Node.js library for simple interaction with BunnyCDN Storage.

The library supports uploading, downloading, and deleting files.


## Installation
To install the package, run the following command:


```bash

npm i bunnynet-storage

```



## Usage

### Import



```javascript

const { uploadFile, downloadFile, deleteFile } = require("bunnynet-storage");

```

### Upload files

To upload a file to a remote directory:

```javascript
// Create configuration object
const storageUploadOptions = {
    // REQUIRED:
    storageZoneName: "your-storage-name", // Storage zone name
    fileName: "your-file-name", // File name including extension (e.g., "video.mp4")
    filePath: "your-path-to-local-file", // Local file path including file name and extension (e.g., "./video.mp4")
    accessKey: "your-access-key", // BunnyNet API Key
    region: "your-storage-region", // Storage region (e.g., "ny")

    // OPTIONAL:
    cdnZoneName: "your-cdn-zone-name" // CDN Zone name for returning URL to the file in the response
};

// Create an async function and use the storageUploadOptions object as an argument for uploadFile
const upload = async () => {
    const resp = await uploadFile(storageUploadOptions);
};

// Call the async function to upload the file
upload();

```


### Download File

To download a file from a remote directory:

```javascript
// Create configuration object
const storageDownloadOptions = {
    // REQUIRED:
    storageZoneName: "your-storage-name", // Storage zone name
    fileName: "your-file-name", // File name including extension (e.g., "video.mp4")
    accessKey: "your-access-key", // BunnyNet API Key
    region: "your-storage-region", // Storage region (e.g., "ny")

    // OPTIONAL:
    localPath: "your-local-path-for-file" // Path where the file will be downloaded (e.g., "./video.mp4"). If not provided, the root folder is used
};

// Create an async function and use the storageDownloadOptions object as an argument for downloadFile
const download = async () => {
    const resp = await downloadFile(storageDownloadOptions);
};

// Call the async function to download the file
download();

```



### Delete File

To delete a file from a remote directory:

```javascript
// Create configuration object
const storageDeleteOptions = {
    // REQUIRED:
    storageZoneName: "your-storage-name", // Storage zone name
    fileName: "your-file-name", // File name including extension (e.g., "video.mp4")
    accessKey: "your-access-key", // BunnyNet API Key
    region: "your-storage-region", // Storage region (e.g., "ny")
};

// Create an async function and use the storageDeleteOptions object as an argument for deleteFile
const deleteFileFromStorage = async () => {
    const resp = await deleteFile(storageDeleteOptions);
};

// Call the async function to delete the file
deleteFileFromStorage();

```

