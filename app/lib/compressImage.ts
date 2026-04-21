/**
 * Client-only: resize image file for upload (canvas). Preserves aspect ratio;
 * caps the longest edge for storage/bandwidth. Output JPEG.
 */
export type CompressImageOptions = {
  maxEdgePx: number
  quality: number
}

const DEFAULT: CompressImageOptions = { maxEdgePx: 1000, quality: 0.72 }

/** Slightly larger cap + quality for API analyze (stays under serverless body limits). */
const ANALYZE: CompressImageOptions = { maxEdgePx: 1200, quality: 0.75 }

async function compressImageWithOptions(
  file: File,
  options: CompressImageOptions
): Promise<File> {
  const { maxEdgePx, quality } = options

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
      const scale = longEdge > 0 ? Math.min(1, maxEdgePx / longEdge) : 1

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
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Could not read image file"))
    }

    img.src = objectUrl
  })
}

export async function compressImage(file: File): Promise<File> {
  return compressImageWithOptions(file, DEFAULT)
}

/** For /api/analyze-model: smaller payload before base64 on the server. */
export async function compressImageForAnalyze(file: File): Promise<File> {
  return compressImageWithOptions(file, ANALYZE)
}
