import { NextRequest, NextResponse } from 'next/server'
import { getDownloadResponse } from '../../../../lib/storage'
import { captureServerError } from '../../../../lib/monitoring'

function normalizeHost(value: string | undefined) {
    if (!value) return null
    try {
        return new URL(value).hostname.toLowerCase()
    } catch {
        return value.replace(/^https?:\/\//, '').split('/')[0].toLowerCase()
    }
}

function getAllowedDownloadHosts() {
    const hosts = new Set<string>()
    const configuredHosts = (process.env.DOWNLOAD_ALLOWED_HOSTS || process.env.NEXT_PUBLIC_CDN_HOST || '')
        .split(',')
        .map((host) => normalizeHost(host.trim()))
        .filter(Boolean) as string[]

    configuredHosts.forEach((host) => hosts.add(host))

    const ossEndpoint = normalizeHost(process.env.OSS_ENDPOINT)
    if (process.env.OSS_BUCKET && ossEndpoint) {
        hosts.add(`${process.env.OSS_BUCKET}.${ossEndpoint}`)
    }

    return hosts
}

function isAllowedDownloadUrl(parsedUrl: URL) {
    if (parsedUrl.protocol !== 'https:') return false
    return getAllowedDownloadHosts().has(parsedUrl.hostname.toLowerCase())
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 })
    }

    try {
        let parsedUrl: URL
        try {
            parsedUrl = new URL(url)
        } catch {
            return new NextResponse('Invalid download URL', { status: 400 })
        }

        if (!isAllowedDownloadUrl(parsedUrl)) {
            return new NextResponse('Download host is not allowed', { status: 400 })
        }

        // If it's our OSS URL, use the authenticated OSS client to fetch the stream.
        const ossEndpoint = normalizeHost(process.env.OSS_ENDPOINT)
        const allowedOssHost = process.env.OSS_BUCKET && ossEndpoint
            ? `${process.env.OSS_BUCKET}.${ossEndpoint}`
            : null

        if (allowedOssHost && parsedUrl.hostname.toLowerCase() === allowedOssHost) {
            const bucket = process.env.OSS_BUCKET
            const key = parsedUrl.pathname.slice(1) // remove leading slash

            const res = await getDownloadResponse(key, bucket)
            if (res) {
                return res
            }
            return new NextResponse('OSS Object Not Found', { status: 404 })
        }

        // Fallback for configured CDN hosts only.
        const response = await fetch(parsedUrl.toString())

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
        await captureServerError('api.tools_download_failed', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
