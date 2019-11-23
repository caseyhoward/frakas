export function getString(name: string): string {
  const value = process.env[name];

  if (value) {
    return value;
  } else {
    throw `Missing environment variable: ${name}`;
  }
}

export function getInteger(name: string): number {
  const value = process.env[name];

  if (value) {
    return parseInt(value, 10);
  } else {
    throw `Missing environment variable: ${name}`;
  }
}

export function getStringOption(name: string): string | null {
  return process.env[name] || null;
}
