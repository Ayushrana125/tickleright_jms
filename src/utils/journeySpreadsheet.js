import ExcelJS from "exceljs";
import * as XLSX from "xlsx";

export const SAMPLE_TEMPLATE_ROWS = [
  {
    "Day Number": 1,
    "Trigger Time": "09:00 AM",
    "Channel": "App Notification",
    "Message Title": "2-Min Game: The Disappearing Spoon",
    "Message Body": "Hide 1 dinner object under a napkin. Have your child close eyes and guess what went missing. Trains eidetic memory!",
    "Deep Link URL": "tr://activity/disappearing-spoon",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 1,
    "Trigger Time": "10:00 PM",
    "Channel": "App Notification",
    "Message Title": "Bedtime Tale: The Whispering Cloud",
    "Message Body": "A soft 3-min audio adventure that gently guides theta brainwaves for restorative deep sleep.",
    "Deep Link URL": "tr://stories/whispering-cloud",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 2,
    "Trigger Time": "09:00 AM",
    "Channel": "Call",
    "Message Title": "Counsellor Check-in: 48-Hour Welcome",
    "Message Body": "Personal 5-minute call to ensure parent has set up the app and answer questions about the right-brain routine.",
    "Deep Link URL": "tr://counsellor/welcome-call",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 2,
    "Trigger Time": "10:00 PM",
    "Channel": "App Notification",
    "Message Title": "Bedtime Tale: Oliver Owl’s Moonlit Glide",
    "Message Body": "Gentle forest rustles and deep breathing story to ease bedtime resistance.",
    "Deep Link URL": "tr://stories/oliver-owl",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 3,
    "Trigger Time": "09:00 AM",
    "Channel": "WhatsApp",
    "Message Title": "Parent Tip: Why 2 Minutes a Day Works",
    "Message Body": "Neuroplasticity in toddlers peaks during short daily bursts. Tap to read our 1-min pediatric right-brain guide.",
    "Deep Link URL": "tr://guides/neuro-bursts",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 3,
    "Trigger Time": "03:30 PM",
    "Channel": "App Notification",
    "Message Title": "Brain Byte: Toddler Memory Horizons",
    "Message Body": "Kids under 6 process imagery at 0.05 seconds. A quick flashcard game activates their photographic neural grid.",
    "Deep Link URL": "tr://nuggets/photographic-grid",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
  {
    "Day Number": 3,
    "Trigger Time": "10:00 PM",
    "Channel": "App Notification",
    "Message Title": "Bedtime Tale: The Little Star That Lost Its Hum",
    "Message Body": "Calming bedtime visualization to relax busy toddler minds before sleep.",
    "Deep Link URL": "tr://stories/humming-star",
    "Avoid Sundays": "Yes",
    "Festive Guard": "Yes",
  },
];

/**
 * Converts any Journey object from the system into an array of rows
 */
export function journeyToRows(journey) {
  if (!journey || !journey.nodes) return [];
  const rows = [];

  journey.nodes.forEach((node, nodeIdx) => {
    if (node.type === "start") return;

    if (node.type === "stackedDay" && Array.isArray(node.data?.comms)) {
      const dayNum = node.data.day ?? nodeIdx;
      node.data.comms.forEach((comm) => {
        rows.push({
          "Day Number": dayNum,
          "Trigger Time": comm.time || "09:00 AM",
          "Channel": comm.channel || "App Notification",
          "Message Title": comm.title || "Daily Touchpoint",
          "Message Body": comm.desc || comm.content || "",
          "Deep Link URL": comm.deepLink || "tr://app",
          "Avoid Sundays": node.data?.avoidSundays !== false ? "Yes" : "No",
          "Festive Guard": node.data?.checkFestivalCalendar !== false ? "Yes" : "No",
        });
      });
    } else if (node.type === "step" || node.type === "human") {
      const dayNum = node.data?.offset ?? nodeIdx;
      rows.push({
        "Day Number": dayNum,
        "Trigger Time": node.data?.triggerTime || "09:00 AM",
        "Channel": node.data?.template?.channel || (node.type === "human" ? "Call" : "App Notification"),
        "Message Title": node.data?.label || node.data?.template?.name || "Step Touchpoint",
        "Message Body": node.data?.description || node.data?.template?.content || "",
        "Deep Link URL": node.data?.deepLink || "tr://app",
        "Avoid Sundays": node.data?.avoidSundays !== false ? "Yes" : "No",
        "Festive Guard": node.data?.checkFestivalCalendar !== false ? "Yes" : "No",
      });
    }
  });

  return rows;
}

/**
 * Downloads rows as an Excel (.xlsx) file with styled bold header and background color
 */
export async function downloadRowsAsExcel(rows, filename = "TickleTrail_Journey.xlsx") {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TickleTrail JMS";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Journey Schedule", {
      views: [{ showGridLines: true, state: "frozen", ySplit: 1 }],
    });

    const columns = [
      { header: "Day Number", key: "day", width: 14 },
      { header: "Trigger Time", key: "time", width: 15 },
      { header: "Channel", key: "channel", width: 20 },
      { header: "Message Title", key: "title", width: 34 },
      { header: "Message Body", key: "desc", width: 55 },
      { header: "Deep Link URL", key: "deepLink", width: 30 },
      { header: "Avoid Sundays", key: "avoidSundays", width: 15 },
      { header: "Festive Guard", key: "festiveGuard", width: 15 },
    ];

    worksheet.columns = columns;

    // Style Header Row (Row 1): Bold, Tickle Right Signature Brand Coral Background Color (#e85c7b), White Text
    const headerRow = worksheet.getRow(1);
    headerRow.height = 34;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10.5, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE85C7B" }, // Tickle Right signature brand coral
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD84467" } },
        bottom: { style: "medium", color: { argb: "FFC23153" } },
        left: { style: "thin", color: { argb: "FFD84467" } },
        right: { style: "thin", color: { argb: "FFD84467" } },
      };
    });

    // Add Data Rows with subtle alternating zebra striping
    rows.forEach((r, idx) => {
      const row = worksheet.addRow({
        day: r["Day Number"] ?? r.day,
        time: r["Trigger Time"] ?? r.time,
        channel: r["Channel"] ?? r.channel,
        title: r["Message Title"] ?? r.title,
        desc: r["Message Body"] ?? r.desc,
        deepLink: r["Deep Link URL"] ?? r.deepLink,
        avoidSundays: r["Avoid Sundays"] ?? (r.avoidSundays ? "Yes" : "No"),
        festiveGuard: r["Festive Guard"] ?? (r.checkFestivalCalendar ? "Yes" : "No"),
      });

      row.height = 24;
      const isEven = idx % 2 === 1;

      row.eachCell((cell, colNumber) => {
        cell.font = { name: "Arial", size: 9.5 };
        cell.alignment = {
          vertical: "middle",
          horizontal:
            colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber >= 8
              ? "center"
              : "left",
          wrapText: colNumber === 5 || colNumber === 6,
        };
        if (isEven) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" }, // Soft subtle slate-50 zebra stripe
          };
        }
        cell.border = {
          bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("ExcelJS export error, falling back to basic XLSX:", err);
    // Fallback to basic XLSX if any browser issue occurs
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journey Schedule");
    XLSX.writeFile(workbook, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
  }
}

/**
 * Downloads a blank pre-formatted sample Excel file with bold header & styled background
 */
export async function downloadSampleTemplate() {
  await downloadRowsAsExcel(SAMPLE_TEMPLATE_ROWS, "TickleTrail_Sample_Journey_Template.xlsx");
}

/**
 * Parses an uploaded .xlsx or .csv file into standardized row objects
 */
export async function parseSpreadsheetFile(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  if (!rawRows || rawRows.length === 0) {
    throw new Error("The uploaded spreadsheet is empty or has no recognizable data rows.");
  }

  // Normalize column names
  const normalizedRows = rawRows.map((row, idx) => {
    const keys = Object.keys(row);
    const getVal = (...possibleKeys) => {
      for (const pk of possibleKeys) {
        const foundKey = keys.find((k) => k.trim().toLowerCase() === pk.toLowerCase());
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== "") {
          return String(row[foundKey]).trim();
        }
      }
      return "";
    };

    const rawDay = getVal("Day Number", "Day", "day", "offset", "day_number", "Day #");
    const day = parseInt(rawDay, 10) || idx + 1;

    const rawTime = getVal("Trigger Time", "Time", "time", "trigger_time", "schedule_time");
    const time = rawTime || "10:00 AM";

    const rawChannel = getVal("Channel", "channel", "type", "channel_type");
    let channel = "App Notification";
    if (rawChannel.toLowerCase().includes("call") || rawChannel.toLowerCase().includes("phone")) channel = "Call";
    else if (rawChannel.toLowerCase().includes("whatsapp")) channel = "WhatsApp";
    else if (rawChannel.toLowerCase().includes("email") || rawChannel.toLowerCase().includes("mail")) channel = "Email";
    else if (rawChannel.toLowerCase().includes("gift")) channel = "Gift";
    else if (rawChannel.toLowerCase().includes("sms")) channel = "SMS";

    const title = getVal("Message Title", "Title", "title", "subject", "headline") || `Day ${day} Touchpoint`;
    const desc = getVal("Message Body", "Body", "body", "desc", "description", "content", "message") || "Right-brain development touchpoint.";
    const deepLink = getVal("Deep Link URL", "Deep Link", "deepLink", "link", "url", "deeplink") || "tr://app";

    const avoidSundays = !["no", "false", "0", "n"].includes(
      getVal("Avoid Sundays", "AvoidSundays", "avoid_sundays").toLowerCase()
    );

    const checkFestivalCalendar = !["no", "false", "0", "n"].includes(
      getVal("Festive Guard", "FestiveGuard", "festive_guard", "checkFestivalCalendar").toLowerCase()
    );

    return {
      day,
      time,
      channel,
      title,
      desc,
      deepLink,
      avoidSundays,
      checkFestivalCalendar,
    };
  });

  return normalizedRows;
}

/**
 * Generates React Flow nodes and edges from parsed normalized rows
 */
export function buildGraphFromRows(rows, journeyId = `journey-${Date.now()}`, journeyName = "Imported Journey") {
  // Group rows by day number
  const dayGroups = new Map();
  rows.forEach((r) => {
    if (!dayGroups.has(r.day)) {
      dayGroups.set(r.day, []);
    }
    dayGroups.get(r.day).push(r);
  });

  // Sort day numbers ascending
  const sortedDays = Array.from(dayGroups.keys()).sort((a, b) => a - b);

  const nodes = [];
  const edges = [];

  // 1. Create Start Node (Journey Trigger)
  const startNodeId = `${journeyId}-start`;
  nodes.push({
    id: startNodeId,
    type: "start",
    position: { x: 50, y: 260 },
    data: {
      label: "Time-based • All Members",
      triggerKind: "Time-based",
      triggerEvent: "Time-based • All Members",
      reference: "APP",
      audienceSegmentId: "seg-all",
      exclusions: [],
      avoidSundays: false,
      checkFestivalCalendar: false,
      checkContentCalendar: false,
      metrics: { onStage: 6420, sent: 6420, opened: 5890 },
    },
  });

  let prevNodeId = startNodeId;

  // 2. Build Day Nodes
  sortedDays.forEach((dayNum, idx) => {
    const dayComms = dayGroups.get(dayNum);
    const nodeId = `${journeyId}-day-${dayNum}`;
    const posX = 420 + idx * 360;
    const posY = 200;

    // Calculate a display calendar date relative to today + dayNum
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() + dayNum);
    const dateStr = mockDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    if (dayComms.length > 1) {
      // Build Stacked Day Node
      nodes.push({
        id: nodeId,
        type: "stackedDay",
        position: { x: posX, y: posY },
        data: {
          label: `Day ${dayNum} • ${dateStr}`,
          day: dayNum,
          date: dateStr,
          comms: dayComms.map((c, cIdx) => ({
            id: `c-d${dayNum}-${cIdx + 1}`,
            time: c.time,
            channel: c.channel,
            title: c.title,
            desc: c.desc,
            deepLink: c.deepLink,
          })),
          avoidSundays: dayComms.some((c) => c.avoidSundays),
          checkFestivalCalendar: dayComms.some((c) => c.checkFestivalCalendar),
          checkContentCalendar: true,
          metrics: { onStage: Math.max(1200, 6420 - idx * 80), sent: 6200, opened: 5300 },
        },
      });
    } else {
      // Build Single Step Node
      const singleComm = dayComms[0];
      const isHuman = singleComm.channel === "Call" || singleComm.channel === "Gift";
      nodes.push({
        id: nodeId,
        type: isHuman ? "human" : "step",
        position: { x: posX, y: posY },
        data: {
          label: singleComm.title,
          offset: dayNum,
          unit: "Days",
          description: singleComm.desc,
          deepLink: singleComm.deepLink,
          triggerTime: singleComm.time,
          template: {
            id: `tpl-import-${dayNum}`,
            name: singleComm.title,
            channel: singleComm.channel,
            content: singleComm.desc,
          },
          avoidSundays: singleComm.avoidSundays,
          checkFestivalCalendar: singleComm.checkFestivalCalendar,
          checkContentCalendar: true,
          metrics: { onStage: Math.max(1200, 6420 - idx * 80), sent: 6200, opened: 5300 },
        },
      });
    }

    // Connect edge from previous node
    edges.push({
      id: `e-${prevNodeId}-${nodeId}`,
      source: prevNodeId,
      target: nodeId,
      type: "smoothstep",
      animated: true,
    });

    prevNodeId = nodeId;
  });

  return { nodes, edges, totalDays: sortedDays.length, totalTouchpoints: rows.length };
}
