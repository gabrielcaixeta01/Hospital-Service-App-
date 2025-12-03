import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "prescricoes.json");

async function readData() {
  try {
    const txt = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(txt) as any[];
  } catch (err) {
    return [];
  }
}

async function writeData(data: any[]) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await readData();
  const idx = data.findIndex((p) => Number(p.id) === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [removed] = data.splice(idx, 1);
  await writeData(data);
  return NextResponse.json({ ok: true, removed });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await readData();
  const item = data.find((p) => Number(p.id) === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
