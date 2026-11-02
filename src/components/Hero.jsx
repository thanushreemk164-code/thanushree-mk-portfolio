import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { personalInfo, heroContent } from '../data/portfolioData'

export default function Hero() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)

  // Three.js interactive 3D centerpiece
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 4.8

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // 3D Geometry: An intricate technical HUD Wireframe Icosahedron & Inner Core
    const geometry = new THREE.IcosahedronGeometry(1.6, 1)
    const wireframeGeometry = new THREE.WireframeGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    })
    const wireframeMesh = new THREE.LineSegments(wireframeGeometry, lineMaterial)
    scene.add(wireframeMesh)

    // Inner glowing technical signal node
    const innerGeometry = new THREE.OctahedronGeometry(0.8, 0)
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5b1f,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
    scene.add(innerMesh)

    // Particle nodes at vertices
    const particleCount = 60
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5
      positions[i + 1] = (Math.random() - 0.5) * 4.5
      positions[i + 2] = (Math.random() - 0.5) * 4.5
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff5b1f,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    let mouseX = 0
    let mouseY = 0
    let isVisible = true

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      if (!prefersReducedMotion) {
        wireframeMesh.rotation.y += 0.003
        wireframeMesh.rotation.x += 0.0015
        innerMesh.rotation.y -= 0.005
        innerMesh.rotation.z += 0.002
        particles.rotation.y += 0.0008

        // Subtle mouse follow
        wireframeMesh.rotation.x += (mouseY * 0.3 - wireframeMesh.rotation.x) * 0.05
        wireframeMesh.rotation.y += (mouseX * 0.3 - wireframeMesh.rotation.y) * 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle canvas resize
    const handleResize = () => {
      if (!canvas || !container) return
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup Three.js resources
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      geometry.dispose()
      wireframeGeometry.dispose()
      lineMaterial.dispose()
      innerGeometry.dispose()
      innerMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  // GSAP entrance animation with once: true
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-anim-item', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden hud-grid"
    >
      {/* Three.js 3D Background Canvas */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full max-w-4xl max-h-[700px] opacity-75"
        />
      </div>

      {/* Decorative Technical Crosshairs */}
      <div className="absolute top-24 left-8 hidden sm:block font-mono text-[10px] text-bone/20 select-none">
        [SYS_COORD // 12.9716° N, 77.5946° E]
      </div>
      <div className="absolute bottom-12 right-8 hidden sm:block font-mono text-[10px] text-bone/20 select-none">
        [SIGNAL_HUD // ACTIVE]
      </div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Eyebrow badge */}
        <div className="hero-anim-item mb-4 inline-flex items-center gap-2 border border-bone/10 bg-panel/70 px-3 py-1 font-mono text-xs uppercase tracking-widest text-dim backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_#ff5b1f]" />
          <span>{heroContent.eyebrow}</span>
        </div>

        {/* Technical Title */}
        <h1 className="hero-anim-item font-sans text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-bone mb-6">
          <span className="block text-dim text-lg sm:text-2xl font-mono uppercase tracking-widest mb-2 font-normal">
            // {personalInfo.role}
          </span>
          {personalInfo.name}
        </h1>

        {/* Hero Narrative Intro */}
        <p className="hero-anim-item mx-auto max-w-2xl text-base sm:text-lg text-dim mb-10 leading-relaxed font-sans">
          {heroContent.intro}
        </p>

        {/* Action Buttons */}
        <div className="hero-anim-item flex flex-wrap items-center justify-center gap-4">
          <a
            href={heroContent.ctaPrimary.href}
            className="hud-frame group relative inline-flex items-center gap-3 border border-signal bg-signal/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-signal hover:text-ink transition-all duration-200"
          >
            <span>{heroContent.ctaPrimary.label}</span>
            <span className="text-signal group-hover:text-ink group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>

          <a
            href={heroContent.ctaSecondary.href}
            className="hud-frame inline-flex items-center gap-2 border border-bone/10 bg-panel/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-dim hover:text-bone hover:border-bone/30 transition-all duration-200"
          >
            <span>{heroContent.ctaSecondary.label}</span>
          </a>
        </div>

        {/* Quick telemetry indicators */}
        <div className="hero-anim-item mt-16 pt-8 border-t border-bone/10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-mono text-xs text-dim">
          <div className="flex items-center gap-2">
            <span className="text-bone/40">LOCATION:</span>
            <span className="text-bone">{personalInfo.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-bone/40">STATUS:</span>
            <span className="text-signal">{personalInfo.availability}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
