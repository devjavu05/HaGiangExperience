import api from "./api";

export async function createExperience(payload) {
  return submitExperience("/api/experiences", payload);
}

export async function updateExperience(id, payload) {
  return submitExperience(`/api/experiences/${id}`, payload, "put");
}

export async function deleteExperience(id) {
  await api.delete(`/api/experiences/${id}`);
}

export async function getMyExperiences() {
  const response = await api.get("/api/experiences/me");
  return response.data;
}

export async function searchExperiences(filters = {}) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice !== "") {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice !== "") {
    params.set("maxPrice", String(filters.maxPrice));
  }
  (filters.categorySlugs ?? []).forEach((slug) => {
    params.append("categorySlugs", slug);
  });
  if (filters.sort) {
    params.set("sort", filters.sort);
  }
  params.set("page", String(filters.page ?? 0));
  params.set("size", String(filters.size ?? 12));

  const response = await api.get(`/api/experiences/search?${params.toString()}`);
  return response.data;
}

export async function submitReview(experienceId, payload) {
  const response = await api.post(`/api/experiences/${experienceId}/reviews`, {
    rating: payload.rating,
    comment: payload.comment
  });

  return response.data;
}

export async function submitReply(experienceId, reviewId, payload) {
  const response = await api.post(`/api/experiences/${experienceId}/reviews/${reviewId}/reply`, {
    comment: payload.comment
  });

  return response.data;
}

async function submitExperience(url, payload, method = "post") {
  const formData = new FormData();

  payload.files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append(
    "experience",
    JSON.stringify({
      title: payload.title,
      description: payload.description,
      contentDetail: payload.contentDetail,
      activities: payload.activities,
      highlights: payload.highlights,
      itinerary: buildNestedItinerary(payload.itinerary ?? []),
      existingImageUrls: payload.existingImageUrls ?? [],
      duration: payload.duration,
      price: Number(payload.price),
      address: payload.address,
      categoryIds: payload.categoryIds ?? [],
      categorySlugs: payload.categorySlugs ?? [],
      mapsPlaceId: payload.mapsPlaceId,
      latitude: payload.latitude,
      longitude: payload.longitude
    })
  );

  const response = await api[method](url, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

function buildNestedItinerary(itinerary) {
  const grouped = new Map();

  itinerary.forEach((item) => {
    const day = Number(item.dayNumber) > 0 ? Number(item.dayNumber) : 1;
    const slot = {
      timeTag: item.timeTag,
      title: item.title,
      description: item.description
    };

    if (!grouped.has(day)) {
      grouped.set(day, []);
    }

    grouped.get(day).push(slot);
  });

  return Array.from(grouped.entries()).map(([day, slots]) => ({ day, slots }));
}
