import { tokenAction } from "@/lib/token-route";
export async function POST(request: Request) {
  return tokenAction(request, "confirm");
}
