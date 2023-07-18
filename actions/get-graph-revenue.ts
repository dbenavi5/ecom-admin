import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        }
    });

    const monthlyRevenue: { [key: number]: number } = {};

    // grouping the orders by month and summing the revenue
    for (const order of paidOrders) {
        const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber();
        }

        // adding this revenue for this order to the reespected month.
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }
    // converting the  group data into the format expected by the graph
    const graphData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 },
    ];

    // filling in the revenue data
    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
}