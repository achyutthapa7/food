const ExcelJS = require('exceljs');

// Build an Excel workbook buffer for a single event's orders + summary
async function buildEventWorkbook(event, orders, groupSummaries, eventSummary) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = [
        { header: 'S.N.', key: 'sn', width: 6 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Group', key: 'group', width: 8 },
        { header: 'Food Item', key: 'food', width: 30 },
        { header: 'Price', key: 'price', width: 12 },
        { header: 'Eligible Amount', key: 'eligible', width: 16 },
        { header: 'Created Time', key: 'created', width: 20 },
    ];
    sheet.getRow(1).font = { bold: true };

    orders.forEach((o, idx) => {
        sheet.addRow({
            sn: idx + 1,
            name: o.visitor_name,
            group: `Group ${o.group_no}`,
            food: o.display_name,
            price: o.actual_price,
            eligible: o.eligible_price,
            created: o.created_at,
        });
    });

    sheet.addRow({});
    sheet.addRow({ name: 'Group 1 Total', price: groupSummaries[1].total_actual, eligible: groupSummaries[1].total_eligible });
    sheet.addRow({ name: 'Group 2 Total', price: groupSummaries[2].total_actual, eligible: groupSummaries[2].total_eligible });
    sheet.addRow({ name: 'Event Total', price: eventSummary.total_actual, eligible: eventSummary.total_eligible });

    return workbook.xlsx.writeBuffer();
}

module.exports = { buildEventWorkbook };
