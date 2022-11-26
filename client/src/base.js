import { initializeApp } from "firebase/app";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

export const app = initializeApp({
    projectId: process.env.REACT_APP_PROJECT_ID,
    appId: process.env.REACT_APP_APP_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    locationId: process.env.REACT_APP_LOCATION_ID,
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    measurementId: process.env.REACT_APP_MERSUREMENT_ID,
});

const storage = getStorage(app);

export const upload = (file, filename) => {
    // Create a storage reference from our  storage service
    // uploading
    console.log("uploading ");
    if (
        filename.endsWith(".jpg") ||
        filename.endsWith(".png") ||
        filename.endsWith(".jpeg")
    ) {
        const storageRef = ref(storage, "images/" + filename);
        return uploadBytes(storageRef, file).then(() => {
            return getDownloadURL(ref(storage, "images/" + filename)).then(
                (url) => {
                    console.log(url);
                    return url;
                }
            );
        });
    } else if (filename.endsWith(".mp4")) {
        const storageRef = ref(storage, "videos/" + filename);
        return uploadBytes(storageRef, file).then(() => {
            return getDownloadURL(ref(storage, "videos/" + filename)).then(
                (url) => {
                    console.log(url);
                    return url;
                }
            );
        });
    }
};

export const deleteFile = (filename, fileType) => {
    console.log(filename,fileType)
    const fileRef = ref(storage, fileType + "s/" + filename);
    console.log(fileRef)
    return deleteObject(fileRef);
};
