/**
 * Client-only: resize image file for upload (canvas). Preserves aspect ratio;
 * caps the longest edge for storage/bandwidth. Output JPEG.
 */
const MAX_EDGE_PX = 1000
const JPEG_QUALITY = 0.72

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Canvas not supported"))
      return
    }

    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const longEdge = Math.max(img.width, img.height)
      const scale = longEdge > 0 ? Math.min(1, MAX_EDGE_PX / longEdge) : 1

      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed"))
            return
          }
          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
              type: "image/jpeg",
            })
          )
        },
        "image/jpeg",
        JPEG_QUALITY
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Could not read image file"))
    }

    img.src = objectUrl
  })
}
