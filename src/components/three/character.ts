/**
 * Bonhomme 3D (étudiant avec sac à dos), construit en formes simples arrondies.
 * Les membres sont articulés (hanches, épaules) pour animer la marche, le saut et le salut.
 */
import * as THREE from 'three'

export interface Character {
  root: THREE.Group
  body: THREE.Group
  legL: THREE.Group
  legR: THREE.Group
  armL: THREE.Group
  armR: THREE.Group
  head: THREE.Group
  dispose: () => void
}

export function buildCharacter(colors: { jacket: string; bag: string; dark: boolean }): Character {
  const geos: THREE.BufferGeometry[] = []
  const mats: THREE.Material[] = []
  const g = <T extends THREE.BufferGeometry>(x: T) => (geos.push(x), x)
  const m = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) => {
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.55, metalness: 0.02, ...extra })
    mats.push(mat)
    return mat
  }

  const skin = m('#b8724a')
  const hair = m('#2a1d16', { roughness: 0.8 })
  const jacket = m(colors.jacket)
  const jacketDark = m(new THREE.Color(colors.jacket).multiplyScalar(0.75).getStyle())
  const pants = m(colors.dark ? '#c2cee2' : '#23365c')
  const shoe = m('#f5f5f2')
  const sole = m('#1a2948')
  const bag = m(colors.bag)
  const eye = m('#141414', { roughness: 0.3 })

  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)

  // Jambes : pivot à la hanche (y = 1.0)
  const makeLeg = (x: number) => {
    const pivot = new THREE.Group()
    pivot.position.set(x, 1.0, 0)
    const leg = new THREE.Mesh(g(new THREE.CapsuleGeometry(0.13, 0.55, 6, 12)), pants)
    leg.position.y = -0.4
    const foot = new THREE.Mesh(g(new THREE.BoxGeometry(0.24, 0.13, 0.38)), shoe)
    foot.position.set(0, -0.82, 0.07)
    const s = new THREE.Mesh(g(new THREE.BoxGeometry(0.25, 0.04, 0.39)), sole)
    s.position.set(0, -0.885, 0.07)
    pivot.add(leg, foot, s)
    body.add(pivot)
    return pivot
  }
  const legL = makeLeg(-0.15)
  const legR = makeLeg(0.15)

  // Torse
  const torso = new THREE.Mesh(g(new THREE.CapsuleGeometry(0.3, 0.42, 8, 16)), jacket)
  torso.position.y = 1.38
  torso.scale.z = 0.78
  const zip = new THREE.Mesh(g(new THREE.BoxGeometry(0.03, 0.5, 0.02)), jacketDark)
  zip.position.set(0, 1.4, 0.235)
  body.add(torso, zip)

  // Sac à dos
  const pack = new THREE.Mesh(g(new THREE.BoxGeometry(0.46, 0.55, 0.22)), bag)
  pack.position.set(0, 1.42, -0.3)
  const flap = new THREE.Mesh(g(new THREE.BoxGeometry(0.47, 0.16, 0.24)), m(new THREE.Color(colors.bag).multiplyScalar(0.8).getStyle()))
  flap.position.set(0, 1.62, -0.3)
  body.add(pack, flap)

  // Bras : pivot à l'épaule
  const makeArm = (x: number) => {
    const pivot = new THREE.Group()
    pivot.position.set(x, 1.66, 0)
    const sleeve = new THREE.Mesh(g(new THREE.CapsuleGeometry(0.1, 0.42, 6, 12)), jacket)
    sleeve.position.y = -0.3
    const hand = new THREE.Mesh(g(new THREE.SphereGeometry(0.1, 14, 12)), skin)
    hand.position.y = -0.62
    pivot.add(sleeve, hand)
    body.add(pivot)
    return pivot
  }
  const armL = makeArm(-0.41)
  const armR = makeArm(0.41)

  // Tête
  const head = new THREE.Group()
  head.position.y = 2.02
  const skull = new THREE.Mesh(g(new THREE.SphereGeometry(0.3, 24, 20)), skin)
  const hairCap = new THREE.Mesh(g(new THREE.SphereGeometry(0.315, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55)), hair)
  hairCap.rotation.x = -0.25
  hairCap.position.set(0, 0.02, -0.02)
  const eyeGeo = g(new THREE.SphereGeometry(0.035, 10, 8))
  const eL = new THREE.Mesh(eyeGeo, eye)
  eL.position.set(-0.1, 0.02, 0.28)
  const eR = new THREE.Mesh(eyeGeo, eye)
  eR.position.set(0.1, 0.02, 0.28)
  const smile = new THREE.Mesh(g(new THREE.TorusGeometry(0.07, 0.014, 6, 16, Math.PI)), m('#5b2e1c'))
  smile.position.set(0, -0.1, 0.27)
  smile.rotation.z = Math.PI
  const neck = new THREE.Mesh(g(new THREE.CylinderGeometry(0.09, 0.1, 0.16, 12)), skin)
  neck.position.y = -0.3
  head.add(skull, hairCap, eL, eR, smile, neck)
  body.add(head)

  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true
  })

  return {
    root,
    body,
    legL,
    legR,
    armL,
    armR,
    head,
    dispose: () => {
      geos.forEach((x) => x.dispose())
      mats.forEach((x) => x.dispose())
    },
  }
}

/** Pose du personnage pour un instant t. walk ∈ [0, 1] mélange repos et marche. */
export function pose(c: Character, t: number, walk: number, jump: number, wave: number) {
  const f = t * 9
  const swing = Math.sin(f) * 0.75 * walk
  c.legL.rotation.x = swing
  c.legR.rotation.x = -swing
  c.armL.rotation.x = -swing * 0.9
  c.armR.rotation.x = swing * 0.9
  c.armL.rotation.z = -0.08
  c.armR.rotation.z = 0.08
  // respiration au repos, rebond à la marche
  const bob = Math.abs(Math.sin(f)) * 0.07 * walk + Math.sin(t * 2) * 0.012 * (1 - walk)
  c.body.position.y = bob + jump
  c.body.rotation.y = Math.sin(f) * 0.08 * walk
  c.head.rotation.y = Math.sin(t * 0.7) * 0.25 * (1 - walk)
  c.head.rotation.z = Math.sin(t * 1.1) * 0.04 * (1 - walk)
  if (jump > 0.01) {
    c.armL.rotation.z = -2.6 * Math.min(1, jump * 3)
    c.armR.rotation.z = 2.6 * Math.min(1, jump * 3)
    c.legL.rotation.x = 0.4
    c.legR.rotation.x = -0.2
  }
  if (wave > 0.01) {
    c.armR.rotation.z = 2.5 * wave
    c.armR.rotation.x = Math.sin(t * 14) * 0.35 * wave
  }
}
