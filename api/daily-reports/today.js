import handler from "../daily-reports.js";

export default function todayReports(req, res) {
  const separator = req.url.includes("?") ? "&" : "?";
  req.url = `${req.url}${separator}today=true`;
  return handler(req, res);
}
