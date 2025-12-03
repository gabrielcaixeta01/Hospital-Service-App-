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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { params } = context;
  const consultaId = Number(params.id);
  const data = await readData();
  const items = data.filter((p) => Number(p.consultaId) === consultaId);
  return NextResponse.json(items);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { params } = context;
  const consultaId = params.id;
  const body = await req.json().catch(() => ({}));
  const texto = String(body.texto ?? "").trim();
  if (!texto) return NextResponse.json({ error: "Texto requerido" }, { status: 400 });

  const data = await readData();
  const id = Date.now();
  const item = {
    id,
    consultaId: String(consultaId),
    texto,
    criadoEm: new Date().toISOString(),
    autor: null,
  };
  data.push(item);
  await writeData(data);
  return NextResponse.json(item, { status: 201 });
}
