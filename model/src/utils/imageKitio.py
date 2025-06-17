import os
from dotenv import load_dotenv
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions

load_dotenv(dotenv_path=".env")

# Load credentials from environment variables
imagekit = ImageKit(
    public_key=os.getenv("imageKit_Public_Key"),
    private_key=os.getenv("imageKit_Private_Key"),
    url_endpoint=os.getenv("imageKit_Url_Endpoint"),
)

def upload_image(processed_image_path, image_name, folder_structure="/"):
    try:
        with open(processed_image_path, "rb") as f:
            file_data = f.read()

        upload_options = UploadFileRequestOptions(
            folder=folder_structure,
            is_private_file=False,
            use_unique_file_name=False
        )

        result = imagekit.upload_file(
            file=file_data,
            file_name=image_name,
            options=upload_options
        )

        # Delete the local file after upload
        os.remove(processed_image_path)

        return result.response_metadata.raw  # contains fileId, url, etc.
    except Exception as e:
        print("Error in upload_image:", e)
        raise e


def delete_image(file_id=""):
    try:
        result = imagekit.delete_file(file_id=file_id)
        print("Deleted:", result.response_metadata.raw)
    except Exception as e:
        print("Error in delete_image:", e)


def delete_bulk_images(file_ids=[]):
    try:
        result = imagekit.bulk_file_delete(file_ids=file_ids)
        print("Bulk Delete:", result.response_metadata.raw)
    except Exception as e:
        print("Error in delete_bulk_images:", e)
