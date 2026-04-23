import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateExperienceForm from "./CreateExperienceForm";
import api, { toAbsoluteAssetUrl } from "../services/api";

function normalizeExperience(item) {
  const existingImages = (item.imageUrls ?? []).map((url) => ({
    originalUrl: url,
    previewUrl: toAbsoluteAssetUrl(url)
  }));
  const itinerary = (item.itinerary ?? []).flatMap((dayItem) =>
    (dayItem.slots ?? []).map((slot) => ({
      id: slot.id,
      dayNumber: dayItem.day ?? 1,
      timeTag: slot.timeTag ?? "",
      title: slot.title ?? "",
      description: slot.description ?? ""
    }))
  );

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentDetail: item.contentDetail,
    activities: item.activities ?? [],
    highlights: item.highlights ?? [],
    itinerary,
    duration: item.duration || "",
    priceValue: item.price,
    address: item.address || "",
    mapsPlaceId: item.mapsPlaceId || "",
    latitude: item.latitude ?? "",
    longitude: item.longitude ?? "",
    categories: item.categories ?? [],
    categoryIds: (item.categories ?? []).map((category) => category.id).filter(Boolean),
    imageUrls: existingImages.map((image) => image.previewUrl),
    existingImageUrls: existingImages.map((image) => image.originalUrl),
    existingImages
  };
}

function EditExperiencePage({ showToast, onSaved }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExperience() {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/experiences/${id}`);
        setExperience(normalizeExperience(response.data));
      } finally {
        setIsLoading(false);
      }
    }

    fetchExperience();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 text-stone-500 sm:px-8 lg:px-12 xl:px-14 2xl:px-16">
        Đang tải dữ liệu bài đăng...
      </div>
    );
  }

  return (
    <CreateExperienceForm
      mode="edit"
      initialData={experience}
      showToast={showToast}
      onCancel={() => navigate("/dashboard")}
      onSuccess={onSaved}
    />
  );
}

export default EditExperiencePage;
