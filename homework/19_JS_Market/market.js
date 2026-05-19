const orders = [
  {
    id: 1,
    user: "Ivan",
    items: [
      { name: "Laptop", price: 1200, qty: 1 },
      { name: "Mouse", price: 25, qty: 2 },
    ],
    status: "pending",
    createdAt: "2026-04-28",
  },
  {
    id: 2,
    user: "Anna",
    items: [{ name: "Phone", price: 800, qty: 1 }],
    status: "completed",
    createdAt: "2026-04-20",
  },
  {
    id: 3,
    user: "Ivan",
    items: [{ name: "Keyboard", price: 100, qty: 1 }],
    status: "pending",
    createdAt: "2026-04-29",
  },
];

function calculateOrderTotal(order) {
  return order.items.reduce((total, item) => total + item.price * item.qty, 0);
}

function getUserPendingOrders(orders, username) {
  return orders.filter(
    (order) => order.user === username && order.status === "pending"
  );
}

function getTotalRevenue(orders) {
  return orders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + calculateOrderTotal(order), 0);
}

function groupOrdersByUser(orders) {
  return orders.reduce((grouped, order) => {
    if (!grouped[order.user]) {
      grouped[order.user] = [];
    }
    grouped[order.user].push(order);
    return grouped;
  }, {});
}

function getTopUsers(orders, topN) {
  const userTotals = {};

  orders.forEach((order) => {
    if (order.status === "completed") {
      if (!userTotals[order.user]) {
        userTotals[order.user] = 0;
      }
      userTotals[order.user] += calculateOrderTotal(order);
    }
  });

  const sortedUsers = Object.entries(userTotals)
    .map(([user, total]) => ({ user, total }))
    .sort((a, b) => b.total - a.total);

  return sortedUsers.slice(0, topN);
}
console.log(calculateOrderTotal(orders[0]));
console.log(getUserPendingOrders(orders, "Ivan"));
console.log(getTotalRevenue(orders));
console.log(groupOrdersByUser(orders));
console.log(getTopUsers(orders, 1));