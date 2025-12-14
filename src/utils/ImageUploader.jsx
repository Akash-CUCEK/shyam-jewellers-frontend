export const ImageUploader = async (files) => {
  const imageUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Akash kumar"); // your Cloudinary preset name

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djaiqzoes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        imageUrls.push(data.secure_url);
      } else {
        console.error("Upload error:", data);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  return imageUrls;
};
