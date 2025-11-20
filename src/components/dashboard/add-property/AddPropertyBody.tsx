"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { toast } from "react-toastify";
import NiceSelect from "@/ui/NiceSelect";

type FormValues = {
  listingCode: string;
  branchId?: number | "";
  category?: string;
  title?: string;
  description?: string;
  saleType: "satilik" | "kiralik";
  propertyType: "konut" | "arsa" | "ticari" | "devren" | "tarla" | "bahce" | "hobi_bahcesi";
  subType?: string;
  price?: string;
  rentPrice?: string;
  city?: string;
  province?: string;
  district?: string;
  neighborhood?: string;
  address?: string;
  location?: { lat?: number; lng?: number };
  rooms?: string;
  brutArea?: string;
  netArea?: string;
  floor?: string;
  totalFloors?: string;
  heatingTypes?: string[];
  cephe?: string[];
  binaYasi?: string;
  aidat?: string;
  tapuDurumu?: string;
  iskan?: string;
  kullanmaDurumu?: string;
  attributes?: Record<string, any>;
};

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "") + "/properties";

const AddPropertyBody = () => {
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      saleType: "satilik",
      propertyType: "konut",
      heatingTypes: [],
      cephe: [],
    },
  });

  const [mainPhoto, setMainPhoto] = useState<File | null>(null);
  const [detailPhotos, setDetailPhotos] = useState<File[]>([]);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  const propertyType = watch("propertyType");
  const saleType = watch("saleType");

  useEffect(() => {
    if (mainPhoto) {
      const url = URL.createObjectURL(mainPhoto);
      setMainPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainPreview(null);
    }
  }, [mainPhoto]);

  useEffect(() => {
    const urls = detailPhotos.map((f) => URL.createObjectURL(f));
    setDetailPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [detailPhotos]);

  const onMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setMainPhoto(f);
  };

  const onDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 10) {
      toast.error("Detay fotoğrafı en fazla 10 olabilir");
      setDetailPhotos(files.slice(0, 10));
    } else {
      setDetailPhotos(files);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // FormData approach for files + fields
      const formData = new FormData();

      // basic fields
      formData.append("listingCode", data.listingCode || "");
      formData.append("branchId", (data.branchId as any) ?? "");
      formData.append("category", data.category ?? "");
      formData.append("city", data.city ?? "");
      formData.append("province", data.province ?? "");
      formData.append("district", data.district ?? "");
      formData.append("neighborhood", data.neighborhood ?? "");
      formData.append("address", data.address ?? "");
      formData.append("saleType", data.saleType ?? "satilik");
      formData.append("propertyType", data.propertyType ?? "konut");
      formData.append("subType", data.subType ?? "");
      formData.append("price", data.price ?? "");
      formData.append("rentPrice", data.rentPrice ?? "");

      // attributes (title, description, konut fields) -> put as JSON string
      const attributes = {
        title: data.title,
        description: data.description,
        rooms: data.rooms,
        brutArea: data.brutArea,
        netArea: data.netArea,
        floor: data.floor,
        totalFloors: data.totalFloors,
        heatingTypes: data.heatingTypes || [],
        cephe: data.cephe || [],
        binaYasi: data.binaYasi,
        aidat: data.aidat,
        tapuDurumu: data.tapuDurumu,
        iskan: data.iskan,
        kullanmaDurumu: data.kullanmaDurumu,
        ...(data.attributes || {}),
      };
      formData.append("attributes", JSON.stringify(attributes));

      // location if provided
      if (data.location && (data.location.lat !== undefined || data.location.lng !== undefined)) {
        formData.append("location", JSON.stringify(data.location));
      }

      // files
      if (mainPhoto) {
        formData.append("mainPhoto", mainPhoto);
      }
      detailPhotos.slice(0, 10).forEach((f) => formData.append("detailPhotos", f));

      // send request (do NOT set Content-Type; browser sets multipart boundary)
      const res = await fetch(apiBase, {
        method: "POST",
        // headers: { Authorization: 'Bearer TOKEN' } // add auth if needed
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        toast.success("İlan başarıyla kaydedildi");
        reset();
        setMainPhoto(null);
        setDetailPhotos([]);
        console.log("created property:", json);
      } else {
        const errText = await res.text();
        console.error("server error:", errText);
        toast.error("Sunucu hatası: " + res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error("Ağ hatası");
    }
  };

  const toggleArrayValue = (arr: string[] | undefined, value: string) => {
    if (!arr) return [value];
    return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Add New Property" />
        <h2 className="main-title d-block d-lg-none">Add New Property</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">Overview</h4>

            <div className="dash-input-wrapper mb-30">
              <label>İlan Kodu*</label>
              <input {...register("listingCode", { required: true })} type="text" placeholder="ILAN123" />
            </div>

            <div className="dash-input-wrapper mb-30">
              <label>Başlık</label>
              <input {...register("title")} type="text" placeholder="Your Property Name" />
            </div>

            <div className="dash-input-wrapper mb-30">
              <label>Açıklama</label>
              <textarea {...register("description")} className="size-lg" placeholder="Write about property..." />
            </div>

            <div className="row align-items-end">
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label>Kategori</label>
                  <input {...register("category")} type="text" placeholder="Kategori (örn: Premium)" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label>Şube (ID)</label>
                  <input {...register("branchId")} type="number" placeholder="Şube ID (opsiyonel)" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Listing Details</h4>

            <div className="row">
              <div className="col-lg-3">
                <label>Satılık / Kiralık</label>
                <NiceSelect
                  className="nice-select"
                  options={[
                    { value: "satilik", text: "Satılık" },
                    { value: "kiralik", text: "Kiralık" },
                  ]}
                  defaultCurrent={0}
                  onChange={(e: any) => setValue("saleType", e.target?.value ?? "satilik")}
                  placeholder=""
                />
              </div>

              <div className="col-lg-3">
                <label>Gayrimenkul Tipi</label>
                <NiceSelect
                  className="nice-select"
                  options={[
                    { value: "konut", text: "Konut" },
                    { value: "arsa", text: "Arsa" },
                    { value: "ticari", text: "Ticari" },
                    { value: "devren", text: "Devren" },
                    { value: "tarla", text: "Tarla" },
                    { value: "bahce", text: "Bahçe" },
                    { value: "hobi_bahcesi", text: "Hobi Bahçesi" },
                  ]}
                  defaultCurrent={0}
                  onChange={(e: any) => setValue("propertyType", e.target?.value ?? "konut")}
                  placeholder=""
                />
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Alt Tip (örn: apart, villa)</label>
                  <input {...register("subType")} type="text" placeholder="Alt Tip" />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Fiyat (Satış)</label>
                  <input {...register("price")} type="number" placeholder="₺" />
                </div>
              </div>

              {saleType === "kiralik" && (
                <div className="col-lg-3">
                  <div className="dash-input-wrapper mb-25">
                    <label>Kira Bedeli</label>
                    <input {...register("rentPrice")} type="number" placeholder="₺ / ay" />
                  </div>
                </div>
              )}
            </div>

            {propertyType === "konut" && (
              <>
                <h5 className="mt-20">Konut Bilgileri</h5>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="dash-input-wrapper mb-25">
                      <label>Oda Sayısı</label>
                      <input {...register("rooms")} type="text" placeholder="3+1" />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="dash-input-wrapper mb-25">
                      <label>Brüt m²</label>
                      <input {...register("brutArea")} type="text" placeholder="140" />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="dash-input-wrapper mb-25">
                      <label>Net m²</label>
                      <input {...register("netArea")} type="text" placeholder="120" />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="dash-input-wrapper mb-25">
                      <label>Bulunduğu Kat</label>
                      <input {...register("floor")} type="text" placeholder="4" />
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="dash-input-wrapper mb-25">
                      <label>Toplam Kat Sayısı</label>
                      <input {...register("totalFloors")} type="text" placeholder="8" />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <label>Isıtma Tipi (Çoklu Seçim)</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["Bireysel Kombi", "Merkezi", "Yerden Isıtma", "Sobalı", "Elektrik", "Klima"].map((opt) => (
                        <label key={opt} className="me-2">
                          <input
                            type="checkbox"
                            onChange={() => {
                              const cur = watch("heatingTypes") || [];
                              setValue("heatingTypes", toggleArrayValue(cur, opt));
                            }}
                            checked={(watch("heatingTypes") || []).includes(opt)}
                          />
                          {" " + opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <label>Cephe (Çoklu Seçim)</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["Kuzey", "Güney", "Doğu", "Batı"].map((opt) => (
                        <label key={opt} className="me-2">
                          <input
                            type="checkbox"
                            onChange={() => {
                              const cur = watch("cephe") || [];
                              setValue("cephe", toggleArrayValue(cur, opt));
                            }}
                            checked={(watch("cephe") || []).includes(opt)}
                          />
                          {" " + opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Address & Location</h4>

            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-25">
                  <label>Adres*</label>
                  <input {...register("address")} type="text" placeholder="Açık adres" />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Şehir</label>
                  <input {...register("city")} type="text" placeholder="İstanbul" />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>İlçe</label>
                  <input {...register("district")} type="text" placeholder="Kadıköy" />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Mahalle</label>
                  <input {...register("neighborhood")} type="text" placeholder="Moda" />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Koordinat (lat)</label>
                  <input
                    type="number"
                    step="any"
                    {...register("location.lat", { valueAsNumber: true })}
                    placeholder="40.99"
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dash-input-wrapper mb-25">
                  <label>Koordinat (lng)</label>
                  <input
                    type="number"
                    step="any"
                    {...register("location.lng", { valueAsNumber: true })}
                    placeholder="29.03"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="map-frame mt-30">
                  <div className="gmap_canvas h-100 w-100">
                    <iframe
                      className="gmap_iframe h-100 w-100"
                      src={`https://maps.google.com/maps?width=600&height=400&hl=en&q=${encodeURIComponent(
                        watch("address") || watch("city") || "istanbul"
                      )}&t=&z=12&ie=UTF8&iwloc=B&output=embed`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Photos</h4>

            <div className="dash-input-wrapper mb-30">
              <label>Ana Fotoğraf (1 adet)</label>
              <input type="file" accept="image/*" onChange={onMainChange} />
              {mainPreview && <img src={mainPreview} alt="main preview" style={{ width: 150, marginTop: 8 }} />}
            </div>

            <div className="dash-input-wrapper mb-30">
              <label>Detay Fotoğrafları (En fazla 10)</label>
              <input type="file" accept="image/*" multiple onChange={onDetailChange} />
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {detailPreviews.map((p, idx) => (
                  <img key={idx} src={p} alt={`detail-${idx}`} style={{ width: 100 }} />
                ))}
              </div>
            </div>
          </div>

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button type="submit" className="dash-btn-two tran3s me-3">Submit Property</button>
            <button
              type="button"
              onClick={() => {
                reset();
                setMainPhoto(null);
                setDetailPhotos([]);
              }}
              className="dash-cancel-btn tran3s"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyBody;