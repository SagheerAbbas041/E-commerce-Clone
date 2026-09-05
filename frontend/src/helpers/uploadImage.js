// src/helpers/uploadImage.js

const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const uploadImage = async (image) => {
    // Basic validation check
    if (!cloudName) {
        console.error("Cloudinary Cloud Name missing! Check your .env file (REACT_APP_CLOUD_NAME_CLOUDINARY).");
        return { error: true, message: "Cloud Name environment variable missing." };
    }

    try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "mern_product"); // Ensure this preset is 'Unsigned' in Cloudinary

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Cloudinary Upload Error:", data.error?.message || "Upload failed");
            return { error: true, message: data.error?.message || "Upload failed" };
        }

        return data; // Contains data.url, data.secure_url, etc.
    } catch (error) {
        console.error("Network/Server Error during image upload:", error);
        return { error: true, message: error.message };
    }
};

export default uploadImage;