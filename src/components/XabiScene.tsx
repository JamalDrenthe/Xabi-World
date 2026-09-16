import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface XabiSceneProps {
  className?: string;
}

export function XabiScene({ className = '' }: XabiSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.className = 'xabi-scene-canvas';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.HemisphereLight(0xe8f5dd, 0x071814, 2.2);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xd5ffad, 4.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x4fe39b, 8, 7);
    rimLight.position.set(-2.5, -1.5, 2);
    scene.add(rimLight);

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.28, 5),
      new THREE.MeshPhysicalMaterial({
        color: 0xb7df91,
        roughness: 0.14,
        metalness: 0.12,
        transmission: 0.48,
        thickness: 1.2,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: 0.92,
      }),
    );
    root.add(orb);

    const innerOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xefffd2,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      }),
    );
    root.add(innerOrb);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd8f9b7,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
    });
    const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.012, 8, 160), ringMaterial);
    ringOne.rotation.set(0.48, -0.24, 0.2);
    root.add(ringOne);
    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.008, 8, 160), ringMaterial.clone());
    ringTwo.material.opacity = 0.35;
    ringTwo.rotation.set(-0.42, 0.65, -0.32);
    root.add(ringTwo);

    const shardGeometry = new THREE.OctahedronGeometry(0.09, 0);
    const shardMaterial = new THREE.MeshStandardMaterial({
      color: 0xe7ffcb,
      emissive: 0x5ed38b,
      emissiveIntensity: 1.2,
      roughness: 0.22,
      metalness: 0.3,
    });
    const shards = Array.from({ length: 18 }, (_, index) => {
      const shard = new THREE.Mesh(shardGeometry, shardMaterial);
      const angle = (index / 18) * Math.PI * 2;
      const radius = 1.8 + (index % 3) * 0.18;
      shard.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.8, Math.sin(angle) * radius * 0.5);
      shard.scale.setScalar(0.55 + (index % 4) * 0.16);
      root.add(shard);
      return { mesh: shard, angle, radius, speed: 0.12 + (index % 5) * 0.018 };
    });

    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.4 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 4.2;
      particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.42;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xd3efb1,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(particles);

    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const clock = new THREE.Clock();

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      targetRotation.set(pointer.y * 0.12, pointer.x * 0.18);
    };

    const onPointerLeave = () => {
      targetRotation.set(0, 0);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      root.rotation.x += (targetRotation.x - root.rotation.x) * 0.035;
      root.rotation.y += (targetRotation.y - root.rotation.y) * 0.035;
      root.position.y = Math.sin(elapsed * 0.8) * 0.06;
      orb.rotation.y = elapsed * 0.12;
      innerOrb.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.035);
      ringOne.rotation.z += 0.0018;
      ringTwo.rotation.z -= 0.0011;
      particles.rotation.y = elapsed * 0.012;

      shards.forEach(({ mesh, angle, radius, speed }) => {
        const nextAngle = angle + elapsed * speed;
        mesh.position.x = Math.cos(nextAngle) * radius;
        mesh.position.z = Math.sin(nextAngle) * radius * 0.5;
        mesh.position.y += Math.sin(elapsed * 1.3 + angle) * 0.0015;
        mesh.rotation.x += 0.008;
        mesh.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`xabi-scene-shell ${focused ? 'is-focused' : ''} ${className}`}>
      <div
        aria-label="Interactieve 3D visualisatie van Xabi World"
        className="xabi-scene-canvas"
        ref={containerRef}
        role="img"
      />
      <div className="xabi-scene-glow" />
      <div className="xabi-scene-label xabi-scene-label-top">
        <span className="xabi-scene-label-dot" />
        live overzicht
      </div>
      <button className="xabi-scene-toggle" onClick={() => setFocused((value) => !value)} type="button">
        <span className="xabi-scene-toggle-pulse" />
        {focused ? 'Focus actief' : 'Verken de wereld'}
      </button>
      <div className="xabi-scene-label xabi-scene-label-bottom">conditional logic · ready</div>
    </div>
  );
}
