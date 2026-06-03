import { resetDemoBoard } from "@/lib/reset-demo-board";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await resetDemoBoard();

    return Response.json({
        ok: true,
        message: "Demo board reset.",
    });
}