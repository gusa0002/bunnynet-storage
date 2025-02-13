const https = require('https');
const fs = require('fs');


//===================
// UPLOAD, DOWNLOAD, DELETE
//===================
const uploadFile = async ({accessKey, region, storageZoneName, filePath, fileName, cdnZoneName}) => {
    const hostname =  region? `${region}.storage.bunnycdn.com` : "storage.bunnycdn.com";
    const storageUrl = `https://${hostname}/${storageZoneName}/${fileName}`;
    // Required: accessKey, region, storageZoneName,filePath, fileName
    // Optional: cdnZoneName
    const missingProperties = checkRequiredPropertiesExist({accessKey,region, storageZoneName, filePath, fileName});
    if (missingProperties.length > 0) {
        return {code: 400, message: `Missing required properties: ${missingProperties.join(", ")}`};
    };
    const readStream = fs.createReadStream(filePath);
    const optionsObject = {
        method: "PUT",
        host: hostname,
        path: `/${storageZoneName}/${fileName}`,
        headers: {
            AccessKey: accessKey,
            'Content-Type': 'application/octet-stream',
        },
    };
    try {
        const result = await new Promise((resolve, reject) => {
            let respData = "";
            const req = https.request(optionsObject, (res) => {
                res.on("data", chunk => {
                    respData += chunk.toString('utf8');
                });
                res.on("end", () => {
                    console.log("Finish");
                    const data = JSON.parse(respData);
                    if (data?.HttpCode && data.HttpCode === 201) {
                        if (cdnZoneName && cdnZoneName.length > 0) {
                            resolve({storageUrl, cdnUrl:`https://${cdnZoneName}.b-cdn.net/${fileName}`, code: data.HttpCode, message: data.Message});
                        }else{
                            resolve({storageUrl: storageUrl, code: data.HttpCode, message: data.Message});
                        }
                    }else {
                        const resp = checkTypeOfBadResponse({code:data?.HttpCode, message:data?.Message});
                        resolve(resp);
                    };
                });
            });
            req.on("error", (error) => {
                const resp = checkTypeOfBadResponse({code:error?.HttpCode, message:error?.Message});
                resolve(resp);
            });
            readStream.pipe(req);
        });
        return result;
    } catch (error) {
        const handledError = checkTypeOfBadResponse({code:error?.HttpCode, message:error?.Message});
        return handledError;
    };
};


const downloadFile = async ({accessKey, region, storageZoneName, fileName, localPath }) => {
    const storageUrl = `https://${region}.storage.bunnycdn.com/${storageZoneName}/${fileName}`;
    // Required: accessKey, region, storageZoneName, fileName
    // Optional: localPath
    const missingProperties = checkRequiredPropertiesExist({accessKey,region, storageZoneName, fileName});
    if (missingProperties.length > 0) {
        return {code: 400, message: `Missing required properties: ${missingProperties.join(", ")}`};
    };
    const options = {
        method: "GET",
        headers: {
            AccessKey: accessKey,
            accept: "*/*"
        },
    };
    try {
        let res = await fetch(storageUrl, options);
        const fileLocation = `${localPath ? localPath : "./"}${fileName}`;
        const fileStream = fs.createWriteStream(fileLocation); 
        const reader = res.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            };
            fileStream.write(value);
        }
        fileStream.end();
        return {code: res.status, message: res.statusText, storageUrl: res.url};
    } catch (error) {
        const handledError = checkTypeOfBadResponse({code:error?.HttpCode, message:error?.Message});
        return handledError;
    };
};


const deleteFile = async ({accessKey, region, storageZoneName,fileName,}) => {
    const storageUrl = `https://${region}.storage.bunnycdn.com/${storageZoneName}/${fileName}`;
    // Required: accessKey, region, storageZoneName, fileName
    // Optional: -
    const missingProperties = checkRequiredPropertiesExist({accessKey,region, storageZoneName, fileName});
    if (missingProperties.length > 0) {
        return {code: 400, message: `Missing required properties: ${missingProperties.join(", ")}`};
    };
    const options = {
        method: "DELETE",
        headers: {
            AccessKey: accessKey,
        },
    };
    const data = await fetch(storageUrl, options)
    .then(res => res.json())
    .then(data => {
        return {storageUrl: storageUrl, code: data.HttpCode, message: data.Message}
    })
    .catch(error => {
        const handledError = checkTypeOfBadResponse({code:error?.HttpCode, message:error?.Message});
        return handledError;
    });
    return data;
};

//===================
// Helper Functions
//===================
const checkRequiredPropertiesExist = (props) => {
    let missingProperties = [];
    for(let key in props){
        if (props.hasOwnProperty(key)) {
            if (!props[key] || props[key].length < 1) {
                missingProperties.push(key);
            }
        }
    }
    return missingProperties;
}

const checkTypeOfBadResponse = ({code, message}) => {
    if (code && message) {
        return {code: code, message: message};
    }else{
        return {code: 400, message: "Bad Request"};
    };
}


module.exports = {
    uploadFile,
    downloadFile,
    deleteFile
};
