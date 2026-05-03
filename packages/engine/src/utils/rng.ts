const MASK_64 = 0xffffffffffffffffn;

function splitmix64(seed: bigint): bigint {
  let z = (seed + 0x9e3779b97f4a7c15n) & MASK_64;
  z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK_64;
  z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK_64;
  return (z ^ (z >> 31n)) & MASK_64;
}

function rotl(x: bigint, k: bigint): bigint {
  return ((x << k) | (x >> (64n - k))) & MASK_64;
}

export class Rng {
  private state: [bigint, bigint, bigint, bigint];

  constructor(seed: bigint) {
    const s0 = splitmix64(seed);
    const s1 = splitmix64(seed + 1n);
    const s2 = splitmix64(seed + 2n);
    const s3 = splitmix64(seed + 3n);
    this.state = [s0, s1, s2, s3];
  }

  public next(): number {
    const result = (rotl(this.state[1] * 5n, 7n) * 9n) & MASK_64;

    const t = (this.state[1] << 17n) & MASK_64;
    this.state[2] ^= this.state[0];
    this.state[3] ^= this.state[1];
    this.state[1] ^= this.state[2];
    this.state[0] ^= this.state[3];
    this.state[2] ^= t;
    this.state[3] = rotl(this.state[3], 45n);

    return Number((result >> 11n) & 0x1fffffffffffffn) / 2 ** 53;
  }

  public nextInt(min: number, max: number): number {
    const range = max - min + 1;
    return min + Math.floor(this.next() * range);
  }

  public shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const temp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = temp;
    }
    return copy;
  }

  public pick<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Cannot pick from empty array');
    return array[this.nextInt(0, array.length - 1)]!;
  }

  public getState(): [bigint, bigint, bigint, bigint] {
    return [...this.state] as [bigint, bigint, bigint, bigint];
  }

  public setState(state: [bigint, bigint, bigint, bigint]): void {
    this.state = [...state] as [bigint, bigint, bigint, bigint];
  }
}
