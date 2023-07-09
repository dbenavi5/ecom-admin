import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(_req: Request, { params }: { params: { colorId: string } }) {
    try {
        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });
        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Patch route - used for updating the store
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } },
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Find and update store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const color = await prismadb.color.update({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// delete route - when user click delete button
export async function DELETE(
    _req: Request,
    { params }: { params: { colorId: string, storeId: string } },
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Find and update store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const color = await prismadb.color.delete({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}