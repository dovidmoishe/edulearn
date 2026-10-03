"use client"
import React, { useEffect, useRef } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className
}: SafeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const img = imgRef.current
    if (img) {
      img.addEventListener('error', handleError as EventListener)
      return () => {
        img.removeEventListener('error', handleError as EventListener)
      }
    }
  }, [])

  if (fill) {
    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

