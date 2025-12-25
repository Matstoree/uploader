import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'File Uploader - Upload & Get Public URL',
  description: 'Upload any file and get a permanent public URL instantly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
