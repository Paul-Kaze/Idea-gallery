import { NextRequest, NextResponse } from 'next/server'
import { getDownloadResponse } from '../../../../lib/storage'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 })
    }

    try {
        // If it's an OSS URL, use our authenticated OSS client to fetch the stream
        if (url.includes('aliyuncs.com')) {
            const parsedUrl = new URL(url)
            const bucket = parsedUrl.hostname.split('.')[0]
            const key = parsedUrl.pathname.slice(1) // remove leading slash

            const res = await getDownloadResponse(key, bucket)
            if (res) {
                return res
            }
            return new NextResponse('OSS Object Not Found', { status: 404 })
        }

        // Fallback for non-OSS URLs or data URIs
        const response = await fetch(url)

        if (!response.ok) {
            console.error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`)
            return new NextResponse('Failed to fetch image', { status: response.status })
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const contentType = response.headers.get('content-type') || 'image/jpeg'

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': 'attachment',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('Error proxying download:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
