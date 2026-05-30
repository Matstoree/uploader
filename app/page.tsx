"use client"
import { useState, useRef, useCallback, DragEvent } from "react"
import Link from "next/link"
import { formatBytes } from "@/lib/utils"
import styles from "./page.module.css"

type State = "idle" | "dragging" | "uploading" | "done" | "error"

export default function Home() {
  const [state, setState] = useState<State>("idle")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [resultUrl, setResultUrl] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setState("idle")
    setFile(null)
    setProgress(0)
    setResultUrl("")
    setError("")
    setCopied(false)
  }

  const upload = useCallback(async (f: File) => {
    setFile(f)
    setState("uploading")
    setProgress(0)

    const form = new FormData()
    form.append("file", f)

    try {
      // Simulate progress with XHR for better UX
      const result = await new Promise<{ status: boolean; url: string; error?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload")
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90))
        }
        xhr.onload = () => {
          setProgress(100)
          try { resolve(JSON.parse(xhr.responseText)) }
          catch { reject(new Error("Invalid response")) }
        }
        xhr.onerror = () => reject(new Error("Network error"))
        xhr.send(form)
      })

      if (result.status && result.url) {
        setResultUrl(result.url)
        setState("done")
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setState("error")
    }
  }, [])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setState("idle")
    const f = e.dataTransfer.files[0]
    if (f) upload(f)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(resultUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <span className={styles.logo}>FileDrop<span className={styles.dot}>.</span></span>
        <Link href="/docs" className={styles.navLink}>API Docs</Link>
      </nav>

      <div className={styles.hero}>
        <h1 className={styles.title}>
          Drop it.<br />Share it.
        </h1>
        <p className={styles.sub}>No login. No limits. Instant URL.</p>
      </div>

      {state === "idle" || state === "dragging" ? (
        <div
          className={`${styles.dropzone} ${state === "dragging" ? styles.dragging : ""}`}
          onDragOver={(e) => { e.preventDefault(); setState("dragging") }}
          onDragLeave={() => setState("idle")}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className={styles.hidden}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f) }}
          />
          <div className={styles.dropIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className={styles.dropText}>
            {state === "dragging" ? "Release to upload" : "Drag & drop or click to select"}
          </p>
          <p className={styles.dropHint}>Any file type · Any size</p>
        </div>
      ) : state === "uploading" ? (
        <div className={styles.card}>
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{file?.name}</span>
            <span className={styles.fileSize}>{file ? formatBytes(file.size) : ""}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.progressLabel}>{progress}%</p>
        </div>
      ) : state === "done" ? (
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successLabel}>Upload complete</p>
          <p className={styles.fileName2}>{file?.name}</p>
          <div className={styles.urlRow}>
            <span className={styles.url}>{resultUrl}</span>
            <button className={styles.copyBtn} onClick={copy}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <a className={styles.openLink} href={resultUrl} target="_blank" rel="noreferrer">Open file ↗</a>
          <button className={styles.resetBtn} onClick={reset}>Upload another</button>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.errorIcon}>✕</div>
          <p className={styles.errorLabel}>{error}</p>
          <button className={styles.resetBtn} onClick={reset}>Try again</button>
        </div>
      )}

      <div className={styles.features}>
        {[
          ["∞", "Permanent storage"],
          ["⚡", "Instant URL"],
          ["🔓", "No login needed"],
          ["📦", "All file types"],
        ].map(([icon, label]) => (
          <div key={label} className={styles.feature}>
            <span className={styles.featureIcon}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
