import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene, Camera, and Renderer setup
    const scene = new THREE.Scene()
    const width = container.clientWidth || 1
    const height = container.clientHeight || 1

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.z = 7

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 2. Create Group with 3 components
    const group = new THREE.Group()

    // (1) Outer Shell: EdgesGeometry of IcosahedronGeometry(1.9, 1) in signal orange LineSegments
    const outerBaseGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const outerEdges = new THREE.EdgesGeometry(outerBaseGeo)
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0,
    })
    const outerShell = new THREE.LineSegments(outerEdges, outerMaterial)
    group.add(outerShell)

    // (2) Inner Core: Points of IcosahedronGeometry(1.15, 4)
    const innerGeometry = new THREE.IcosahedronGeometry(1.15, 4)
    const innerMaterial = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    })
    const innerCore = new THREE.Points(innerGeometry, innerMaterial)
    group.add(innerCore)

    // (3) Orbit Ring: LineLoop through 128 points of an EllipseCurve radius 2.7
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0)
    const ringPoints = curve.getPoints(128)
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const orbitRing = new THREE.LineLoop(ringGeometry, ringMaterial)
    orbitRing.rotation.x = Math.PI / 2.4
    group.add(orbitRing)

    // Initial scale for intro materialisation
    if (!prefersReducedMotion) {
      group.scale.setScalar(0.6)
    }

    scene.add(group)

    // 3. Interaction state & drag handlers
    let tiltTargetX = 0
    let tiltTargetY = 0
    let dragRotX = 0
    let dragRotY = 0
    let autoSpinY = 0

    let isDragging = false
    let previousPointerX = 0
    let previousPointerY = 0

    const canvas = renderer.domElement

    const handlePointerDown = (e) => {
      isDragging = true
      previousPointerX = e.clientX
      previousPointerY = e.clientY
    }

    const handlePointerMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1

      tiltTargetX = normY * 0.25
      tiltTargetY = normX * 0.4

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX
        const deltaY = e.clientY - previousPointerY
        previousPointerX = e.clientX
        previousPointerY = e.clientY

        dragRotY += deltaX * 0.01
        dragRotX += deltaY * 0.01
      }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    // 4. Animation loop and materialisation
    let isVisible = true
    let animationFrameId
    const startTime = performance.now()

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsed = (currentTime - startTime) / 1000

      // Intro materialisation over ~1 second
      if (!prefersReducedMotion && elapsed <= 1) {
        const p = Math.min(elapsed / 1.0, 1)
        // Ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - p, 3)
        group.scale.setScalar(0.6 + 0.4 * easeOut)
        outerMaterial.opacity = 0.9 * easeOut
      } else if (!prefersReducedMotion && elapsed > 1) {
        group.scale.setScalar(1)
        outerMaterial.opacity = 0.9
      }

      // Continuous rotations
      if (!prefersReducedMotion) {
        autoSpinY += 0.0025
        innerCore.rotation.y = -elapsed * 0.15
      }

      // Ease group rotation toward combined target (tilt + drag + auto-spin)
      const targetRotationX = tiltTargetX + dragRotX
      const targetRotationY = tiltTargetY + dragRotY + autoSpinY

      group.rotation.x += (targetRotationX - group.rotation.x) * 0.06
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.06

      renderer.render(scene, camera)
    }

    animationFrameId = requestAnimationFrame(animate)

    // 5. Visibility and Window Resize handling
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.01 }
    )
    observer.observe(container)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return

      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // 6. Comprehensive resource cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()

      canvas.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('resize', handleResize)

      outerBaseGeo.dispose()
      outerEdges.dispose()
      outerMaterial.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
      ringGeometry.dispose()
      ringMaterial.dispose()

      renderer.dispose()
      renderer.forceContextLoss()

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  )
}
