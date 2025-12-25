/**
 * Helper function to download files from URLs
 * This handles cross-origin downloads by fetching the file as a blob
 */
export const downloadFile = async (url: string, filename: string) => {
    try {
        // Fetch the file as a blob
        const response = await fetch(url, {
            mode: 'cors',
            credentials: 'omit',
        })

        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`)
        }

        const blob = await response.blob()

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob)

        // Create a temporary anchor element
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        link.style.display = 'none'

        // Append to body, click, and remove
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up the blob URL after a short delay
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl)
        }, 100)
    } catch (error) {
        console.error('Download error:', error)
        throw error
    }
}
