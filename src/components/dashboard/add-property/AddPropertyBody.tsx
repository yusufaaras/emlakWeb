"use client"
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { toast } from "react-toastify";
import NiceSelect from "@/ui/NiceSelect";
import Image from "next/image";
import locationImage from "@/assets/images/dashboard/icon/icon_16.svg";

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
  // konut-specific
  rooms?: string;
  brutArea?: string;
  netArea?: string;
  floor?: string;
  totalFloors?: string;
  heatingTypes?: string[]; // multi
  cephe?: string[]; // multi
  binaYasi?: string;
  aidat?: string;
  tapuDurumu?: string;
  iskan?: string;
  kullanmaDurumu?: string;
  attributes?: Record<string, any>;
};

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "") + "/properties";

const AddPropertyBody = () => {
  const { register, handleSubmit, control, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      saleType: "satilik",
      propertyType: "konut",
      heatingTypes: [],
      cephe: [],
    },
  });

  const propertyType = watch("propertyType");
  const saleType = watch("saleType");

  useEffect(() => {
    // örnek olarak lokasyon otomatik doldurma fonksiyonu eklenebilir
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      // Oluşturulacak payload: backend model ile uyumlu
      const payload: any = {
        listingCode: data.listingCode,
        branchId: data.branchId || null,
        category: data.category || null,
        city: data.city || null,
        province: data.province || null,
        district: data.district || null,
        neighborhood: data.neighborhood || null,
        address: data.address || null,
        location: data.location || null,
        saleType: data.saleType,
        propertyType: data.propertyType,
        subType: data.subType || null,
        price: data.price ? Number(data.price) : null,
        rentPrice: data.rentPrice ? Number(data.rentPrice) : null,
        attributes: {
          // ortak ve konut özel alanları attributes içinde saklıyoruz
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
          // ek alanlar isteğe göre eklenir
        },
      };

      const res = await fetch(apiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: 'Bearer TOKEN' -> eğer auth varsa ekle
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        toast.success("İlan başarıyla kaydedildi");
        reset();
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

  // helper: checkbox multi select toggle
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

            {/* KONUT spesifik alanlar */}
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

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button type="submit" className="dash-btn-two tran3s me-3">Submit Property</button>
            <button type="button" onClick={() => reset()} className="dash-cancel-btn tran3s">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyBody;