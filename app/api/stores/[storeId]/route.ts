import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// Patch route - used for updating the store
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();
        const body = await req.json();
        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Find and update store
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId,
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('STORE_PATCH', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// delete route - when user click delete button

export async function DELETE(
    _req: Request,
    { params }: { params: { storeId: string } },
) {
    try {
        // Check if we are authenticated
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Find and update store
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId,
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}