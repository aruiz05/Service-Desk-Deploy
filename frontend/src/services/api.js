const configuredBaseUrl =
  import.meta.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
export const ADMIN_TOKEN_STORAGE_KEY = "serviceDeskAdminToken";

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function setAdminToken(token) {
  window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

function getAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function getResponseData(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(response, responseData) {
  if (typeof responseData?.detail === "string") {
    return responseData.detail;
  }

  if (Array.isArray(responseData?.detail)) {
    return "Please check the submitted fields and try again.";
  }

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  return `Request failed with status ${response.status}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const responseData = await getResponseData(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(response, responseData));
  }

  return responseData;
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}

function getFilenameFromContentDisposition(contentDisposition) {
  const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/i);
  return filenameMatch?.[1] || "cybersecurity_ticket_report.csv";
}

export async function checkHealth() {
  return apiRequest("/health");
}

export async function loginAdmin(data) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAdminStatus() {
  return apiRequest("/auth/me");
}

export async function getTickets(params = {}) {
  const queryString = buildQueryString(params);
  const path = queryString ? `/tickets?${queryString}` : "/tickets";

  return apiRequest(path);
}

export async function getTicket(ticketId) {
  return apiRequest(`/tickets/${ticketId}`);
}

export async function createTicket(data) {
  return apiRequest("/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTicket(ticketId, data) {
  return apiRequest(`/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTicket(ticketId) {
  return apiRequest(`/tickets/${ticketId}`, {
    method: "DELETE",
  });
}

export async function getKnowledgeArticles(params = {}) {
  const queryString = buildQueryString(params);
  const path = queryString ? `/knowledge?${queryString}` : "/knowledge";

  return apiRequest(path);
}

export async function getKnowledgeArticle(articleId) {
  return apiRequest(`/knowledge/${articleId}`);
}

export async function createKnowledgeArticle(data) {
  return apiRequest("/knowledge", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateKnowledgeArticle(articleId, data) {
  return apiRequest(`/knowledge/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteKnowledgeArticle(articleId) {
  return apiRequest(`/knowledge/${articleId}`, {
    method: "DELETE",
  });
}

export async function getAnalyticsSummary() {
  return apiRequest("/analytics/summary");
}

export async function getCategoryAnalytics() {
  return apiRequest("/analytics/categories");
}

export async function getStatusAnalytics() {
  return apiRequest("/analytics/status");
}

export async function getPriorityAnalytics() {
  return apiRequest("/analytics/priorities");
}

export async function getTrends(days = 30) {
  return apiRequest(`/analytics/trends?days=${days}`);
}

export async function getSLAAnalytics() {
  return apiRequest("/analytics/sla");
}

export async function downloadTicketReport(params = {}) {
  const queryString = buildQueryString(params);
  const path = queryString
    ? `/reports/tickets.csv?${queryString}`
    : "/reports/tickets.csv";
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const responseData = await getResponseData(response);
    throw new Error(getErrorMessage(response, responseData));
  }

  const csvBlob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(csvBlob);
  const downloadLink = document.createElement("a");
  const filename = getFilenameFromContentDisposition(
    response.headers.get("content-disposition"),
  );

  downloadLink.href = downloadUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return { filename };
}
