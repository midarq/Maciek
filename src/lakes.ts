export type ShorePoint = readonly [number, number]

// Stylized shorelines from the municipality's 2025 water-safety maps,
// pages 31 (Wądół), 27 (Kościelne) and 21 (Chłop). Source linked in README.
// Nested copies are decorative shoreline echoes, not measured depth contours.
const shores: ShorePoint[][] = [
  [ // Wądół: northern basin, two pronounced peninsulas and the eastern arm.
    [205, 510], [224, 520], [236, 547], [275, 535], [322, 524],
    [358, 540], [397, 537], [435, 549], [454, 577], [462, 620],
    [488, 647], [495, 678], [482, 711], [462, 738], [455, 756],
    [421, 762], [401, 768], [385, 741], [380, 763], [394, 788],
    [419, 804], [430, 859], [435, 908], [454, 905], [486, 932],
    [521, 941], [551, 931], [554, 899], [548, 856], [565, 822],
    [597, 800], [617, 825], [632, 893], [640, 968], [657, 1007],
    [700, 1038], [748, 1059], [760, 1104], [788, 1148], [807, 1183],
    [797, 1206], [773, 1214], [749, 1193], [733, 1165], [700, 1147],
    [655, 1130], [604, 1120], [572, 1105], [542, 1080], [517, 1066],
    [505, 1068], [495, 1110], [476, 1102], [448, 1071], [433, 1041],
    [437, 1011], [450, 989], [467, 985], [503, 1003], [536, 1030],
    [572, 1053], [596, 1083], [605, 1113], [589, 1142], [556, 1158],
    [515, 1154], [476, 1150], [434, 1150], [398, 1135], [362, 1112],
    [326, 1076], [293, 1037], [271, 1009], [269, 966], [273, 915],
    [280, 851], [291, 816], [314, 791], [334, 778], [342, 750],
    [337, 718], [323, 691], [311, 682], [300, 694], [284, 719],
    [256, 726], [228, 719], [210, 703], [204, 669], [203, 626],
    [196, 581], [192, 539],
  ],
  [ // Kościelne: broad middle basin with narrow northern and southern ends.
    [744, 440], [773, 451], [798, 486], [817, 527], [831, 573],
    [822, 615], [816, 650], [803, 665], [778, 672], [786, 686],
    [754, 701], [711, 720], [670, 726], [634, 731], [647, 757],
    [686, 786], [736, 817], [785, 844], [795, 876], [778, 911],
    [743, 943], [709, 951], [704, 971], [735, 1003], [762, 1043],
    [782, 1084], [776, 1130], [764, 1170], [746, 1194], [718, 1197],
    [694, 1176], [683, 1134], [664, 1094], [637, 1056], [621, 1013],
    [602, 987], [560, 943], [525, 920], [505, 888], [502, 847],
    [490, 799], [480, 750], [476, 701], [468, 655], [470, 626],
    [492, 614], [537, 610], [582, 619], [631, 627], [676, 631],
    [719, 627], [757, 620], [765, 603], [761, 559], [750, 519],
    [734, 485], [725, 457],
  ],
  [ // Chłop: two wide basins around its long central peninsula.
    [240, 302], [288, 285], [301, 255], [330, 228], [355, 201],
    [385, 194], [409, 213], [440, 228], [474, 230], [509, 255],
    [536, 261], [568, 243], [598, 232], [628, 240], [651, 246],
    [697, 237], [731, 227], [756, 237], [770, 265], [770, 296],
    [754, 320], [719, 335], [692, 363], [668, 393], [653, 427],
    [657, 442], [674, 436], [690, 404], [719, 382], [756, 371],
    [792, 374], [817, 395], [847, 402], [889, 389], [930, 374],
    [973, 364], [1008, 358], [1036, 367], [1055, 390], [1057, 427],
    [1047, 455], [1040, 486], [1011, 517], [983, 551], [948, 580],
    [908, 597], [880, 621], [858, 641], [821, 649], [794, 666],
    [764, 668], [735, 658], [711, 647], [686, 625], [652, 624],
    [623, 628], [592, 620], [574, 627], [564, 651], [548, 655],
    [546, 625], [517, 604], [499, 579], [505, 554], [536, 537],
    [570, 523], [598, 502], [607, 466], [611, 428], [626, 394],
    [649, 371], [640, 356], [620, 352], [589, 374], [558, 374],
    [539, 399], [513, 417], [479, 431], [455, 450], [430, 446],
    [411, 453], [391, 480], [383, 508], [362, 511], [340, 500],
    [319, 504], [321, 526], [336, 553], [306, 567], [278, 562],
    [259, 546], [232, 556], [207, 546], [182, 528], [170, 502],
    [185, 482], [212, 470], [244, 461], [260, 439], [267, 412],
    [246, 392], [230, 371], [225, 339],
  ],
]

function smoothShore(points: ShorePoint[]): ShorePoint[] {
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y)
  const left = Math.min(...xs), top = Math.min(...ys)
  const width = Math.max(...xs) - left, height = Math.max(...ys) - top
  const size = Math.max(width, height)
  const normalized = points.map(([x, y]) => [(x - left - width / 2) / size, (y - top - height / 2) / size] as const)
  const result: ShorePoint[] = []
  for (let index = 0; index < normalized.length; index++) {
    const a = normalized[(index - 1 + normalized.length) % normalized.length]
    const b = normalized[index], c = normalized[(index + 1) % normalized.length]
    const d = normalized[(index + 2) % normalized.length]
    const steps = Math.max(3, Math.ceil(Math.hypot(c[0] - b[0], c[1] - b[1]) * 180))
    for (let step = 0; step < steps; step++) {
      const t = step / steps, t2 = t * t, t3 = t2 * t
      const coordinate = (axis: 0 | 1) => .5 * ((2 * b[axis]) + (-a[axis] + c[axis]) * t
        + (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * t2
        + (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * t3)
      result.push([coordinate(0), coordinate(1)])
    }
  }
  return result
}

// Parallel outlines follow the shoreline instead of shrinking it about a point.
// A distance field merges narrow inlets naturally, without crossed contour copies.
function shorelineContours(shore: ShorePoint[]): ShorePoint[][] {
  const resolution = 384, margin = .22
  const points = shore.map(([x, y]) => [x * .72, y * .72] as const)
  const left = Math.min(...points.map(([x]) => x)) - margin
  const top = Math.min(...points.map(([, y]) => y)) - margin
  const columns = Math.ceil((Math.max(...points.map(([x]) => x)) - left + margin) * resolution) + 1
  const rows = Math.ceil((Math.max(...points.map(([, y]) => y)) - top + margin) * resolution) + 1
  const distance = new Float32Array(columns * rows).fill(1e6)
  for (let row = 0; row < rows; row++) {
    const y = top + row / resolution, crossings: number[] = []
    points.forEach(([ax, ay], index) => {
      const [bx, by] = points[(index + 1) % points.length]
      if ((ay > y) !== (by > y)) crossings.push(ax + (y - ay) * (bx - ax) / (by - ay))
    })
    crossings.sort((a, b) => a - b)
    for (let pair = 0; pair + 1 < crossings.length; pair += 2) {
      const from = Math.ceil((crossings[pair] - left) * resolution)
      const to = Math.floor((crossings[pair + 1] - left) * resolution)
      distance.fill(0, row * columns + from, row * columns + to + 1)
    }
  }
  for (let row = 1; row < rows - 1; row++) {
    for (let column = 1; column < columns - 1; column++) {
      const i = row * columns + column
      distance[i] = Math.min(distance[i], distance[i - 1] + 1, distance[i - columns] + 1,
        distance[i - columns - 1] + Math.SQRT2, distance[i - columns + 1] + Math.SQRT2)
    }
  }
  for (let row = rows - 2; row > 0; row--) {
    for (let column = columns - 2; column > 0; column--) {
      const i = row * columns + column
      distance[i] = Math.min(distance[i], distance[i + 1] + 1, distance[i + columns] + 1,
        distance[i + columns - 1] + Math.SQRT2, distance[i + columns + 1] + Math.SQRT2)
    }
  }
  return Array.from({ length: 7 }, (_, ring) => {
    const level = .5 + ring * .03 * resolution
    const nodes = new Map<number, { point: ShorePoint; neighbors: number[] }>()
    for (let row = 0; row < rows - 1; row++) {
      for (let column = 0; column < columns - 1; column++) {
        const i = row * columns + column
        const values = [distance[i], distance[i + 1], distance[i + columns + 1], distance[i + columns]]
        const mask = values.reduce((sum, value, corner) => sum | (value < level ? 1 << corner : 0), 0)
        if (mask === 0 || mask === 15) continue
        const edges: { key: number; point: ShorePoint }[] = []
        const corners = [[column, row], [column + 1, row], [column + 1, row + 1], [column, row + 1]]
        const keys = [i * 2, (i + 1) * 2 + 1, (i + columns) * 2, i * 2 + 1]
        for (let edge = 0; edge < 4; edge++) {
          const next = (edge + 1) % 4
          if ((values[edge] < level) === (values[next] < level)) continue
          const t = (level - values[edge]) / (values[next] - values[edge])
          edges.push({ key: keys[edge], point: [
            left + (corners[edge][0] + (corners[next][0] - corners[edge][0]) * t) / resolution,
            top + (corners[edge][1] + (corners[next][1] - corners[edge][1]) * t) / resolution,
          ] })
        }
        // Resolve diagonal cells consistently with the center of the distance field.
        if (edges.length === 4 && ((mask === 5) === (values.reduce((a, b) => a + b) / 4 >= level))) {
          edges.push(edges.shift()!)
        }
        for (let pair = 0; pair < edges.length; pair += 2) {
          const a = edges[pair], b = edges[pair + 1]
          if (!nodes.has(a.key)) nodes.set(a.key, { point: a.point, neighbors: [] })
          if (!nodes.has(b.key)) nodes.set(b.key, { point: b.point, neighbors: [] })
          nodes.get(a.key)!.neighbors.push(b.key)
          nodes.get(b.key)!.neighbors.push(a.key)
        }
      }
    }
    const visited = new Set<number>(), paths: ShorePoint[][] = []
    for (const start of nodes.keys()) {
      if (visited.has(start)) continue
      let current = start, previous = -1
      const path: ShorePoint[] = []
      while (!visited.has(current)) {
        visited.add(current)
        const node = nodes.get(current)!
        path.push(node.point)
        const next = node.neighbors.find(key => key !== previous)
        if (next === undefined) break
        previous = current
        current = next
      }
      paths.push(path)
    }
    // Keep the enclosing shoreline if a narrow bay closes into a small inner loop.
    const outline = paths.sort((a, b) => b.length - a.length)[0]
    const spaced = outline.filter((point, index) => index === 0 ||
      Math.hypot(point[0] - outline[index - 1][0], point[1] - outline[index - 1][1]) > 1.5 / resolution || index % 3 === 0)
    return spaced.map((point, index) => {
      const before = spaced[(index - 1 + spaced.length) % spaced.length]
      const after = spaced[(index + 1) % spaced.length]
      return [(before[0] + point[0] * 2 + after[0]) / 4, (before[1] + point[1] * 2 + after[1]) / 4] as const
    })
  })
}

export const lakeContours = shores.map(smoothShore).map(shorelineContours)
